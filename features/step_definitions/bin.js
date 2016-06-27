var ChildProcess = require('child_process');
var DeepDiff = require('deep-diff');
var Diff = require('diff');
var StripColorCodes = require('stripcolorcodes');
var JSYAML = require('js-yaml');

module.exports = function() {
  this.Given(/^the '(.*)' feature$/, function(feature, callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    if (!world.features) {
      world.features = [];
    }

    world.features.push('features/' + feature + '.feature');

    callback();
  });

  this.Given(/^the '(.*)' features$/, function(features, callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    if (!world.features) {
      world.features = [];
    }

    world.features.push('features/' + features + '/');

    callback();
  });

  this.Given(/^the '(.*)' tags?$/, function(tags, callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    world.tags = tags;

    callback();
  });

  this.Given(/^a profile called '(.*)'$/, function(name, callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    if (!world.profiles) {
      world.profiles = {};
    }

    world.profiles[name] = {};

    callback();
  });

  this.Given(/^the '(.*)' profile has the tags? '(.*)'$/, function(name, tags, callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    if (!world.profiles[name].tags) {
      world.profiles[name].tags = [];
    }

    world.profiles[name].tags.push(tags);

    callback();
  });

  this.Given(/^the '(.*)' profile has the environment variable '(.*)' set to '(.*)'$/, function(name, envName, envValue, callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    if (!world.profiles[name].env) {
      world.profiles[name].env = {};
    }

    world.profiles[name].env[envName] = envValue;

    callback();
  });

  this.Given(/^a '(.*)' formatter$/, function(name, callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    if (!world.formatters) {
      world.formatters = {};
    }

    world.formatters[name] = {
      type: name
    };

    callback();
  });

  this.Given(/^'(.*)' workers?$/, function(count, callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    world.workerCount = count;

    callback();
  });

  this.Given(/^the '(.*)' custom version of Cucumber$/, function(path, callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    world.customerCucumberPath = path;

    callback();
  });

  this.Given(/^'(.*)' is required$/, function(path, callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    if (!world.supportCodePaths) {
      world.supportCodePaths = [];
    }

    world.supportCodePaths.push(path);

    callback();
  });

  this.Given(/^dry run mode$/, function(callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    world.dryRun = true;

    callback();
  });

  this.Given(/^the environment variable '(.*)' is set to '(.*)'$/, function(name, value, callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    if (!world.env) {
      world.env = {};
    }

    world.env[name] = value;

    callback();
  });

  this.Given(/^'(.*)' max retries$/, function(maxRetries, callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    world.maxRetries = maxRetries;

    callback();
  });

  this.When(/^executing the parallel-cucumber-js bin$/, function(callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    var args = ['../bin/parallel-cucumber-js'];

    if (world.customerCucumberPath) {
      args.push('--cucumber');
      args.push(world.customerCucumberPath);
    }

    if (world.tags) {
      args.push('-t');
      args.push(world.tags);
    }

    if (world.profiles) {
      Object.keys(world.profiles).forEach(function(profileName) {
        var profile = world.profiles[profileName];
        var profileDefined = false;

        if (profile.tags) {
          profile.tags.forEach(function(tags) {
            args.push('--profiles.' + profileName + '.tags');
            args.push(tags);
          });

          profileDefined = true;
        }

        if (profile.env) {
          Object.keys(profile.env).forEach(function(envName) {
            var envValue = profile.env[envName];
            args.push('--profiles.' + profileName + '.env.' + envName);
            args.push(envValue);
          });

          profileDefined = true;
        }

        if (!profileDefined) {
          args.push('--profiles.' + profileName);
        }
      });
    }

    if (world.formatters) {
      Object.keys(world.formatters).forEach(function(formatterName) {
        var formatter = world.formatters[formatterName];

        var formatterExpression = formatterName;

        if (formatter.out) {
          formatterExpression += ':' + formatter.out;
        }

        args.push('-f');
        args.push(formatterExpression);
      });
    }

    if (world.supportCodePaths) {
      world.supportCodePaths.forEach(function(supportCodePath) {
        args.push('-r');
        args.push(supportCodePath);
      });
    }

    if (world.workerCount) {
      args.push('-w');
      args.push(world.workerCount);
    }

    if (world.dryRun) {
      args.push('-d');
    }

    if (world.maxRetries) {
      args.push('--max-retries');
      args.push(world.maxRetries);
    }

    if (world.features) {
      world.features.forEach(function(feature) {
        args.push(feature);
      });

      args.push('-r');
      args.push('features/');
    }

    if (!world.env) {
      world.env = {};
    }

    var env = {};

    Object.keys(process.env).forEach(function(envName) {
      env[envName] = process.env[envName];
    });

    Object.keys(world.env).forEach(function(envName) {
      env[envName] = world.env[envName];
    });

    world.child = ChildProcess.spawn('node', args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: 'test_assets',
      env: env
    });

    var stdout = [];
    var stderr = [];

    world.child.stdout.on('data', function (data) {
      stdout.push(data);
    });

    world.child.stderr.on('data', function (data) {
      stderr.push(data);
      process.stderr.write(data);
    });

    world.child.on('exit', function(code) {
      world.stdout = stdout.join('');
      world.stderr = stderr.join('');
      world.exitCode = code;

      callback();
    });
  });

  this.Then(/^the exit code should be '(.*)'$/, function(exitCode, callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    if (world.exitCode !== parseInt(exitCode, 10)) {
      callback(JSON.stringify({ message: 'Unexpected value', expected: exitCode, actual: world.exitCode, stdout: world.stdout }));
    }
    else {
      callback();
    }
  });

  this.Then(/^(.*) should contain JSON matching:$/, function(stream, expectedJson, callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    try {
      expectedJson = JSON.parse(expectedJson);
    }
    catch (e) {
      if (!(e instanceof SyntaxError)) {
        throw e;
      }

      callback({ message: 'Syntax error in expected JSON', error: e, expectedJson: expectedJson });
      return;
    }

    var actualJson = world[stream];

    try {
      actualJson = JSON.parse(actualJson);
    }
    catch (e) {
      if (!(e instanceof SyntaxError)) {
        throw e;
      }

      callback({ message: 'Syntax error in actual JSON', error: e, actualJson: actualJson });
      return;
    }

    //console.log(JSON.stringify(actualJson, null, '  '));

    actualJson.forEach(function(feature) {
      if (typeof feature.uri === 'string') {
        feature.uri = feature.uri.replace(/^.*[\\\/]features[\\\/]/i, '{uri}/features/').replace('\\', '/');
      }

      if (feature.elements) {
        feature.elements.forEach(function(element) {
          element.steps.forEach(function(step) {
            if (typeof step.result.duration === 'number' && step.result.duration > 0) {
              step.result.duration = '{duration}';
            }
            if (step.match && typeof step.match.location === 'string') {
              step.match.location = '{location}';
            }
          });
        });
      }
    });

    normalizeJsonFeatureOrder(expectedJson);
    normalizeJsonFeatureOrder(actualJson);

    var differences = DeepDiff.diff(actualJson, expectedJson);

    if (differences) {
      var transformedDifferences = [];

      differences.forEach(function(difference) {
        var path = '';

        difference.path.forEach(function(pathPart) {
          path += '/' + pathPart;
        });

        transformedDifferences.push({
          kind: difference.kind,
          path: path,
          lhs: difference.lhs,
          rhs: difference.rhs
        });
      });

      callback({ message: 'Actual JSON did not match expected JSON', differences: transformedDifferences });
    }
    else {
      callback();
    }
  });

  this.Then(/^(.*) should contain new line separated YAML matching:$/, function(stream, expectedYaml, callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    expectedYaml = normalizeMultiLineYaml(expectedYaml);
    var actualYaml = normalizeMultiLineYaml(world[stream]);

    var zeroOrGreaterNumberKeys = ['worker'];
    var durationKeys = ['duration', 'duration', 'elapsed', 'saved'];
    var durationRegExp = /^-?\d{2,}:\d{2}:\d{2}\.\d{3}$/;
    var percentageKeys = ['savings'];
    var percentageRegExp = /^-?\d{1,}\.\d{2}%$/;

    actualYaml.forEach(function(event) {
      Object.keys(event).forEach(function(itemKey) {
        var item = event[itemKey];

        zeroOrGreaterNumberKeys.forEach(function(valueKey) {
          if (typeof item[valueKey] === 'number' && item[valueKey] >= 0) {
            item[valueKey] = '{zeroOrGreaterNumber}';
          }
        });

        durationKeys.forEach(function(valueKey) {
          if (typeof item[valueKey] === 'string' && durationRegExp.test(item[valueKey])) {
            item[valueKey] = '{duration}';
          }
        });

        percentageKeys.forEach(function(valueKey) {
          if (typeof item[valueKey] === 'string' && percentageRegExp.test(item[valueKey])) {
            item[valueKey] = '{percentage}';
          }
        });
      });
    });

    expectedYaml = dumpMultiLineYaml(expectedYaml);
    actualYaml = dumpMultiLineYaml(actualYaml);

    var differences = diffText(expectedYaml, actualYaml);

    if (differences) {
      callback({ message: 'Actual YAML did not match expected YAML', differences: differences });
    }
    else {
      callback();
    }
  });

  this.Then(/^(.*) should contain text matching:$/, function(stream, expectedText, callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    expectedText = normalizeText(expectedText);
    var actualText = normalizeText(world[stream]);

    var differences = diffText(expectedText, actualText);

    if (differences) {
      callback({ messages: 'Actual text did not match expected text', differences: differences });
    }
    else {
      callback();
    }
  });

  this.Then(/^(.*) should be empty$/, function(stream, callback) {
    if (this.isDryRun()) { return callback(); }

    var world = this;

    var actualText = world[stream];

    if (actualText.length > 0) {
      callback({ message: 'Expected stderr to be empty but it was not', actualText: actualText });
    }
    else {
      callback();
    }
  });
};

