var CustomFormatter = function(options) {
  var ParallelCucumber = require('../../../lib/parallel_cucumber');
  var OS = require('os');

  var self = ParallelCucumber.Formatters.Formatter(options);

  self._firstFeature = true;
  var superEnd = self.end;

  self._write('Start' + OS.EOL);

  self.formatFeature = function(options) {
    self._write('Feature ' + options.feature.id + OS.EOL);
  };

  self.end = function(callback) {
    self._write('End' + OS.EOL);

    superEnd(callback);
  };

  return self;
};

module.exports = CustomFormatter;