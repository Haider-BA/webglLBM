
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats, materialCopy, materialStep, materialShow
var cameraRTT, sceneStep1, sceneStep2, sceneStep3, sceneShow, scene, renderer, sceneCopy1, sceneCopy2, sceneCopy3;
var sceneCompute1, sceneCompute2 , sceneCompute3, sceneMesh, meshMaskTexture  ;
var sceneBounceback1, sceneBounceback2, sceneBounceback3, sceneParticle, sceneModifyMesh;
var sceneCopyMesh, currMeshTexture;
var sceneMacro;
var mouseX = 0, mouseY = 0;

var material, quad;

var rtTexture1, rtTexture2, rtTexture3;
var rtTexture1c, rtTexture2c, rtTexture3c;
var rtTextureMacro;

var triangle,plane;
var delta = 1.;
var currTime = 0;
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
var showParts;
init();
init2();
animate();

function setRenderType(v) {
	var bu = v.valueOf();
	materialShow.uniforms.renderType.value = bu;
}
function setOmega(v) {
	var bu = v.valueOf();
	materialCompute1.uniforms.omega.value = bu;
	materialCompute2.uniforms.omega.value = bu;
	materialCompute3.uniforms.omega.value = bu;
}
function setScaleOutput(v) {
	var bu = v.valueOf();
	materialShow.uniforms.scaleOutput.value = Math.log(bu);
}
function resetParts() {
	renderer.render(randScene, cameraRTT, velTexture[0]);
	renderer.render(randScene, cameraRTT, posTexture[0]);
	renderer.render(randScene, cameraRTT, velTexture[1]);
	renderer.render(randScene, cameraRTT, posTexture[1]);
	buffer = 0;
}

function clearObstacles() {
	renderer.render( sceneMesh, cameraRTT, currMeshTexture, true );
	renderer.render( sceneMesh, cameraRTT,meshMaskTexture, true);
}

