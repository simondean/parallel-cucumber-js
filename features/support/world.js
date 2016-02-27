module.exports = function() {
  this.World = function() {
    this.isDryRun = function() {
      return process.argv.indexOf('--dry-run') !== -1 || process.env.PARALLEL_CUCUMBER_DRY_RUN === 'true';
    };
  };
};
