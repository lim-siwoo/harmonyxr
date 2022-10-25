let express = require('express'); // 웹서버 구축
let app = express();
let port = 8006;

let server = require('http').createServer(app);
var compression = require('compression')

let io = require('socket.io')(server);
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

let roomList = new Array();

app.set('view engine', 'ejs'); // Set render engine mode to ejs
app.set('views', __dirname + '/views'); // Specify the folder where ejs is located

app.use(compression());
app.use(express.static('public')); // Set static file location

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index', { roomList: roomList });
});

app.get('/room/:roomname', (req, res) => {
  for (const room of roomList) {
    if (room.name == req.params.roomname) { // If already exist
      room.userCount++;
      res.render('room', { roomname: room.name });
      return;
    }
  }

  let room = { // Create new room data
    name: req.params.roomname,
    userCount: 1,
  };
  roomList.push(room);
  res.render('room', { roomname: room.name });
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomname, peerId, username) => {
    console.log(username, "joining to", roomname);
    socket.join(roomname);
    socket.to(roomname).emit("user-connected", peerId);
    socket.data.peerId = peerId; // peerid가 생길 때마다 저장
    socket.data.username = username;
  });

  socket.on("disconnecting", (reason) => {
    for (const roomname of socket.rooms) { // 소켓이 속한 룸의 정보
      if (roomname !== socket.id) {
        console.log(socket.data.username, "disconnecting from", roomname);
        for(let key of roomList.keys()) {
          if(roomList[key].name === roomname) {
            roomList[key].userCount--;
            if(roomList[key].userCount < 1) {
              roomList.splice(key, 1);
            } else{
              io.to(roomname).emit("user has left", socket.data.peerId);
            }
          }
        }
      }
    }

  });
});
server.listen(port, function () { // Open server
  console.log(`Listening on http://localhost:${port}/`);
});
