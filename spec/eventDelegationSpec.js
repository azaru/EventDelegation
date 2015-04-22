'use stric';
describe('Event Delegation - ', function() {
  
  describe('Add and delete events & callbacks by CSS Selector', function(){
      
    function myCallback(){
      console.log('yeah');
    }

    beforeEach(function(){
      events.on('click', '#out', myCallback);
    });

    it('Should be able to add an event', function(){
      expect(events.handlersCount).toEqual(1);
    });

    it('Should be able to save a callback', function(){
      expect(typeof events.handlers.click['#out'].callbacks[0]).toEqual('function');
      expect(events.handlers.click['#out'].callbacks[0]).toEqual(myCallback);
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
      var out_events_number = events.handlers.click['#out'].callbacks.length;
      expect(out_events_number).toEqual(2);
    });

    it('Should be able to add more than one event to diferent css Selector', function(){
      events.on('click', '#in', myCallback);
      var out_events_number = events.handlersCount;
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
      expect(events.handlersCount).toEqual(1);
    });

    it('Should be able to save a callback', function(){
      var euuid = out.getAttribute('data-euuid');
      expect(typeof events.handlers.click[euuid].callbacks[0]).toEqual('function');
      expect(events.handlers.click[euuid].callbacks[0]).toEqual(myCallback);
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
      var euuid = out.getAttribute('data-euuid');
      var out_events_number = events.handlers.click[euuid].callbacks.length;
      expect(out_events_number).toEqual(2);
    });

    it('Should be able to add more than one event to diferent HTML Object', function(){
      var inner = document.getElementById('in');
      events.on('click', inner, myCallback);
      var out_events_number = events.handlersCount;
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
      expect(events.handlersCount).toEqual(1);
    });

  });
  
  describe('Trigger callbacks', function(){
    var out, inner, that = {fn: function(){}, fn2: function(){}};

    beforeEach(function(){
      out =  document.getElementById('out');
      inner = document.getElementById('in');
      spyOn(that,"fn").and.callThrough();
      spyOn(that,"fn2").and.callThrough();
    });

    it('Should be able to trigger a callback when the event is fired - HTML Element', function(){
      events.on('click', out, that.fn);
      out.click();
      expect(that.fn).toHaveBeenCalled();
      
    });

    it('Should be able to trigger a callback when the event is fired - CSS Selector', function(){
      events.on('click', '#out', that.fn);
      out.click();
      expect(that.fn).toHaveBeenCalled();
    });

    it("Shouldn't be able to trigger a callback without the event - HTML Element", function(){
      events.on('click', out, that.fn);
      expect(that.fn).not.toHaveBeenCalled();
    });
    it("Shouldn't be able to trigger a callback without the event - CSS Selector", function(){
      events.on('click', "#out", that.fn);
      expect(that.fn).not.toHaveBeenCalled();
    });

    it("Shouldn't be able to trigger a callback without the event (even with childred firing it) - HTML Element", function(){
      events.on('click', out, that.fn);
      inner.click();
      expect(that.fn).not.toHaveBeenCalled();
    });

    it("Shouldn't be able to trigger a callback without the event (even with childred firing it) - CSS Selector", function(){
      events.on('click', "#out", that.fn);
      inner.click();
      expect(that.fn).not.toHaveBeenCalled();
    });

    it("Shouldn't be able to trigger a callback without the event (even with parent firing it) - HTML Element", function(){
      events.on('click', inner, that.fn);
      out.click();
      expect(that.fn).not.toHaveBeenCalled();
    });

    it("Shouldn't be able to trigger a callback without the event (even with parent firing it) - CSS Selector", function(){
      events.on('click', "#in", that.fn);
      out.click();
      expect(that.fn).not.toHaveBeenCalled();
    });

    it("Should be able to trigger more than one callback - HTML Elements", function(){
      events.on('click', out, that.fn);
      events.on('click', out, that.fn2);
      out.click();
      expect(that.fn).toHaveBeenCalled();
      expect(that.fn2).toHaveBeenCalled();
    });

    it("Should be able to trigger more than one callback - CSS Selectors", function(){
      events.on('click', "#out", that.fn);
      events.on('click', "#out", that.fn2);
      out.click();
      expect(that.fn).toHaveBeenCalled();
      expect(that.fn2).toHaveBeenCalled();
    });

    it("Should be able to trigger only the first callback if return false - HTML Elements", function(){
      that.fn = function(){return false;};
      spyOn(that,"fn").and.callThrough();
      events.on('click', out, that.fn);
      events.on('click', out, that.fn2);
      out.click();
      expect(that.fn).toHaveBeenCalled();
      expect(that.fn2).not.toHaveBeenCalled();
    });

    it("Should be able to trigger only the first callback if return false - CSS Selectors", function(){
      that.fn = function(){return false;};
      spyOn(that,"fn").and.callThrough();
      events.on('click', "#out", that.fn);
      events.on('click', "#out", that.fn2);
      out.click();
      expect(that.fn).toHaveBeenCalled();
      expect(that.fn2).not.toHaveBeenCalled();
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

  xdescribe("Performance",function(){
    allEvents = [];
    beforeEach(function(){
      var inner = document.getElementById('in');
      var next = inner;
      for(var i=0; i<1000; i++){
        next = addNewNode('span','sub'+i, next);
      }
      for(var i=0; i<1000; i++){
        var rand = document.getElementById('sub'+i)
        allEvents.push(rand);
      }
    });
    xit('set 1000 events at diferent Elements (x25)',function(){
      
      var timer1 = timeFor(function(){
        for(var i in allEvents){
          events.on('click', allEvents[i], function(){
            a += 1;
          });
        }
      });
      var handlers = events.handlers;
      events.off();
      var timer2 = timeFor(function(){
        for(var i in allEvents){
          allEvents[i].addEventListener('click', function(){
            var a = 1;
          });
        }
      });
      
      expect(timer1).toBeLessThan(timer2 * 25);
    });

    xit('set 1000 events at same Element (x1.1)',function(){
      
      var timer1 = timeFor(function(){
        for(var i=0; i<1000; i++){
          events.on('click', allEvents[0], function(){
            a += 1;
          });
        }
      });
      
      events.off();
      var timer2 = timeFor(function(){
        for(var i=0; i<1000; i++){
          allEvents[0].addEventListener('click', function(){
            var a = 1;
          });
        }
      });
      
      var handlers = events.handlers;
      expect(timer1).toBeLessThan(timer2 * 1.1);
    });

    xit('trigger 1000 events - diferent elements (x1)',function(){
      for(var i in allEvents){
        events.on('click', allEvents[i], function(){
          var a = 1;
        });
      }
      
      var timer1 = timeFor(function(){
        for(var i in allEvents){
          allEvents[i].click();
        }
      });

      events.off();
      
      for(var i in allEvents){
        allEvents[i].addEventListener('click', function(){
          var a = 1;
        });
      }
      
      var timer2 = timeFor(function(){
        for(var i in allEvents){
          allEvents[i].click();
        }
      });
      var handlers = events.handlers;
      expect(timer1).toBeLessThan(timer2);
    });
  });
});