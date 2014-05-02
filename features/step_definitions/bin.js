var ChildProcess = require('child_process');
var DeepDiff = require('deep-diff');

module.exports = function() {
  this.Given(/^the '(.*)' tags?$/, function(tags, callback) {
    if (isDryRun()) { return callback(); }

    var world = this;

    world.tags = tags;

    callback();
  });

  this.Given(/^a profile called '(.*)'$/, function(name, callback) {
    if (isDryRun()) { return callback(); }

    var world = this;

    if (!world.profiles) {
      world.profiles = {};
    }

    world.profiles[name] = {};

    callback();
  });

  this.Given(/^the '(.*)' profile has the tags? '(.*)'$/, function(name, tags, callback) {
    if (isDryRun()) { return callback(); }

    var world = this;

    world.profiles[name].tags = tags;

    callback();
  });

  this.When(/^executing the parallel-cucumber-js bin$/, function(callback) {
    if (isDryRun()) { return callback(); }

    var world = this;

    var args = ['../bin/parallel-cucumber-js'];

    if (world.tags) {
      args.push('-t');
      args.push(world.tags);
    }

    if (world.profiles) {
      Object.keys(world.profiles).forEach(function(profileName) {
        var profile = world.profiles[profileName];
        args.push('--profiles.' + profileName + '.tags');
        args.push(profile.tags);
      });
    }

    world.child = ChildProcess.spawn('node', args, {
      stdio: ['ignore', 'pipe', process.stderr],
      cwd: 'example'
    });

    var stdout = [];

    world.child.stdout.on('data', function (data) {
      stdout.push(data);
    });

    world.child.on('exit', function(code) {
      world.stdout = stdout.join('');
      world.exitCode = code;

      callback();
    });
  });

  this.Then(/^the exit code should be '(.*)'$/, function(exitCode, callback) {
    if (isDryRun()) { return callback(); }

    var world = this;

    if (world.exitCode !== parseInt(exitCode, 10)) {
      callback(JSON.stringify({ message: 'Unexpected value', expected: exitCode, actual: world.exitCode, stdout: world.stdout }));
    }
    else {
      callback();
    }
  });

  this.Then(/^the stdout should contain JSON matching:$/, function(expectedJson, callback) {
    if (isDryRun()) { return callback(); }

    var world = this;

    expectedJson = JSON.parse(expectedJson);
    var actualJson = JSON.parse(world.stdout);

    actualJson.forEach(function(feature) {
      if (typeof feature.uri === 'string') {
        feature.uri = feature.uri.replace(/^.*[\\\/]features[\\\/]/i, '{uri}/features/').replace('\\', '/');
      }

      feature.elements.forEach(function(element) {
        element.steps.forEach(function(step) {
          if (typeof step.result.duration === 'number' && step.result.duration > 0) {
            step.result.duration = '{duration}';
          }
        });
      });
    });

    normalizeFeatureOrder(expectedJson);
    normalizeFeatureOrder(actualJson);

    var differences = DeepDiff.diff(actualJson, expectedJson);

    if (differences) {
      console.error(JSON.stringify(differences, null, 2));
      callback('Actual JSON did not match expected JSON');
    }
    else {
      callback();
    }
  });
};

function isDryRun() {
  return process.argv.indexOf('--dry-run') !== -1;
}


function normalizeFeatureOrder(report) {
  report.sort(function(a, b) {
    if (a.uri < b.uri) return -1;
    if (a.uri > b.uri) return 1;
    if (a.profileName < b.profileName) return -1;
    if (a.profileName > b.profileName) return 1;
    return 0;
  });
}