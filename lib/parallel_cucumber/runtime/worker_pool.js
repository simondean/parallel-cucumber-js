var WorkerPool = function(options) {
  var Path = require('path');
  var Events = require('events');
  var ChildProcess = require('child_process');
  var Async = require('async');
  var Debug = require('debug')('parallel-cucumber-js');

  var self = new Events.EventEmitter();

  self.options = options;

  self.activeWorkerCount = 0;
  self.workers = [];

  if (self.options.debugBrk) {
    Debug('Enabling node debug mode, breaking on first line');
    self.debugArgName = '--debug-brk';
    self.firstDebugPort = self.options.debugBrk;
  }
  else if (self.options.debug) {
    Debug('Enabling node debug mode');
    self.debugArgName = '--debug';
    self.firstDebugPort = self.options.debug;
  }

  if (self.debugArgName) {
    self.debug = true;

    if (typeof self.firstDebugPort !== 'number') {
      self.firstDebugPort = 5858;
    }

    Debug('Debug ports starting from ' + self.firstDebugPort);
  }
  else {
    self.debug = false;
  }

  self.start = function(callback) {
    Debug('Started worker pool');

    function nextTask(workerIndex) {
      var done = false;

      self.emit('next', function(task) {
        if (done) { return; }
        done = true;

        var worker = self.workers[workerIndex];

        if (task) {
          if (!worker) {
            Debug('Creating worker', workerIndex);

            // Clone the array using slice()
            var execArgv = process.execArgv.slice();

            if (self.debug) {
              var debugPort = self.firstDebugPort + workerIndex;
              Debug('Worker debug port: ' + debugPort);

              execArgv.push(self.debugArgName + '=' + debugPort);
            }

            worker = ChildProcess.fork(Path.join(__dirname, '../../../bin/parallel-cucumber-js-worker'), [], { execArgv: execArgv });

            self.activeWorkerCount++;
            self.workers[workerIndex] = worker;

            worker.on('message', function(message) {
              Debug('Received message');
              if (message.cmd === 'start') {
                worker.send({ cmd: 'init', workerIndex: workerIndex, dryRun: self.options.dryRun });
                worker.send({ cmd: 'task', task: task });
              }
              else if (message.cmd === 'report') {
                Debug('Received "report" message');
                self.emit('report', { workerIndex: message.workerIndex, profileName: message.profileName, report: message.report, success: message.success });
              }
              else if (message.cmd === 'next') {
                Debug('Received "next" message');
                nextTask(message.workerIndex);
              }
            });

            worker.on('error', function (err) {
              Debug('Child error:', err);
              self.emit('error', err);
            });

            worker.on('exit', function (code, signal) {
              Debug('Child exited:', code, signal);
            });
          }
          else {
            worker.send({ cmd: 'task', task: task });
          }
        }
        else {
          if (worker) {
            Debug('Worker exiting', workerIndex);
            self.activeWorkerCount--;
            self.workers[workerIndex] = null;
            worker.send({ cmd: 'exit' });

            Debug('Worker count:', self.activeWorkerCount);

            if (self.activeWorkerCount === 0) {
              Debug('Last worker exited');
              self.emit('done');
            }
          }
        }
      });
    }

    Async.times(
      self.options.workerCount,
      function(workerIndex, next) {
        nextTask(workerIndex);

        next();
      },
      function(err) {
        if (callback) {
          callback(err);
        }
      }
    );
  };

  return self;
};

module.exports = WorkerPool;