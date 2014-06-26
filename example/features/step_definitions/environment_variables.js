module.exports = function() {
  this.Then(/^the environment variable '(.*)' equals '(.*)'$/, function(name, expectedValue, callback) {
    if (this.isDryRun()) { return callback(); }

    var actualValue = process.env[name];

    if (typeof actualValue === 'undefined') {
      callback('Expected environment variable ' + name + ' to exist but it did not exist');
    }
    if (actualValue !== expectedValue) {
      callback('Actual value \'' + actualValue + '\' did not match expected value \'' + expectedValue + '\'');
    }
    else {
      callback();
    }
  });

  this.Then(/^the environment variable '(.*)' is not set$/, function(name, callback) {
    if (this.isDryRun()) { return callback(); }

    var actualValue = process.env[name];

    if (typeof actualValue !== 'undefined') {
      callback('Expected environment variable to not be set but was set to \'' + actualValue + '\'');
    }
    else {
      callback();
    }
  });
};
