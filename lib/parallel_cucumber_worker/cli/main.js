var Main = function() {
  var Path = require('path');
  var Command = require('commander').Command;
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

    Debug('cucumberPath: ', options.cucumberPath);

    self.Cucumber = require(cucumberPath);

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
    process.env.PARALLEL_CUCUMBER_RETRY = self.task.retryCount.toString();
    var originalEnv = {};

    Object.keys(self.task.env).forEach(function(envName) {
      originalEnv[envName] = process.env[envName];
      process.env[envName] = self.task.env[envName];
    });


    function collect(val, memo) {
      memo.push(val);
      return memo;
    }

    function getProgram() {
      var program = new Command(Path.basename(argv[1]));

      program
        .usage('[options] [<DIR|FILE[:LINE]>...]')
        .version(self.Cucumber.VERSION, '-v, --version')
        .option('-b, --backtrace', 'show full backtrace for errors')
        .option('--compiler <EXTENSION:MODULE>', 'require files with the given EXTENSION after requiring MODULE (repeatable)', collect, [])
        .option('-d, --dry-run', 'invoke formatters without executing steps')
        .option('--fail-fast', 'abort the run on first failure')
        .option('-f, --format <TYPE[:PATH]>', 'specify the output format, optionally supply PATH to redirect formatter output (repeatable)', collect, ['pretty'])
        .option('--name <REGEXP>', 'only execute the scenarios with name matching the expression (repeatable)', collect, [])
        .option('--no-colors', 'disable colors in formatter output')
        .option('--no-snippets', 'hide step definition snippets for pending steps')
        .option('--no-source', 'hide source uris')
        .option('-p, --profile <NAME>', 'specify the profile to use (repeatable)', collect, [])
        .option('-r, --require <FILE|DIR>', 'require files before executing features (repeatable)', collect, [])
        .option('--snippet-syntax <FILE>', 'specify a custom snippet syntax')
        .option('-S, --strict', 'fail if there are any undefined or pending steps')
        .option('-t, --tags <EXPRESSION>', 'only execute the features or scenarios with tags matching the expression (repeatable)', collect, []);

      program.on('--help', function() {
        console.log('  For more details please visit https://github.com/cucumber/cucumber-js#cli\n');
      });

      return program;
    }

    function getConfiguration() {
      var program = getProgram();
      program.parse(argv);
      var profileArgs = self.Cucumber.Cli.ProfilesLoader.getArgs(program.profile);
      if (profileArgs.length > 0) {
        var fullArgs = argv.slice(0, 2).concat(profileArgs).concat(argv.slice(2));
        program = getProgram();
        program.parse(fullArgs);
      }
      return self.Cucumber.Cli.Configuration(program.opts(), program.args);
    }

    var configuration = getConfiguration();
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

    exit();
  };

  self._pathIsAModule = function(path) {
    return path === Path.basename(path);
  };

  return self;
};

module.exports = Main;