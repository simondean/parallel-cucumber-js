var SupportCodeFinder = function() {
  var self = {};

  self.find = function(options, callback) {
    var supportCodePaths = options.supportCodePaths;

    if (supportCodePaths.length > 0) {
      // Clone the array using slice()
      supportCodePaths = supportCodePaths.slice();

      callback(null, supportCodePaths);
      return;
    }

    supportCodePaths = [];

    options.featurePaths.forEach(function (featurePath) {
      supportCodePaths.push(featurePath.replace(/[\/\\][^\/\\]+\.feature$/i, ''));
    });

    callback(null, supportCodePaths);
  };

  return self;
};

module.exports = SupportCodeFinder;
