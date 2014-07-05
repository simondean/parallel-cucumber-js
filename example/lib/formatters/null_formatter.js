var NullFormatter = function(options) {
  var ParallelCucumber = require('../../../lib/parallel_cucumber');

  var self = ParallelCucumber.Formatters.Formatter(options);

  self.formatFeature = function() {
    // no-op
  };

  return self;
};

module.exports = NullFormatter;