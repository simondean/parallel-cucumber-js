var JsonFormatter = function(options) {
  var ParallelCucumber = require('../../parallel_cucumber');
  var OS = require('os');
  var Debug = require('debug')('parallel-cucumber-js');

  var self = ParallelCucumber.Formatters.Formatter(options);

  self.type = 'json';
  self._firstFeature = true;
  self._superEnd = self.end;
  self._features = [];

  self.formatFeature = function(options) {
    var newFeature = true;
    var currentFeature = options.feature;
    self._features.forEach(function(feature) {
      if (feature.uri === currentFeature.uri && feature.profile === currentFeature.profile && feature.retry === currentFeature.retry) {
        Debug('Existing feature, merging elements (scenarios)');
        newFeature = false;
        feature.elements = feature.elements.concat(currentFeature.elements);
        feature.elements.sort(function(a, b) {
          return a.line - b.line;
        });
      }
    });
    if (newFeature) {
      Debug('New feature');
      self._features.push(currentFeature);
    }
    self._rewriteReport(JSON.stringify(self._features));
  };

  self.end = function(callback) {
    var json = JSON.stringify(self._features);
    self._write(json);
    self._write(OS.EOL);

    self._superEnd(callback);
  };

  return self;
};

module.exports = JsonFormatter;