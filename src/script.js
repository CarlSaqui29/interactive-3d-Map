import './main.css'
import * as THREE from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

const lodingManager = new THREE.LoadingManager();

// responsible for pre-loader page
const preloadingPage = document.querySelector('.loader');
lodingManager.onLoad = function() {
    preloadingPage.style.display = 'none';
}

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
/////////////////////////////////////////////////////////////////////////
//// DRACO LOADER TO LOAD DRACO COMPRESSED MODELS FROM BLENDER
const dracoLoader = new DRACOLoader()
const loader = new GLTFLoader(lodingManager)
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })
loader.setDRACOLoader(dracoLoader)

/////////////////////////////////////////////////////////////////////////
///// DIV CONTAINER CREATION TO HOLD THREEJS EXPERIENCE
const container = document.createElement('div')
document.body.appendChild(container)

/////////////////////////////////////////////////////////////////////////
///// SCENE CREATION
const scene = new THREE.Scene()
scene.background = new THREE.Color('#c8f0f9')

/////////////////////////////////////////////////////////////////////////
///// RENDERER CONFIG
const renderer = new THREE.WebGLRenderer({ antialias: true}) // turn on antialias
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) //set pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight) // make it full screen
renderer.outputEncoding = THREE.sRGBEncoding // set color encoding
container.appendChild(renderer.domElement) // add the renderer to html div

/////////////////////////////////////////////////////////////////////////
///// CAMERAS CONFIG
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

/////////////////////////////////////////////////////////////////////////
///// SCENE LIGHTS
const ambient = new THREE.AmbientLight(0xa0a0fc, 0.82)
scene.add(ambient)

const sunLight = new THREE.DirectionalLight(0xe8c37b, .96)
sunLight.position.set(-69,44,14)
scene.add(sunLight)

/////////////////////////////////////////////////////////////////////////
///// LOADING GLB/GLTF MODEL FROM BLENDER
loader.load('models/gltf/MAPY.glb', function (gltf) {
    scene.add(gltf.scene);
    
})

introAnimation();
setOrbitControlsLimits();
rendeLoop();

function gotoLinnea() {
    new TWEEN.Tween(camera.position).to({
        x: -46,
        y: 6,
        z: -18
    }, 1800)
    .delay(100).easing(TWEEN.Easing.Quartic.InOut).start()
    .onComplete(function () {
        controls.enabled = true
        TWEEN.remove(this)
    })
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
    controls.minDistance = 10
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
        // gotoJasmine();
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
        // gotoJasmine();
    })
}

function rendeLoop() {
    labelRenderer.render(scene, camera);
    TWEEN.update() // update animations
    controls.update() // update orbit controls
    renderer.render(scene, camera) // render the scene using the camera
    requestAnimationFrame(rendeLoop) //loop the render function
}



// debugger - to be deleted
debugger
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