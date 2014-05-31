
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

io.sockets.on('connection', function (socket) {
  
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
      console.log(wc.nodes.list);
      wc.nodes.list.forEach(function(node){
         io.sockets.socket(node['socket_id']).emit("compute", data);
      });
  });
  
  socket.on('result', function(data) {
      console.log("result: " + data);
  });

  socket.on('disconnect', function () {
    io.sockets.emit('user disconnected');
    console.log(socket.id);
  });

});

console.log("testing");
