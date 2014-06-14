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
    self.cucumberPath = options.cucumberPath;
    self.dryRun = options.dryRun;
  };

  self._task = function(options) {
    self.task = options.task;
    self.output = [];
    Debug('Task:', self.task);

    // Cucumber ignores the first two arguments
    var argv = ['', ''];

    self.task.supportCodePaths.forEach(function(supportCodePath) {
      argv.push('-r');
      argv.push(supportCodePath);
    });
    self.task.tags.forEach(function(tagExpression) {
      argv.push('-t');
      argv.push(tagExpression);
    });
    argv.push(self.task.featureFilePath);
    Debug('Cucumber argv:', argv);

    Debug('Setting the PARALLEL_CUCUMBER_PROFILE environment variable to \'' + self.task.profileName + '\'');
    process.env.PARALLEL_CUCUMBER_PROFILE = self.task.profileName;
    process.env.PARALLEL_CUCUMBER_DRY_RUN = self.dryRun;

    var cucumberPath = self.cucumberPath;

    if (!self._pathIsAModule(cucumberPath)) {
      cucumberPath = Path.resolve(cucumberPath);
    };

    var Cucumber = require(cucumberPath);
    var configuration = Cucumber.Cli.Configuration(argv);
    var runtime = Cucumber.Runtime(configuration);
    var formatter = Cucumber.Listener.JsonFormatter(
      {
        logToConsole: false,
        logToFunction: self._writeReport
      }
    );
    runtime.attachListener(formatter);
    runtime.start(self._taskDone);
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
      Debug('Sent "report" message');
      return;
    }

    process.send({ cmd: 'report', workerIndex: self.workerIndex, profileName: self.task.profileName, report: report, success: success });
    Debug('Sent "report" message');
    process.send({ cmd: 'next', workerIndex: self.workerIndex });
    Debug('Sent "next" message');
  };

  self._exit = function() {
    process.disconnect();
    process.exit(0);
  };

  self._pathIsAModule = function(path) {
    return path === Path.basename(path);
  }

  return self;
};

module.exports = Main;