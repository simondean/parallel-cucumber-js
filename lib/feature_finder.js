var FS = require('fs');
var Glob = require('glob');
var Path = require('path');
var Async = require('async');
var Debug = require('debug')('parallel-cucumber-js');

var FeatureFinder = module.exports;

FeatureFinder.find = function(options, callback) {
  Async.waterfall(
    [
      Async.apply(getGlobPatterns, { features: options.features, dryRun: options.dryRun }),
      ensureForwardSlashes,
      combineGlobPatterns,
      findFeaturePaths,
      getFeaturePathSizes,
      sortFeaturePathsInDescendingSizeOrder
    ],
    function(err, featurePaths) {
      if (err) {
        callback({ message: "Failed to find the features", innerError: err });
      }
      else {
        callback(null, featurePaths);
      }
    }
  )

};

function getGlobPatterns(options, callback) {
  Async.map(
    options.features,
    function(feature, callback) {
      FS.stat(feature, function(err, stats) {
        if (err) {
          callback(err);
        }
        else {
          if (stats.isDirectory()) {
            if (options.dryRun) {
              callback(null, feature);
            }
            else {
              callback(null, Path.join(feature, '**/*.feature'));
            }
          }
          else {
            callback(null, feature);
          }
        }
      });
    },
    function(err, globPatterns) {
      if (err) {
        callback(err);
      }
      else {
        callback(null, { globPatterns: globPatterns })
      }
    }
  );
}

function ensureForwardSlashes(options, callback) {
  var globPatterns = options.globPatterns.map(function(globPattern) {
    return globPattern.replace(/\\/g, '/');
  });

  callback(null, { globPatterns: globPatterns });
}

function combineGlobPatterns(options, callback) {
  if (options.globPatterns.length > 1) {
    callback(null, { globPattern: '{' + options.globPatterns.join(',') + '}' });
  }
  else {
    callback(null, { globPattern: options.globPatterns[0] });
  }
}

function findFeaturePaths(options, callback) {
  Glob(options.globPattern, { strict: true }, function(err, featurePaths) {
    if (err) {
      callback(err);
    }
    else {
      callback(null, { featurePaths: featurePaths });
    }
  });
}

function getFeaturePathSizes(options, callback) {
  Async.map(
    options.featurePaths,
    function(featurePath, callback) {
      FS.stat(featurePath, function(err, stats) {
        if (err) {
          callback(err);
        }
        else {
          if (stats.isDirectory()) {
            callback(null, { path: featurePath, size: Number.MAX_VALUE });
          }
          else {
            callback(null, { path: featurePath, size: stats.size });
          }
        }
      });
    },
    function(err, featurePaths) {
      if (err) {
        callback(err);
      }
      else {
        callback(null, { featurePaths: featurePaths });
      }
    }
  )
}

function sortFeaturePathsInDescendingSizeOrder(options, callback) {
  options.featurePaths.sort(function(a, b) {
    return b.size - a.size;
  });

  Async.map(
    options.featurePaths,
    function(featurePath, callback) {
      callback(null, featurePath.path);
    },
    callback
  );
}