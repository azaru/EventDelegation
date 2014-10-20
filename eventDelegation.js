'use strict';
(function(){
  var EventDelegation = {};
  var handlers = {};
  var _matcher = Element.prototype.matches || Element.prototype.webkitMatchesSelector
    || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector 
    || Element.prototype.oMatchesSelector;
  
  EventDelegation.on = function(eventType ,selector ,handler){

    if(!handler || typeof(handler) != 'function')
        return false;

    if(!handlers[eventType]){
      handlers[eventType] = [];
      document.addEventListener(eventType, _trigger);
    }
    
    for(var i in handlers[eventType]){
      if(_match(handlers[eventType][i].selector, selector, false)){
        handlers[eventType][i].callbacks.push(handler);
        return ;
      }
    }

    handlers[eventType].push({"selector": selector, "callbacks": [handler]});
     
  }

  EventDelegation.off = function(eventType, selector, handler){
    if(!selector)
      return false;

    var callbacks = [];
    for(var i in handlers[eventType]){
      if(_match(handlers[eventType][i].selector, selector, false)){
        _removeHandler(handlers[eventType][i].callbacks, handler); 
      }
      callbacks = callbacks.concat(handlers[eventType][i].callbacks);
      if(handlers[eventType][i].callbacks.length == 0){
          handlers[eventType].splice(i, 1);
      }
    }

    if(callbacks.length == 0){
      document.removeEventListener(eventType, _trigger);
      delete handlers[eventType];
    }
  }

  EventDelegation.removeAllFor = function(selector){
    for(var key in handlers){
      EventDelegation.off(key, selector);
    }
  }

  var _removeHandler  = function(callbacks, handler){
    for(var x = callbacks.length - 1; x >= 0; x--) {
        if(!handler || callbacks[x] === handler) {
          callbacks.splice(x, 1);
        }
    }
    return callbacks;
  }    
  
  var _match = function(target, selector, matcher){
      if(typeof selector == typeof target){
        if(typeof selector == 'object'){
          return target.isSameNode(selector);
        }else{
          return target == selector;
        }
      }else if(matcher){ 
        return target[_matcher.name](selector);
      }else{
        return false
      }
  }

  var _applyHandlers = function(callbacks, target, args){
    for(var i=0; i < callbacks.length; i++){
        callbacks[i].apply(target, args);
    }
  }

  var _trigger = function(event){
    if(handlers[event.type]){
      var args = Array.prototype.slice.call(arguments);
      var _handlers = handlers[event.type];

      for(var key in handlers[event.type]){   
        if(_match(event.target, _handlers[key].selector, true)){
          _applyHandlers(_handlers[key].callbacks, event.target, args);
        }
      }
    }
  }

  window.events = EventDelegation;
})();