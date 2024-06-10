import { expect, test } from 'vitest';
import { calculatePercent, escapeRegExp, matchClasses } from '../src/utils.js';

const generateRegex = (key: string) =>
  new RegExp(matchClasses(escapeRegExp(key)), 'g');

test('calculatePercent - after: 20, before: 10', () =>
  expect(calculatePercent(20, 10)).toBe(50));

test('escapeRegExp - escape hyphen', () => {
  expect(escapeRegExp('h-[40px]')).toBe('h-\\[40px\\]');
});

test('escapeRegExp - escape dot', () => {
  expect(escapeRegExp('h.')).toBe('h\\.');
});

test('escapeRegExp - escape asterisk', () => {
  expect(escapeRegExp('h*')).toBe('h\\*');
});

test('escapeRegExp - escape plus', () => {
  expect(escapeRegExp('h+')).toBe('h\\+');
});

test('escapeRegExp - escape question mark', () => {
  expect(escapeRegExp('h?')).toBe('h\\?');
});

test('escapeRegExp - escape dollar sign', () => {
  expect(escapeRegExp('h$')).toBe('h\\$');
});

test('escapeRegExp - escape curly braces', () => {
  expect(escapeRegExp('h{40px}')).toBe('h\\{40px\\}');
});

test('escapeRegExp - escape parentheses', () => {
  expect(escapeRegExp('h(40px)')).toBe('h\\(40px\\)');
});

test('escapeRegExp - escape pipe', () => {
  expect(escapeRegExp('h|')).toBe('h\\|');
});

test('escapeRegExp - escape backslash', () => {
  expect(escapeRegExp('h\\')).toBe('h\\\\');
});

test('matchClasses - h-4 not match h-40', () => {
  expect('class="h-4 h-40"'.replaceAll(generateRegex('h-4'), `$1test`)).toBe(
    'class="test h-40"',
  );
});

test('matchClasses - h-4 not match hh-4', () => {
  expect('class="h-4 hh-4"'.replaceAll(generateRegex('h-4'), `$1test`)).toBe(
    'class="test hh-4"',
  );
});

test('matchClasses - h-4 match multiple times not consecutive', () => {
  expect(
    'class="h-4 h-40 h-4"'.replaceAll(generateRegex('h-4'), `$1test`),
  ).toBe('class="test h-40 test"');
});

test('matchClasses - h-4 match multiple times consecutive', () => {
  expect('class="h-4 h-4"'.replaceAll(generateRegex('h-4'), `$1test`)).toBe(
    'class="test test"',
  );
});

test('matchClasses - h-4 not match hover:h-4', () => {
  expect(
    'class="h-4 hover:h-4"'.replaceAll(generateRegex('h-4'), `$1test`),
  ).toBe('class="test hover:h-4"');
});

test('matchClasses - h-4 not match h-4:hover', () => {
  expect(
    'class="h-4 h-4:hover"'.replaceAll(generateRegex('h-4'), `$1test`),
  ).toBe('class="test h-4:hover"');
});

test('matchClasses - h-4 not match [h-4]', () => {
  expect('class="h-4 [h-4]"'.replaceAll(generateRegex('h-4'), `$1test`)).toBe(
    'class="test [h-4]"',
  );
});

test('matchClasses - h-4 not match h-4[h-4]', () => {
  expect(
    'class="h-4 h-4[h-4]"'.replaceAll(generateRegex('h-4'), `$1test`),
  ).toBe('class="test h-4[h-4]"');
});

test('matchClasses - h-4 not match [h-4]h-4', () => {
  expect(
    'class="h-4 [h-4]h-4"'.replaceAll(generateRegex('h-4'), `$1test`),
  ).toBe('class="test [h-4]h-4"');
});

test('matchClasses - h-4 not match [h-4]h-4[h-4]', () => {
  expect(
    'class="h-4 [h-4]h-4[h-4]"'.replaceAll(generateRegex('h-4'), `$1test`),
  ).toBe('class="test [h-4]h-4[h-4]"');
});

test("matchClasses - before:content-['']", () => {
  expect(
    'class="before:content-[\'\']"'.replaceAll(
      generateRegex("before:content-['']"),
      `$1test`,
    ),
  ).toBe('class="test"');
});

test('matchClasses - text-[18px]', () => {
  expect(
    'class="text-[18px]"'.replaceAll(generateRegex('text-[18px]'), `$1test`),
  ).toBe('class="test"');
});

test('matchClasses - bg-white not match bg-white-smoke', () => {
  expect(
    'class="bg-white-smoke"'.replaceAll(generateRegex('bg-white'), `$1test`),
  ).toBe('class="bg-white-smoke"');
});

test('matchClasses - py-1 not match py-1.5', () => {
  expect('class="py-1.5"'.replaceAll(generateRegex('py-1'), `$1test`)).toBe(
    'class="py-1.5"',
  );
});

test('matchClasses - [-webkit-text-fill-color:_transparent]', () => {
  expect(
    'class="[-webkit-text-fill-color:_transparent]"'.replaceAll(
      generateRegex('[-webkit-text-fill-color:_transparent]'),
      `$1test`,
    ),
  ).toBe('class="test"');
});

test('matchClasses - !bg-dark-accent/90', () => {
  expect(
    'class="!bg-dark-accent/90"'.replaceAll(
      generateRegex('!bg-dark-accent/90'),
      `$1test`,
    ),
  ).toBe('class="test"');
});

test('matchClasses - md:text-5xl/relaxed', () => {
  expect(
    'class="md:text-5xl/relaxed"'.replaceAll(
      generateRegex('md:text-5xl/relaxed'),
      `$1test`,
    ),
  ).toBe('class="test"');
});

test('matchClasses - dark:[&_path]:!fill-very-dark', () => {
  expect(
    'class="dark:[&_path]:!fill-very-dark"'.replaceAll(
      generateRegex('dark:[&_path]:!fill-very-dark'),
      `$1test`,
    ),
  ).toBe('class="test"');
});

test('matchClasses - h-4 not match when is not in class', () => {
  expect('h-4 h-4[h-4]'.replaceAll(generateRegex('h-4'), `$1test`)).toBe(
    'h-4 h-4[h-4]',
  );
});

test('matchClasses - h-4 match when is declaring a var', () => {
  expect(
    'const test = "h-4 h-4[h-4]"'.replaceAll(generateRegex('h-4'), `$1test`),
  ).toBe('const test = "test h-4[h-4]"');
});

test('matchClasses - h-4 match when is declaring a var without space', () => {
  expect(
    'const test ="h-4 h-4[h-4]"'.replaceAll(generateRegex('h-4'), `$1test`),
  ).toBe('const test ="test h-4[h-4]"');
});

test('matchClasses - h-4 match when use simple quote', () => {
  expect(
    "const test = 'h-4 h-4[h-4]'".replaceAll(generateRegex('h-4'), `$1test`),
  ).toBe("const test = 'test h-4[h-4]'");
});

test('matchClasses - h-4 match when use template quote', () => {
  expect(
    'const test = `h-4 h-4[h-4]`'.replaceAll(generateRegex('h-4'), `$1test`),
  ).toBe('const test = `test h-4[h-4]`');
});

test('matchClasses - link match but not <link /> tag', () => {
  expect(
    '<link class="link">sfds</link>'.replaceAll(
      generateRegex('link'),
      `$1test`,
    ),
  ).toBe('<link class="test">sfds</link>');
});
