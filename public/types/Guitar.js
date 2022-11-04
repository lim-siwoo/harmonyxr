import * as THREE from '../build/three.module.js';
import { GLTFLoader } from '../libs/loaders/GLTFLoader.js';
// import { VRButton } from '../libs/VRButton';controllerModelFactory
// import { XRControllerModelFactory } from '../libs/XRControllerModelFactory.js';


class Guitar {

    constructor (camera){
        this.guitar = new THREE.Group();
        this.INTERSECTION;
        this.selected;

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
        
        this.guitarCollison = new THREE.Sphere((0.3,0,-0.1),1);
        // this.collision.material.color.setHex(0xffffff);
        // this.handCollison = new THREE.Sphere();

        this.collision.position.set(0.3,0,-0.1);
        this.collision.name = "collision";
        this.guitar.add(this.collision);

        this.guitarCollison.name = "guitarCollision";
        this.guitar.add(this.guitarCollison);

        
        
        this.v = new THREE.Vector3() // vector temp for compare collision
        
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
        // this.partner.add(this.head);
        })
        this.guitar.position.set(0.2,0,0);
        
    }

    onSelectStart() {

        // this.userData.isSelecting = true;
        this.collision.material.color.setHex(0x00ff00);

    }

    onSelectEnd() {

        // this.userData.isSelecting = false;
        this.collision.material.color.setHex(0xffffff);
    }

    handleCollisions(controllers, controller1, controller2) {
        // console.log("호출됨?");
        this.INTERSECTION = undefined;
        this.guitar.collided = false;

        // //안된다 왤까?
        // controller1.addEventListener( 'selectstart', this.onSelectStart );
		// controller1.addEventListener( 'selectend', this.onSelectEnd );
        // controller2.addEventListener( 'selectstart', this.onSelectStart );
		// controller2.addEventListener( 'selectend', this.onSelectEnd );

        
        

        // let collision = this.guitar.getObjectByName("collision");
        // this.box.getBoundingBox(this.guitarCollison);
        for(let g =0; g <controllers.length; g++){
            const controller = controllers[g];
            // controller.colliding = false;

            const { grip, gamepad } = controller;
            
            const sphere = {
            radius: 0.03,
            center: grip.position
            };
            this.box.setFromObject(this.guitar.children[0]);
            if(this.box.intersectsSphere(sphere)){
                //기타를 쳤다
                if(this.guitar.collided == false){
                    this.guitar.collided = true;
                    this.collision.material.color.setHex(0x000000);
                    this.INTERSECTION = true;
                    // const { grip, gamepad } = controller;

                    if(gamepad.buttons[5].pressed == true & gamepad.buttons[4].pressed == false){
                        // this.aMajor.stop();
                        if(this.aMajor.isPlaying){
                            this.aMajor.stop();
                        }
                        this.aMajor.play();
                    }else if(gamepad.buttons[4].pressed == true & gamepad.buttons[5].pressed == false)
                    {
                        // this.cMajor.stop();
                        if(this.cMajor.isPlaying){
                            this.cMajor.stop();
                        }
                        this.cMajor.play();
                    }else if(gamepad.buttons[4].pressed == true & gamepad.buttons[5].pressed == true){
                        if(this.fMajor.isPlaying){
                            this.fMajor.stop();
                        }
                        this.fMajor.play();
                    }else{
                        if(this.gMajor.isPlaying){
                            this.gMajor.stop();
                        }
                        this.gMajor.play();
                    }
                    
                }
                
            }
            else{
                this.guitar.collided = false;
                this.collision.material.color.setHex(0xffff00);
                this.INTERSECTION = false;
                if(this.aMajor.isPlaying){
                    // this.aMajor.stop();//ㅁㄹ 버그남
                }
            }
        }
    }
}
export{Guitar};