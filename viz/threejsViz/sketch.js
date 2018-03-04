var camera, scene, scenelight, renderer, controls;
var cameraSpeed = 0;

var raycaster;
var mouse = new THREE.Vector2();



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

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

var data;
var words_array;
preload();

function preload() {
    var xobj = new XMLHttpRequest();
    xobj.open('GET', "the_post_3d_vector_result.json");
    xobj.responseType = "json";
    xobj.send();
    xobj.onload = function() {
        data = xobj.response;
        init();
    }
}

function init() {

    words_array = Object.keys(data);
    console.log(words_array);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, -0, 800);


    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    scene.fog = new THREE.Fog(0xf0f0f0, 0, 850);

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    scenelight = new THREE.AmbientLight(0x404040);
    scene.add(scenelight);


    var onKeyDown = function(event) {
        switch (event.keyCode) {
            case 38: // up
                moveUp = true;
                break;
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
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
            case 68: // d
                moveRight = true;
                break;
          
        }
    };
    var onKeyUp = function(event) {
        switch (event.keyCode) {
            case 38: // up
                moveUp = false;
                break;
            case 87: // w
                moveForward = false;
                break;
            case 37: // left
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
            case 68: // d
                moveRight = false;
                break;
        }
    };
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );


    var loader = new THREE.FontLoader();
    loader.load('fonts/helvetiker_regular.typeface.json', function(font) {

        var color = 0x006699;
        var matDark = new THREE.LineBasicMaterial({
            color: color,
            side: THREE.DoubleSide
        });
        var matLite = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 35,

            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });
        for (var i = 0; i < words_array.length; i++) {
            var message = words_array[i];
            var x = (data[message][0]);
            var y = (data[message][1]);
            var z = (data[message][2]);
            // var z = getRandomArbitrary(0.,400)
            var mappedX = Math.floor(mapping(x, -17., 18., -500., 500.));
            var mappedY = Math.floor(mapping(y, -17., 18., -500., 500.));
            var mappedZ = Math.floor(mapping(z, -17., 18., -400., 500.));
            generateShapeFromText(message, mappedX, mappedY, mappedZ, font, matDark, matLite);
        }
    }); //end load function
    renderer = new THREE.WebGLRenderer({
        // antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    animate();
} // end init

function generateShapeFromText(_word, _xpos, _ypos, _zpos, _font, mD, mL) {
    var xMid, text;
    var textShape = new THREE.BufferGeometry();
    //text,size,divisions
    var shapes = _font.generateShapes(_word, 10, 1);
    var geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    // xMid = _pos - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    // geometry.translate(xMid, 0, 0);
    geometry.translate(_xpos, _ypos, 0);
    // make shape ( N.B. edge view not visible )
    textShape.fromGeometry(geometry);
    text = new THREE.Mesh(textShape, mL);
    text.position.z = _zpos;
    scene.add(text);
    // make line shape ( N.B. edge view remains visible )
    var holeShapes = [];
    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        if (shape.holes && shape.holes.length > 0) {
            for (var j = 0; j < shape.holes.length; j++) {
                var hole = shape.holes[j];
                holeShapes.push(hole);
            }
        }
    }
    shapes.push.apply(shapes, holeShapes);
    var lineText = new THREE.Object3D();
    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        var points = shape.getPoints();
        var geometry = new THREE.BufferGeometry().setFromPoints(points);

        geometry.translate(_xpos, _ypos, 0);
        var lineMesh = new THREE.Line(geometry, mD);
        lineText.add(lineMesh);
    }
    // scene.add(lineText);
}


function animate() {

    requestAnimationFrame(animate);
    render();
}

function render() {
    var _time = Date.now() * 0.001;
    if (controlsEnabled === true) {

        var time = performance.now();
        var delta = (time - prevTime) / 1000;
        velocity.x -= velocity.x * 5.0 * delta;
        velocity.z -= velocity.z * 1.0 * delta;
        velocity.y -= velocity.y *5.0 *delta;
        // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);
        direction.y = Number(moveDown) - Number(moveUp);
        direction.normalize(); // this ensures consistent movements in all directions
        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
        if(moveUp||moveDown) velocity.y -= direction.y *400 * delta;

        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);
        // if (controls.getObject().position.y < 10) {
        //     velocity.y = 0;
        //     controls.getObject().position.y = 10;
        // }
        prevTime = time;
    }

    renderer.render(scene, camera);
}

// function onMouseMove(event) {
//     // calculate mouse position in normalized device coordinates
//     // (-1 to +1) for both components
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
// }

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

// window.addEventListener('mousemove', onMouseMove, false);