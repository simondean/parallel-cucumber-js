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

### Config

You need to add a ParallelCucumberfile.js confg file to the your test codebase:

``` javascript
module.exports = {
  profiles: {
    default: {
    }
  }
};
```

Multiple profiles can be configured and the cucumber tests will be
executed multiple times, once for each profile.  This can be useful for
things like executing the same tests against both a desktop browser
and mobile browser.

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

parallel-cucumber-js currently only works with cucumber's JSON formatter.  It
doesn't support the HTML or pretty formatters.

### Run

parallel-cucumber-js can be ran from terminal as follows:

``` shell
$ node_modules/.bin/parallel-cucumber-js --workers 4
```

### Example

See https://github.com/simondean/parallel-cucumber-js-example for an example
test codebase that uses parallel-cucumber-js.
