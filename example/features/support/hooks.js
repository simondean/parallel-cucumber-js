module.exports = function() {
  this.BeforeFeatures(function(event, callback) {
    if (shouldLog()) { console.log('Before features'); }
    callback();
  });

  this.BeforeFeature(function(event, callback) {
    if (shouldLog()) { console.log('Before feature'); }
    callback();
  });

  this.Background(function(event, callback) {
    if (shouldLog()) { console.log('Background'); }
    callback();
  });

  this.BeforeScenario(function(event, callback) {
    if (shouldLog()) { console.log('Before scenario'); }
    callback();
  });

  this.BeforeStep(function(event, callback) {
    if (shouldLog()) { console.log('Before step'); }
    callback();
  });

  this.StepResult(function(event, callback) {
    if (shouldLog()) { console.log('Step result'); }
    callback();
  });

  this.AfterStep(function(event, callback) {
    if (shouldLog()) { console.log('After step'); }
    callback();
  });

  this.AfterScenario(function(event, callback) {
    if (shouldLog()) { console.log('After scenario'); }
    callback();
  });

  this.AfterFeature(function(event, callback) {
    if (shouldLog()) { console.log('After feature'); }
    callback();
  });

  this.AfterFeatures(function(event, callback) {
    if (shouldLog()) { console.log('After features'); }
    callback();
  });
  
  function shouldLog() {
    return process.env.LOG_CUCUMBER_EVENTS === 'true';
  }
};