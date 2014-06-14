# parallel-cucumber changelog

## [v0.1.1](https://github.com/simondean/parallel-cucumber-js/compare/v0.1.0...v0.1.1)

### New features
* Can now specify a customized version of cucumber-js to load.  Can specify a relative path or custom module name
* Implemented a work around for cucumber-js lacking a dry run mode.  The workaround uses an environment variable called PARALLEL_CUCUMBER_DRY_RUN
* Improved the output of the progress formatter.  Nested JSON in error messages is now converted to YAML, which makes it much easier to read the error messages
* Added additional tests for the --profiles.NAME.tags command line arguments

### Fixes
* Fixed a bug where passing only one -r/--require command line argument did not work.  Specifying more than one of those arguments was working

## [v0.1.0](https://github.com/simondean/parallel-cucumber-js/tree/v0.1.0)

Initial release