(function(){
  'use strict';
  
  var _matcher = Element.prototype.matches 
    || Element.prototype.webkitMatchesSelector
    || Element.prototype.mozMatchesSelector 
    || Element.prototype.msMatchesSelector 
    || Element.prototype.oMatchesSelector;
  var rootHandler = {};

  var _on = function (eventType ,selector ,handler){
    _paramsCheck(arguments, 3);
    _addListenerIfNeeded(this.uuid, eventType);
    _addHandlerToSelector(this.uuid, eventType, selector, handler);
  };

  var _off= function (eventType, selector, handler){
    var argLength = arguments.length, uuid = this.uuid;
    if(argLength == 0)
      _removeAllEvents(uuid);
    if(argLength == 1){
      selector = eventType;
      _removeAllFor(uuid, selector);
    }
    if(2 <= argLength <= 3)
      _removeHandlersFromSelectors(uuid, eventType, selector, handler);
  };

  var _removeAllEvents = function (uuid){
    for(var eventType in rootHandler[uuid].handlers){
      _removeEventListener(uuid, eventType);
    }
  };

  var _removeAllFor = function (uuid, selector){
    for(var key in rootHandler[uuid].handlers){
      _removeHandlersFromSelectors(uuid, key, selector)
    }
  };

  var _removeHandlersFromSelectors = function(uuid, eventType, selector, handler){
    var handlers = rootHandler[uuid].handlers;
    var key = _keyForSelector(selector);
    if(!handlers[eventType] || !handlers[eventType][key])
      return;

    _removeHandler(handlers[eventType][key].callbacks, handler);
    if(handlers[eventType][key].callbacks.length === 0){
         delete handlers[eventType][key];
    }
    
    if(_objectCount(handlers[eventType]) === 0){
      _removeEventListener(uuid, eventType);
    }
  }
  var _objectCount = function(obj){
    var count = 0;
    for(var key in obj){
      if(obj.hasOwnProperty(key))
        count++;
    }
    return count;
  }

  var _addHandlerToSelector = function(uuid, eventType, selector, handler){
    var handlers = rootHandler[uuid].handlers, done;
    var key = _keyForSelector(selector);
    if(handlers[eventType][key]){
      handlers[eventType][key].callbacks.push(handler);
      return
    }
    var newSelector = {"selector": selector, "callbacks": [handler]};
    handlers[eventType][key] = newSelector;
  };

  var _keyForSelector = function(selector){
    if(typeof selector === "string")
      return selector
    if(typeof selector === "object"){
      var euuid = selector.getAttribute('data-euuid') || generateUUID();
      selector.setAttribute('data-euuid', euuid);
      return euuid;
    }
  };

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

  var _removeEventListener = function(uuid, eventType){
    var rootNode = rootHandler[uuid].rootNode;
    var handlers = rootHandler[uuid].handlers;
    rootNode.removeEventListener(eventType, _trigger.bind({}, uuid));
    delete handlers[eventType];
  };

  var _addListenerIfNeeded = function(uuid, eventType){
    var rootNode = rootHandler[uuid].rootNode;
    var handlers = rootHandler[uuid].handlers;
    if(!handlers[eventType]){
      handlers[eventType] = {};
      rootNode.addEventListener(eventType, _trigger.bind({}, uuid));
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

  var _trigger = function(uuid, event){
    var handlers = rootHandler[uuid].handlers;
    if(handlers[event.type]){
      var args = Array.prototype.slice.call(arguments);
      var _handlers = handlers[event.type];

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
  var generateUUID =function (){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  };
  var _removeAllForAndChilds = function(uuid, element){
    _removeAllFor(uuid, element);
    for(var i = 0; i < element.childElementCount; i++){
     _removeAllForAndChilds(uuid, element.children[i]);
    }
  }
  var EventDelegation = function(rootNode){
    rootNode = _chooseRootNode(rootNode);
    var uuid = this.uuid = generateUUID();
    rootHandler[this.uuid] = {
      rootNode: rootNode,
      handlers: {}
    }
    
    rootNode.addEventListener('DOMNodeRemoved',function(event){
      _removeAllForAndChilds(uuid, event.target);
    });
    
    Object.freeze(this);
  }

  Object.defineProperty(EventDelegation.prototype, 'handlers', {
    get: function(){
      return Object.create(rootHandler[this.uuid].handlers);
    }
  });

  Object.defineProperty(EventDelegation.prototype, 'handlersCount', {
    get: function(){
      var count = 0;
      for(var handlerType in rootHandler[this.uuid].handlers){
        for(var handler in rootHandler[this.uuid].handlers[handlerType]){
          count++;
        }
      }
      return count;
    }
  });

  EventDelegation.prototype.off = _off;
  EventDelegation.prototype.on = _on;

  window.EventDelegation = EventDelegation;
})();