function resetSims() {
	materialCompute1.uniforms.currTime.value = 0.;
	materialCompute2.uniforms.currTime.value = 0.;
	materialCompute3.uniforms.currTime.value = 0.;	
	resetParts();
	clearObstacles();
}
function toggleParts() {
	
	if (showParts == true ) {
		showParts = false;
	} else {
		showParts = true;
	}
}
function init() {

	container = document.getElementById( 'container' );
	customWindow = Object();
	customWindow.innerWidth = 512;
	customWindow.innerHeight = 128;
	cameraRTT = new THREE.OrthographicCamera( customWindow.innerWidth / - 2, customWindow.innerWidth / 2, customWindow.innerHeight / 2, customWindow.innerHeight / - 2, -1000, 1000 );

	sceneStep1 = new THREE.Scene();
	sceneCopy1 = new THREE.Scene();
	sceneStep2 = new THREE.Scene();
	sceneCopy2 = new THREE.Scene();
	sceneStep3 = new THREE.Scene();
	sceneCopy3 = new THREE.Scene();
	sceneCompute1 = new THREE.Scene();
	sceneCompute2 = new THREE.Scene();
	sceneCompute3 = new THREE.Scene();
	sceneBounceback1 = new THREE.Scene();
	sceneBounceback2 = new THREE.Scene();
	sceneBounceback3 = new THREE.Scene();	
	sceneShow = new THREE.Scene();
	sceneMesh = new THREE.Scene();
	sceneModifyMesh = new THREE.Scene();
	sceneCopyMesh = new THREE.Scene();
	sceneParticle = new THREE.Scene();
	sceneMacro = new THREE.Scene();

	console.log(container);

	rtTextureMacro = new THREE.WebGLRenderTarget( customWindow.innerWidth, customWindow.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, type: THREE.FloatType } );

	rtTexture1 = new THREE.WebGLRenderTarget( customWindow.innerWidth, customWindow.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, type: THREE.FloatType } );
	rtTexture2 = new THREE.WebGLRenderTarget( customWindow.innerWidth, customWindow.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, type: THREE.FloatType } );
	rtTexture3 = new THREE.WebGLRenderTarget( customWindow.innerWidth, customWindow.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, type: THREE.FloatType } );
	
	rtTexture1c = new THREE.WebGLRenderTarget( customWindow.innerWidth, customWindow.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, type: THREE.FloatType } );
	rtTexture2c = new THREE.WebGLRenderTarget( customWindow.innerWidth, customWindow.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, type: THREE.FloatType } );
	rtTexture3c = new THREE.WebGLRenderTarget( customWindow.innerWidth, customWindow.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, type: THREE.FloatType } );
	
	meshMaskTexture = new THREE.WebGLRenderTarget( customWindow.innerWidth, customWindow.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat } );
	currMeshTexture = new THREE.WebGLRenderTarget( customWindow.innerWidth, customWindow.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat } );

	rtTexture1.wrapS = THREE.RepeatWrapping;
	rtTexture1.wrapT = THREE.RepeatWrapping;
	
	rtTexture2.wrapS = THREE.RepeatWrapping;
	rtTexture2.wrapT = THREE.RepeatWrapping;
	
	rtTexture3.wrapS = THREE.RepeatWrapping;
	rtTexture3.wrapT = THREE.RepeatWrapping;
	
	rtTexture1c.wrapS = THREE.RepeatWrapping;
	rtTexture1c.wrapT = THREE.RepeatWrapping;
	
	rtTexture2c.wrapS = THREE.RepeatWrapping;
	rtTexture2c.wrapT = THREE.RepeatWrapping;
	
	rtTexture3c.wrapS = THREE.RepeatWrapping;
	rtTexture3c.wrapT = THREE.RepeatWrapping;
	
	materialShow = new THREE.ShaderMaterial( {

		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShow' ).textContent,
		uniforms: { renderType:{ type: "i", value: 0 } , dtx: { type: "f", value: 0.1}, dty: { type: "f", value: 0.1}, 
		tDiffuse1: { type: "t", value: rtTexture1c },
		tDiffuse2: { type: "t", value: rtTexture2c },
		tDiffuse3: { type: "t", value: rtTexture3c },
		tMask: { type: "t", value: meshMaskTexture },
		scaleOutput: { type: "f", value: Math.log(2.) }
	} }
	);

	materialMacro = new THREE.ShaderMaterial( {

		uniforms: { 
		tDiffuse1: { type: "t", value: rtTexture1 },
		tDiffuse2: { type: "t", value: rtTexture2 },
		tDiffuse3: { type: "t", value: rtTexture3 } },
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentMacro' ).textContent,
	} );


	materialCompute1 = new THREE.ShaderMaterial( {

		uniforms: { tDiffuse1: { type: "t", value: rtTexture1 } , currTime: {type: "f", value:0} , omega: {type: "f", value:1.45},
		tDiffuse2: { type: "t", value: rtTexture2 },
		tDiffuse3: { type: "t", value: rtTexture3 },
		BCType: {type: "i", value: 0 } },
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentCompute1' ).textContent,

	} );
	materialCompute2 = new THREE.ShaderMaterial( {

		uniforms: {tDiffuse1: { type: "t", value: rtTexture1 } , currTime: {type: "f", value:0}, omega: {type: "f", value:1.45},
		tDiffuse2: { type: "t", value: rtTexture2 },
		tDiffuse3: { type: "t", value: rtTexture3 },
		BCType: {type: "i", value: 0 } }, 
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentCompute2' ).textContent,

	} );			
	materialCompute3 = new THREE.ShaderMaterial( {

		uniforms: {tDiffuse1: { type: "t", value: rtTexture1 } ,currTime: {type: "f", value:0}, omega: {type: "f", value:1.45},
		tDiffuse2: { type: "t", value: rtTexture2 },
		tDiffuse3: { type: "t", value: rtTexture3 },
		BCType: {type: "i", value: 0 } },
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentCompute3' ).textContent,

	} );

	materialStep1 = new THREE.ShaderMaterial( {

		uniforms: { time: { type: "f", value: 0.0 } , dtx: { type: "f", value: 0.1}, dty: { type: "f", value: 0.1},
		tDiffuse3: { type: "t", value: rtTexture1 } },
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentStep1' ).textContent,

		depthWrite: false

	} );
	materialStep2 = new THREE.ShaderMaterial( {

		uniforms: { time: { type: "f", value: 0.0 } , dtx: { type: "f", value: 0.1}, dty: { type: "f", value: 0.1},
		tDiffuse3: { type: "t", value: rtTexture2 } },
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentStep2' ).textContent,

		depthWrite: false

	} );
	materialStep3 = new THREE.ShaderMaterial( {

		uniforms: { time: { type: "f", value: 0.0 } , dtx: { type: "f", value: 0.1}, dty: { type: "f", value: 0.1},
		tDiffuse3: { type: "t", value: rtTexture3 } },
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentStep3' ).textContent,

		depthWrite: false

	} );								
	materialCopy1 = new THREE.ShaderMaterial( {

		uniforms: { tDiffuse1: { type: "t", value: rtTexture1c } },
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentCopy1' ).textContent,

		depthWrite: false

	} );				
	materialCopy2 = new THREE.ShaderMaterial( {

		uniforms: { tDiffuse2: { type: "t", value: rtTexture2c } },
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentCopy2' ).textContent,

		depthWrite: false

	} );	
	materialCopy3 = new THREE.ShaderMaterial( {

		uniforms: { tDiffuse3: { type: "t", value: rtTexture3c } },
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentCopy3' ).textContent,

		depthWrite: false

	} );	
	materialCopyMesh = new THREE.ShaderMaterial( {

		uniforms: { tDiffuse: { type: "t", value: currMeshTexture } },
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentCopyMesh' ).textContent,

		depthWrite: false

	} );			
	materialMesh = new THREE.ShaderMaterial( {
		uniforms: { dtx: { type: "f", value: 0.1}, dty: { type: "f", value: 0.1}},
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentInitMesh' ).textContent,

		depthWrite: false

	} );
	materialModifyMesh = new THREE.ShaderMaterial( {
		uniforms: { currMesh: { type: "t", value: meshMaskTexture }, dtx: { type: "f", value: 1.1}, dty: { type: "f", value: 1.1},  x: { type: "f", value: 1.1}, y: { type: "f", value: 1.1}},
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentModifyMesh' ).textContent,

		depthWrite: false

	} );							
	materialBounceback1 = new THREE.ShaderMaterial( {

		uniforms: {tDiffuse1: { type: "t", value: rtTexture1 },
		tDiffuse2: { type: "t", value: rtTexture2 },
		tDiffuse3: { type: "t", value: rtTexture3 },
		tMask: { type: "t", value: meshMaskTexture } },
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentBounceback1' ).textContent,

	} );
	materialBounceback2 = new THREE.ShaderMaterial( {

		uniforms: {tDiffuse1: { type: "t", value: rtTexture1 },
		tDiffuse2: { type: "t", value: rtTexture2 },
		tDiffuse3: { type: "t", value: rtTexture3 },
		tMask: { type: "t", value: meshMaskTexture } },
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentBounceback2' ).textContent,

	} );
	materialBounceback3 = new THREE.ShaderMaterial( {

		uniforms: {tDiffuse1: { type: "t", value: rtTexture1 },
		tDiffuse2: { type: "t", value: rtTexture2 },
		tDiffuse3: { type: "t", value: rtTexture3 },
		tMask: { type: "t", value: meshMaskTexture } },
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentBounceback3' ).textContent,

	} );
	var attributes = {
		displacement: {
	    type: 'vec2', // a float
	    value: [] // an empty array
	}
};
materialParticle = new THREE.ShaderMaterial( {
} );
plane = new THREE.PlaneBufferGeometry( customWindow.innerWidth, customWindow.innerHeight );
triangle = new THREE.CircleGeometry( 2, 5 );


