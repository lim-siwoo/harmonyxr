import * as THREE from '../build/three.module.js';
import { GLTFLoader } from '../libs/loaders/GLTFLoader.js';
// import { VRButton } from '../libs/VRButton';controllerModelFactory
// import { XRControllerModelFactory } from '../libs/XRControllerModelFactory.js';


class Guitar {

    constructor (camera){
        this.guitar = new THREE.Group();
        this.INTERSECTION;
        this.selected;
        this.guitar.collided = false;
        this.playing = false;
        this.input = 0;
        this.v = new THREE.Vector3;
        this.aButton = false;
        this.bButton = false;
        this.isStroke= false;

        const listener = new THREE.AudioListener();
        camera.add( listener );

        // create a global audio source
        this.sound = new THREE.Audio( listener );
        this.aMajor = new THREE.Audio( listener );
        this.cMajor = new THREE.Audio( listener );
        this.fMajor = new THREE.Audio( listener );
        this.gMajor = new THREE.Audio( listener );

        const audioLoader = new THREE.AudioLoader();
        audioLoader.load( '/resources/guitar/a-major.wav', ( buffer ) =>{
            this.sound.setBuffer( buffer );
            this.sound.setLoop( false );
            this.sound.setVolume( 0.5 );
            // this.sound.play();
        });

        audioLoader.load( '/resources/guitar/a-major.wav', ( buffer ) =>{
            this.aMajor.setBuffer( buffer );
            this.aMajor.setLoop( false );
            this.aMajor.setVolume( 0.5 );
            this.aMajor.offset = 1.3;
            this.aMajor.duration = 4;
            // this.aMajor.play();
        });

        audioLoader.load( '/resources/guitar/c-major.wav', ( buffer ) =>{
            this.cMajor.setBuffer( buffer );
            this.cMajor.setLoop( false );
            this.cMajor.setVolume( 0.5 );
            this.cMajor.offset = 1;
            this.cMajor.duration = 4;
            // this.cMajor.play();
        });

        audioLoader.load( '/resources/guitar/f-major.wav', ( buffer ) =>{
            this.fMajor.setBuffer( buffer );
            this.fMajor.setLoop( false );
            this.fMajor.setVolume( 0.5 );
            this.fMajor.offset = 2.5;
            this.fMajor.duration = 4;
            // this.cMajor.play();
        });

        audioLoader.load( '/resources/guitar/g-major.wav', ( buffer ) =>{
            this.gMajor.setBuffer( buffer );
            this.gMajor.setLoop( false );
            this.gMajor.setVolume( 0.5 );
            this.gMajor.offset = 0.8;
            this.gMajor.duration = 4;
            // this.cMajor.play();
        });
        

        // this.audioLoader = new THREE.AudioLoader();
        //     this.audioLoader.load( '/resources/guitar/a-major.wav', function( buffer ) {
        //     this.sound.setBuffer( this.buffer );
        //     this.sound.setLoop( true );
        //     this.sound.setVolume( 0.5 );
        //     this.sound.play();
        // });

        

        this.box = new THREE.Box3();
        
        this.geometry = new THREE.SphereGeometry( 0.05, 8, 8 );
        this.material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        this.collision = new THREE.Mesh( this.geometry, this.material );
        
        // this.guitarCollison = new THREE.Sphere((0.3,0,-0.1),1);
        // this.collision.material.color.setHex(0xffffff);
        // this.handCollison = new THREE.Sphere();

        this.collision.position.set(0.3,0,-0.1);
        this.collision.name = "collision";
        this.guitar.add(this.collision);

        // this.guitarCollison.name = "guitarCollision";
        // this.guitar.add(this.guitarCollison);

        
        
        // GLTFLOADER
        const loader = new GLTFLoader().setPath('/resources/guitar/guitar_model/');
        loader.load('scene.gltf', (gltf) => {
            gltf.scene.scale.set(0.1, 0.1, 0.1);
            gltf.scene.position.set(0, 0, 0);
            let y_angle = 90;
            y_angle = y_angle * 3.14 / 180.0;
            gltf.scene.rotation.set(0, y_angle, 0);
            this.guitar.add(gltf.scene);
            this.guitar.name = "guitar";
            this.guitar.position.set(0.2,0,0);
            // this.partner.add(this.head);
        })
        
        
    }

    onSelectStart() {

        // this.userData.isSelecting = true;
        this.collision.material.color.setHex(0x00ff00);

    }

    onSelectEnd() {

        // this.userData.isSelecting = false;
        this.collision.material.color.setHex(0xffffff);
    }


