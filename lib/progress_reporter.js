var Path = require('path');
var JSYAML = require('js-yaml');
require('colors');
var Debug = require('debug')('parallel-cucumber-js');


var ProgressReporter = function() {
  if (!(this instanceof ProgressReporter)) return new ProgressReporter();

  var self = this;

  return self;
};

ProgressReporter.prototype.report = function(options) {
  options.report.forEach(function(item) {
    item.profile = options.profileName;
  });

  logReportProgress({ workerIndex: options.workerIndex, report: options.report, dryRun: options.dryRun });
};

function logReportProgress(options) {
  options.report.forEach(function(item) {
    var featureUri = cleanUri(Path.relative(process.cwd(), item.uri));

    if (item.elements) {
      item.elements.forEach(function(element) {
        var elementStatus = 'stepless';

        if (element.steps) {
          var foundElementStatus = false;

          element.steps.forEach(function(step) {
            if (!foundElementStatus) {
              if (step.result) {
                elementStatus = step.result.status;
                foundElementStatus = elementStatus !== 'passed';
              }
              else {
                elementStatus = 'unknown';
                foundElementStatus = true;
              }
            }
          });
        }

        if (!options.dryRun) {
          logEvent(element.type, {
            worker: options.workerIndex,
            status: elementStatus,
            uri: featureUri + '/' + cleanUri(element.name)
          });
        }
      });
    }

    if (!options.dryRun) {
      logEvent('feature', {
        worker: options.workerIndex,
        status: 'finished',
        uri: featureUri
      });
    }
  });
}

function logEvent(key, item) {
  Debug('Event', key, item);
  var event = {};
  event[key] = item;

  var eventYaml = JSYAML.safeDump(
    event,
    {
      flowLevel: 0
    }
  );

  if (item.status == 'passed') {
    eventYaml = eventYaml.green;
  }
  else if (item.status == 'failed') {
    eventYaml = eventYaml.red;
  }
  else if (item.status == 'stepless') {
    eventYaml = eventYaml.blue;
  }
  else  {
    eventYaml = eventYaml.grey;
  }

  process.stderr.write(eventYaml);
}

function cleanUri(value) {
  return value.replace(/[^a-zA-Z0-9\\/]/g, '_').replace(/\\/g, '/');
}

module.exports = ProgressReporter;