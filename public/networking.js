"use strict";
let socket = io("/", {
  transports: ["websocket"]
});

//let videoGrid = document.getElementById("video-grid");
let myVideo = document.createElement("video");
//let chatForm = document.getElementById('chatForm');
myVideo.muted = true;

let username = prompt('Enter username', Math.random().toString(36).substring(2, 12));
let peer = new Peer();
let conns = new Array(); // 동접한 사람의 data channel
let calls = new Array();

let myVideoStream;
let myPeerId;

// TODO:
// 전반적으로 비디오와 관련된 코드 제거
// 오디오만 연결

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: false
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

peer.on('connection', function (conn) {
  conn.on('open', () => {
    conn.on('data', (data) => {
      console.log("Datachannel received from ", conn.peer);
      console.log("Received Data", data);
      //var chatArea = document.getElementById('chatArea');
      //chatArea.append("\n" + data.username + " : " + data.msg);
      //document.getElementById("chatArea").scrollTop = document.getElementById("chatArea").scrollHeight;
    });
    conns.push(conn);
  })
});

const connectToNewUser = (peerId, stream) => {
  const call = peer.call(peerId, stream);
  const conn = peer.connect(peerId);
  const video = document.createElement("video");

  call.on("stream", (userVideoStream) => {
    console.log("Stream established with ", call.peer);
    // TODO:
    // 오디오 연결 잘 되는지 테스트하기
    addVideoStream(video, userVideoStream);
  });
  calls.push({ // 전화거는쪽
    cal: call,
    video: video
  });

  // TODO :
  // 새로운 유저가 접속될때 새로운 더미를 생성하는 코드
  conn.on('open', () => {
    console.log("DataChannel connected with ", conn.peer);
    conn.on('data', (data) => {
      // TODO:
      // 위치 데이터값이 들어왔을때 더미의 위치를 갱신하는 코드
      console.log("Datachannel received from ", conn.peer);
      console.log("Received Data", data);
    });
    
    conns.push(conn);
  });

};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    //videoGrid.append(video);
  });
};

socket.on("user has left",(disPeerId)=> {
  console.log(disPeerId, " is left");
  for (let key of calls.keys()) {
    if(calls[key].cal.peer === disPeerId){
      let removedCall = calls.splice(key, 1);
      removedCall[0].video.remove();
      removedCall[0].cal.close();
    }
  }
  for (let key of conns.keys()) {
    if(conns[key].peer === disPeerId){
      let removedConn= conns.splice(key, 1);
      removedConn[0].close();
    }
  }
});
