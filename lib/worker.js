var Debug = require('debug')('parallel-cucumber-js');

var workerIndex;

process.on('message', function(message) {
  if (message.cmd == 'init') {
    workerIndex = message.workerIndex;
    Debug('Worker ' + workerIndex + ' received "init" message')
  }
  else if (message.cmd == 'task') {
    Debug('Worker ' + workerIndex + ' received "task" message');
    process.send({ cmd: 'report', workerIndex: workerIndex, profileName: 'example', report: [{ uri: 'Hello, World!' }], success: true });
    Debug('Sent "report" message');
    process.send({ cmd: 'next', workerIndex: workerIndex });
    Debug('Sent "next" message');
  }
  else if (message.cmd == 'exit') {
    Debug('Worker ' + workerIndex + ' received "exit" message');
    process.disconnect();
    process.exit(0);
  }
});

process.send({ cmd: 'start' });