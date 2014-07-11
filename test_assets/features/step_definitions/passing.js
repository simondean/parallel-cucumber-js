module.exports = function() {
  this.Given(/^a passing pre-condition$/, function(callback) {
    if (this.isDryRun()) { return callback(); }

    callback();
  });

  this.When(/^a passing action is executed$/, function(callback) {
    if (this.isDryRun()) { return callback(); }

    callback();
  });

  this.When(/^a failing action is executed$/, function(callback) {
    if (this.isDryRun()) { return callback(); }

    callback('Failed');
  });

  this.When(/^an action is executed that passes on retry '(.*)'$/, function(retryCount, callback) {
    if (this.isDryRun()) { return callback(); }

    var currentRetryCount = parseInt(process.env.PARALLEL_CUCUMBER_RETRY);

    if (currentRetryCount < retryCount) {
      callback('Failed on retry ' + currentRetryCount);
    }
    else {
      callback();
    }
  });

  this.Then(/^a post-condition passes$/, function(callback) {
    if (this.isDryRun()) { return callback(); }

    callback();
  });
};
