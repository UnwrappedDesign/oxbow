const config = {
  '**/*.(ts|js|cjs|mjs)': (filenames) => [
    'npm run tsc',
    `npm run lint --fix ${filenames.join(' ')}`,
    `npx prettier --write ${filenames.join(' ')}`,
  ],

  '**/*.(md|json)': (filenames) =>
    `npx prettier --write ${filenames.join(' ')}`,
};

module.exports = config;
