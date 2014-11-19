describe("Event Delegation - ", function() {
  


  describe('Add and delete events & callbacks by CSS Selector', function(){
    

    function myCallback(){
      console.log('yeah');
    }

    beforeEach(function(){
      events.on('click', '#out', myCallback);
    });

    it('Should be able to add an event', function(){
      expect(events.handlers.click.length).toEqual(1);
    });

    it('Should be able to save a callback', function(){
      expect(typeof events.handlers.click[0].callbacks[0]).toEqual('function');
      expect(events.handlers.click[0].callbacks[0]).toEqual(myCallback);
    });

    it('Should be able to save the correct event type', function(){
      expect(events.handlers.click).not.toEqual(undefined);
    });

    it('Should be able to remove an event with named function', function(){
      events.off('click', '#out', myCallback);
      expect(events.handlers.click).toEqual(undefined);
    });
    it('Should be able to remove events with selector & eventType', function(){
      events.off('click', '#out');
      expect(events.handlers.click).toEqual(undefined);
    });

    it('Should be able to remove last event', function(){
      events.off('#out');
      expect(events.handlers.click).toEqual(undefined);
    });

    it('Should be able to remove all events', function(){
      events.off();
      expect(events.handlers.click).toEqual(undefined);
    });

    it('Should be able to add more than one event to same css Selector', function(){
      events.on('click', '#out', myCallback);
      var out_events_number = events.handlers.click[0].callbacks.length;
      expect(out_events_number).toEqual(2);
    });

    it('Should be able to add more than one event to diferent css Selector', function(){
      events.on('click', '#in', myCallback);
      var out_events_number = events.handlers.click.length;
      expect(out_events_number).toEqual(2);
    });

  });

  describe('Add and delete events & callbacks by HTML Element', function(){
    

    function myCallback(){
      console.log('yeah');
    }

    var out;

    beforeEach(function(){
      out =  document.getElementById('out');
      events.on('click', out, myCallback);
    });

    it('Should be able to add an event', function(){
      expect(events.handlers.click.length).toEqual(1);
    });

    it('Should be able to save a callback', function(){
      expect(typeof events.handlers.click[0].callbacks[0]).toEqual('function');
      expect(events.handlers.click[0].callbacks[0]).toEqual(myCallback);
    });

    it('Should be able to save the correct event type', function(){
      expect(events.handlers.click).not.toEqual(undefined);
    });

    it('Should be able to remove an event with named function', function(){
      events.off('click', out, myCallback);
      expect(events.handlers.click).toEqual(undefined);
    });

    it('Should be able to remove events with selector & eventType', function(){
      events.off('click', out);
      expect(events.handlers.click).toEqual(undefined);
    });

    it('Should be able to remove last event', function(){
      events.off(out);
      expect(events.handlers.click).toEqual(undefined);
    });

    it('Should be able to add more than one event to same HTML Object', function(){
      events.on('click', out, myCallback);
      var out_events_number = events.handlers.click[0].callbacks.length;
      expect(out_events_number).toEqual(2);
    });

    it('Should be able to add more than one event to diferent HTML Object', function(){
      var inner = document.getElementById('in');
      events.on('click', inner, myCallback);
      var out_events_number = events.handlers.click.length;
      expect(out_events_number).toEqual(2);
    });

    it('Should be able to remove one event when the Element is removed', function(){
      out.remove();
      expect(events.handlers.click).toEqual(undefined);
    });

    it('Should be able to remove one event when the parent Element is removed', function(){
      var inner = document.getElementById('in');
      events.on('click', inner, myCallback);
      out.remove();
      expect(events.handlers.click).toEqual(undefined);
    });

    it('Should be able to remove the child Element without remove parent events', function(){
      var inner = document.getElementById('in');
      events.on('click', inner, myCallback);
      inner.remove();
      expect(events.handlers.click.length).toEqual(1);
    });

  });
  
  describe('Trigger callbacks', function(){
    var out;

    beforeEach(function(){
      out =  document.getElementById('out');
    });

    it('Should be able to trigger a callback when the event is fired - HTML Element', function(){
      var trigger = false;
      events.on('click', out, function(){
        trigger = true;
      });
      out.click();
      expect(trigger).toEqual(true);
    });

    it('Should be able to trigger a callback when the event is fired - CSS Selector', function(){
      var trigger = false;
      events.on('click', '#out', function(){
        trigger = true;
      });
      out.click();
      expect(trigger).toEqual(true);
    });

    it("Shouldn't be able to trigger a callback without the event - HTML Element", function(){
      var trigger = false;
      events.on('click', out, function(){
        trigger = true;
      });
      expect(trigger).toEqual(false);
    });
    it("Shouldn't be able to trigger a callback without the event - CSS Selector", function(){
      var trigger = false;
      events.on('click', '#out', function(){
        trigger = true;
      });
      expect(trigger).toEqual(false);
    });

    it("Shouldn't be able to trigger a callback without the event (even with childred firing it) - HTML Element", function(){
      var trigger = false;
      events.on('click', out, function(){
        trigger = true;
      });
      var inner = document.getElementById('in');
      inner.click();
      expect(trigger).toEqual(false);
    });

    it("Shouldn't be able to trigger a callback without the event (even with childred firing it) - CSS Selector", function(){
      var trigger = false;
      events.on('click', '#out', function(){
        trigger = true;
      });
      var inner = document.getElementById('in');
      inner.click();
      expect(trigger).toEqual(false);
    });

    it("Shouldn't be able to trigger a callback without the event (even with parent firing it) - HTML Element", function(){
      var trigger = false;
      var inner = document.getElementById('in');
      events.on('click', inner, function(){
        trigger = true;
      });
      
      out.click();
      expect(trigger).toEqual(false);
    });

    it("Shouldn't be able to trigger a callback without the event (even with parent firing it) - CSS Selector", function(){
      var trigger = false;
      var inner = document.getElementById('in');
      events.on('click', '#in', function(){
        trigger = true;
      });
      
      out.click();
      expect(trigger).toEqual(false);
    });

     it("Should be able to trigger more than one callback - HTML Elements", function(){
      var trigger = false, trigger2 = false;
      events.on('click', out, function(){
        trigger = true;
      });
      events.on('click', out, function(){
        trigger2 = true;
      });
      
      out.click();
      expect(trigger && trigger2).toEqual(true);
    });
     it("Should be able to trigger more than one callback - CSS Selectors", function(){
      var trigger = false, trigger2 = false;
      events.on('click', '#out', function(){
        trigger = true;
      });
      events.on('click', '#out', function(){
        trigger2 = true;
      });
      
      out.click();
      expect(trigger && trigger2).toEqual(true);
    });

  });

  describe("Internals", function(){
    it('Internal handlers is read only',function(){
      events.on('click','#out',function(){ console.log('la');});
      events.handlers = undefined;
      events.handlers.click = undefined;
      expect(events.handlers).not.toEqual(undefined)
      expect(events.handlers.click).not.toEqual(undefined)
    });
    
    it('.on internal function is read only',function(){
      events.on = undefined;
      expect(events.on).not.toEqual(undefined);
    });

    it('.off internal function is read only',function(){
      events.off = undefined;
      expect(events.off).not.toEqual(undefined);
    });

    it('.on raise an error with less than 3 parameters',function(){
      var onClickWith1Args = function(){
        events.on('click');
      }
      var onClickWith2Args = function(){
        events.on('click','#in');
      }
      expect(onClickWith1Args).toThrow();
      expect(onClickWith2Args).toThrow();
    });

  });

});