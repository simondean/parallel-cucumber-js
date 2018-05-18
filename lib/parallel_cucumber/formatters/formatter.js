var Formatter = function(options) {
  var Events = require('events');
  var FS = require('fs');

  var self = new Events.EventEmitter();

  self.outFilePath = options.outFilePath;

  if (self.outFilePath) {
    self._out = FS.createWriteStream(self.outFilePath, { flags: 'w' });
    self._outNeedsClosing = true;
  }
  else {
    self._out = process.stdout;
  }

  self._out.on('error', function(err) {
    self.emit('error', err);
  });

  self.formatFeatures = function(options) {
    options.features.forEach(function(feature) {
      self.formatFeature({ workerIndex: options.workerIndex, profileName: options.profileName, feature: feature });
    });
  };

  self._write = function(data) {
    self._out.write(data, 'utf8');
  };

  self.end = function(callback) {
    if (self._outNeedsClosing) {
      self._outNeedsClosing = false;
      self._out.end(callback);
    }
    else {
      callback();
    }
  };

  return self;
};

module.exports = Formatter;