quad = new THREE.Mesh( plane, materialMesh );
sceneMesh.add( quad );

quad = new THREE.Mesh( plane, materialMacro );
sceneMacro.add( quad );

quad = new THREE.Mesh( plane, materialModifyMesh );
sceneModifyMesh.add( quad );

quad = new THREE.Mesh( plane, materialStep1 );
sceneStep1.add( quad );
quad = new THREE.Mesh( plane, materialStep2 );
sceneStep2.add( quad );
quad = new THREE.Mesh( plane, materialStep3 );
sceneStep3.add( quad );

quad = new THREE.Mesh( plane, materialCopy1 );
sceneCopy1.add( quad );
quad = new THREE.Mesh( plane, materialCopy2 );
sceneCopy2.add( quad );
quad = new THREE.Mesh( plane, materialCopy3 );
sceneCopy3.add( quad );

quad = new THREE.Mesh( plane, materialCompute1 );
sceneCompute1.add( quad );
quad = new THREE.Mesh( plane, materialCompute2 );
sceneCompute2.add( quad );				
quad = new THREE.Mesh( plane, materialCompute3 );
sceneCompute3.add( quad );

quad = new THREE.Mesh( plane, materialBounceback1 );
sceneBounceback1.add( quad );
quad = new THREE.Mesh( plane, materialBounceback2 );
sceneBounceback2.add( quad );				
quad = new THREE.Mesh( plane, materialBounceback3 );
sceneBounceback3.add( quad );