    handleParnterCollisions(partner) {

        this.guitar.collided = false;

        for(let g =0; g < partner.children.length; g++){

            for(let g =0; g < partner.children.length; g++){
                partner.children[g].getWorldPosition(this.v);
                const sphere = {
                    radius: 0.02,
                    center: this.v
                }
                this.box.setFromObject(this.guitar.children[0]);
                if(this.box.intersectsSphere(sphere)){
                    //기타를 쳤다
                    if(this.guitar.collided == false){
                        this.guitar.collided = true;
                        this.collision.material.color.setHex(0x000000);
                        // const { grip, gamepad } = controller;
    
                        if(partner.bButton == true & partner.aButton == false) {
                            this.input = 1;
                        }else if(partner.aButton == true & partner.bButton == false)
                        {
                            this.input = 2;
                        }else if(partner.aButton == true & partner.bButton == true){
                            this.input = 3;
                        }else{
                            this.input = 4;

                        }
    
                    }
                    
                }
                else{
                    this.collision.material.color.setHex(0xffff00);
                }
            }
            
        }
        
        switch(this.input) {
            case 0:
                break;
            case 1:
                if(!this.guitar.collided & this.playing){
                    this.aMajor.stop();
                    this.aMajor.play();
                }else{
                    this.aMajor.play();
                }
                break;
            case 2:
                if(this.aMajor.isPlaying){
                    this.aMajor.stop();
                }
                this.aMajor.play();
                break;
            case 3:
                if(this.aMajor.isPlaying){
                    this.aMajor.stop();
                }
                this.aMajor.play();
                break;
            case 4:
                if(this.aMajor.isPlaying){
                    this.aMajor.stop();
                }
                this.aMajor.play();
                break;
            default:
                break;
            
                
                
        }

    }


    handleCollisions(partners, controllers) {
        let v = new THREE.Vector3(); // vector temp for compare collision
        let v2 = new THREE.Vector3();
        this.guitar.collided = false;
        this.collision.material.color.setHex(0xffff00);
        //파트너 충돌 처리
        // for (let partner of partners) {
        //     for (let part of partner.partner.children) {
        //         // v.x = v.x - partner.position.x;
        //         // v.y = v.y - partner.position.y;
        //         // v.z = v.z - partner.position.z;
        //         // v.sub(partner.partner.position);
        //         part.getWorldPosition(v);
        //         const sphere = {
        //           radius: 0.04,
        //           center: v
        //         };
        //         console.log("2");
        //         console.log("충돌 감지할 손: ", v)
        //         this.box.setFromObject(this.guitar.children[0]);
        //         console.log("콜라이더", this.box.min);
        //         // this.guitar.children[0].getWorldPosition(v2);

        //         if(partner.partner.children.length > 2) {
        //             partner.partner.getObjectByName("leftHand").children[0].getWorldPosition(v2);
        //             console.log("왼손 자식1 좌표", v2)
        //             // if (partner.partner.children[0].children.length > 1) {
        //             //     partner.partner.getObjectByName("leftHand").children[0].children[1].getWorldPosition(v2);
        //             //     console.log("왼손 자식2 좌표", v2)
        //             // }
        //             partner.partner.getObjectByName("rightHand").getWorldPosition(v2);
        //             console.log("오른손 월드 좌표", v2)
        //             // partner.partner.getObjectByName("leftHand").getWorldPosition(v2);
        //             // this.box.min.add(v2);
        //             // this.box.max.add(v2);
        //         }
        //         // console.log("v2", v2);
        //         // console.log("box: ", this.box)
                
        //         if (this.box.intersectsSphere(sphere)) {//왼손이랑 닿았을때
        //             console.log("파트너 손 충돌");
        //             this.guitar.collided = true;
        //             this.collision.material.color.setHex(0x000000);
        //         }
        //         if(this.bButton == true && this.aButton == false){
        //             this.input = 1;
        //         }else if(this.aButton == true && this.bButton == false ) {
        //             this.input = 2;
        //         }else if(this.aButton == true && this.bButton == true ) {
        //             this.input = 3;
        //         }else{
        //             this.input = 4;
        //         }

        //     }
        // }

        if(this.bButton == true && this.aButton == false){
            this.input = 1;
        }else if(this.aButton == true && this.bButton == false ) {
            this.input = 2;
        }else if(this.aButton == true && this.bButton == true ) {
            this.input = 3;
        }else{
            this.input = 4;
        }

        console.log(this.isStroke);
        this.guitar.collided = this.isStroke;
        

        //자기자신 충돌 처리
        for(let g =0; g <controllers.length; g++){
            const controller = controllers[g];
            // controller.colliding = false;

            const { grip, gamepad } = controller;
            
            const sphere = {
            radius: 0.02,
            center: grip.position
            };
            this.box.setFromObject(this.guitar.children[0]);
            if(this.box.intersectsSphere(sphere)){
                //기타를 쳤다
                this.guitar.collided = true;
                console.log(this.guitar.collided)
                this.collision.material.color.setHex(0x000000);
            }


            if(this.bButton == true && this.aButton == false){
                this.input = 1;
            }else if(this.aButton == true && this.bButton == false ) {
                this.input = 2;
            }else if(this.aButton == true && this.bButton == true ){
                this.input = 3;
            }else{
                this.input = 4;
            }
        }

        if(this.guitar.collided) {
            this.collision.material.color.setHex(0x000000);
        }

        if(!this.guitar.collided && this.playing){
            //finish
            this.playing = false;
        }else if(this.guitar.collided && !this.playing) {
            this.playing = true;
            //소리 출력
            switch(this.input) {
                case 1:
                    if(this.aMajor.isPlaying){
                        this.aMajor.stop();
                    }
                    this.aMajor.play();
                    break;
                case 2:
                    if(this.cMajor.isPlaying){
                        this.cMajor.stop();
                    }
                    this.cMajor.play();
                    break;
                case 3:
                    if(this.fMajor.isPlaying){
                        this.fMajor.stop();
                    }
                    this.fMajor.play();
                    break;
                case 4:
                    if(this.gMajor.isPlaying){
                        this.gMajor.stop();
                    }
                    this.gMajor.play();
                    break;
                default:
                    break;
            }
        }

        
        return this.guitar.collided;
        
    }
}
export{Guitar};