var Formatters = {};

Formatters.FeatureFinder = require('./runtime/feature_finder');
Formatters.SupportCodeFinder = require('./runtime/support_code_finder');
Formatters.WorkerPool = require('./runtime/worker_pool');

module.exports = Formatters;
