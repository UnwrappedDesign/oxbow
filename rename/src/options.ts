import { matchClasses } from './utils.js';

import type { RenameOptions } from './types.js';

export const defaultOptions = {
  rename: {
    strategy: 'minimal',
    by: 'whole',
  },
  targetExt: ['html', 'js'],
  matchClasses,
} satisfies RenameOptions;
