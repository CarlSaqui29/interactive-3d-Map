import './main.css'
import * as THREE from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { gsap } from "gsap";

// pre-loding page
const lodingManager = new THREE.LoadingManager();
const preloadingPage = document.querySelector('.loader');
lodingManager.onLoad = function() {
    preloadingPage.style.visibility = 'hidden';
}

// visit models methods
const jasmine_btn = document.querySelector('#jasmine_btn');
jasmine_btn.onclick = function() { show_jasmine_model() };

// modals instance
var linnea_modal = new bootstrap.Modal(document.getElementById('linnea_modal'), {
    keyboard: false
})
var jasmine_modal = new bootstrap.Modal(document.getElementById('jasmine_modal'), {
    keyboard: false
})
var club_house = new bootstrap.Modal(document.getElementById('club_house'), {
    keyboard: false
})

// draco loader to compress 3d model
const dracoLoader = new DRACOLoader()
const loader = new GLTFLoader(lodingManager)
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })
loader.setDRACOLoader(dracoLoader)

// add div to append 3d model
const container = document.createElement('div')
document.body.appendChild(container)
// setting scene cbg color
const scene = new THREE.Scene()
scene.background = new THREE.Color('#c8f0f9')

/////////////////////////////////////////////////////////////////////////
///// RENDERER CONFIG
const renderer = new THREE.WebGLRenderer({ antialias: true}) // turn on antialias
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) //set pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight) // make it full screen
renderer.outputEncoding = THREE.sRGBEncoding // set color encoding
container.appendChild(renderer.domElement) // add the renderer to html div

// set camera
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 500)
camera.position.set(34,16,-20)
scene.add(camera)

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

/////////////////////////////////////////////////////////////////////////
///// MAKE EXPERIENCE FULL SCREEN
window.addEventListener('resize', () => {
    const width = window.innerWidth
    const height = window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    renderer.setPixelRatio(2)
    labelRenderer.setSize(this.window.innerWidth, this.window.innerHeight);
})

/////////////////////////////////////////////////////////////////////////
///// CREATE ORBIT CONTROLS
const controls = new OrbitControls(camera, labelRenderer.domElement)

load_gltf('models/gltf/MAPY.glb', 0);
setup_lighting();
introAnimation();
setOrbitControlsLimits();
rendeLoop();

function setup_lighting() {
    const ambient = new THREE.AmbientLight(0xa0a0fc, 0.82)
    scene.add(ambient)

    const sunLight = new THREE.DirectionalLight(0xe8c37b, .96)
    sunLight.position.set(-69,44,14)
    scene.add(sunLight)
}

function gotoLinnea() {
    gsap.to(controls.target,{x: -40, y: 2, z: -5, duration: 2, ease: 'power3.inOut'})
    gsap.to(camera.position,{x: -48, y: 9, z: -21, duration: 2, ease: 'power3.inOut'})
}

function gotoJasmine() {
    gsap.to(controls.target,{x: -15, y: 9, z: -20, duration: 2, ease: 'power3.inOut'})
    gsap.to(camera.position,{x: -25, y: 9, z: -20, duration: 2, ease: 'power3.inOut'})
}

function gotoClubhouse() {
    gsap.to(controls.target,{x: -15, y: 2, z: -10, duration: 2, ease: 'power3.inOut'})
    gsap.to(camera.position,{x: -46, y: 6, z: -22, duration: 2, ease: 'power3.inOut'})
}

function introAnimation() {
    controls.enabled = false //disable orbit controls to animate the camera
    new TWEEN.Tween(camera.position.set(64,26,7)).to({ // from camera position
        x: -65, //desired x position to go
        y: 17, //desired y position to go
        z: -41 //desired z position to go
    }, 6500) // time take to animate
    .delay(3000).easing(TWEEN.Easing.Quartic.InOut).start() // define delay, easing
    .onComplete(function () { //on finish animation
        controls.enabled = true //enable orbit controls
        //setOrbitControlsLimits() //enable controls limits
        TWEEN.remove(this) // remove the animation from memory
        renderButtons();
    })
    
}

function setOrbitControlsLimits(){
    controls.minDistance = 1
    controls.maxDistance = 150
    controls.enableRotate = true
    controls.enableZoom = true
    controls.maxPolarAngle = Math.PI /2.2
}

