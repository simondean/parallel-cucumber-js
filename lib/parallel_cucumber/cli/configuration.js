var Configuration = function(argv) {
  var Yargs = require('yargs');
  var Debug = require('debug')('parallel-cucumber-js');
  var OS = require('os');

  var self = {};

  var defaultWorkerCount = OS.cpus().length;

  if (defaultWorkerCount < 2) {
    defaultWorkerCount = 2;
  }

  self.yargs = Yargs
    .usage('Usage: $0 options [FILE|DIR]*')
    .options('h', {
      alias: 'help',
      describe: 'Displays this help message'
    })
    .options('f', {
      alias: 'format',
      describe: 'How to format the results of executing features.  Syntax is FORMAT[:PATH] where FORMAT can be json or progress or the path to a custom formatter script.  The default format is progress.  If specified, PATH is the file that output will be written to'
    })
    .options('w', {
      alias: 'workers',
      default: defaultWorkerCount,
      describe: 'Number of instances of cucumber to run in parallel.  Defaults to the number of CPU cores'
    })
    .options('r', {
      alias: 'require',
      describe: 'Require support code files before executing the features.  Specifying this option disables automatic loading.'
    })
    .options('t', {
      alias: 'tags',
      describe: 'Tags of the features or scenarios to execute.  Sets the tags for the default profile.  Use --profile.name.tags to set the tags for a profile'
    })
    .options('profiles.name.tags', {
      describe: 'Tags of the features or scenarios to execute for a profile.  Replace name in the arg with the name of the profile'
    })
    .options('c', {
      alias: 'cucumber',
      describe: 'Use a custom version of cucumber-js.  Specifies either a relative path or the name of a module',
      default: 'cucumber'
    })
    .options('d', {
      alias: 'dry-run',
      boolean: true,
      default: false,
      describe: 'Enables cucumber\'s dry run mode'
    })
    .options('debug', {
      describe: 'Starts cucumber workers in debug mode.  Pass a number to set the port the first worker should listen on.  Subsequent workers will increment the port number.  Default debug port is the node.js standard of 5858'
    })
    .options('debug-brk', {
      describe: 'Starts cucumber workers in debug mode and breaks on the first line.  Accepts an optional port number like --debug'
    });
  var args = self.yargs.parse(argv.slice(2));

  self.help = args['help'];
  self.formats = args['format'];
  self.workerCount = args['workers'];
  self.supportCodePaths = args['require'];
  self.tags = args['tags'];
  self.profiles = args['profiles'];
  self.cucumberPath = args['cucumber'];
  self.dryRun = args['dry-run'];
  self.debug = args['debug'];
  self.debugBrk = args['debug-brk'];
  self.featurePaths = args._;

  Debug('Configuration:', self);

  self.showHelp = function() {
    self.yargs.showHelp();
  };

  return self;
};

module.exports = Configuration;