var Main = function() {
  var Path = require('path');
  var Command = require('commander').Command;
  var Debug = require('debug')('parallel-cucumber-js:parallel_cucumber_worker:main:::');

  var self = {};

  Debug('Process current working directory:', process.cwd());

  process.on('message', function(message) {
    if (message.cmd === 'init') {
      Debug('Worker ' + self.workerIndex + ' received "init" message');
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
    //var RealAstTreeWalker = self.Cucumber.Runtime.AstTreeWalker;
    //
    //var optionsss = { dryRun: undefined, failFast: undefined, strict: undefined };

  //  self.Cucumber.Runtime.AstTreeWalker = function(features, supportCodeLibrary, listeners, optionsss) {
  //    var self2 = RealAstTreeWalker(features, supportCodeLibrary, listeners, optionsss);
  //
  //    var emptyCollection = self.Cucumber.Type.Collection();
  //    var realBroadcastEvent = self2.broadcastEvent;
  //    var realGetListeners = supportCodeLibrary.getListeners;
  //
  //
  //    function disableSupportCodeListeners() {
  //      supportCodeLibrary.getListeners = function() {
  //        return emptyCollection;
  //      };
  //    }
  //
  //    function enableSupportCodeListeners() {
  //      supportCodeLibrary.getListeners = realGetListeners;
  //    }
  //
  //    function isCensoredEvent(event) {
  //      var name = event.getName();
  //
  //      if (name === 'BeforeFeatures') {
  //        if (self.beforeFeatures) {
  //          self.beforeFeatures = false;
  //          return false;
  //        }
  //
  //        return true;
  //      }
  //      else if (name === 'AfterFeatures') {
  //        return true;
  //      }
  //      else {
  //        return false;
  //      }
  //    }
  //    self2.broadcastEvent = function(event, callback) {
  //      if (isCensoredEvent(event)) {
  //        disableSupportCodeListeners();
  //        realBroadcastEvent(event, function() {
  //          enableSupportCodeListeners();
  //          callback();
  //        });
  //      }
  //      else {
  //        realBroadcastEvent(event, callback);
  //      }
  //    };
  //
  //    self2.broadcastEventUncensored = function(event, callback) {
  //      realBroadcastEvent(event, callback);
  //    };
  //
  //    self.astTreeWalker = self2;
  //    return self2;
  //  };
  //
  //  Object.keys(RealAstTreeWalker).forEach(function(key) {
  //    self.Cucumber.Runtime.AstTreeWalker[key] = RealAstTreeWalker[key];
  //  });

  };

  self._task = function(options) {
    self.task = options.task;
    self.output = [];
    Debug('Task:', self.task);

    // Cucumber ignores the first two arguments
    var argv = ['', ''];
    //argv.push('-f');
    //argv.push('json:tests/acceptance/report/cucumber_report_en_US.html.json');
    //
    //argv.push('-f');
    //argv.push('json');

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

    function getProgram () {
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

      program.on('--help', function(){
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
      var configuration = self.Cucumber.Cli.Configuration(program.opts(), program.args);
      return configuration;
    }

    var configuration = getConfiguration();

    //var configuration = self.Cucumber.Cli.Configuration({ version: '0.9.4',
    //  backtrace: undefined,
    //  compiler: [],
    //  dryRun: undefined,
    //  failFast: undefined,
    //  format: [ 'pretty', 'json' ],
    //  name: [],
    //  colors: true,
    //  snippets: true,
    //  source: true,
    //  profile: [],
    //  require:
    //      [ 'tests/acceptance/step_definitions/',
    //        'tests/acceptance/step_definitions/' ],
    //  snippetSyntax: undefined,
    //  strict: undefined,
    //  tags: [ '~@blocked', '~@todo', '@email' ] },
    //    [ 'tests/acceptance/features/' ]);
    //
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

    //console.log('argv === ', argv);
    //
    //var cli = self.Cucumber.Cli(argv);
    //
    //cli.run(function (succeeded) {
    //    Object.keys(originalEnv).forEach(function(envName) {
    //      if (typeof originalEnv[envName] === 'undefined') {
    //        delete process.env[envName];
    //      }
    //      else {
    //        process.env[envName] = originalEnv[envName];
    //      }
    //    });
    //
    //  Debug('Task Done YEE: ', succeeded);
    //
    //    self._taskDone(succeeded);
    //});

  };

  self._writeReport = function (value) {
    Debug('self:::', self);
    self.output.push(value);
  };

  self._taskDone = function(success) {
    Debug('Success:', success);

    var report = self.output.join('');

    console.log('report:::::=== ', report);

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

    //if (self.astTreeWalker) {
    //  var event = self.Cucumber.Runtime.AstTreeWalker.Event('AfterFeatures');
    //
    //  self.astTreeWalker.broadcastEventUncensored(event, function() {
    //    exit();
    //  });
    //}
    //else {
      exit();
    //}
  };

  self._pathIsAModule = function(path) {
    return path === Path.basename(path);
  };

  return self;
};

module.exports = Main;