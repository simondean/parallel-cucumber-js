# parallel-cucumber-js

Executes Cucumber scenarios in parrallel, reducing the amount of time tests take to execute.

__WARNING: This is work-in-progress.  It is not working yet__

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

By default parallel-cucumber will look for features files under a directly called `./features`

The number of features that will be executed in parallel can be set by passing the `-w` argument:

``` shell
$ node_modules/.bin/parallel-cucumber-js -w 4
```

parallel-cucumber can execute the same scenario multiple times.  This can be
useful for things like executing the same tests against both a desktop browser
and mobile browser.

``` shell
$ node_modules/.bin/parallel-cucumber-js --profile.desktop.tags ~@mobile-only --profile.mobile.tags ~@desktop-only
```

### Config

In addition to passing in arguments, parallel-cucumber can be configured
through a config file.  All of parallel-cucumber's arguments can be set via
the config file.  Create a file called `ParallelCucumberfile.js:

``` javascript
module.exports = {
  profiles: {
    desktop: {
      tags: ['~@mobile-only']
    },
    mobile: {
      tags: ['~@desktop-only']
    }
  }
};
```

then pass the `-c` argument:

``` shell
$ node_modules/.bin/parallel-cucumber-js -c ParallelCucumberfile.js
```
