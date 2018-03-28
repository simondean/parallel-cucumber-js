var fireBeforeFeatures = true,
  afterFeaturesEvent = null;

function EventBroadcaster(listeners, supportCodeLibrary) {
  var Cucumber = require('cucumber'),
    listenerDefaultTimeout = supportCodeLibrary.getDefaultTimeout(),
    supportCodeListeners = supportCodeLibrary.getListeners();


  var self = {
    broadcastAroundEvent: function broadcastAroundEvent(event, userFunction, callback) {
      self.broadcastBeforeEvent(event, function() {
        userFunction(function() {
          var userFunctionCallbackArguments = arguments;
          self.broadcastAfterEvent(event, function() {
            callback.apply(null, userFunctionCallbackArguments);
          });
        });
      });
    },

    broadcastBeforeEvent: function broadcastBeforeEvent(event, callback) {
      var preEvent = event.replicateAsPreEvent();
      self.broadcastEvent(preEvent, callback);
    },

    broadcastAfterEvent: function broadcastAfterEvent(event, callback) {
      var postEvent = event.replicateAsPostEvent();
      self.broadcastEvent(postEvent, callback);
    },

    broadcastEvent: function broadcastEvent(event, callback) {
      Cucumber.Util.asyncForEach(getAllListeners(), function (listener, callback) {
        listener.hear(event, listenerDefaultTimeout, function(error) {
          if (error) {
            process.nextTick(function(){ throw error; }); // prevent swallow by unhandled rejection
          }
          callback();
        });
      }, callback);
    }
  };

  var realBroadcastEvent = self.broadcastEvent;

  self.broadcastEventUncensored = function broadcastEventUncensored(event, callback) {
    realBroadcastEvent(event, callback);
  };

  self.broadcastAfterFeaturesEvent = function broadcastAfterFeaturesEvent(callback) {
    self.broadcastEventUncensored(afterFeaturesEvent, callback);
  };

  self.broadcastEvent = function (event, callback) {
    if (isCensoredEvent(event)) {
      disableSupportCodeListeners();
      realBroadcastEvent(event, function () {
        enableSupportCodeListeners();
        callback();
      });
    }
    else {
      realBroadcastEvent(event, callback);
    }
  };

  function getAllListeners() {
    return listeners.concat(supportCodeListeners);
  }

  function disableSupportCodeListeners() {
    supportCodeListeners = [];
  }

  function enableSupportCodeListeners() {
    supportCodeListeners = supportCodeLibrary.getListeners();
  }

  function isCensoredEvent(event) {
    var name = event.getName();

    if (name === 'BeforeFeatures') {
      if (fireBeforeFeatures) {
        fireBeforeFeatures = false;
        return false;
      }
      return true;
    }

    else if (name === 'AfterFeatures') {
      afterFeaturesEvent = event;
      return true;
    }

    else {
      return false;
    }
  }

  return self;
}

module.exports = EventBroadcaster;
