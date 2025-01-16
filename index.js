import * as THREE from "./lib/build/three.module.js";
import { PLANETS } from "./planetDB.js";
import { getSpaceShipData } from "./spaceship.js";
import { GLTFLoader } from "./lib/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "./lib/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from './lib/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from "./lib/examples/jsm/loaders/FontLoader.js";

var is_third_person = false;
const rotatingCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const thirdPersonCamera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);
var activeCamera = rotatingCamera; 

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();

var animation_speed = 1000;
var Frame = 24000;
var Planets = [];
var PlanetIndex = 1;
var MouseLocation = new THREE.Vector2();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

const loader = new THREE.TextureLoader();
const Cloader = new THREE.CubeTextureLoader();
const Floader = new FontLoader();
const gltfLoader = new GLTFLoader();
const controls = new OrbitControls(rotatingCamera, renderer.domElement);
const RandomSelectColor = [
    0x00FFFF,
    0x00FF00,
    0xFFCC00,
    0xE6E6FA,
    0xFF69B4,
    0xFF8C00,
    0xFFB6C1,
    0x00FFFF,
    0x87CEEB,
    0xA8FFB2,
    0xEE82EE,
    0xADD8E6
]

var satelite;
var spaceship_light;
var spaceship;
var sun;
var earth;
var font;

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function createText(name){
    let geo = new TextGeometry(name, {
        font: font,
        size: 10,
        depth: 0.1
    })

    geo.computeBoundingBox();
    const boundingBox = geo.boundingBox;
    const textWidth = boundingBox.max.x - boundingBox.min.x;

    geo.translate(-textWidth / 2, 0, 0);

    let mat = new THREE.MeshBasicMaterial({
        color: 0xFFCC00
    });
    return new THREE.Mesh(geo, mat);
}

function createPlanet(param){
    let tex = loader.load([param.texture]);
    let geo = new THREE.SphereGeometry(param.radius);
    let mat = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        map: tex
    });

    let group = new THREE.Group();
    let object = new THREE.Mesh(geo, mat);
    object.castShadow = true;
    object.receiveShadow = true;
    let data = {
        planet: object,
        distance: 640 - param.location.x,
        spin_speed_add: 0,
        is_hover: false
    };

    if(param.ring != undefined){
        let tex_ring = loader.load([param.ring.texture]);
        let geo_ring = new THREE.RingGeometry(param.ring.inner, param.ring.outer, param.ring.theta);
        let mat_ring = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            map: tex_ring
        });
        let ring = new THREE.Mesh(geo_ring, mat_ring);
        ring.rotateX(Math.PI / 2 + Math.random() * 0.2 - 0.1);
        ring.material.side = THREE.DoubleSide;
        ring.material.needsUpdate = true;
        // ring.rotateY(Math.PI / -6 * Math.random());
        ring.receiveShadow = true;
        ring.castShadow = false;
        ring.planetIndex = PlanetIndex;
        group.add(ring);
        data.ring = ring;
    };
    group.add(object);
    data.object = group;
    
    let text = createText(param.name);
    text.position.set(0, param.radius + 8, 0);
    group.add(text);
    data.text = text;

    group.position.set(param.location.x, param.location.y, param.location.z);
    
    object.planetIndex = PlanetIndex;

    scene.add(group);
    Planets.push(data);
    if(param.name == "Earth") earth = group;
    PlanetIndex++;
    return group;
}

function createSkyBox(){
    let skybox = Cloader.load([
        './src/assets/skybox/front.png',
        './src/assets/skybox/back.png',
        './src/assets/skybox/top.png',
        './src/assets/skybox/bottom.png',
        './src/assets/skybox/right.png',
        './src/assets/skybox/left.png'
    ])

    scene.background = skybox;
}

function createSpaceships(){
    gltfLoader.load('./src/assets/model/spaceship/scene.gltf', obj=>{
        spaceship = obj.scene;
        spaceship.receiveShadow = true;
        spaceship.castShadow = true;
        scene.add(spaceship);
    });
}

function createSun(){
    let tex = loader.load("./src/assets/textures/sun.jpg");
    let geo = new THREE.SphereGeometry(40);
    let mat = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        map: tex
    });

    let object = new THREE.Mesh(geo, mat);
    object.position.set(640, 0, 320);
    object.castShadow = false;
    object.receiveShadow = false;
    scene.add(object);
    
    object.planetIndex = 0;
    let data = {
        planet: object,
        object: object,
        distance: 0,
        spin_speed_add: 0,
        is_hover: false
    };
    
    let text = createText("Sun");
    text.position.set(640, 48, 320);
    data.text = text;

    scene.add(text);
    Planets.push(data);
    return object;
}

function createSatelite(){
    let geo = new THREE.CylinderGeometry(1, 0.5, 0.4, 8);
    let mat = new THREE.MeshStandardMaterial({
        color: 0xCCCCCC,
        metalness: 0.5,
        roughness: 0.5
    });

    let object = new THREE.Mesh(geo, mat);
    object.castShadow = false;
    object.receiveShadow = true;
    scene.add(object);
    return object;
}

