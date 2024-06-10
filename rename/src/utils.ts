import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import postcssRename from 'postcss-rename';
import postcssVariableCompress from 'postcss-variable-compress';

import type { InternalRenameOptions } from './types.js';
import type { Options as PostcssRenameOptions } from 'postcss-rename';
import type { CSSOptions, UserConfig } from 'vite';
import type { ProcessOptions } from 'postcss';
import type { ResultPlugin } from 'postcss-load-config';
import type { Document as Document_, Root as Root_ } from 'postcss';

export const MAPS_DIRECTORY = './.class-maps' as const;

export const matchClasses = (key: string) =>
  `(:^|[^&<;:_/\[\\]a-zA-Z0-9_.-])(${key})(?=$|[^&;:_/\[\\]a-zA-Z0-9_.-])`;
export const escapeRegExp = (string: string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const calculatePercent = (before: number, after: number) =>
  (100 - (after / before) * 100) | 0;

export async function* walkFiles(dir: string): AsyncGenerator<string> {
  const dirents = await readdir(dir, { withFileTypes: true });

  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);

    if (dirent.isDirectory()) yield* walkFiles(res);
    else yield res;
  }
}

export const getPostCssConfig = async (
  root: UserConfig['root'],
  postcssInlineOptions: CSSOptions['postcss'],
) => {
  let postcssConfigResult;

  // Check if postcss config is not inlined
  if (
    !(typeof postcssInlineOptions === 'object' && postcssInlineOptions !== null)
  ) {
    const { default: postcssrc } = await import('postcss-load-config');
    const searchPath =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      typeof postcssInlineOptions === 'string' ? postcssInlineOptions : root!;

    try {
      postcssConfigResult = await postcssrc({}, searchPath);
    } catch (e) {
      postcssConfigResult = null;
    }
  }

  return postcssConfigResult;
};

// Explicitly type the return value because of a bug in typescript
// @see https://github.com/microsoft/TypeScript/issues/42873
export const getViteConfiguration = async (
  options: InternalRenameOptions['rename'],
  viteConfig: UserConfig,
): Promise<{
  css: {
    postcss: {
      options: ProcessOptions<Document_ | Root_>;
      plugins: ResultPlugin[];
    };
  };
}> => {
  // We need to manually load postcss config files because when inlining the tailwind and autoprefixer plugins,
  // that causes vite to ignore postcss config files
  const postcssConfigResult = await getPostCssConfig(
    viteConfig.root,
    viteConfig.css?.postcss,
  );
  const postcssOptions = postcssConfigResult?.options ?? {};
  const postcssPlugins = postcssConfigResult?.plugins?.slice() ?? [];

  postcssPlugins.push(postcssRename(options as PostcssRenameOptions));
  // eslint-disable-next-line
  // @ts-ignore
  postcssPlugins.push(postcssVariableCompress());

  return {
    css: {
      postcss: {
        options: postcssOptions,
        plugins: postcssPlugins,
      },
    },
  };
};
