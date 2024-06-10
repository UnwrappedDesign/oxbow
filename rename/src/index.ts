import { existsSync } from 'node:fs';
import { mkdir, readFile, rmdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, gzipSync } from 'node:zlib';
import { Table } from 'console-table-printer';
import md5 from 'md5';
import prettyBytes from 'pretty-bytes';
import * as parser from '@babel/parser';

import _traverse from '@babel/traverse';
import _generate from '@babel/generator';

const traverse = _traverse.default;
const generate = _generate.default;

import { defaultOptions } from './options.js';
import {
  MAPS_DIRECTORY,
  calculatePercent,
  escapeRegExp,
  getViteConfiguration,
  walkFiles,
} from './utils.js';

import type { AstroIntegration } from 'astro';
import type { InternalRenameOptions, RenameOptions } from './types.js';

export default function renameIntegration(
  options?: RenameOptions,
): AstroIntegration {
  const _options = {
    ...defaultOptions,
    ...options,
    rename: {
      ...defaultOptions.rename,
      ...options?.rename,
      outputMapCallback: async (map) => {
        const content = JSON.stringify(map);

        try {
          if (!existsSync(MAPS_DIRECTORY)) {
            await mkdir(MAPS_DIRECTORY);
          }
        } catch (err) {
          console.error(
            `\u001b[31mTemporal directory to process files couldn't be created: ${err}.\u001b[39m`,
          );
          return;
        }

        try {
          await writeFile(
            `${MAPS_DIRECTORY}/class-map-${md5(content)}.json`,
            content,
            {
              encoding: 'utf8',
              flag: 'w',
            },
          );
        } catch (err) {
          console.error(
            `\u001b[31mThere was an error saving the CSS map: ${err}.\u001b[39m`,
          );
          return;
        }

        options?.rename?.outputMapCallback?.(map);
      },
    },
  } satisfies InternalRenameOptions;

  return {
    name: 'astro-rename',
    hooks: {
      'astro:config:setup': async ({ config, updateConfig, command }) => {
        if (command !== 'build') return;

        try {
          await rmdir(MAPS_DIRECTORY, { recursive: true });
          // if the directory doesn't exist, it's fine
        } catch (_) {}

        updateConfig({
          vite: await getViteConfiguration(_options?.rename, config.vite),
        });
      },
      'astro:build:done': async ({ dir }) => {
        const dist = fileURLToPath(dir);
        let classMap = {};

        try {
          for await (const map of walkFiles(MAPS_DIRECTORY)) {
            const res = await readFile(map, 'utf8');
            classMap = {
              ...classMap,
              ...JSON.parse(res),
            };
          }
        } catch (_) {
          console.error(
            `\u001b[31mA CSS map of transformed classes it isn't provided\u001b[39m`,
          );
          return;
        }

        try {
          const stats = new Table();

          for await (const file of walkFiles(dist)) {
            if (!_options.targetExt.some((ext) => file.endsWith(ext))) continue;

            const fileName = file.replace(dist, ''); // remove the dist path

            let content = await readFile(file, 'utf-8');
            const oldSize = content.length;

            Object.keys(classMap).forEach((key) => {
              const regex = new RegExp(
                _options
                  .matchClasses(escapeRegExp(key))
                  .replaceAll('&', '&#x26;'),
                'g',
              );

              content = content.replaceAll(
                regex,
                `$1${classMap[key as keyof typeof classMap]}`,
              );
            });

            await writeFile(file, content, {
              encoding: 'utf8',
              flag: 'w',
            });

            const newSize = content.length;
            const percent = calculatePercent(oldSize, newSize);

            stats.addRow({
              File: fileName,
              'Original Size': prettyBytes(oldSize),
              'New Size': prettyBytes(newSize),
              Reduced: `${percent}%`,
              Gzip: prettyBytes(gzipSync(content).byteLength),
              Brotli: prettyBytes(brotliCompressSync(content).byteLength),
            });
          }

          stats.printTable();
        } catch (_) {
          console.error(
            `\u001b[31mThe build directory doesn't exists.\u001b[39m`,
          );
          return;
        }
      },
      'astro:build:ssr': async () => {
        let classMap = {};

        try {
          for await (const map of walkFiles(MAPS_DIRECTORY)) {
            const res = await readFile(map, 'utf8');
            classMap = {
              ...classMap,
              ...JSON.parse(res),
            };
          }
        } catch (_) {
          console.error(
            `\u001b[31mA CSS map of transformed classes it isn't provided\u001b[39m`,
          );
          return;
        }

        for await (const file of walkFiles('./dist/server')) {
          if (!_options.targetExt.some((ext) => file.endsWith(ext))) continue;

          console.log('Processing file', file);

          try {
            const code = await readFile(file, 'utf-8');

            const ast = parser.parse(code, {
              sourceType: 'module', // Allows parsing of ES6 modules
              plugins: ['jsx'], // Include plugins if you're dealing with specific syntax like JSX
            });

            const modifyString = (value: string) =>
              Object.keys(classMap).reduce((value, key) => {
                const regex = new RegExp(
                  _options
                    .matchClasses(escapeRegExp(key))
                    .replaceAll('&', '&#x26;'),
                  'g',
                );

                return value.replaceAll(
                  regex,
                  `$1${classMap[key as keyof typeof classMap]}`,
                );
              }, value);
            // Traverse and modify the AST
            traverse(ast, {
              StringLiteral(path) {
                path.node.value = modifyString(path.node.value);
              },
              // Modify JSX text and attributes
              JSXText(path) {
                path.node.value = modifyString(path.node.value);
              },
              // Modify template literals
              TemplateLiteral(path) {
                path.node.quasis.map((element) => {
                  element.value.raw = modifyString(element.value.raw);
                  element.value.cooked = modifyString(
                    element.value.cooked ?? '',
                  );
                });
              },
            });

            // Generate the modified code from the transformed AST
            const output = generate(ast, {}, code);

            await writeFile(file, output.code, {
              encoding: 'utf8',
              flag: 'w',
            });
          } catch (err) {
            console.log(err);
          }
        }
      },
    },
  };
}
