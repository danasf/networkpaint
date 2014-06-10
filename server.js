var server = require('http').createServer(handler),
io = require('socket.io').listen(server),
fs = require('fs'),
url = require('url');

server.listen(8888);

function handler(req,res) {
  console.log("new HTTP connection");
  var path = url.parse(req.url);
 // var get = path.href == '/' ? __dirname+"/index.html" : __dirname + path.href;
  fs.readFile(__dirname +"/index.html",function(err,data) {
    if(err) {
      res.writeHead(500);
      return res.end("error");
    }
    res.writeHead(200);
    res.end(data);
  });
}


io.on('connection',function(sock) {
  console.log("new socket connection");
  sock.emit('message',{ hello: 'world'});
  sock.on('newLine',function(data) { console.log(data); });

});