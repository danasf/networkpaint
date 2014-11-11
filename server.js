var server = require('http').createServer(handler),
io = require('socket.io').listen(server),
fs = require('fs'),
url = require('url');

server.listen(4000);

function handler(req,res) {
  console.log("new HTTP connection");
var path = url.parse(req.url);
  console.log("HTTP connection");

  var get = path.href == '/' ? __dirname+"/index.html" : __dirname + path.href;
  fs.readFile(get,function(err,data) {
    if(err) { res.writeHeader(404); res.end("Error"); }
    res.writeHeader(200);
    res.end(data);
  });
}


io.on('connection',function(sock) {
  console.log("new socket connection");
  sock.emit('message',{ hello: 'world'});
  sock.on('newLine',function(data) { 
      sock.broadcast.emit('newLine',data);
  });

   sock.on('erase',function(data) { 
      sock.broadcast.emit('erase');
  });

});