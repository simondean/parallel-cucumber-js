var JsonFormatter = function(options) {
  var ParallelCucumber = require('../../parallel_cucumber');
  var OS = require('os');
  var FS = require('fs');
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

    if (self.outFilePath) {
      var jsonPart = JSON.stringify(self._features).slice(0, -1);
      self._writeToFile(jsonPart);
    }
  };

  self._writeToFile = function (data) {
    self._out = FS.createWriteStream(self.outFilePath, {flags: 'w'});
    self._outNeedsClosing = true;
    self._out.write(data, 'utf8');
  };

  self.end = function(callback) {
    var jsonFinal = JSON.stringify(self._features);
    if (self.outFilePath) {
      self._writeToFile(jsonFinal + OS.EOL);
    }
    else {
      self._write(jsonFinal + OS.EOL);
    }

    self._superEnd(callback);
  };

  return self;
};

module.exports = JsonFormatter;