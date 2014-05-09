var Main = function() {
  var ParallelCucumber = require('../../parallel_cucumber');
  var Debug = require('debug')('parallel-cucumber-js');

  var self = {};

  self.start = function() {
    var configuration = ParallelCucumber.Cli.Configuration(process.argv);

    if (configuration.help) {
      configuration.showHelp();
      self._exit(0);
    }
    else {
      ParallelCucumber.Runtime(configuration).run(function(err, info) {
        if (err) {
          Debug('Exiting');
          console.error(err);
          self._exit(2);
        }
        else {
          var code = info.success ? 0 : 1;
          self._exit(code);
        }
      });
    }
  };

  self._exit = function(code) {
    Debug("Exiting with code " + code);

    // See https://github.com/joyent/node/issues/3737 for more information
    // on why the process exit event is used
    process.on('exit', function() {
      process.exit(code);
    });
  };

  return self;
};

module.exports = Main;