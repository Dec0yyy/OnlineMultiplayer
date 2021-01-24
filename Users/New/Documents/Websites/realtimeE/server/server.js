const io = require('socket.io')();
const FRAME_RATE = 10;
const MAX_HP = 100;

var inGame = false;

io.on('connection', socket => {
  socket.join('Queue');
  socket.emit('init');

  io.in('Queue').clients((error, clients) => {
        if (error) throw error;
        if(clients.length > 1){
          socket.to('Queue').emit('gameRequest', {id: socket.id});
        }
        console.log("queue = "+clients.length);
  });

  socket.on('acceptRequest', () =>{
    socket.to('Queue').emit('acceptRequest');
    socket.leave("Queue");
    socket.join('GameRoom');
    inGame = true;
  });


  io.in('GameRoom').clients((error, clients) => {
        if (error) throw error;
        if(clients.length > 1){
          socket.to('GameRoom').emit('gameRequest', {id: socket.id});
        };
        console.log("gameRoom = "+ clients.length);
  });

  socket.on('JoinGameRoom', function(){
    socket.leave("Queue");
    socket.join("GameRoom");
    inGame = true;
  });
  socket.on('leaveGameRoom', ()=>{
    socket.leave('GameRoom')
  });


  //Game updates
  socket.on('updatePlayer', data => {
    socket.to('GameRoom').emit('updateScene', {x: data.pos_x, y: data.pos_y, rot: data.rotation});
    if(data.bullets != null){
      socket.to('GameRoom').emit('updateBullets', {bullets: data.bullets});
    }
  });

  socket.on('bullet_hit', function(){
    socket.to('GameRoom').emit('bullet_hit');
  });

  socket.on('GameOver', ()=>{
    socket.to('GameRoom').emit('GameOver');
    socket.leave("GameRoom");
  });
});




io.listen(3000);

