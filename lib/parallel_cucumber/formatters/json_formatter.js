var JsonFormatter = function(options) {
  var ParallelCucumber = require('../../parallel_cucumber');
  var OS = require('os');
  var Debug = require('debug')('parallel-cucumber-js');

  var self = ParallelCucumber.Formatters.Formatter(options);

  self._firstFeature = true;
  self._superEnd = self.end;

  self._write('[');

  self.formatFeature = function(options) {
    var json = JSON.stringify(options.feature);

    if (json.length == 0) {
      Debug('Empty report');
    }
    else {
      if (self._firstFeature) {
        Debug('First report');
        self._firstFeature = false;
      }
      else {
        Debug('Subsequent report');
        json = ',' + json;
      }

      self._write(json);
    }
  };

  self.end = function(callback) {
    self._write(']' + OS.EOL);

    self._superEnd(callback);
  };

  return self;
};

module.exports = JsonFormatter;