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
        gltf.scene.position.set(0, 0, 0);
        let y_angle = 180;
        y_angle = y_angle * 3.14 / 180.0;
        gltf.scene.rotation.set(0, y_angle, 0);
        this.head.add(gltf.scene);
        this.head.name = "head";
        this.partner.add(this.head);
    })
    loader.setPath('/resources/hand/');
    loader.load('scene.gltf', (gltf) => {
        gltf.scene.scale.set(0.01, 0.01, 0.01);
        gltf.scene.position.set(0, 0, 0);
        this.leftHand.add(gltf.scene);
        this.leftHand.name="rightHand";
        this.partner.add(this.leftHand);
    })

    loader.load('scene.gltf', (gltf) => {
        let partnerHandR = gltf.scene;
        gltf.scene.scale.set(0.01, 0.01, 0.01);
        gltf.scene.position.set(0, 0, 0);
        this.rightHand.add(gltf.scene);
        this.rightHand.name="leftHand";
        this.partner.add(this.rightHand);
    })

    // TODO :
    // 새로운 유저가 접속될때 새로운 더미를 생성하는 코드
    this.conn.on('open', () => {
      console.log("DataChannel connected with ", this.conn.peer);
      this.conn.on('data', (data) => {
        console.log("Datachannel received from ", this.conn.peer);
        // console.log("Received Data", data);
        this.partner.position.x = data.position.x;
        this.partner.position.y = data.position.y;
        this.partner.position.z = data.position.z;
        
        this.head.rotation.x = data.rotation.x;
        this.head.rotation.y = data.rotation.y;
        this.head.rotation.z = data.rotation.z;
        // TODO:
        // 컨트롤러 위치가 미묘하게 이상함. 고쳐야함
        this.partner.getObjectByName("leftHand").position.x = data.controller1.position.x - data.position.x;
        this.partner.getObjectByName("leftHand").position.y = data.controller1.position.y - data.position.y;
        this.partner.getObjectByName("leftHand").position.z = data.controller1.position.z - data.position.z;
        this.partner.getObjectByName("rightHand").position.x = data.controller2.position.x - data.position.x;
        this.partner.getObjectByName("rightHand").position.y = data.controller2.position.y - data.position.y;
        this.partner.getObjectByName("rightHand").position.z = data.controller2.position.z - data.position.z;
      });

    });
}


}
export{Partner};