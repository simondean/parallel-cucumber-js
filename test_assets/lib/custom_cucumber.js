var Cucumber = require('cucumber');

var OriginalJsonFormatter = Cucumber.Listener.JsonFormatter;

Cucumber.Listener.JsonFormatter = function(options) {
  var self = OriginalJsonFormatter(options);

  var originalLog = self.log;
  var logOutput = '';

  self.log = function(string) {
    logOutput += string;
    var report;

    try {
      report = JSON.parse(logOutput);
    }
    catch (e) {
      if (!(e instanceof SyntaxError)) {
        throw e;
      }

      return;
    }

    logOutput = '';

    report.forEach(function(item) {
      item['custom_cucumber'] = true;
      item['elements'] = [];
    });

    originalLog(JSON.stringify(report));
  };

  return self;
};

module.exports = Cucumber;