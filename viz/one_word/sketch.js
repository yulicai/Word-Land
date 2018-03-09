/*
 * A simple example of loading font and displaying a 3D word in Three.js
 * Yuli Cai, 2018 March
 */

var camera, scene, scenelight, renderer;
init();


function init() {

    // Camera

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 800);


    // Scene

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    scene.fog = new THREE.Fog(0xf0f0f0, 0, 850);

    // Lighting

    scenelight = new THREE.AmbientLight(0x404040);
    scene.add(scenelight);


    // Loading font and its material

    var loader = new THREE.FontLoader();
    // Load the json file for this font from this path
    loader.load('fonts/Nunito_Sans_Light_Regular.json', function(font) {
        var color = 0x006699;
        var matLite = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 35,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });
        generateShapeFromText("hello",0,0,700,font,matLite);
       
    }); //end load function

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    animate();
} // end init

function generateShapeFromText(_word, _xpos, _ypos, _zpos, _font, mL) {
    var xMid, text;
    var textShape = new THREE.BufferGeometry();
    var shapes = _font.generateShapes(_word, 10, 1); //text,size,divisions
    var geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    geometry.translate(_xpos, _ypos, 0);
    // make shape ( N.B. edge view not visible )
    textShape.fromGeometry(geometry);
    text = new THREE.Mesh(textShape, mL);
    text.position.z = _zpos;
    scene.add(text);
}


function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function mapping(n, start1, stop1, start2, stop2) {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}
