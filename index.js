const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
let count = io.engine.clientsCount;
let users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){

  count = io.engine.clientsCount;
  io.emit('count', count);

  socket.on("disconnect", (reason) => {
    count = io.engine.clientsCount;
    io.emit('count', count);
    io.emit('users', users);
  });

  console.log('A user connected');

  socket.on('setUsername', function(data){

     if(users.indexOf(data) > -1){
        socket.emit('userExists', data + ' is taken! Try a different nickname.');
     } else {
        users.push(data);
        socket.emit('userSet', {username: data});

        io.emit('users', users);
     }
  });

  

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });


});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
