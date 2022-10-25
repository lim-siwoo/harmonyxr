import * as THREE from '../build/three.module.js';
import { GLTFLoader } from '../libs/loaders/GLTFLoader.js';

/*
* 상대방 3D Model에 대한 class , it called when connectToNewUser is operated.
*/
class Partner {
constructor (conn){
    this.conn = conn;
    this.partner = new THREE.Group();

    // GLTFLOADER
    const loader = new GLTFLoader().setPath('/resources/head/');
    loader.load('scene.gltf', (gltf) => {
        let partnerHead = gltf.scene;
        partnerHead.scale.set(1.0, 1.0, 1.0);
        partnerHead.position.set(0, 1, 0);
        let y_angle = 180;
        y_angle = y_angle * 3.14 / 180.0;
        partnerHead.rotation.set(0, y_angle, 0);
        this.partner.add(partnerHead);
    })
    loader.setPath('/resources/hand/');
    loader.load('scene.gltf', (gltf) => {
        let partnerHandL = gltf.scene;
        partnerHandL.scale.set(0.01, 0.01, 0.01);
        partnerHandL.position.set(0.5, 0.5, 0);
        this.partner.add(partnerHandL);
    })

    loader.load('scene.gltf', (gltf) => {
        let partnerHandR = gltf.scene;
        partnerHandR.scale.set(0.01, 0.01, 0.01);
        partnerHandR.position.set(-0.5, 0.5, 0);
        this.partner.add(partnerHandR);
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
      });

    });
}


}
export{Partner};