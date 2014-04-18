var Async = require('async');
var Path = require('path');
var FS = require('fs');
var Debug = require('debug')('parallel-cucumber-js');

var FeatureFinder = require('./feature_finder');
var WorkerPool = require('./worker_pool');
var ProgressReporter = require('./progress_reporter');

var ParallelCucumber = function(options) {
  if (!(this instanceof ParallelCucumber)) return new ParallelCucumber(options);

  var self = this;
  self.options = options;
  self.progressReporter = new ProgressReporter();

  return self;
};

ParallelCucumber.prototype.run = function(callback) {
  var self = this;

  var configFile = self.options.configFile;
  var config = require(Path.resolve(configFile));

  self.options.profiles = config.profiles;

  self._executeFeatures(
    self.options,
    function(err, info) {
      callback(err, info);
    }
  );
};

ParallelCucumber.prototype._executeFeatures = function(options, callback) {
  var self = this;

  function done(err, info) {
    callback(err, info);
  }

  self._findFeatures(
    options,
    function(err, featurePaths) {
      if (err) {
        done(err);
      }
      else {
        options.featurePaths = featurePaths;

        self._executeFeaturesOnWorkerPool(
          options,
          function(err, info) {
            done(err, info);
          }
        );
      }
    }
  )
};

ParallelCucumber.prototype._executeFeaturesOnWorkerPool = function(options, callback) {
  var self = this;

  Debug('Spawning cucumber instances');

  var outStream;
  var finished = false;
  var success = true;

  function done(err) {
    if (finished) return;
    finished = true;

    callback(err, { success: success });
  }

  Async.parallel(
    [
      Async.apply(self._getTasks, options),
      function(callback) {
        self._getOutStream(options, function(err, info) {
          if (err) {
            callback(err);
          }
          else if (info.outStream) {
            outStream = info.outStream;

            outStream.on('error', function(err) {
              done(err);
            });

            outStream.write('[', function() {
              callback(null, outStream);
            });
          }
          else {
            console.log('[');
            callback();
          }
        });
      }
    ],
    function(err, results) {
      if (err) {
        done(err);
        return;
      }

      var tasks = results[0];

      Debug('Found ' + tasks.length + ' tasks to execute');
      Debug('Execution will be limited to ' + options.workerCount + ' workers');

      var firstReport = true;

      var workerPool = new WorkerPool({ workerCount: options.workerCount, dryRun: options.dryRun, debug: options.debug, debugBrk: options.debugBrk });

      workerPool.on(
        'next',
        function(callback) {
          if (tasks.length > 0) {
            var task = tasks.shift();

            callback({
              task: task
            });
          }
          else {
            callback();
          }
        }
      );

      workerPool.on(
        'report',
        function(info) {
          if (!info.success) {
            success = false;
          }

          self.progressReporter.report({ profileName: info.profileName, workerIndex: info.workerIndex, report: info.report, dryRun: options.dryRun });

          var report = JSON.stringify(info.report);
          // Remove [ and ] from start and end of the JSON string
          report = report.substr(1, report.length - 2);

          if (report.length == 0) {
            Debug('Empty report');
          }
          else {
            if (firstReport) {
              Debug('First report');
              firstReport = false;
            }
            else {
              Debug('Subsequent report');
              report = ',' + report;
            }
          }

          if (outStream) {
            Debug('Saving cucumber output file');
            outStream.write(report);
          }
          else {
            Debug('Sending cucumber output to stdout');
            console.log(report);
          }
        }
      );

      workerPool.on(
        'done',
        function() {
          Debug('Done');
          if (outStream) {
            outStream.write(']', function() {
              outStream.end();
            });
          }
          else {
            console.log(']');
          }

          done();
        }
      );

      workerPool.on(
        'error',
        function(err) {
          success = false;
          done(err);
        }
      );

      workerPool.start();
    }
  )
};

ParallelCucumber.prototype._getOutStream = function(options, callback) {
  if (options.out) {
    Debug('Saving cucumber output to ' + options.out);
    var outStream = FS.createWriteStream(options.out);
    callback(null, { outStream: outStream });
  }
  else {
    Debug('Sending cucumber output to stdout');
    callback(null, {});
  }
};

ParallelCucumber.prototype._getTasks = function(options, callback) {
  var tasks = [];
  var taskCount = 0;

  options.featurePaths.forEach(function(featurePath) {
    Object.keys(options.profiles).forEach(function(profileName) {
      var taskIndex = taskCount++;
      var profile = options.profiles[profileName];
      // Clone the array using slice()
      var tags = profile.tags.slice();
      var env = profile.env || {};

      env.PARALLEL_CUCUMBER_PROFILE = profileName;

      var task = {
        taskIndex: taskIndex,
        profileName: profileName,
        featurePath: featurePath,
        tags: tags,
        env: env
      };

      tasks.push(task)
    });
  });

  callback(null, tasks);
};

ParallelCucumber.prototype._findFeatures = function(options, callback) {
  var self = this;

  if (options.features.length == 0) {
    callback({ message: "No features have been specified" });
  }
  else {
    FeatureFinder.find({ features: options.features, dryRun: options.dryRun }, function(err, featurePaths) {
      if (err) {
        callback(err);
      }
      else {
        callback(null, featurePaths);
      }
    });
  }
};

module.exports = ParallelCucumber;
