let express = require('express');
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
  roomList.forEach((elem) => {
    if (elem.name == req.params.roomname) { // If already exist
      res.render('room', { roomname: elem.name });
    }
  });
  let room = { // Create new room data
    name: req.params.roomname,
  };
  roomList.push(room);
  res.render('room', { roomname: room.name });
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomname, peerId, username) => {
    socket.join(roomname);
    socket.to(roomname).emit("user-connected", peerId);
  });
});

server.listen(port, function () { // Open server
  console.log(`Listening on http://localhost:${port}/`);
});