import * as THREE from './build/three.module.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { VRButton } from './libs/VRButton.js';
import { XRControllerModelFactory } from './libs/XRControllerModelFactory.js';
import { GLTFLoader } from './libs/loaders/GLTFLoader.js';
import { Networking } from './networking.js';

import { Drum } from './types/Drum.js';
import { PlayerData} from "./types/PlayerData.js";
import { MusicRoom} from "./types/MusicRoom.js";
import {Piano} from './types/Piano.js';

import { Guitar } from './types/Guitar.js';

let container;
let partners = new Array();
let camera, scene, renderer;
let controller1, controller2;
let controllerGrip1, controllerGrip2;
const box = new THREE.Box3();
let guitar;
// let guitarDummy = THREE.Object3D();

const controllers = [];
const oscillators = [];
let controls, group;
let audioCtx = null;
let sound;
let networking;

let drum;
let musicRoom;
let piano;
let aMajor, cMajor, fMajor, gMajor;

let listener = new THREE.AudioListener();
let v = new THREE.Vector3(); // vector temp for compare collision
let username = prompt('Enter username', Math.random().toString(36).substring(2, 12));
// minor pentatonic scale, so whichever notes is striked would be more pleasant
const musicScale = [0, 3, 5, 7, 10];

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x808080);

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10);
    camera.position.set(0, 1.6, 3);

    controls = new OrbitControls(camera, container);
    controls.target.set(0, 1.6, 0);
    controls.update();

    const floorGeometry = new THREE.PlaneGeometry(4, 4);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 1.0,
        metallicness: 0.0
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    // scene.add(floor);

    // scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

    const light = new THREE.DirectionalLight(0x090909);
    light.position.set(0, 6, 0);
    light.castShadow = true;
    light.shadow.camera.top = 2;
    light.shadow.camera.bottom = - 2;
    light.shadow.camera.right = 2;
    light.shadow.camera.left = - 2;
    light.shadow.mapSize.set(4096, 4096);
    scene.add(light);

    group = new THREE.Group();
    group.position.z = - 0.5;
    // scene.add(group);

    camera.add( listener );
    

    camera.add(listener);
    piano = new Piano(listener);
    console.log(piano.object);
    scene.add(piano.object);
    drum = new Drum(listener);
    scene.add(drum.scene);
    // console.log(drum.scene)
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));


    // controllers

    controller1 = renderer.xr.getController(0);
    scene.add(controller1);

    controller2 = renderer.xr.getController(1);
    scene.add(controller2);

    const controllerModelFactory = new XRControllerModelFactory();

    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.addEventListener('connected', controllerConnected);
    controllerGrip1.addEventListener('disconnected', controllerDisconnected);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);

    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.addEventListener('connected', controllerConnected);
    controllerGrip2.addEventListener('disconnected', controllerDisconnected);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);

    //ADD Instruments - Guitar

    window.addEventListener('resize', onWindowResize);

    networking = new Networking(partners, camera, controllerGrip1, controllerGrip2, roomname, username, scene);
    guitar = new Guitar(camera);
    guitar.guitar.visible = false;
    
    controllerGrip1.add(guitar.guitar);
    musicRoom = new MusicRoom(scene);
    musicRoom.addMusicRoom();
    musicRoom.addLight();
    musicRoom.AddNeonSticks();
}

function controllerConnected(evt) {

    controllers.push({
        gamepad: evt.data.gamepad,
        grip: evt.target,
        colliding: false,
        playing: false
    });

}

function controllerDisconnected(evt) {

    const index = controllers.findIndex(o => o.controller === evt.target);
    if (index !== - 1) {
        controllers.splice(index, 1);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
    renderer.setAnimationLoop(render);
}

function takeGuitar() {
    for(let g =0; g <controllers.length; g++){

        const controller = controllers[1];
                // controller.colliding = false;

        const { grip, gamepad } = controller;

        if(gamepad.buttons[0].pressed == true & gamepad.buttons[1].pressed == true){
            guitar.guitar.visible = true;
        }
        else{
            guitar.guitar.visible = false;
        }
    }
}

let cnt = 0;

function render() {
    musicRoom.LightTargetPattrol();
    musicRoom.NeonStickAnimation();
    takeGuitar();

    if(controllers.length){
        const { grip, gamepad} = controllers[0];
        guitar.aButton = gamepad.buttons[4].pressed;
        guitar.bButton = gamepad.buttons[5].pressed;
    }
    let isStroke = guitar.handleCollisions(partners, controllers);

    piano.handleCollisions(partners, controllers);

    // partnerCollisions(); 
    drum.handleCollisions(partners, controllers);
    if(cnt == 1 ) {
        cnt = 0;
        // 기타가 보이는지 정보 추가
        networking.broadcastToPlayers(guitar.guitar.visible, guitar.aButton, guitar.bButton, isStroke);
    }

    cnt++;
    renderer.render(scene, camera);
}