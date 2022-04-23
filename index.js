const { acceptsLanguages } = require('express/lib/request');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
let count = io.engine.clientsCount;
let userNames = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){

  count = io.engine.clientsCount;
  io.emit('count', count);
  io.emit('users', userNames);

  socket.on("disconnect", (reason) => {
    count = io.engine.clientsCount;
    io.emit('count', count);

    delete userNames[socket.id];

    io.emit('users', userNames);

  });

  console.log('A user connected');

  socket.on('setUsername', function(data){

     if(Object.values(userNames).includes(data.name)){
        socket.emit('userExists', data.name + ' is taken! Try a different nickname.');
     } else {
        socket.emit('userSet', {username: data.name});
        var userName = data.name;
        var userId = data.userId;
        userNames[userId] = userName;
        io.emit('users', userNames);
     }
  });

  

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });


});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
