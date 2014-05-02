var FS = require('fs');
var Glob = require('glob');
var Path = require('path');
var Async = require('async');
var Debug = require('debug')('parallel-cucumber-js');

var FeatureFinder = module.exports;

FeatureFinder.find = function(options, callback) {
  Async.waterfall(
    [
      Async.apply(getGlobPatterns, { featurePaths: options.featurePaths, dryRun: options.dryRun }),
      ensureForwardSlashes,
      combineGlobPatterns,
      findFeatureFilePaths,
      getFeatureFileSizes,
      sortFeatureFilePathsInDescendingSizeOrder
    ],
    function(err, featureFilePaths) {
      if (err) {
        callback({ message: "Failed to find the features", innerError: err });
      }
      else {
        callback(null, featureFilePaths);
      }
    }
  )
};

function getGlobPatterns(options, callback) {
  Async.map(
    options.featurePaths,
    function(featurePath, callback) {
      FS.stat(featurePath, function(err, stats) {
        if (err) {
          callback(err);
        }
        else {
          if (stats.isDirectory()) {
            if (options.dryRun) {
              callback(null, featurePath);
            }
            else {
              callback(null, Path.join(featurePath, '**/*.feature'));
            }
          }
          else {
            callback(null, featurePath);
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

function findFeatureFilePaths(options, callback) {
  Debug('Glob:', options.globPattern);
  Glob(options.globPattern, { strict: true }, function(err, featureFilePaths) {
    if (err) {
      callback(err);
    }
    else {
      Debug('Found feature paths:', featureFilePaths);
      callback(null, { featureFilePaths: featureFilePaths });
    }
  });
}

function getFeatureFileSizes(options, callback) {
  Async.map(
    options.featureFilePaths,
    function(featureFilePath, callback) {
      FS.stat(featureFilePath, function(err, stats) {
        if (err) {
          callback(err);
        }
        else {
          if (stats.isDirectory()) {
            callback(null, { path: featureFilePath, size: Number.MAX_VALUE });
          }
          else {
            callback(null, { path: featureFilePath, size: stats.size });
          }
        }
      });
    },
    function(err, featureFilePaths) {
      if (err) {
        callback(err);
      }
      else {
        callback(null, { featureFilePaths: featureFilePaths });
      }
    }
  )
}

function sortFeatureFilePathsInDescendingSizeOrder(options, callback) {
  options.featureFilePaths.sort(function(a, b) {
    return b.size - a.size;
  });

  Async.map(
    options.featureFilePaths,
    function(featureFilePath, callback) {
      callback(null, featureFilePath.path);
    },
    callback
  );
}