function initialize(){
    rotatingCamera.position.set(640, 240, 480);
    rotatingCamera.lookAt(640, 0, 320);
    controls.update();
    // camera.rotateZ(Math.PI / 2);

    satelite = createSatelite();
    createSpaceships();
    
    Floader.load('./lib/examples/fonts/gentilis_regular.typeface.json', fonts=>{
        font = fonts;
        sun = createSun();
        Object.keys(PLANETS).forEach(id =>{
            createPlanet(PLANETS[id]);
            console.log("Load Planet: " + PLANETS[id].name);
        })
    })

    let pointL = new THREE.PointLight(0xFFFFFF, 1, 1280, 0.01);
    pointL.castShadow = true;
    pointL.position.set(640, 0, 320);

    spaceship_light = new THREE.SpotLight(0xFFFFFF, 8, 8, Math.PI, 0.2, 0.6);
    spaceship_light.castShadow = true;
    spaceship_light.position.set(0, 326, 0);

    
    scene.add(pointL);
    scene.add(spaceship_light);
    
    createSkyBox();
}

function animate(){
    for(let i = 0; i< Planets.length; i++){
        let data = Planets[i];
        if(i > 0){
            data.object.position.set(Math.sin(Frame / (animation_speed * (10-i))) * data.distance + 640, Math.sin(Frame / (animation_speed * (10-i))) * 50 - 30, Math.cos(Frame / (animation_speed * (10-i))) * data.distance + 320);
        }
        data.object.rotateY((1+ i) / animation_speed + data.spin_speed_add);
        
        if(!is_third_person && data.is_hover){
            data.text.visible = true;
            data.text.lookAt(rotatingCamera.position.x, 0, rotatingCamera.position.z);
            if(Frame % 120 == 0){
                let color = RandomSelectColor[parseInt(Math.random() * 12)];
                data.planet.material.color.set(color);
                if(data.ring != undefined) data.ring.material.color.set(color);
            }
        }else{
            data.text.visible = false;
            data.planet.material.color.set(0xFFFFFF);
            if(data.ring != undefined) data.ring.material.color.set(0xFFFFFF);
        }
        if(data.spin_speed_add > 0.0) data.spin_speed_add -= 0.00025;
        data.is_hover = false;
    }
    if(sun != undefined) sun.rotateY(0.001);
    let spaceshipData = getSpaceShipData();
    
    thirdPersonCamera.position.set(
        lerp(thirdPersonCamera.position.x, spaceshipData.position.x - Math.sin(spaceshipData.rotation.y) * 16, 0.1), 
        lerp(thirdPersonCamera.position.y, spaceshipData.position.y + 16, 0.5), 
        lerp(thirdPersonCamera.position.z, spaceshipData.position.z - Math.cos(spaceshipData.rotation.y) * 16, 0.1)
    );
    thirdPersonCamera.lookAt(spaceshipData.position.x, spaceshipData.position.y, spaceshipData.position.z);

    if(spaceship != undefined){
        spaceship.position.set(spaceshipData.position.x, spaceshipData.position.y, spaceshipData.position.z);
        spaceship.rotation.set(spaceshipData.rotation.x, spaceshipData.rotation.y, spaceshipData.rotation.z);
        
        
        spaceship_light.position.set(spaceshipData.position.x, spaceshipData.position.y + 6, spaceshipData.position.z);
    }

    if(satelite != undefined && earth != undefined){
        satelite.position.set(Math.sin(Frame / 900) * 8 + earth.position.x, Math.sin(Frame / 600) * 8 + earth.position.y, Math.cos(Frame / 800) * 8 + earth.position.z);
        satelite.rotateY(0.002);
        satelite.rotateX(0.001);
        satelite.rotateZ(0.0006);
    }

    if(!is_third_person){
        raycaster.setFromCamera(MouseLocation, rotatingCamera);

        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            const selectedObject = intersects[0].object;
            if(selectedObject.planetIndex != undefined){
                Planets[selectedObject.planetIndex].is_hover = true;
            }
            
        }
    }


    renderer.render(scene, activeCamera);
    Frame++;
}

function render(){
    renderer.setAnimationLoop(animate);

    document.body.appendChild(renderer.domElement);
};

window.onload = () =>{
    initialize();

    render();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    controls.update();
});

window.addEventListener('keydown', event=> {
    switch (event.key){
        case 'r':
        case 'R':
            is_third_person = !is_third_person;
            if(is_third_person){
                activeCamera = thirdPersonCamera;
            }else{
                activeCamera = rotatingCamera;
            }
            break;
        case 'z':
        case 'Z':
            animation_speed *= 5;
            break;
        case 'x':
        case 'X':
            animation_speed = 1000;
            break;
        case 'c':
        case 'C':
            animation_speed /= 5;
            break;
    }
});


window.addEventListener('mousemove', event=>{
    MouseLocation.x = (event.clientX / window.innerWidth) * 2 - 1;
    MouseLocation.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
window.addEventListener('click', event=>{
    if(!is_third_person){
        raycaster.setFromCamera(MouseLocation, rotatingCamera);

        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            const selectedObject = intersects[0].object;
            if(selectedObject.planetIndex != undefined){
                Planets[selectedObject.planetIndex].spin_speed_add = 0.1;
                Planets[selectedObject.planetIndex].is_hover = true;
            }
        }
    }
});