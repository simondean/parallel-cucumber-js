var Main = function() {
  var Path = require('path');
  var Debug = require('debug')('parallel-cucumber-js');

  var self = {};

  Debug('Process current working directory:', process.cwd());

  process.on('message', function(message) {
    if (message.cmd === 'init') {
      self._init(message);
      Debug('Worker ' + self.workerIndex + ' received "init" message');
    }
    else if (message.cmd === 'task') {
      Debug('Worker ' + self.workerIndex + ' received "task" message');
      self._task(message);
    }
    else if (message.cmd === 'exit') {
      Debug('Worker ' + self.workerIndex + ' received "exit" message');
      self._exit();
    }
  });

  self.start = function() {
    process.send({ cmd: 'start' });
  };

  self._init = function(options) {
    self.workerIndex = options.workerIndex;
    self.dryRun = options.dryRun;
    self.beforeFeatures = true;

    var cucumberPath = options.cucumberPath;

    if (!self._pathIsAModule(cucumberPath)) {
      cucumberPath = Path.resolve(cucumberPath);
    }

    self.Cucumber = require(cucumberPath);
    var RealAstTreeWalker = self.Cucumber.Runtime.AstTreeWalker;

    self.Cucumber.Runtime.AstTreeWalker = function(features, supportCodeLibrary, listeners, options) {
      var self2 = RealAstTreeWalker(features, supportCodeLibrary, listeners, options);

      var realBroadcastEvent = self2.broadcastEvent;
      var realGetListeners = supportCodeLibrary.getListeners;

      self2.broadcastEvent = function(event, callback) {
        if (isCensoredEvent(event)) {
          disableSupportCodeListeners();
          realBroadcastEvent(event, function() {
            enableSupportCodeListeners();
            callback();
          });
        }
        else {
          realBroadcastEvent(event, callback);
        }
      };

      self2.broadcastEventUncensored = function(event, callback) {
        realBroadcastEvent(event, callback);
      };

      function disableSupportCodeListeners() {
        supportCodeLibrary.getListeners = function() {
          return [];
        };
      }

      function enableSupportCodeListeners() {
        supportCodeLibrary.getListeners = realGetListeners;
      }

      function isCensoredEvent(event) {
        var name = event.getName();

        if (name === 'BeforeFeatures') {
          if (self.beforeFeatures) {
            self.beforeFeatures = false;
            return false;
          }

          return true;
        }
        else if (name === 'AfterFeatures') {
          return true;
        }
        else {
          return false;
        }
      }

      self.astTreeWalker = self2;
      return self2;
    };

    Object.keys(RealAstTreeWalker).forEach(function(key) {
      self.Cucumber.Runtime.AstTreeWalker[key] = RealAstTreeWalker[key];
    });
  };

  self._task = function(options) {
    self.task = options.task;
    self.output = [];
    Debug('Task:', self.task);

    // Set cucumber defaults
    var opts = {
      require: [],
      tags: [],
      formats: ['pretty'],
      compiler: [],
      profile: [],
      name: [],
    };
    var featurePaths = [];

    self.task.supportCodePaths.forEach(function(supportCodePath) {
      opts.require.push(supportCodePath);
    });

    self.task.tags.forEach(function(tagExpression) {
      opts.tags.push(tagExpression);
    });

    if (self.task.formats) {
      self.task.formats.forEach(function(formatExpression) {
        opts.formats.push(formatExpression);
      });
    }

    if (self.task.compiler) {
      opts.compiler.push(self.task.compiler);
    }

    featurePaths.push(self.task.featureFilePath);
    Debug('Cucumber options:', opts);
    Debug('Cucumber feature paths:', featurePaths);

    Debug('Setting the PARALLEL_CUCUMBER_PROFILE environment variable to \'' + self.task.profileName + '\'');
    process.env.PARALLEL_CUCUMBER_PROFILE = self.task.profileName;
    process.env.PARALLEL_CUCUMBER_DRY_RUN = self.dryRun;
    process.env.PARALLEL_CUCUMBER_RETRY = self.task.retryCount.toString();
    var originalEnv = {};

    Object.keys(self.task.env).forEach(function(envName) {
      originalEnv[envName] = process.env[envName];
      process.env[envName] = self.task.env[envName];
    });

    var configuration = self.Cucumber.Cli.Configuration(opts, featurePaths);
    var runtime = self.Cucumber.Runtime(configuration);
    var formatter = self.Cucumber.Listener.JsonFormatter(
      {
        logToConsole: false,
        logToFunction: self._writeReport
      }
    );
    runtime.attachListener(formatter);
    runtime.start(function(success) {
      Object.keys(originalEnv).forEach(function(envName) {
        if (typeof originalEnv[envName] === 'undefined') {
          delete process.env[envName];
        }
        else {
          process.env[envName] = originalEnv[envName];
        }
      });

      self._taskDone(success);
    });
  };

  self._writeReport = function (value) {
    Debug(self);
    self.output.push(value);
  };

  self._taskDone = function(success) {
    Debug('Success:', success);

    var report = self.output.join('');

    try {
      report = JSON.parse(report);
    }
    catch (e) {
      if (!(e instanceof SyntaxError)) {
        throw e;
      }

      process.send({ cmd: 'error', workerIndex: self.workerIndex, profileName: self.task.profileName, message: 'Syntax error in the JSON report: ' + e });
      Debug('Sent "error" message');
      return;
    }

    process.send({ cmd: 'report', workerIndex: self.workerIndex, task: self.task, report: report, success: success });
    Debug('Sent "report" message');
    process.send({ cmd: 'next', workerIndex: self.workerIndex });
    Debug('Sent "next" message');
  };

  self._exit = function() {
    function exit() {
      process.disconnect();
      process.exit(0);
    }

    if (self.astTreeWalker) {
      var event = self.Cucumber.Runtime.AstTreeWalker.Event('AfterFeatures');

      self.astTreeWalker.broadcastEventUncensored(event, function() {
        exit();
      });
    }
    else {
      exit();
    }
  };

  self._pathIsAModule = function(path) {
    return path === Path.basename(path);
  };

  return self;
};

module.exports = Main;