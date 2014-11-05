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

    it('Should be able to remove last event', function(){
      events.off('click', '#out');
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

    it('Should be able to remove last event', function(){
      events.off('click', out);
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
});