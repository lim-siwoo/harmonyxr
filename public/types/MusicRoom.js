import * as THREE from '../build/three.module.js';
import { GLTFLoader } from '../libs/loaders/GLTFLoader.js';


class MusicRoom {
    constructor(scene) {
        this.scene = scene;

        this.spotLightR= new THREE.SpotLight(0xff0000, 5, 30, Math.PI * 0.1, 0.1, 2);
        this.spotLightG = new THREE.SpotLight(0x00ff00, 5, 30, Math.PI * 0.1, 0.1,2);
        this.spotLightB = new THREE.SpotLight(0x0000ff, 5, 30, Math.PI * 0.1, 0.1, 2);
        
        this.spotLightW1 = new THREE.SpotLight(0xffffff, 7, 30, Math.PI * 0.05, 0.1, 2);
        this.spotLightW2 = new THREE.SpotLight(0xffffff, 7, 30, Math.PI * 0.05, 0.1, 2);
        this.spotLightW3 = new THREE.SpotLight(0xffffff, 7, 30, Math.PI * 0.05, 0.1, 2);
        this.spotLightW4 = new THREE.SpotLight(0xffffff, 7, 30, Math.PI * 0.05, 0.1, 2);
        
        
        this.LightArray = new Array();
        this.LightArray.push(this.spotLightR);
        this.LightArray.push(this.spotLightG);
        this.LightArray.push(this.spotLightB);
        
        this.LightArray.push(this.spotLightW1);
        this.LightArray.push(this.spotLightW2);
        this.LightArray.push(this.spotLightW3);
        this.LightArray.push(this.spotLightW4);
        

        this.pattrolPatternX = 0;
        this.circlePattern1 = [0,0];
        this.circlePattern2 = [0,0];
        this.circlePattern3 = [0,0];
        this.circlePattern4 = [0,0];
        this.pattrolFlag = 1;
        this.time = 0;
        this.neonStickAngle = 0;

        this.neonGroup1 = new THREE.Group();
        this.neonGroup2 = new THREE.Group();

    }

    addMusicRoom() 
    {
        const loader = new GLTFLoader().setPath('/resources/MusicRoom/');
        loader.load('scene.gltf', (gltf) => {
            gltf.scene.scale.set(0.8,0.8,0.8);
            gltf.scene.position.set(0, -0.5, 0); 
            this.scene.add( gltf.scene );
        })
    
    }
    
    addLight()
    {
        this.spotLightR.position.set(  3, 3, 2.5 );
        this.spotLightG.position.set(  0, 3, 2.5 );
        this.spotLightB.position.set( -3, 3, 2.5 );
    
        this.spotLightW1.position.set(-3,3,0.5);
        this.spotLightW2.position.set(-1,3,0.5);
        this.spotLightW3.position.set( 1,3,0.5);
        this.spotLightW4.position.set( 3,3,0.5);
    
        for(let i=0; i < this.LightArray.length; i++)
        {
            this.LightArray[i].castShadow = true;
            this.LightArray[i].shadow.mapSize.width = 1;
            this.LightArray[i].shadow.mapSize.height = 1;
    
            this.LightArray[i].shadow.camera.near = 50;
            this.LightArray[i].shadow.camera.far = 400;
            this.LightArray[i].shadow.camera.fov = 30;
            this.scene.add( this.LightArray[i] );
        }
    
    
        const loader = new GLTFLoader().setPath('/resources/hand/');
        loader.load('scene.gltf', (gltf) => {
        gltf.scene.scale.set(0.01, 0.01, 0.01);
        gltf.scene.position.set(0,3,5); 
        this.scene.add( gltf.scene );
        })
    
    }
    
