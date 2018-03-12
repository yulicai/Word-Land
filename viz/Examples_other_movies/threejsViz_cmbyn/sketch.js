/*
 *  Word Land  -  A 3D visualization for movie script and word2vec
 *  Yuli Cai
 *  2018
 */



const current_movie = "Call Me by Your Name";
const path_to_file = "call_me_by_your_name_3d_vector_result.json";

var camera, scene, scenelight, renderer, controls;
var cameraSpeed = 0;

const mapping_range = 500.;

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
var controlsEnabled = false;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;
var onAmerica = false;
var onPeace = false;


////////////////////////////////
//----- Control Speed --------//
////////////////////////////////

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
const time2find = 100;
var counter = 100;



////////////////////////////////
//----- Text Data --------//
////////////////////////////////

var data;
var words_array;
var word1, word2;
var word1Pos = { x: 0, y: 0, z: 0 };
var word2Pos = { x: 0, y: 0, z: 0 };
var speed2word1, speed2word2;

preload();



////////////////////////////////
//----- Preload --------//
////////////////////////////////

// Load JSON data file
function preload() {
    var xobj = new XMLHttpRequest();
    xobj.open('GET', path_to_file);
    xobj.responseType = "json";
    xobj.send();
    xobj.onload = function() {
        data = xobj.response;
        init();
    }
}


////////////////////////////////
//----- INIT --------//
////////////////////////////////


function init() {

    var textColor = 0xeebd49;
    var textOutlineColor = 0x6600ff;
    var bgColor = 0x0f5b9e;
    var lightColor = 0xffffff;


    // Save all the words in an array
    words_array = Object.keys(data);

    // Get the data from two high light words
    word1 = "elio";
    word2 = "oliver"
    word1Pos.x = data[word1][0];
    word1Pos.y = data[word1][1];
    word1Pos.z = data[word1][2];
    word1Pos.x = Math.floor(mapping(word1Pos.x, -17., 18., -mapping_range/2, mapping_range));
    word1Pos.y = Math.floor(mapping(word1Pos.y, -17., 18.,  -mapping_range/2, mapping_range));
    word1Pos.z = Math.floor(mapping(word1Pos.z, -17., 18., -mapping_range/2., mapping_range));


    word2Pos.x = data[word2][0];
    word2Pos.y = data[word2][1];
    word2Pos.z = data[word2][2];
    word2Pos.x = Math.floor(mapping(word2Pos.x, -17., 18.,-mapping_range/2., mapping_range));
    word2Pos.y = Math.floor(mapping(word2Pos.y, -17., 18., -mapping_range/2., mapping_range));
    word2Pos.z = Math.floor(mapping(word2Pos.z, -17., 18., -mapping_range/2., mapping_range));
    // Calculate the distance between this two words
    var _diff = (diff(word1Pos.x, word1Pos.y, word1Pos.z, word2Pos.x, word2Pos.y, word2Pos.z)).toFixed(2);
    document.getElementById("text_info").innerHTML = "In the movie " + current_movie + " <br /> <span style=\"color:#ff5935; font-size:17px\">" + word1 + " </span> and <span style=\"color:#ff5935; font-size:17px\"> " + word2 + " </span> <br /> are <span style=\"color:#ff5935\">" + _diff + " </span> pixels <br /> away from each other.";


    // Initials for THREE.JS

    //Set up Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, -0, 800);

    // Set up a new scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);
    // scene.background = new THREE.Color(0xf0f0f0);
    scene.fog = new THREE.Fog(bgColor, 0, 850);

    // Control system
    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    // Lighting
    // scenelight = new THREE.AmbientLight(0x404040);
    scenelight = new THREE.AmbientLight(lightColor);
    scene.add(scenelight);


    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    // Load word with font
    var loader = new THREE.FontLoader();
    loader.load('fonts/helvetiker_regular.typeface.json', function(font) {
        // var color = 0x006699; // Main text color 
        // Material 1
        var matDark = new THREE.LineBasicMaterial({
            color: textOutlineColor,
            linewidth: 4,
            side: THREE.DoubleSide
        });
        // Material 2
        var matLite = new THREE.MeshPhongMaterial({
            color: textColor,
            shininess: 35,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        // Material 3
        var specialMat = new THREE.MeshPhongMaterial({
            color: 0xf45342,
            side: THREE.DoubleSide,
            shininess: 35,
            transparent: true,
            opacity: 0.8
        });
        // Go through the data array and create a three.js mesh from each word
        for (var i = 0; i < words_array.length; i++) {
            var message = words_array[i];
            var x = (data[message][0]);
            var y = (data[message][1]);
            var z = (data[message][2]);
            // var z = getRandomArbitrary(0.,400)
            var mappedX = Math.floor(mapping(x, -17., 18., -mapping_range/2., mapping_range));
            var mappedY = Math.floor(mapping(y, -17., 18., -mapping_range/2., mapping_range));
            var mappedZ = Math.floor(mapping(z, -17., 18., -mapping_range/2., mapping_range));
            // Main function to generate three.js mesh from a word
            if (message == word1 || message == word2) generateShapeFromText(message, mappedX, mappedY, mappedZ, font, matDark, specialMat);
            else generateShapeFromText(message, mappedX, mappedY, mappedZ, font, matDark, matLite);
        }
    }); //end load function

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    animate();
} // end init



////////////////////////////////
//- Generate Mesh from word --//
////////////////////////////////

function generateShapeFromText(_word, _xpos, _ypos, _zpos, _font, mD, mL) {
    var xMid, text;
    var textShape = new THREE.BufferGeometry();

    var shapes = _font.generateShapes(_word, 10, 1); //text,size,divisions
    // Create a new geometry from the font shape
    var geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    // xMid = _pos - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    // geometry.translate(xMid, 0, 0);
    geometry.translate(_xpos, _ypos, 0);

    // make shape ( N.B. edge view not visible )
    textShape.fromGeometry(geometry);
    // Apply material with geometry
    text = new THREE.Mesh(textShape, mL);
    text.position.z = _zpos;
    scene.add(text);

    var lineText = new THREE.Object3D();
    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        var points = shape.getPoints();
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.translate(_xpos, _ypos, 0);
        var lineMesh = new THREE.Line(geometry, mD);
        lineMesh.position.z = _zpos;
        lineText.add(lineMesh);
    }
    scene.add(lineText);
}


////////////////////////////////
//----- Animate --------------//
////////////////////////////////

function animate() {
    requestAnimationFrame(animate);
    render();
}



////////////////////////////////
//----- Render --------------//
////////////////////////////////

function render() {
    if (controlsEnabled === true) {
        var time = performance.now();
        var delta = (time - prevTime) / 1000;
        velocity.x -= velocity.x * 5.0 * delta;
        velocity.z -= velocity.z * 1.0 * delta;
        velocity.y -= velocity.y * 5.0 * delta;
        // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        //Direction is polarized, either 1 or -1
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);
        direction.y = Number(moveDown) - Number(moveUp);
        direction.normalize(); // this ensures consistent movements in all directions
        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
        if (moveUp || moveDown) velocity.y -= direction.y * 400 * delta;

        // More the control perspective
        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);

        // Go find word1
        if (onAmerica) {
            if (counter > 0) {
                controls.getObject().translateX(speed2word1.x);
                controls.getObject().translateY(speed2word1.y);
            } else {
                counter = time2find;
                onAmerica = false;
            }
            counter--;
        }
        // Go find word2
        if (onPeace) {
            if (counter > 0) {
                controls.getObject().translateX(speed2word2.x);
                controls.getObject().translateY(speed2word2.y);
            } else {
                counter = time2find;
                onPeace = false;
            }
            counter--;
        }
        prevTime = time;
    }

    renderer.render(scene, camera);
}


