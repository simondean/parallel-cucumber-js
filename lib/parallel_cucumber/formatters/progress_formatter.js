var ProgressFormatter = function(options) {
  var ParallelCucumber = require('../../parallel_cucumber');
  var Path = require('path');
  var JSYAML = require('js-yaml');
  require('colors');
  var Debug = require('debug')('parallel-cucumber-js');

  var self = ParallelCucumber.Formatters.Formatter(options);
  self.cumulativeDuration = 0;
  self._superEnd = self.end;
  self._startTime = process.hrtime();

  self.formatFeature = function(options) {
    var feature = options.feature;
    var featureUri = cleanUri(Path.relative(process.cwd(), feature.uri));
    var featureDuration = 0;

    if (feature.elements) {
      feature.elements.forEach(function(element) {
        var elementStatus = 'stepless';
        var errorMessage;
        var elementDuration = 0;

        if (element.steps) {
          var foundElementStatus = false;

          element.steps.forEach(function(step) {
            if (!foundElementStatus) {
              if (step.result) {
                elementStatus = step.result.status;
                foundElementStatus = elementStatus !== 'passed';
                errorMessage = step.result['error_message'];

                if (step.result.duration) {
                  elementDuration += step.result.duration;
                }
              }
              else {
                elementStatus = 'unknown';
                foundElementStatus = true;
              }
           }
          });
        }

        featureDuration += elementDuration;

        var event = {
          worker: options.workerIndex,
          status: elementStatus,
          profile: options.profileName,
          uri: featureUri + '/' + cleanUri(element.name),
          duration: formatDuration(elementDuration)
        };

        if (errorMessage) {
          event.errorMessage = errorMessage;
        }

        self._logEvent(element.type, event);
      });
    }

    self.cumulativeDuration += featureDuration;

    self._logEvent('feature', {
      worker: options.workerIndex,
      status: 'finished',
      profile: options.profileName,
      uri: featureUri,
      duration: formatDuration(featureDuration)
    });
  };

  self.end = function(callback) {
    var elapsedDuration = process.hrtime(self._startTime);
    elapsedDuration = elapsedDuration[0] * 1e9 + elapsedDuration[1];
    var savedTime = self.cumulativeDuration - elapsedDuration;
    var savingsPercentage = savedTime / self.cumulativeDuration * 100;

    if (savingsPercentage < -100) {
      savingsPercentage = -100;
    }

    self._logEvent('summary', {
      status: 'finished',
      duration: formatDuration(self.cumulativeDuration),
      elapsed: formatDuration(elapsedDuration),
      saved: formatDuration(savedTime),
      savings: formatPercentage(savingsPercentage)
    });

    self._superEnd(callback);
  };

  self._logEvent = function(key, item) {
    Debug('Event', key, item);
    var event = {};
    event[key] = self._expandNestedJson(item);
    var objectDepth = self._findObjectDepth(event);
    var flowLevel = objectDepth > 2 ? -1 : 1;

    var eventYaml = JSYAML.safeDump(
      event,
      {
        flowLevel: flowLevel
      }
    );

    if (item.status === 'passed') {
      eventYaml = eventYaml.green;
    }
    else if (item.status === 'failed') {
      eventYaml = eventYaml.red;
    }
    else if (item.status === 'stepless') {
      eventYaml = eventYaml.blue;
    }
    else  {
      eventYaml = eventYaml.grey;
    }

    self._write(eventYaml);
  };

  self._expandNestedJson = function(value) {
    if (Array.isArray(value)) {
      for (var i = 0, length = value.length; i < length; i++) {
        value[i] = self._expandNestedJson(value[i]);
      };
    }
    else if (value === Object(value)) {
      Object.keys(value).forEach(function(key) {
        value[key] = self._expandNestedJson(value[key]);
      });
    }
    else if (typeof value === 'string') {
      var json;
      var isJson = false;

      try {
        json = JSON.parse(value);
        isJson = true;
      }
      catch (e) {
        if (!(e instanceof SyntaxError)) {
          throw e;
        }
      }

      if (isJson) {
        value = self._expandNestedJson(json);
      }
    }

    return value;
  };

  self._findObjectDepth = function(value) {
    var depth = 0;
    var items;

    if (Array.isArray(value)) {
      items = value;
    }
    else if (value === Object(value)) {
      items = []
      Object.keys(value).forEach(function(key) {
        items.push(value[key]);
      });
    }

    if (items) {
      items.forEach(function(item) {
        depth = Math.max(1 + self._findObjectDepth(item), depth);
      });
    }

    return depth;
  };

  return self;
};

function cleanUri(value) {
  return value.replace(/[^a-zA-Z0-9\\/]/g, '_').replace(/\\/g, '/');
}

function formatDuration(totalNanoseconds) {
  var sign;

  if (totalNanoseconds >= 0) {
    sign = '';
  }
  else {
    sign = '-';
    totalNanoseconds = -totalNanoseconds;
  }

  var totalMilliseconds = Math.floor(totalNanoseconds / 1000000);
  var milliseconds = totalMilliseconds % 1000;
  var totalSeconds = Math.floor(totalMilliseconds / 1000);
  var seconds = totalSeconds % 60;
  var totalMinutes = Math.floor(totalSeconds / 60);
  var minutes = totalMinutes % 60;
  var totalHours = Math.floor(totalMinutes / 60);

  var padding = '0';
  var text = sign + padStringLeft(totalHours.toString(), padding, 2) + ':' +
    padStringLeft(minutes.toString(), padding, 2) + ':' +
    padStringLeft(seconds.toString(), padding, 2) + '.' +
    padStringLeft(milliseconds.toString(), padding, 3);
  return text;
}

function padStringLeft(value, padding, count) {
  while (value.length < count) {
    value = padding + value;
  }

  return value;
}

function formatPercentage(value) {
  return value.toFixed(2) + '%';
}

module.exports = ProgressFormatter;