    AddNeonSticks()
    {
        const loader = new GLTFLoader().setPath('/resources/neonstick/');
        // loader.load('scene.gltf', (gltf) => {
        // this.neonStick = new THREE.Object3D();
        // gltf.scene.scale.set(0.8,0.2,0.8);
        // gltf.scene.rotation.set(0,0,0);
        // this.neonStick.add(gltf.scene);
        // this.neonStick.position.set(1,1,1);
        // this.neonStick.rotation.set(0.15,0,0);
        // this.neonGroup1.add(this.neonStick);
        // })

        // loader.load('scene.gltf', (gltf) => {
        //     this.neonStick = new THREE.Object3D();
        //     gltf.scene.scale.set(0.8,0.2,0.8);
        //     gltf.scene.rotation.set(0,0,0);
        //     this.neonStick.add(gltf.scene);
        //     this.neonStick.position.set(3,1,3);
        //     this.neonStick.rotation.set(0.15,0,0);
        //     this.neonGroup1.add(this.neonStick);

        // })
    
        
        for(let i=0; i<3; i++)
        {
            for(let j=0; j<10; j++)
            {
                this.neonStick = new THREE.Object3D();
    
                loader.load('scene.gltf', (gltf) => {
    
                    if(j%2==0)
                    {
                        gltf.scene.scale.set(0.8,0.2,0.8);
                        gltf.scene.rotation.set(0,0,0);
                        this.neonStick.add(gltf.scene);
                        this.neonStick.position.set(j-4+0.1, 0, i+3);
                        this.neonStick.rotation.set(0.15,0,0);
                    }

                    else
                    {
                        gltf.scene.scale.set(0.8,0.2,0.8);
                        gltf.scene.rotation.set(0,0,0);
                        this.neonStick.add(gltf.scene);
                        this.neonStick.position.set(j-5, 0, i+3);
                        this.neonStick.rotation.set(0.15,0,0);

                    }
                    
                    this.neonGroup1.add(this.neonStick);
                    })
            }

            for(let k=0; k<10; k++)
            {            
                this.neonStick = new THREE.Object3D();

                loader.load('scene.gltf', (gltf) => {
                
                    if(k%2==0)
                    {
                        gltf.scene.scale.set(0.8,0.2,0.8);
                        gltf.scene.rotation.set(0,0,0);
                        this.neonStick.add(gltf.scene);
                        this.neonStick.position.set(k-3+0.1, 0, i+3);
                        this.neonStick.rotation.set(-0.15,0,0);
                    }
    
                    else
                    {
                        gltf.scene.scale.set(0.8,0.2,0.8);
                        gltf.scene.rotation.set(0,0,0);
                        this.neonStick.add(gltf.scene);
                        this.neonStick.position.set(k-4, 0, i+3);
                        this.neonStick.rotation.set(-0.15,0,0);
    
                    }
                    
                    this.neonGroup2.add(this.neonStick);
                })
            }
        }
    
        this.scene.add(this.neonGroup1);
        this.scene.add(this.neonGroup2);
    }
    
    LightTargetPattrol()
    {
        if(this.pattrolPatternX < -5)
        {
            this.pattrolFlag = 1;
        }
    
        else if(this.pattrolPatternX > 5)
        {
            this.pattrolFlag = -1;
        }
    
        this.pattrolPatternX = this.pattrolPatternX + 0.1*this.pattrolFlag;
    
        // for(let i=0; i< 3; i++)
        // {
            this.LightArray[1].target.position.x = this.pattrolPatternX;
            this.scene.add(this.LightArray[1].target );
        // }
    
        this.time = this.time + 0.1;
        this.circlePattern1[0] = -1 + 1 * Math.cos(this.time);
        this.circlePattern1[1] =  0 + 1 * Math.sin(this.time);
        this.spotLightW1.target.position.x = this.circlePattern1[0];
        this.spotLightW1.target.position.z = this.circlePattern1[1];
    
        this.spotLightR.target.position.x = this.circlePattern1[0];
        this.spotLightR.target.position.z = this.circlePattern1[1];
        this.scene.add(this.spotLightW1.target );
        this.scene.add(this.spotLightR.target );
    
        this.circlePattern2[0] = 0 + 1 * Math.cos(this.time)*-1;
        this.circlePattern2[1] = 0 + 1 * Math.sin(this.time)*-1;
        this.spotLightW2.target.position.x = this.circlePattern2[0];
        this.spotLightW2.target.position.z = this.circlePattern2[1];
        this.scene.add(this.spotLightW2.target );
    
    
        this.circlePattern3[0] = 1 + 1 * Math.cos(this.time*-1);
        this.circlePattern3[1] = 0 + 1 * Math.sin(this.time*-1);
        this.spotLightW3.target.position.x = this.circlePattern3[0];
        this.spotLightW3.target.position.z = this.circlePattern3[1];
        
        this.spotLightB.target.position.x = this.circlePattern3[0];
        this.spotLightB.target.position.z = this.circlePattern3[1];
    
        this.scene.add(this.spotLightW3.target );
        this.scene.add(this.spotLightB.target );
    // 
    // 
        this.circlePattern4[0] = 2 + 1 * Math.cos(this.time*-1)*-1;
        this.circlePattern4[1] = 0 + 1 * Math.sin(this.time*-1)*-1;
        this.spotLightW4.target.position.x = this.circlePattern4[0];
        this.spotLightW4.target.position.z = this.circlePattern4[1];
        this.scene.add(this.spotLightW4.target );
    
        
        // console.log (circlePattern1[0] + " " + circlePattern1[1]);
    }
    
    NeonStickAnimation()
    {
        if(this.neonStickAngle > 0.7)
        {
            this.pattrolFlag = -1;
        }          
    
        else if(this.neonStickAngle < 0.5)
        {
            this.pattrolFlag = 1;
        }

        this.neonStickAngle = this.neonStickAngle + 0.1*this.pattrolFlag;
        this.neonGroup1.position.set(0,this.neonStickAngle,0);
        this.neonGroup2.position.set(0,1+this.neonStickAngle*-1,0);
    
    }        
}

export { MusicRoom }

