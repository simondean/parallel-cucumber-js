# parallel-cucumber-js
  [![Build Status](https://travis-ci.org/simondean/parallel-cucumber-js.png?branch=master)](https://travis-ci.org/simondean/parallel-cucumber-js)
  [![Dependencies](https://david-dm.org/simondean/parallel-cucumber-js.png)](https://david-dm.org/simondean/parallel-cucumber-js)
  [![Code Climate](https://codeclimate.com/github/simondean/parallel-cucumber-js.png)](https://codeclimate.com/github/simondean/parallel-cucumber-js)

[![NPM](https://nodei.co/npm/parallel-cucumber.png?stars&downloads)](https://nodei.co/npm/parallel-cucumber/)
[![NPM](https://nodei.co/npm-dl/parallel-cucumber.png)](https://nodei.co/npm/parallel-cucumber/)

Executes Cucumber scenarios in parallel, reducing the amount of time tests take to execute.

parallel-cucumber-js uses multiple node.js processes to execute more than one Cucumber feature at a time.  This can
greatly reduce the time it takes for a test suite to execute.  However, a test suite needs to be built with
parallization in mind; especially when the Cucumber features are accessing shared resources like a database-backed
web service.

## Usage

### Install

parallel-cucumber-js is available as an npm module called parallel-cucumber.

parallel-cucumber-js should be added to your test codebase as a dev dependency.  You can do this with:

``` shell
$ npm install --save-dev parallel-cucumber
```

Alternatively you can manually add it to your package.json file:

``` json
{
  "devDependencies" : {
    "parallel-cucumber": "latest"
  }
}
```

then install with:

``` shell
$ npm install --dev
```

### Run

parallel-cucumber-js can be ran from a terminal as follows:

``` shell
$ node_modules/.bin/parallel-cucumber-js
```

By default parallel-cucumber will look for features files under a directory called `./features`

### Number of Workers

The number of features that will be executed in parallel can be set by passing the `-w` argument:

``` shell
$ node_modules/.bin/parallel-cucumber-js -w 4
```

Setting the number of workers controls the amount of parallization.  The larger the number of workers, the more
Cucumber feature will be executed in parallel.  By default the number of workers is set to the number of CPU cores in
the machine running parallel-cucumber.

### Profiles

parallel-cucumber can execute the same scenario multiple times.  This can be useful for things like executing the same
tests against both a desktop browser and mobile browser.

``` shell
$ node_modules/.bin/parallel-cucumber-js --profile.desktop.tags ~@mobile-only --profile.mobile.tags ~@desktop-only
```

parallel-cucumber sets an environment variable called PARALLEL_CUCUMBER_PROFILE which can be used within the
Cucumber step defs and support code to determine which profile is currently executing.

### Environment variables

Environment variables can be specified for a profile and those environment variables will be set when the Cucumber scenarios
are executed for the profile:

``` shell
$ node_modules/.bin/parallel-cucumber-js --profile.desktop.env.EXAMPLE_NAME example_value --profile.desktop.env.EXAMPLE_NAME_2 example_value_2
```

### Formats

Two output formats are supported: json and progress.  The progress format is the default.  The `-f` argument is used
to configure a different format:

``` shell
$ node_modules/.bin/parallel-cucumber-js -f json
```

By default, output is sent to the console but you can also send it to a file:

``` shell
$ node_modules/.bin/parallel-cucumber-js -f json:./output.json
```

You can configure multiple formats, with each format configured to output to the console or a file:

``` shell
$ node_modules/.bin/parallel-cucumber-js -f json:./output.json -f progress
```

### Example

See https://github.com/simondean/parallel-cucumber-js-example for an example
test codebase that uses parallel-cucumber-js.
