module.exports = function() {
  this.Given(/^the environment variable '(.*)' equals '(.*)'$/, function(name, expectedValue, callback) {
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
};