function renderButtons() {
    // linnea btn
    const linnea_p = document.createElement('p');
    linnea_p.className = 'tooltip show';
    linnea_p.textContent = 'Linnea Model'
    const linnea_Container = document.createElement('div');
    linnea_Container.appendChild(linnea_p);
    linnea_Container.style.cursor = "pointer";
    const linnea_PointLabel = new CSS2DObject(linnea_Container);
    linnea_PointLabel.position.set(-41, 6, -13.5);
    scene.add(linnea_PointLabel);
    linnea_Container.addEventListener('pointerdown', () => { 
        linnea_modal.toggle();
        gotoLinnea();
    })

    // jasmine btn
    const jasmine_p = document.createElement('p');
    jasmine_p.className = 'tooltip show';
    jasmine_p.textContent = 'Jasmine Model'
    const jasmine_Container = document.createElement('div');
    jasmine_Container.appendChild(jasmine_p);
    jasmine_Container.style.cursor = "pointer";
    const jasmine_PointLabel = new CSS2DObject(jasmine_Container);
    jasmine_PointLabel.position.set(-4, 6, -22);
    scene.add(jasmine_PointLabel);
    jasmine_Container.addEventListener('pointerdown', () => { 
        jasmine_modal.toggle();
        gotoJasmine();
    })

    // clubhouse btn
    const cb_p = document.createElement('p');
    cb_p.className = 'tooltip show';
    cb_p.textContent = 'CPR Information'
    const cb_Container = document.createElement('div');
    cb_Container.appendChild(cb_p);
    cb_Container.style.cursor = "pointer";
    const cb_PointLabel = new CSS2DObject(cb_Container);
    cb_PointLabel.position.set(-33, 6, -19);
    scene.add(cb_PointLabel);
    cb_Container.addEventListener('pointerdown', () => { 
        club_house.toggle();
        gotoClubhouse();
    })
}

function renderButtons_jasmine() {
    // jasmine btn
    const jasmine_p = document.createElement('p');
    jasmine_p.className = 'tooltip show';
    jasmine_p.textContent = 'Go Back to CPR Map'
    const jasmine_Container = document.createElement('div');
    jasmine_Container.appendChild(jasmine_p);
    jasmine_Container.style.cursor = "pointer";
    const jasmine_PointLabel = new CSS2DObject(jasmine_Container);
    jasmine_PointLabel.position.set(-10, 10, 13.5);
    scene.add(jasmine_PointLabel);
    jasmine_Container.addEventListener('pointerdown', () => { 
        remove_current_model();
        setup_lighting();
        preloadingPage.style.visibility = 'visible';
        load_gltf('models/gltf/MAPY.glb', 0);
        introAnimation();
    })
}

function rendeLoop() {
    console.log(camera.position)
    // document.getElementById("cameraPos").innerHTML = camera.position;
    labelRenderer.render(scene, camera);
    TWEEN.update() // update animations
    controls.update() // update orbit controls
    renderer.render(scene, camera) // render the scene using the camera
    requestAnimationFrame(rendeLoop) //loop the render function
}
function load_gltf(path, Ypos) {
    loader.load(path, function (gltf) {
        scene.add(gltf.scene);
        gltf.scene.position.setY(Ypos);
    })
}
function remove_current_model() {
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
}

function show_jasmine_model() {
    jasmine_modal.toggle();
    remove_current_model();
    setup_lighting();
    preloadingPage.style.visibility = 'visible';
    load_gltf('models/gltf/jasmine_interior.glb', 8)
    gsap.to(camera.position,{x: 25, y: 12, z: 22, duration: 5, ease: 'power3.inOut'})
    renderButtons_jasmine()
    // gsap.to(controls.target,{x: 0, y: 0, z: 100, duration: 2, ease: 'power3.inOut'})
    // gsap.to(camera.position,{x: 0, y: 7, z: -18, duration: 5, ease: 'power3.inOut'})
}


import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js'
const gui = new GUI()

// create parameters for GUI
var params = {color: sunLight.color.getHex(), color2: ambient.color.getHex(), color3: scene.background.getHex()}

// create a function to be called by GUI
const update = function () {
	var colorObj = new THREE.Color( params.color )
	var colorObj2 = new THREE.Color( params.color2 )
	var colorObj3 = new THREE.Color( params.color3 )
	sunLight.color.set(colorObj)
	ambient.color.set(colorObj2)
	scene.background.set(colorObj3)
}

//////////////////////////////////////////////////
//// GUI CONFIG
gui.add(sunLight, 'intensity').min(0).max(10).step(0.0001).name('Dir intensity')
gui.add(sunLight.position, 'x').min(-100).max(100).step(0.00001).name('Dir X pos')
gui.add(sunLight.position, 'y').min(0).max(100).step(0.00001).name('Dir Y pos')
gui.add(sunLight.position, 'z').min(-100).max(100).step(0.00001).name('Dir Z pos')
gui.addColor(params,'color').name('Dir color').onChange(update)
gui.addColor(params,'color2').name('Amb color').onChange(update)
gui.add(ambient, 'intensity').min(0).max(10).step(0.001).name('Amb intensity')
gui.addColor(params,'color3').name('BG color').onChange(update)

//////////////////////////////////////////////////
//// ON MOUSE MOVE TO GET CAMERA POSITION
document.addEventListener('mousemove', (event) => {
    event.preventDefault()

    console.log(camera.position)

}, false)