# parallel-cucumber changelog

## [v1.0.x](https://github.com/simondean/parallel-cucumber-js/compare/v1.0.0...master)

### [master (unreleased)](https://github.com/simondean/parallel-cucumber-js/compare/v1.0.1...master)

### [v1.0.2](https://github.com/simondean/parallel-cucumber-js/compare/v1.0.1...v1.0.2)

#### New features
* Added the --compiler command line argument enabling pre-processing sources (e.g. babel-register)

### [v1.0.1](https://github.com/simondean/parallel-cucumber-js/compare/v1.0.0...v1.0.1)

#### Fixes
* Backgrounds no longer a failure (closes #20)

### [v1.0.0](https://github.com/simondean/parallel-cucumber-js/compare/v0.1.7...v1.0.0)

#### New features
* Upgraded to latest version of Cucumber, v1.0.0 (closes #16)
* Executes scenarios in parallel rather than just executing features in parallel (closes #14)  

## [v0.1.x](https://github.com/simondean/parallel-cucumber-js/compare/v0.1.0...v1.0.0)

### [v0.1.7](https://github.com/simondean/parallel-cucumber-js/compare/v0.1.6...v0.1.7)

#### New features
* Additional tests for retries
* Removed retry count from feature and scenario ids and added it to the feature names

#### Fixes
* Formatters could not emit error events

### [v0.1.6](https://github.com/simondean/parallel-cucumber-js/compare/v0.1.5...v0.1.6)

#### Fixes
* Retries should not fail when an element in the report does not have an id

### [v0.1.5](https://github.com/simondean/parallel-cucumber-js/compare/v0.1.4...v0.1.5)

#### New features
* Retry failed features (closes #11)

### [v0.1.4](https://github.com/simondean/parallel-cucumber-js/compare/v0.1.3...v0.1.4)

#### New features
* Removed the -c command line argument (closes #7)
* Included the tests in the npm package
* Restructured the tests
* The tests are less reliant on tags
* Additional tests for tags

#### Fixes
* BeforeFeatures and AfterFeatures events should not fire for every feature (closes #8)

### [v0.1.3](https://github.com/simondean/parallel-cucumber-js/compare/v0.1.2...v0.1.3)

#### New features
* Updated dependencies

### [v0.1.2](https://github.com/simondean/parallel-cucumber-js/compare/v0.1.1...v0.1.2)

#### New features
* Use Travis CI for builds (closes #3)
* Setting environment variables on a profile (closes #6)

#### Fixes
* Allow cucumber-js 0.4.x to be used (closes #2)
* Error with progress formatter when a step has no result (closes #4)

### [v0.1.1](https://github.com/simondean/parallel-cucumber-js/compare/v0.1.0...v0.1.1)

#### New features
* Can now specify a customized version of cucumber-js to load.  Can specify a relative path or custom module name
* Implemented a work around for cucumber-js lacking a dry run mode.  The workaround uses an environment variable called PARALLEL_CUCUMBER_DRY_RUN
* Improved the output of the progress formatter.  Nested JSON in error messages is now converted to YAML, which makes it much easier to read the error messages
* Added additional tests for the --profiles.NAME.tags command line arguments

#### Fixes
* Fixed a bug where passing only one -r/--require command line argument did not work.  Specifying more than one of those arguments was working

### [v0.1.0](https://github.com/simondean/parallel-cucumber-js/tree/v0.1.0)

Initial release
