/*
 * A simple example of a using pointlock control in three.js
 * Yuli Cai, 2018 March
 */

var camera, scene, scenelight, renderer,controls;
var cube;

var controlsEnabled = false;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

////////////////////////////////
//----- Pointer Lock --------//
////////////////////////////////

var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
if (havePointerLock) {
    var element = document.body;
    var pointerlockchange = function(event) {
        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
            controlsEnabled = true;
            controls.enabled = true;
            blocker.style.display = 'none';
        } else {
            controls.enabled = false;
            blocker.style.display = 'block';
            instructions.style.display = '';
        }
    };


    var pointerlockerror = function(event) {
        instructions.style.display = '';
    };

    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
    document.addEventListener('pointerlockerror', pointerlockerror, false);
    document.addEventListener('mozpointerlockerror', pointerlockerror, false);
    document.addEventListener('webkitpointerlockerror', pointerlockerror, false);
    
    instructions.addEventListener('click', function(event) {
        instructions.style.display = 'none';
        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();
    }, false);
} else {
    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}


init();



function init() {

    // Camera

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000); // fieldOfView, aspectRatio, nearPlane, farPlane
    camera.position.set(0, 0, 50);


    // Scene

    scene = new THREE.Scene();


    // Control system

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    // Lighting

    scenelight = new THREE.AmbientLight(0x404040);
    scene.add(scenelight);

    // Create a cube with width, height, and depth set to 1
    var geometry = new THREE.BoxGeometry(1, 1, 1);

    // Use a simple material with a specified hex color
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    // Combine the geometry and material into a mesh
    cube = new THREE.Mesh(geometry, material);

    // Add the mesh to the scene
    scene.add(cube);

    // Create the canvas with a renderer and tell the
    // renderer to clean up jagged aliased lines
    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Add the canvas to the DOM
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    animate();
} // end init


function animate() {
    // An animation loop that call itself recursively
    requestAnimationFrame(animate);
    render();
}

function render() {
    if (controlsEnabled === true) {
        var time = performance.now();
        var delta = (time - prevTime) / 1000;
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= velocity.y * 8.0 * delta;

        //Direction is polarized, either 1 or -1
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);
        direction.y = Number(moveDown) - Number(moveUp);
        direction.normalize(); // this ensures consistent movements in all directions
        if (moveForward || moveBackward) velocity.z -= direction.z * 200.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 200.0 * delta;
        if (moveUp || moveDown) velocity.y -= direction.y * 200 * delta;

        // More the control perspective
        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);
        prevTime = time;
    }
    var current_time = Date.now() * 0.001;
    // camera.position.z = 5 + 2.5 * Math.cos(current_time);
    // Rotate the object a bit each animation frame
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;
    renderer.render(scene, camera);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}



function onKeyDown(event) {
    switch (event.keyCode) {
        case 38: // up
            moveUp = true;
            break;
        case 87: // w
            moveForward = true;
            break;
        case 65: // a
            moveLeft = true;
            break;
        case 40: // down
            moveDown = true;
            break;
        case 83: // s
            moveBackward = true;
            break;
        case 68: // d
            moveRight = true;
            break;
    }
}


function onKeyUp(event) {
    switch (event.keyCode) {
        case 38: // up
            moveUp = false;
            break;
        case 87: // w
            moveForward = false;
            break;

        case 65: // a
            moveLeft = false;
            break;
        case 40: // down
            moveDown = false;
            break;
        case 83: // s
            moveBackward = false;
            break;

        case 68: // d
            moveRight = false;
            break;
    }
}

document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);