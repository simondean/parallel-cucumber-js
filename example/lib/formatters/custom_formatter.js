var CustomFormatter = function(options) {
  var ParallelCucumber = require('../../../lib/parallel_cucumber');

  var self = ParallelCucumber.Formatters.Formatter(options);

  self._firstFeature = true;
  var superEnd = self.end;

  self._write('Start\n');

  self.formatFeature = function(options) {
    self._write('Feature ' + options.feature.id + '\n');
  };

  self.end = function(callback) {
    self._write('End\n');

    superEnd(callback);
  };

  return self;
};

module.exports = CustomFormatter;