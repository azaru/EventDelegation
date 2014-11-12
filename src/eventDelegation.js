(function(){
  'use strict';
  
  var _matcher = Element.prototype.matches || Element.prototype.webkitMatchesSelector
    || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector 
    || Element.prototype.oMatchesSelector;

  var _on = function (eventType ,selector ,handler){
    _paramsCheck.call(this, arguments, 3);
    _addListenerIfNeeded.call(this, eventType);
    _addHandlerToSelector.call(this, eventType, selector, handler);
  };

  var _off= function (eventType, selector, handler){
    _paramsCheck(arguments, 2);
    var allRemoved = _removeHandlersFromSelectors.call(this, eventType, selector, handler);
    if(allRemoved){
      _removeEventListener.call(this, eventType);
    }
  };

  var _removeAllEvents = function (){
    for(var eventType in this.handlers){
      _removeEventListener.call(this, eventType);
    }
  };

  var _removeAllFor = function (selector){
    _paramsCheck(arguments, 1);

    for(var key in this.handlers){
      _off.call(this, key, selector);
    }
  };

  var _removeHandlersFromSelectors = function(eventType, selector, handler){
    var callbacks = [];
    for(var i in this.handlers[eventType]){
      if(_match(selector, this.handlers[eventType][i].selector, false)){
        _removeHandler(this.handlers[eventType][i].callbacks, handler); 
      }
      callbacks = callbacks.concat(this.handlers[eventType][i].callbacks);
      if(this.handlers[eventType][i].callbacks.length === 0){
          this.handlers[eventType].splice(i, 1);
      }
    }
    return callbacks.length === 0;
  }

  var _addHandlerToSelector = function(eventType, selector, handler){
    for(var i in this.handlers[eventType]){
      if(_match(selector, this.handlers[eventType][i].selector, false)){
        this.handlers[eventType][i].callbacks.push(handler);
        return ;
      }
    }

    this.handlers[eventType].push({"selector": selector, "callbacks": [handler]});
  }

  var _paramsCheck = function(args, num){
    if(args.length < num)
      throw new Error('Invalid number of arguments');

    var permitedArgs = [['string'], ['string', 'object'], ['function']];
    for(var i=0; i < num - 1; i++){
      if(permitedArgs[i].indexOf(typeof(args[i]))<0){
        throw new Error('Invalid argument type');
      }   
    }
  };

  var _removeEventListener = function(eventType){
    document.removeEventListener(eventType, _trigger.bind(this));
    delete this.handlers[eventType];
  };

  var _addListenerIfNeeded = function(eventType){
    if(!this.handlers[eventType]){
      this.handlers[eventType] = [];
      document.addEventListener(eventType, _trigger.bind(this));
    }
  };

  var _removeHandler  = function(callbacks, handler){
    for(var x = callbacks.length - 1; x >= 0; x--) {
        if(!handler || callbacks[x] === handler) {
          callbacks.splice(x, 1);
        }
    }
    return callbacks;
  };    
  
  var _match = function(target, selector, matcher){
      if(typeof selector == typeof target){
        if(typeof selector == 'object'){
          return target.isSameNode(selector);
        }else{
          return target == selector;
        }
      }else if(matcher){ 
        return _matcher.call(target, selector);
      }else{
        return false;
      }
  };

  var _applyHandlers = function(callbacks, target, args){
    for(var i=0; i < callbacks.length; i++){
        callbacks[i].apply(target, args);
    }
  };

  var _trigger = function(event){
    if(this.handlers[event.type]){
      var args = Array.prototype.slice.call(arguments);
      var _handlers = this.handlers[event.type];

      for(var key in _handlers){   
        if(_match(event.target, _handlers[key].selector, true)){
          _applyHandlers(_handlers[key].callbacks, event.target, args);
        }
      }
    }
  };

  var _chooseRootNode = function(rootNode){
    if(typeof rootNode === "string")
      return document.getElementById(rootNode);
    if(typeof rootNode === "object")
      return rootNode;

    return document;
  }

  var EventDelegation = function(rootNode){
      this.rootNode = _chooseRootNode(rootNode);
      this.handlers = {};
      this.rootNode.addEventListener('DOMNodeRemoved', (function(event){
        _removeAllFor.call(this, event.target);
      }).bind(this));
      
      Object.freeze(this);
  }

  EventDelegation.prototype.removeAllEvents = _removeAllEvents;
  EventDelegation.prototype.off = _off;
  EventDelegation.prototype.on = _on;
  EventDelegation.prototype.removeAllFor = _removeAllFor;

  window.EventDelegation = EventDelegation;
})();