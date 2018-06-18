var Runtime = function (configuration) {
  var ParallelCucumber = require('../parallel_cucumber');
  var Async = require('async');
  var FS = require('fs');
  var Path = require('path');
  var Debug = require('debug')('parallel-cucumber-js');
  var Gherkin = require('gherkin');

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
        var noTasks = tasks.length === 0;

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

        workerPool.on(
          'empty',
          function() {
            Debug('Empty');
            Async.each(
              self.formatters,
              function(formatter, callback) {
                if (formatter.type !== 'progress') {
                  formatter.end(callback);
                }
              },
              function(err) {
                done(err);
              }
            );
          }
        );

        workerPool.start();

        if (noTasks) {
          workerPool.emit('empty');
          return;
        }
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
          // If profile.tags is defined and not empty than split tags string into array
          var tags = profile.tags && profile.tags[0] ? profile.tags[0].split(',') : [];
          var env = profile.env || {};

          env.PARALLEL_CUCUMBER_PROFILE = profileName;

          function addTask() {
            tasks.push({
              taskIndex: taskCount++,
              profileName: profileName,
              featureFilePath: featureFile.path,
              supportCodePaths: options.supportCodePaths,
              tags: profile.tags || [],
              env: env,
              retryCount: 0
            });
          }

          var matchTags = true;
          if (tags.length === 0) {
            addTask();
          } else {
            tags.forEach(function (tag) {
              if (tag.indexOf('~') === 0) {
                matchTags = featureFile.tags.indexOf(tag.substring(1)) === -1;
              }
              else {
                matchTags = featureFile.tags.indexOf(tag) > -1;
              }
              if (matchTags) {
                addTask();
              }
            });
          }
        });
      });
    });

    callback(null, tasks);
  };

  self._getFeatureFileObjects = function (featureFilePath) {
    var parser = new Gherkin.Parser();
    var gherkinDocument = parser.parse(FS.readFileSync(featureFilePath, 'utf8'));
    var featureFileObjects = [];

    var featureTags = self._collectTags(gherkinDocument.feature.tags);
    if (gherkinDocument.feature.children.length > 0) {
      gherkinDocument.feature.children.forEach(function (child) {
        var scenarioTags = [];
        if (child.type !== 'Background') {
          scenarioTags = self._collectTags(child.tags);
        }
        if (child.examples === undefined || child.examples.length === 0) {
          featureFileObjects.push({
            path: featureFilePath + ':' + child.location.line,
            tags: featureTags.concat(scenarioTags)
          });
        }
        else {
          child.examples.forEach(function (example) {
            var exampleTags = self._collectTags(example.tags);
            example.tableBody.forEach(function (tableRow) {
              featureFileObjects.push({
                path: featureFilePath + ':' + tableRow.location.line,
                tags: featureTags.concat(scenarioTags).concat(exampleTags)
              });
            });
          });
        }
      });
    }

    return featureFileObjects;
  };

  self._collectTags = function (tagsArray) {
    var tags = [];
    tagsArray.forEach(function (tag) {
      tags.push(tag.name);
    });
    return tags;
  };

  return self;
};

Runtime.FeatureFinder = require('./runtime/feature_finder');
Runtime.SupportCodeFinder = require('./runtime/support_code_finder');
Runtime.WorkerPool = require('./runtime/worker_pool');

module.exports = Runtime;
