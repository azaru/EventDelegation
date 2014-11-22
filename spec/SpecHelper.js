function addNewNode(nodeType, id, parent){
  var node = document.createElement(nodeType);
  node.id = id;
  parent.appendChild(node);
  return node;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function timeFor(fn){
  var timeStart=  microtime(true);
  fn();
  return microtime(true) - timeStart;
}

function microtime(get_as_float) {
  var now = new Date()
    .getTime() / 1000;
  var s = parseInt(now, 10);

  return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
}

afterEach(function(){
  events.off();
  var out = document.getElementById('out');
  if(out){out.remove();}
});

beforeEach(function(){
  var nodeOut = addNewNode('span', 'out', document.body);
  addNewNode('span', 'in', nodeOut);
  window.events = new EventDelegation();
});