quad = new THREE.Mesh( plane, materialShow );
sceneShow.add( quad );

quad = new THREE.Mesh( plane, materialCopyMesh );
sceneCopyMesh.add( quad )

quad = new THREE.Sprite(  );
quad.scale.set(5,5,1);
sceneParticle.add( quad );


renderer = new THREE.WebGLRenderer();

	renderer.setSize( customWindow.innerWidth, customWindow.innerHeight );
	renderer.autoClear = false;

	materialStep1.uniforms.dtx.value  = 1. / customWindow.innerWidth;
	materialStep2.uniforms.dtx.value  = 1. / customWindow.innerWidth;
	materialStep3.uniforms.dtx.value  = 1. / customWindow.innerWidth;

	materialStep1.uniforms.dty.value  = 1. / customWindow.innerHeight;
	materialStep2.uniforms.dty.value  = 1. / customWindow.innerHeight;
	materialStep3.uniforms.dty.value  = 1. / customWindow.innerHeight;

	materialShow.uniforms.dtx.value  = 1. / customWindow.innerWidth;
	materialShow.uniforms.dty.value  = 1. / customWindow.innerHeight;	

	materialMesh.uniforms.dtx.value  = 1. / customWindow.innerWidth;
	materialMesh.uniforms.dty.value  = 1. / customWindow.innerHeight;	

	materialModifyMesh.uniforms.dtx.value  = 1. / customWindow.innerWidth;
	materialModifyMesh.uniforms.dty.value  = 1. / customWindow.innerHeight;	
	

	materialShow.uniforms.scaleOutput.value = Math.log(2.);
	//container.appendChild( renderer.domElement );

	showParts = true;
}

function animate() {

	requestAnimationFrame( animate );

	render();
	//stats.update();

}

