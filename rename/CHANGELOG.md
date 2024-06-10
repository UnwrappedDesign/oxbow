# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Support for compressing CSS variables.

### Changed

- Regular expresion to match class names now is more strict, avoiding matches with incomplete class names.

### Fixed

- Config types are now correctly exported, so now the plugin has suggestion in options.

## [1.1.2] - 2023-11-04

### Changed

- Now the required version of Node.js is the latest LTS 18 or higher.
- Updated dependencies.

## [1.1.1] - 2023-10-21

### Changed

- Now the required version of Node.js is the latest LTS 18.18 or higher.

## [1.1.0] - 2023-08-11

### Added

- Show size of the result files with gzip and brotli
- Improve stadistics of file size reduction

### Fixed

- Regex expression matches incomplete class names, leading to errors: `h-2` class match instances of `h-20`

## [1.0.0] - 2023-05-29

### Added

- Support for compressing CSS classes.
- The options for [postcss-rename](https://github.com/google/postcss-rename) support excluding IDs.
- Replacement of CSS class references in HTML, JS, and other files.
- Support for custom class name prefixes.
- Option to set the target file extensions to process.
