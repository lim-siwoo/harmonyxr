import * as THREE from '../build/three.module.js';
import { GLTFLoader } from '../libs/loaders/GLTFLoader.js';
import { Guitar } from './Guitar.js';

/*
* 상대방 3D Model에 대한 class , it called when connectToNewUser is operated.
*/
class Partner {
constructor (conn, camera){
    this.conn = conn;
    this.partner = new THREE.Group();
    this.head = new THREE.Object3D();
    this.rightHand = new THREE.Object3D();
    this.leftHand = new THREE.Object3D();
    this.isGuitar = false;
    this.aButton = false;
    this.bButton = false;
    this.isPlaying = false;
    this.guitar = new Guitar(camera);


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

        this.guitar.guitar.visible = false;
        this.guitar.guitar.name="guitar";
        this.rightHand.add(this.guitar.guitar);

        this.partner.add(this.rightHand);
        // 파트너 손에 기타 추가 (이렇게 하면 되나?)
        
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
   
        this.partner.getObjectByName("leftHand").position.x = data.controller1.position.x - data.position.x;
        this.partner.getObjectByName("leftHand").position.y = data.controller1.position.y - data.position.y;
        this.partner.getObjectByName("leftHand").position.z = data.controller1.position.z - data.position.z;
        this.partner.getObjectByName("rightHand").position.x = data.controller2.position.x - data.position.x;
        this.partner.getObjectByName("rightHand").position.y = data.controller2.position.y - data.position.y;
        this.partner.getObjectByName("rightHand").position.z = data.controller2.position.z - data.position.z;
        
        this.partner.getObjectByName("leftHand").rotation.x = data.controller1.rotation.x;
        this.partner.getObjectByName("leftHand").rotation.y = data.controller1.rotation.y;
        this.partner.getObjectByName("leftHand").rotation.z = data.controller1.rotation.z;
        this.partner.getObjectByName("rightHand").rotation.x = data.controller2.rotation.x;
        this.partner.getObjectByName("rightHand").rotation.y = data.controller2.rotation.y;
        this.partner.getObjectByName("rightHand").rotation.z = data.controller2.rotation.z;
        

        // 파트너 기타 보이게할지 결정하는 부분
        this.guitar.guitar.visible = data.isGuitar;
        this.guitar.aButton = data.aButton;
        this.guitar.bButton = data.bButton;
        this.guitar.isStroke = data.isStroke;
      });

    });
}


}
export{Partner};