import { PlayerData } from "./types/PlayerData.js";
import { Partner } from "./types/Partner.js";
class Networking {
  constructor(partners, camera, controller1, controller2, roomName, username, scene) {
    this.partners = partners;
    this.camera = camera;
    this.controller1 = controller1;
    this.controller2 = controller2;
    this.scene = scene;

    this.socket = io("/", {
      transports: ["websocket"],
    });

    this.myVideo = document.createElement("video");
    this.myVideo.muted = true;

    this.peer = new Peer();
    this.conns = new Array(); // 동접한 사람의 data channel
    this.calls = new Array();
    this.players = new Array();

    this.myVideoStream;
    this.myPeerId;

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then((stream) => {
        this.myVideoStream = stream;
        this.myVideo.srcObject = stream;
        this.myVideo.addEventListener("loadedmetadata", () => {
          this.myVideo.play();
        });
        this.peer.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");

          call.on("stream", (userVideoStream) => {
            video.srcObject = userVideoStream;
            video.addEventListener("loadedmetadata", () => {
              video.play();
            });
          });
          this.calls.push({
            cal: call,
            video: video,
          });
        });

        this.socket.on("user-connected", (peerId) => {
          this.#connectToNewUser(peerId, stream); // 전화를 주는 클라이언트
        });
      });

    this.peer.on("open", (peerId) => {
      this.socket.emit("join-room", roomName, peerId, username);
      this.myPeerId = peerId;
    });

    this.peer.on("connection", (conn) => {
      console.log("Connection Received ", conn.peer);
      this.conns.push(conn);
      let partner = new Partner(conn, this.camera);
      this.scene.add(partner.partner);
    });

    this.socket.on("user has left", (disPeerId) => {
      console.log(disPeerId, " is left");
      for (let key of this.calls.keys()) {
        if (this.calls[key].cal.peer === disPeerId) {
          let removedCall = this.calls.splice(key, 1);
          removedCall[0].video.remove();
          removedCall[0].cal.close();
        }
      }
      for (let key of this.conns.keys()) {
        if (this.conns[key].peer === disPeerId) {
          let removedConn = this.conns.splice(key, 1);
          removedConn[0].close();
        }
      }
    });

    // setInterval(this.broadcastToPlayers, 1000);
  }

  #connectToNewUser(peerId, stream) {
    console.log("Connect to user ", peerId);
    const call = this.peer.call(peerId, stream);
    const conn = this.peer.connect(peerId);
    const video = document.createElement("video");

    call.on("stream", (userVideoStream) => {
      console.log("Stream established with ", call.peer);
      video.srcObject = userVideoStream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    });
    this.calls.push({
      // 전화거는쪽
      cal: call,
      video: video,
    });

    this.conns.push(conn);
    let partner = new Partner(conn, this.camera);
    this.partners.push(partner);
    this.scene.add(partner.partner);
  }

  broadcastToPlayers(isGuitar, aButton, bButton, isStroke) {
    let playerData = new PlayerData(
      this.camera,
      this.controller1,
      this.controller2,
      isGuitar,
      aButton,
      bButton,
      isStroke
    );
    this.conns.forEach((conn) => {
      conn.send(playerData);
    });
  }
}

export { Networking };
