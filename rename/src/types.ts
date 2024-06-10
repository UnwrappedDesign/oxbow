import type { Options as PostcssRenameOptions } from 'postcss-rename';

export type RenameOptions =
  | {
      rename?: {
        /**
         * The renaming strategy to use:
         *  - "none": Don't change names at all. This is the default strategy.
         * - "debug": Add an underscore at the end of each name. This is useful for keeping classes readable during debugging while still verifying that your templates and JavaScript aren't accidentally using non-renamed classes.
         * - "minimal": Use the shortest possible names, in order of appearance: the first class is renamed to .a, the second to .b, and so on.
         *
         * This can also be a function that takes a CSS name (the full name in by-whole mode and the part in by-part mode) and returns its renamed value.
         *
         * @default 'minimal'
         */
        strategy?: PostcssRenameOptions['strategy'];
        /**
         * Whether to rename in "by-whole mode" or "by-part mode".
         * - "whole": Rename the entire name at once, so for example .tall-image might become .a. This is the default mode.
         * - "part": Rename each hyphenated section of a name separately, so for example .tall-image might become .a-b.
         *
         * @default 'whole'
         */
        by?: PostcssRenameOptions['by'];
        /**
         * A string prefix to add before every renamed class. This applies even if strategy is set to none.
         * In by-part mode, the prefix is applied to the entire class, but it isn't included in the output map.
         *
         * @default undefined
         */
        prefix?: PostcssRenameOptions['prefix'];
        /**
         * An array (or other Iterable) of names that shouldn't be renamed.
         *
         * @default undefined
         */
        except?: PostcssRenameOptions['except'];
        /**
         * A callback that's passed a map from original class names to their renamed equivalents, so that an HTML template or JS class references can also be renamed.
         *
         * In by-part mode, this contains separate entries for each part of a class name. It doesn't contain any names that weren't renamed because of except.
         *
         * @default undefined
         */
        outputMapCallback?: PostcssRenameOptions['outputMapCallback'];
      };
      /**
       * The target file extensions to process.
       *
       * @default '["html", "js"]''
       */
      targetExt?: string[];
      /**
       * A function that takes a CSS name (the full name in by-whole mode and the part in by-part mode) and returns a regular expression that matches that name.
       * This is used to find references to the original class names in HTML templates and JS classes.
       * The default is to match the name with word boundaries on either side, but you can change this to match only the start or end of the name, or to match more or less than a whole word.
       *
       * @default ```js
       * (key: string) => `(:^|[^&;:_/\[\\]a-zA-Z0-9_.-])(${key})(?=$|[^&;:_/\[\\]a-zA-Z0-9_.-])`
       * ```
       */
      matchClasses?: (key: string) => string;
    }
  | undefined;

export type InternalRenameOptions = {
  rename: {
    strategy: PostcssRenameOptions['strategy'];
    by: PostcssRenameOptions['by'];
    prefix?: PostcssRenameOptions['prefix'];
    except?: PostcssRenameOptions['except'];
    outputMapCallback(map: {
      [key: string]: string;
    }): Promise<void> | PostcssRenameOptions['outputMapCallback'];
  };
  targetExt: string[];
  matchClasses: (key: string) => string;
};
