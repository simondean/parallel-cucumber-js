module.exports = function() {
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
};
