/*
 * A simple example of a rotating box in three.js
 * Yuli Cai, 2018 March
 */

var camera, scene, scenelight, renderer;
var cube;
init();


function init() {

    // Camera

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000); // fieldOfView, aspectRatio, nearPlane, farPlane
    camera.position.set(0, 0, 7);


    // Scene

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0061ff);


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
    var current_time = Date.now() * 0.001;
    camera.position.z = 5 + 2.5*Math.cos(current_time);
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