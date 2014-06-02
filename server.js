
var config = { port: 8000 };

var http = require('http'),
//    utils = require("util"),
    fs = require('fs'),
    url = require('url'),
    connect = require('connect'),
    wc = require('./webcloud.js');


var app = connect()
    .use(connect.logger('dev'))
    .use(connect.static(__dirname + '/client', { maxAge: 86400000 }))
    .use(function(request, response){
    
    var route = url.parse(request.url).pathname;
    if( route == '/' || route == '/home' ){
        fs.readFile('./index.html', function (err, html) {
            response.writeHeader(200, {"Content-Type": "text/html"});
            response.end(html);
        });
        
        //wc.nodes.add( request.connection.remoteAddress );

    } else {
        response.writeHeader(404, {"Content-Type": "text/plain"});
        response.end();
    }
  });

http.createServer(app).listen(config.port);

var io = require('socket.io').listen(7000);

var result_buffer = [],
    rc = 0,
    lock = 0,
    NUM_NODE = 0;

var on_compute = null, on_complete = null;


io.sockets.on('connection', function (socket) {

  console.log("new connection: ", socket.id);
  
  var newnode = {"id": wc.nodes.list.length, "ip": socket.handshake.address.address, "socket_id": socket.id};

  if(wc.nodes.isAdded(newnode) == false){
      wc.nodes.list.forEach(function(node){ 
         io.sockets.socket(node['socket_id']).emit("newnode", newnode);
      });

      wc.nodes.add(newnode);
      console.log(wc.nodes.list);
  }

  socket.emit('init', { nodes: wc.nodes.list });

  socket.on('program', function(data) {

      lock = 1;
      NUM_NODE = wc.nodes.list.length;
      var obj = JSON.parse(data);

      var node_data;

      if(obj.postcompute){
        on_complete = eval( "(" + obj.postcompute + ")");  //TODO: check for security 
        console.log(on_complete);
      }


      if(obj.precompute){
        on_compute = eval( "(" + obj.precompute + ")");  //TODO: check for security 
        node_data = on_compute(obj.data);
      } else {
        node_data = null;
      }

      console.log(obj);

      wc.nodes.list.forEach(function(node){
         io.sockets.socket(node['socket_id']).emit("compute", {node_id: node.id, NUM_NODE: wc.nodes.list.length, data: (node_data)?node_data[node[id]]:obj.data, compute: obj.compute});
      });
  });
 
  socket.on('result', function(result) {
    var nid = wc.nodes.get(socket.id);
    //console.log(nid);
    rc++;
    result_buffer[nid] = result;
    console.log(result_buffer);

    if(rc == NUM_NODE){
              console.log(on_complete);
      if(on_complete) {
        var final_result = on_complete(result_buffer);
      } else {
        var final_result = result_buffer;
      }
      console.log(final_result, rc);
      wc.nodes.list.forEach(function(node){ 
         io.sockets.socket(node['socket_id']).emit("complete", {final_result: final_result, results: result_buffer});
      });
    }
  }); 

  socket.on('disconnect', function () {
    io.sockets.emit('user disconnected');
    wc.nodes.delete(socket.id);
    console.log("disconnect: " + socket.id);
  });

});

console.log("testing");