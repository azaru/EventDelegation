function addNewNode(nodeType, id, parent){
  var node = document.createElement(nodeType);
  node.id = id;
  parent.appendChild(node);
  return node;
}

  afterEach(function(){
      events.removeAllEvents();
      var out = document.getElementById('out');
      if(out){out.remove();}
  });

  beforeEach(function(){
    var nodeOut = addNewNode('span', 'out', document.body);
    addNewNode('span', 'in', nodeOut);
  });