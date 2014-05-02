var Cucumber = require('cucumber');
var Debug = require('debug')('parallel-cucumber-js');

var Worker = function() {
  if (!(this instanceof Worker)) return new Worker();

  var self = this;

  Debug('Process current working directory:', process.cwd());

  process.on('message', function(message) {
    if (message.cmd == 'init') {
      self._init(message);
      Debug('Worker ' + self.workerIndex + ' received "init" message')
    }
    else if (message.cmd == 'task') {
      Debug('Worker ' + self.workerIndex + ' received "task" message');
      self._task(message);
    }
    else if (message.cmd == 'exit') {
      Debug('Worker ' + self.workerIndex + ' received "exit" message');
      self._exit();
    }
  });

  return self;
};

Worker.prototype.start = function() {
  process.send({ cmd: 'start' });
};

Worker.prototype._init = function(options) {
  var self = this;

  self.workerIndex = options.workerIndex;
};

Worker.prototype._task = function(options) {
  var self = this;

  self.task = options.task;
  self.output = [];
  Debug('Task:', self.task);

  // Cucumber ignores the first to arguments
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

  var configuration = Cucumber.Cli.Configuration(argv);
  var runtime = Cucumber.Runtime(configuration);
  var formatter = Cucumber.Listener.JsonFormatter(
    {
      logToConsole: false,
      logToFunction: function() {
        self._writeReport.apply(self, arguments);
      }
    }
  );
  runtime.attachListener(formatter);
  runtime.start(function() {
    self._taskDone.apply(self, arguments);
  });
};

Worker.prototype._writeReport = function (value) {
  var self = this;

  Debug(self);
  self.output.push(value);
};

Worker.prototype._taskDone = function(success) {
  var self = this;

  Debug('Success:', success);

  var report = self.output.join('');
  report = JSON.parse(report);

  process.send({ cmd: 'report', workerIndex: self.workerIndex, profileName: self.task.profileName, report: report, success: success });
  Debug('Sent "report" message');
  process.send({ cmd: 'next', workerIndex: self.workerIndex });
  Debug('Sent "next" message');
};

Worker.prototype._exit = function() {
  process.disconnect();
  process.exit(0);
};

var worker = new Worker();
worker.start();
