let socket = io("/", {
  transports: ["websocket"]
});

let videoGrid = document.getElementById("video-grid");
let myVideo = document.createElement("video");
let chatForm = document.getElementById('chatForm');
myVideo.muted = true;

let username = prompt('Enter username', Math.random());
let peer = new Peer();
let conns = new Array();

let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (peerId) => {
      connectToNewUser(peerId, stream);
    });
  });

peer.on("open", (peerId) => {
  socket.emit("join-room", roomname, peerId, username);
});


peer.on('connection', function (conn) {
  conn.on('open', () => {
    conn.on('data', (data) => {
      console.log("Datachannel Received");
      var chatArea = document.getElementById('chatArea');
      chatArea.append("\n" + data.username + " : " + data.msg);
      document.getElementById("chatArea").scrollTop = document.getElementById("chatArea").scrollHeight;
    });
    conns.push(conn);
  })
});

const connectToNewUser = (peerId, stream) => {
  const call = peer.call(peerId, stream);
  const conn = peer.connect(peerId);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });

  conn.on('open', () => {
    console.log("DataChannel connected");
    conn.on('data', (data) => {
      var chatArea = document.getElementById('chatArea');
      chatArea.append("\n" + data.username + " : " + data.msg);
      document.getElementById("chatArea").scrollTop = document.getElementById("chatArea").scrollHeight;
    });
    conns.push(conn);
  })
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};

// Chat send button onclicked
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  var chatInput = document.getElementById('chatInput');
  var chatArea = document.getElementById('chatArea');
  chatArea.append("\n" + username + " : " + chatInput.value);
  document.getElementById("chatArea").scrollTop = document.getElementById("chatArea").scrollHeight;

  conns.forEach((conn) => {
    conn.send({
        username: username,
        msg: chatInput.value,
    });
  })

  chatInput.value = "";
});