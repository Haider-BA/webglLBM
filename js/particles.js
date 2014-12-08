var container = document.getElementById('container');
//var renderer;
var scene;
var camera;
var stats;
var sphere;
var rtTexture;
var velScene;
var velUniforms;
var controls;
var line;
var cameraControls;
var posScene;
var dispScene;
var randScene;
var velTexture;
var posTexture;
var posUniforms;
var dispUniforms;
var mouse = {x:0,y:0};
var projector;
var canvas;
var texSize = 128;
var dispSize = {x:window.innerWidth, y:window.innerHeight};
var paused = false;

function init2() {

    //renderer = new THREE.WebGLRenderer({alpha: false });
    //renderer.setClearColor(0x000000, false);

    projector = new THREE.Projector();

    $("#help").click(function() {
        console.log("clicked help");
        $(this).fadeOut();
    });

    //renderer.setSize(dispSize.x, dispSize.y);

    ///renderer.setBlending(THREE.AdditiveBlending);

    canvas = renderer.domElement;

    container.appendChild(canvas);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    velTexture = [];
    posTexture = [];


    velTexture[0] = new THREE.WebGLRenderTarget(
        customWindow.innerWidth, customWindow.innerHeight, {
            format: THREE.RGBFormat,
            generateMipmaps: false,
            magFilter: THREE.NearestFilter,
            type: THREE.FloatType
        }
    );

    posTexture[0] = new THREE.WebGLRenderTarget(
        customWindow.innerWidth, customWindow.innerHeight, {
            format: THREE.RGBFormat,
            generateMipmaps: false,
            magFilter: THREE.NearestFilter,
            type: THREE.FloatType
        }
    );


    velTexture[1] = new THREE.WebGLRenderTarget(
        customWindow.innerWidth, customWindow.innerHeight, {
            format: THREE.RGBFormat,
            generateMipmaps: false,
            magFilter: THREE.NearestFilter,
            type: THREE.FloatType
        }
    );

    posTexture[1] = new THREE.WebGLRenderTarget(
        customWindow.innerWidth, customWindow.innerHeight, {
            format: THREE.RGBFormat,
            generateMipmaps: false,
            magFilter: THREE.NearestFilter,
            type: THREE.FloatType
        }
    );

    console.log(posTexture);


    velScene = new THREE.Scene();
    posScene = new THREE.Scene();

    var velVert = $('#velVert').text();
    var velFrag = $('#velFrag').text();
    velUniforms = {
        velTex: {type: "t", value: velTexture[0]},
        posTex: {type: "t", value: posTexture[0]},
        macroTex: {type: "t", value: rtTextureMacro },
        targetPos: {type: "v3", value: new THREE.Vector3(0.7, 0.5, 0.5)},
        time: 	{ type: "f", value: 1.0 },
        gravDist: 	{ type: "f", value: 1000.0 }
    };




    var velMaterial = new THREE.ShaderMaterial( {
        uniforms: velUniforms,
        vertexShader:velVert,
        fragmentShader:velFrag,
        depthWrite: false
    });

    var velPlane = new THREE.Mesh(new THREE.PlaneGeometry(customWindow.innerWidth, customWindow.innerHeight), velMaterial);
    velScene.add(velPlane);



    var posVert = $('#posVert').text();
    var posFrag = $('#posFrag').text();

    posUniforms = {
        posTex: {type: "t", value: posTexture[0]},
        velTex: {type: "t", value: velTexture[0]},
        meshTex: {type: "t", value: meshMaskTexture },
        time: {type: "f", value: 1.0 }
    };



    var posMaterial = new THREE.ShaderMaterial( {
        uniforms: posUniforms,
        vertexShader:posVert,
        fragmentShader:posFrag,
        depthWrite: false
    });


    var posPlane = new THREE.Mesh(new THREE.PlaneGeometry(customWindow.innerWidth, customWindow.innerHeight), posMaterial);
    posScene.add(posPlane);





    randScene = new THREE.Scene();
    var randVert = $('#randVert').text();
    var randFrag = $('#randFrag').text();

    var randUniforms = {
        time: 	{ type: "f", value: 1.0 }
    };



    var randMaterial = new THREE.ShaderMaterial( {
        uniforms: randUniforms,
        vertexShader:randVert,
        fragmentShader:randFrag,
        depthWrite: false
    });


    var randPlane = new THREE.Mesh(new THREE.PlaneGeometry(customWindow.innerWidth, customWindow.innerHeight), randMaterial);
    randScene.add(randPlane);


    // Display

    dispScene = new THREE.Scene();

    dispScene.add(cameraRTT );

    //cameraControls = new THREE.OrbitControls(camera);
    
    //cameraControls.userPanSpeed = 0;


    var dispVert = $('#dispVert').text();
    var dispFrag = $('#dispFrag').text();

    dispUniforms = {
        posTex: {type: "t", value: posTexture[0]},
        time: 	{ type: "f", value: 1.0 },
        texSize: 	{ type: "f", value: texSize }

    };

    var dispAttributes = {
        id: {type: 'f', value: []}
    };

    var dispMaterial = new THREE.ShaderMaterial( {
        uniforms: dispUniforms,
        vertexShader:dispVert,
        fragmentShader:dispFrag,
        depthWrite: false,
        transparent: true,
        blending: THREE.AdditiveBlending
    });

    var particles = new THREE.Geometry();

    var nPartPerDim = 20;
    for (var i = 0; i < nPartPerDim; i++) {
        for (var j = 0; j < nPartPerDim; j++) {

        var xPix = /*customWindow.innerWidth**/( i/nPartPerDim + 0.5/nPartPerDim );
        var yPix = /*customWindow.innerHeight**/( j/nPartPerDim + 0.5/nPartPerDim );
        particles.vertices.push(new THREE.Vector3(xPix, yPix , 0)); //   i/texSize
        }   
    }   
    var particleMesh = new THREE.ParticleSystem(particles, dispMaterial);


    dispScene.add(particleMesh);


    randScene = new THREE.Scene();
    var randVert = $('#randVert').text();
    var randFrag = $('#randFrag').text();

    var randUniforms = {
        time:   { type: "f", value: 1.0 }
    };

    var randMaterial = new THREE.ShaderMaterial( {
        uniforms: randUniforms,
        vertexShader:randVert,
        fragmentShader:randFrag,
        depthWrite: false
    });


    var randPlane = new THREE.Mesh(new THREE.PlaneGeometry(customWindow.innerWidth,
                                customWindow.innerHeight), randMaterial);
    randScene.add(randPlane);


}

var buffer = 0;
var rand = true;
