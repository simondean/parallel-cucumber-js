var SupportCodeFinder = module.exports;

SupportCodeFinder.find = function(options, callback) {
  var supportCodePaths = options.supportCodePaths;

  if (supportCodePaths) {
    if (!Array.isArray) {
      supportCodePaths = [supportCodePaths];
    }
    else {
      // Clone the array using slice()
      supportCodePaths = supportCodePaths.slice();
    }

    callback(null, supportCodePaths);
    return;
  }

  supportCodePaths = [];

  options.featurePaths.forEach(function(featurePath) {
    supportCodePaths.push(featurePath.replace(/[\/\\][^\/\\]+\.feature$/i, ''));
  });

  callback(null, supportCodePaths);
}