function onKeyDown(event) {
    switch (event.keyCode) {
        case 38: // up
            moveUp = true;
            break;
        case 87: // w
            moveForward = true;
            break;
        case 37: // left
            onAmerica = false;
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
        case 39: // right
            onPeace = false;
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
        case 37: // left
            onAmerica = true;
            var currentX = controls.getObject().position.x;
            var currentY = controls.getObject().position.y;
            // var currentZ = controls.getObject().position.z;
            var diff_word1_x = word1Pos.x - currentX;
            var diff_word1_y = word1Pos.y - currentY;
            // var diff_word1_z = word1Pos.z - currentZ;

            document.getElementById("movie_info").style.visibility = "visible";

            if (Math.abs(diff_word1_y) < 5 && Math.abs(diff_word1_x) < 5) speed2word1 = { x: 0, y: 0 };
            else speed2word1 = { x: diff_word1_x / counter, y: diff_word1_y / counter };
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
        case 39: // right
            onPeace = true;
            var currentX = controls.getObject().position.x;
            var currentY = controls.getObject().position.y;
            // var currentZ = controls.getObject().position.z;
            var diff_word2_x = word2Pos.x - currentX;
            var diff_word2_y = word2Pos.y - currentY;
            // var diff_word2_z = word2Pos.z - currentZ;
            // document.getElementById("movie_info").style.visibility = "visible";
            if (Math.abs(diff_word2_y) < 5 && Math.abs(diff_word2_x) < 5) speed2word2 = { x: 0, y: 0 };
            else speed2word2 = { x: diff_word2_x / counter, y: diff_word2_y / counter };
            break;
        case 68: // d
            moveRight = false;
            break;
    }
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

function diff(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2));
}

// window.addEventListener('mousemove', onMouseMove, false);