let socket = io("/", {
  transports: ["websocket"]
});

let videoGrid = document.getElementById("video-grid");
let myVideo = document.createElement("video");
let chatForm = document.getElementById('chatForm');
myVideo.muted = true;

let username = prompt('Enter username', Math.random());
let peer = new Peer();
let conns = new Array(); // 동접한 사람의 data channel
let calls = new Array();

let myVideoStream;
let myPeerId;

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
      calls.push({
        cal : call,
        video: video
      });

    });

    socket.on("user-connected", (peerId) => {
      connectToNewUser(peerId, stream); // 전화를 주는 클라이언트
    });
  });

peer.on("open", (peerId) => {
  socket.emit("join-room", roomname, peerId, username);
  myPeerId = peerId;

});

socket.on("user has left",(disPeerId)=> {
  console.log("0")
  console.log(calls)
  for (const key of calls.keys()) {
    console.log("1")
    if(calls[key].cal.peer === disPeerId){
      console.log("2")
      var removedCall = calls.splice(key, 1);
      console.log(removedCall[0].video)
      removedCall[0].video.remove();

      console.log(removedCall[0])
      removedCall[0].cal.close();
    }
  }
  for (const key of conns.keys()) {
    if(conns[key].peer === disPeerId){
      console.log("chatting closed")
      var removedConn= conns.splice(key, 1);
      removedConn[0].close();
    }
  }

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
    console.log("stream")
    addVideoStream(video, userVideoStream);
  });
  calls.push({ // 전화거는쪽
    cal: call,
    video: video
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
    // video.remove();
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