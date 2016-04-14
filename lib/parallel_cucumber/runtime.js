var Runtime = function (configuration) {
  var ParallelCucumber = require('../parallel_cucumber');
  var Async = require('async');
  var FS = require('fs');
  var Path = require('path');
  var Debug = require('debug')('parallel-cucumber-js');

  var self = {};

  self._featureFinder = ParallelCucumber.Runtime.FeatureFinder();
  self._supportCodeFinder = ParallelCucumber.Runtime.SupportCodeFinder();

  self._configuration = configuration;

  self.run = function(callback) {
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
        Async.apply(self._featureFinder.find, { featurePaths: options.featurePaths, dryRun: options.dryRun, profiles: options.profiles }),
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
            var task = info.task;

            if (task.retryCount > 0) {
              var nameSuffix = ' - retry ' + task.retryCount;

              info.report.forEach(function(feature) {
                feature.name += nameSuffix;
              });
            }

            info.report.forEach(function(feature) {
              feature.profile = task.profileName;
              feature.retry = task.retryCount;
            });

            self.formatters.forEach(function(formatter) {
              formatter.formatFeatures({ workerIndex: info.workerIndex, profileName: task.profileName, features: info.report });
            });

            if (!info.success) {
              if (task.retryCount < self._configuration.maxRetries) {
                task.retryCount++;
                tasks.push(task);
              }
              else {
                success = false;
              }
            }
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

    options.featureFilePaths.forEach(function (featureFilePath) {
      self._getFeatureFileObjects(featureFilePath).forEach(function (featureFile) {
        Object.keys(options.profiles).forEach(function (profileName) {
          var profile = options.profiles[profileName];
          // Clone the array using slice()
          var tags = profile.tags ? profile.tags.slice() : [];
          var env = profile.env || {};

          env.PARALLEL_CUCUMBER_PROFILE = profileName;

          var matchTags = true;
          tags.forEach(function (tag) {
            if (matchTags) {
              if (tag.startsWith('~')) {
                matchTags = featureFile.tags.indexOf(tag.substring(1)) == -1;
              }
              else {
                matchTags = featureFile.tags.indexOf(tag) > -1;
              }
            }
          });
          if (matchTags) {
            var task = {
              taskIndex: taskCount++,
              profileName: profileName,
              featureFilePath: featureFile.path,
              supportCodePaths: options.supportCodePaths,
              tags: tags,
              env: env,
              retryCount: 0
            };
            tasks.push(task);
          }
        });
      });
    });

    callback(null, tasks);
  };

  /**
   * Get separate objects for every scenario and example in the given feature file.
   * @param featureFilePath the feature file path
   * @returns {Array} containing feature file objects
   * @private
   */
  self._getFeatureFileObjects = function (featureFilePath) {
    var featureFileObjects = [];
    var featureTags = [];
    var scenarioTags = [];
    var tags = [];
    var examplesHeader = false;

    FS.readFileSync(featureFilePath, 'utf8').split(/[\n]/).forEach(function (line, i) {
      if (new RegExp('@\\S+').test(line)) {
        tags = tags.concat(line.match(new RegExp('(@\\S+)', 'g')));
      }
      else if (new RegExp('Feature:').test(line)) {
        featureTags = tags;
        tags = [];
      }
      else if (new RegExp('Scenario:').test(line)) {
        scenarioTags = tags;
        tags = [];
        featureFileObjects.push({
          path: featureFilePath + ':' + (i + 1),
          tags: featureTags.concat(scenarioTags)
        });
      }
      else if (new RegExp('Scenario Outline:').test(line)) {
        scenarioTags = tags;
        tags = [];
        examplesHeader = true;
      }
      else if (new RegExp('\\|.+\\|').test(line)) {
        if (!examplesHeader) {
          featureFileObjects.push({
            path: featureFilePath + ':' + (i + 1),
            tags: featureTags.concat(scenarioTags)
          });
        }
        examplesHeader = false;
      }
    });

    return featureFileObjects;
  };

  return self;
};

Runtime.FeatureFinder = require('./runtime/feature_finder');
Runtime.SupportCodeFinder = require('./runtime/support_code_finder');
Runtime.WorkerPool = require('./runtime/worker_pool');

module.exports = Runtime;
