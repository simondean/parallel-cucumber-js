var Runtime = function(configuration) {
  var ParallelCucumber = require('../parallel_cucumber');
  var Async = require('async');
  var Path = require('path');
  var Debug = require('debug')('parallel-cucumber-js');

  var self = {};

  self._featureFinder = ParallelCucumber.Runtime.FeatureFinder();
  self._supportCodeFinder = ParallelCucumber.Runtime.SupportCodeFinder();

  self._configuration = configuration;

  self.run = function(callback) {
    if (!self._configuration.formats) {
      self._configuration.formats = ['progress'];
    }
    else if (!Array.isArray(self._configuration.formats)) {
      self._configuration.formats = [self._configuration.formats];
    }

    if (!self._configuration.profiles) {
      self._configuration.profiles = { 'default': {} };
    }

    Debug('Profiles:', self._configuration.profiles);

    if (self._configuration.tags) {
      if (!self._configuration.profiles['default']) {
        self._configuration.profiles['default'] = {};
      }

      self._configuration.profiles['default'].tags = self._configuration.tags;
      delete self._configuration.tags;
    }

    Debug('Profiles:', self._configuration.profiles);

    Object.keys(self._configuration.profiles).forEach(function(profileName) {
      var profile = self._configuration.profiles[profileName];

      if (profile.tags && !Array.isArray(profile.tags)) {
        profile.tags = [profile.tags];
      }
    });

    Debug('Profiles:', self._configuration.profiles);

    if (self._configuration.featurePaths.length === 0) {
      self._configuration.featurePaths = ['./features/'];
    }

    self._executeFeatures(
      self._configuration,
      function(err, info) {
        callback(err, info);
      }
    );
  };

  self._executeFeatures = function(options, callback) {
    function done(err, info) {
      callback(err, info);
    }

    Async.parallel(
      [
        Async.apply(self._featureFinder.find, { featurePaths: options.featurePaths, dryRun: options.dryRun }),
        Async.apply(self._supportCodeFinder.find, { featurePaths: options.featurePaths, supportCodePaths: options.supportCodePaths })
      ],
      function(err, results) {
        if (err) {
          done(err);
        }
        else {
          options.featureFilePaths = results[0];
          options.supportCodePaths = results[1];

          Debug('Feature file paths:', options.featureFilePaths);
          Debug('Support code paths:', options.supportCodePaths);

          self._executeFeaturesOnWorkerPool(
            options,
            function(err, info) {
              done(err, info);
            }
          );
        }
      }
    );
  };

  self._executeFeaturesOnWorkerPool = function(options, callback) {
    Debug('Spawning cucumber instances');

    var finished = false;
    var success = true;

    function done(err) {
      if (finished) { return; }
      finished = true;

      callback(err, { success: success });
    }

    Async.parallel(
      [
        Async.apply(self._getTasks, options),
        Async.apply(self._createFormatters, options)
      ],
      function(err, results) {
        if (err) {
          done(err);
          return;
        }

        var tasks = results[0];

        Debug('Found ' + tasks.length + ' tasks to execute');
        Debug('Execution will be limited to ' + options.workerCount + ' workers');

        var workerPool = ParallelCucumber.Runtime.WorkerPool({ workerCount: options.workerCount, cucumberPath: options.cucumberPath, dryRun: options.dryRun, debug: options.debug, debugBrk: options.debugBrk });

        workerPool.on(
          'next',
          function(callback) {
            if (tasks.length > 0) {
              var task = tasks.shift();
              callback(task);
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

            info.report.forEach(function(element) {
              element.profile = info.profileName;
            });

            self.formatters.forEach(function(formatter) {
              formatter.formatFeatures({ workerIndex: info.workerIndex, profileName: info.profileName, features: info.report });
            });
          }
        );

        workerPool.on(
          'done',
          function() {
            Debug('Done');
            Async.each(
              self.formatters,
              function(formatter, callback) {
                formatter.end(callback);
              },
              function(err) {
                done(err);
              }
            );
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
    );
  };

  self._createFormatters = function(options, callback) {
    self.formatters = [];

    self._configuration.formats.forEach(function(format) {
      var parts = format.split(':');
      var formatterName = parts[0];
      var outFilePath = parts.slice(1).join(':');
      var formatterType;

      if (formatterName.toLowerCase() === 'json') {
        formatterType = ParallelCucumber.Formatters.JsonFormatter;
      }
      else if (formatterName.toLowerCase() === 'progress') {
        formatterType = ParallelCucumber.Formatters.ProgressFormatter;
      }
      else {
        try {
          formatterType = require(Path.resolve(formatterName));
        }
        catch (err) {
          callback({ message: 'Failed to load custom formatter', formatter: formatterName, innerError: err });
          return;
        }
      }

      var formatter = formatterType({ outFilePath: outFilePath });
      self.formatters.push(formatter);
    });

    callback();
  };

  self._getTasks = function(options, callback) {
    var tasks = [];
    var taskCount = 0;

    options.featureFilePaths.forEach(function(featureFilePath) {
      Object.keys(options.profiles).forEach(function(profileName) {
        var taskIndex = taskCount++;
        var profile = options.profiles[profileName];
        // Clone the array using slice()
        var tags = profile.tags ? profile.tags.slice() : [];
        var env = profile.env || {};

        env.PARALLEL_CUCUMBER_PROFILE = profileName;

        var task = {
          taskIndex: taskIndex,
          profileName: profileName,
          featureFilePath: featureFilePath,
          supportCodePaths: options.supportCodePaths,
          tags: tags,
          env: env
        };

        tasks.push(task);
      });
    });

    callback(null, tasks);
  };

  return self;
};

Runtime.FeatureFinder = require('./runtime/feature_finder');
Runtime.SupportCodeFinder = require('./runtime/support_code_finder');
Runtime.WorkerPool = require('./runtime/worker_pool');

module.exports = Runtime;
