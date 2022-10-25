import * as THREE from '../build/three.module.js';
import { GLTFLoader } from '../libs/loaders/GLTFLoader.js';

/*
* 상대방 3D Model에 대한 class , it called when connectToNewUser is operated.
*/
class Partner {
constructor (conn){
    this.conn = conn;
    this.partner = new THREE.Group();
    this.head = new THREE.Object3D();
    this.rightHand = new THREE.Object3D();
    this.leftHand = new THREE.Object3D();


    // GLTFLOADER
    const loader = new GLTFLoader().setPath('/resources/head/');
    loader.load('scene.gltf', (gltf) => {
        gltf.scene.scale.set(1.0, 1.0, 1.0);
        gltf.scene.position.set(0, 1, 0); // 나중에 연동이되면 이 값은 지워줘야합니다.
        let y_angle = 180;
        y_angle = y_angle * 3.14 / 180.0;
        gltf.scene.rotation.set(0, y_angle, 0);
        this.head.add(gltf.scene);
        this.partner.add(this.head);
    })
    loader.setPath('/resources/hand/');
    loader.load('scene.gltf', (gltf) => {
        gltf.scene.scale.set(0.01, 0.01, 0.01);
        gltf.scene.position.set(0.5, 0.5, 0); //나중에 멀티로 연동이 되면 이 값은 지워야합니다.
        this.leftHand.add(gltf.scene);
        this.partner.add(this.leftHand);
    })

    loader.load('scene.gltf', (gltf) => {
        let partnerHandR = gltf.scene;
        gltf.scene.scale.set(0.01, 0.01, 0.01);
        gltf.scene.position.set(-0.5, 0.5, 0); //나중에 멀티로 연동이 되면 이 값은 지워야합니다.
        this.rightHand.add(gltf.scene);
        this.partner.add(this.rightHand);
    })

    // TODO :
    // 새로운 유저가 접속될때 새로운 더미를 생성하는 코드
    this.conn.on('open', () => {
      console.log("DataChannel connected with ", this.conn.peer);
      this.conn.on('data', (data) => {
        console.log("Datachannel received from ", this.conn.peer);
        console.log("Received Data", data);
        this.partner.position.x = data.position.x;
        this.partner.position.y = data.position.y;
        this.partner.position.z = data.position.z;
        this.partner.rotation.x = data.rotation.x;
        this.partner.rotation.y = data.rotation.y;
        this.partner.rotation.z = data.rotation.z;

        // TODO:
        // 컨트롤러 위치 값도 대입 해줘야함
        //partner.position = data.position;
        // this.partner.children[1].position = data.head.position; //머리값도 저장해야해요. 로테이션도요.
        this.partner.children[1].position = data.controller1.position;
        this.partner.children[2].position = data.controller2.position;

      });

    });
}


}
export{Partner};