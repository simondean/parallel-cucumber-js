module.exports = function() {
  this.When(/^a pending action is executed$/, function(callback) {
    if (this.isDryRun()) { return callback(); }

    callback.pending();
  });
};
