'use strict';
(function(){
  var EventDelegation = {};
  var handlers = {};
  
  EventDelegation.on = function(eventType ,selector ,handler){

    if(!handler || typeof(handler) != 'function')
        return false;

    if(!handlers[eventType]){
      handlers[eventType] = {};
      document.addEventListener(eventType, _trigger);
    }

    if(!handlers[eventType][selector]){
      handlers[eventType][selector] = [];
    }
    handlers[eventType][selector].push(handler);
  }

  EventDelegation.off = function(eventType, selector, handler){
    if(!selector)
      return false;

    if(handlers[eventType] && handlers[eventType][selector])
      var selectors = handlers[eventType][selector]
      for(var i = selectors.length - 1; i >= 0; i--) {
        if(!handler || selectors[i] === handler) {
         selectors.splice(i, 1);
        }
      }

      if(!selectors){
        document.removeEventListener(eventType, _trigger);
        delete handlers[eventType];
      }
    }
  var _matcher = Element.prototype.matches || Element.prototype.webkitMatchesSelector
    || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector 
    || Element.prototype.oMatchesSelector;  

  var _trigger = function(event){
    if(handlers[event.type]){
      var args = Array.prototype.slice.call(arguments);
      for(var key in handlers[event.type]){
        if(event.target[_matcher.name](key)){
          for(var i=0; i < handlers[event.type][key].length; i++){
            handlers[event.type][key][i].apply(event.target, args);
          }
        }
      }
    }
  }

  window.events = EventDelegation;
})();