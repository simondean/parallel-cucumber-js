var ProgressFormatter = function(options) {
  var ParallelCucumber = require('../../parallel_cucumber');
  var Path = require('path');
  var JSYAML = require('js-yaml');
  require('colors');
  var Debug = require('debug')('parallel-cucumber-js');

  var self = ParallelCucumber.Formatters.Formatter(options);

  self.formatFeature = function(options) {
    var feature = options.feature;
    var featureUri = cleanUri(Path.relative(process.cwd(), feature.uri));

    if (feature.elements) {
      feature.elements.forEach(function(element) {
        var elementStatus = 'stepless';
        var errorMessage;

        if (element.steps) {
          var foundElementStatus = false;

          element.steps.forEach(function(step) {
            if (!foundElementStatus) {
              if (step.result) {
                elementStatus = step.result.status;
                foundElementStatus = elementStatus !== 'passed';
                errorMessage = step.result.error_message;
              }
              else {
                elementStatus = 'unknown';
                foundElementStatus = true;
              }
            }
          });
        }

        var event = {
          worker: options.workerIndex,
          status: elementStatus,
          profile: options.profileName,
          uri: featureUri + '/' + cleanUri(element.name)
        };

        if (errorMessage) {
          event.errorMessage = errorMessage;
        }

        self._logEvent(element.type, event);
      });
    }

    self._logEvent('feature', {
      worker: options.workerIndex,
      status: 'finished',
      profile: options.profileName,
      uri: featureUri
    });
  };

  self._logEvent = function(key, item) {
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

    self._write(eventYaml);
  };

  return self;
};

function cleanUri(value) {
  return value.replace(/[^a-zA-Z0-9\\/]/g, '_').replace(/\\/g, '/');
}

module.exports = ProgressFormatter;