function render() {

	renderer.clear();
	if (currTime == 0) {

		renderer.render(randScene, cameraRTT, velTexture[0]);
		renderer.render(randScene, cameraRTT, posTexture[0]);
		renderer.render(randScene, cameraRTT, velTexture[1]);
		renderer.render(randScene, cameraRTT, posTexture[1]);

		buffer = 1;
	};

for (var i = 0; i < 1; i++) {
	renderer.render( sceneCompute1, cameraRTT, rtTexture1c, true );
	renderer.render( sceneCompute2, cameraRTT, rtTexture2c, true );
	renderer.render( sceneCompute3, cameraRTT, rtTexture3c, true );

	renderer.render( sceneCopy1, cameraRTT, rtTexture1, true );
	renderer.render( sceneCopy2, cameraRTT, rtTexture2, true );
	renderer.render( sceneCopy3, cameraRTT, rtTexture3, true );

	renderer.render( sceneBounceback1, cameraRTT, rtTexture1c, true );
	renderer.render( sceneBounceback2, cameraRTT, rtTexture2c, true );
	renderer.render( sceneBounceback3, cameraRTT, rtTexture3c, true );

	renderer.render( sceneCopy1, cameraRTT, rtTexture1, true );
	renderer.render( sceneCopy2, cameraRTT, rtTexture2, true );
	renderer.render( sceneCopy3, cameraRTT, rtTexture3, true );

	renderer.render( sceneStep1, cameraRTT, rtTexture1c, true );
	renderer.render( sceneCopy1, cameraRTT, rtTexture1, true );
	
	renderer.render( sceneStep2, cameraRTT, rtTexture2c, true );
	renderer.render( sceneCopy2, cameraRTT, rtTexture2, true );
	
	renderer.render( sceneStep3, cameraRTT, rtTexture3c, true );
	renderer.render( sceneCopy3, cameraRTT, rtTexture3, true );

};

var a, b;

    if (buffer == 1) {
    	buffer = 0;
    	a = 1;
    	b = 0;
    } else {
    	buffer = 1;
    	a = 0;
    	b = 1;
    }

    renderer.render( sceneMacro, cameraRTT, rtTextureMacro, true );

    velUniforms.velTex.value = velTexture[a];
    velUniforms.posTex.value = posTexture[a];


    renderer.render(velScene, cameraRTT, velTexture[b]);

    posUniforms.velTex.value = velTexture[b];
    posUniforms.posTex.value = posTexture[a];

    renderer.render(posScene, cameraRTT, posTexture[b]);


    dispUniforms.posTex.value = posTexture[b];

	renderer.render( sceneShow, cameraRTT );

    if (showParts) {
    	renderer.render(dispScene, cameraRTT);
    };
	materialStep1.uniforms.time.value += delta;
	materialStep2.uniforms.time.value += delta;
	materialStep3.uniforms.time.value += delta;

	materialCompute1.uniforms.currTime.value += delta;
	materialCompute2.uniforms.currTime.value += delta;
	materialCompute3.uniforms.currTime.value += delta;
	currTime += delta;
}


function onDocumentMouseDown( event ) {

	var canvas = document.getElementById( 'container' );
	var xRatio = window.innerWidth/customWindow.innerWidth;
	var yRatio = window.innerHeight/customWindow.innerHeight;
	var top  = window.pageYOffset || document.documentElement.scrollTop,
    left = window.pageXOffset || document.documentElement.scrollLeft;
	var offsetTop = canvas.offsetTop;
	var offsetHeight = canvas.offsetHeight;
	
	var offsetLeft = canvas.offsetLeft;
	
	var vector2 = new THREE.Vector3(
		2. * xRatio * (event.clientX - .5 * window.innerWidth + offsetLeft - 0 ) / window.innerWidth ,
		2. * yRatio * (event.clientY - .5 * window.innerHeight - offsetTop + top + 270 ) / window.innerHeight - 1,
		0.5 );	
	var vector = new THREE.Vector3(
		2. * xRatio * (event.clientX - .5 * window.innerWidth - offsetLeft ) / window.innerWidth ,
		2. * yRatio * (event.clientY - .5 * window.innerHeight - offsetTop + top ) / window.innerHeight - 1,
		0.5 );	
	console.log(vector);

	materialModifyMesh.uniforms.x.value = .5 + .5 * vector2.x;
	materialModifyMesh.uniforms.y.value = .5 - .5 * vector2.y;

	renderer.clear();
	renderer.render( sceneModifyMesh, cameraRTT, currMeshTexture, true );
	renderer.render( sceneCopyMesh, cameraRTT,meshMaskTexture, true);
	renderer.render( sceneShow, cameraRTT );


}
