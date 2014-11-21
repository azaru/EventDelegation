Usage:

events = new EventDelegation( "CSS selector" or HTML Element );

events.on("Event type", "CSS selector" or HTML Element, Callback);

events.off("Event type", "CSS selector" or HTML Element, Callback);
  Remove the callback from the list

events.off("CSS selector" or HTML Element)
  Remove all callbacks for one element

events.off("Event type", "CSS selector" or HTML Element)
  Remove all callbacks of that kind of event for one element 

events.off();
  Remove all callbacks for this instance