function diffText(expectedText, actualText) {
  var differences = Diff.diffLines(expectedText, actualText);

  var different = false;

  differences.forEach(function(part) {
    if (part.added || part.removed) {
      different = true;
    }
  });

  if (!different) {
    return undefined;
  }

  var unifiedDiff = Diff.createPatch('text', expectedText, actualText);

  return unifiedDiff;
}

function normalizeJsonFeatureOrder(report) {
  report.sort(function(a, b) {
    if (a.uri < b.uri) { return -1; }
    if (a.uri > b.uri) { return 1; }
    if (a.profile < b.profile) { return -1; }
    if (a.profile > b.profile) { return 1; }
    return 0;
  });
}

function normalizeMultiLineYaml(value) {
  value = normalizeText(value);
  var lines = value.split('\n');
  var events = [];

  lines.forEach(function(line) {
    events.push(JSYAML.load(line));
  });

  events.sort(function(a, b) {
    if (a.scenario && b.scenario) {
      if (a.uri < b.uri) { return -1; }
      if (a.uri > b.uri) { return 1; }
      if (a.profile < b.profile) { return -1; }
      if (a.profile > b.profile) { return 1; }
      return 0;
    }

    if (a.feature && b.feature) {
      if (a.uri < b.uri) { return -1; }
      if (a.uri > b.uri) { return 1; }
      if (a.profile < b.profile) { return -1; }
      if (a.profile > b.profile) { return 1; }
      return 0;
    }

    if (a.summary && b.summary) {
      if (a.status < b.status) { return -1; }
      if (a.status > b.status) { return 1; }
      return 0;
    }

    if (a.scenario) { return -1; }
    if (b.scenario) { return 1; }
    if (a.feature) { return -1; }
    if (b.feature) { return 1; }
    if (a.summary) { return -1; }
    if (b.summary) { return 1; }
    return 0;
  });

  return events;
}

function dumpMultiLineYaml(multiLineYaml) {
  var lines = [];

  multiLineYaml.forEach(function(yaml) {
    lines.push(JSYAML.safeDump(yaml, { flowLevel: 0 }));
  });

  return lines.join('\n');
}

function normalizeText(value) {
  value = StripColorCodes(value);
  value = value.replace(/\r\n/gm, '\n');
  value = value.replace(/^\n+/gm, '');
  value = value.replace(/\n+$/gm, '');
  value = value.replace(/^\s+/gm, '');
  value = value.replace(/\s+$/gm, '');
  value = value.replace(/\s+\n/gm, '\n');
  value = value.replace(/\n\s+/gm, '\n');
  return value;
}
