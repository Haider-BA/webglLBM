
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats, materialCopy, materialStep, materialShow;

var cameraRTT, camera, sceneStep1, sceneStep2, sceneStep3, sceneShow, scene, renderer, zmesh1, zmesh2, sceneCopy1, sceneCopy2, sceneCopy3;
var sceneCompute1, sceneCompute2 , sceneCompute3, sceneMesh  ;
var sceneBounceback1, sceneBounceback2, sceneBounceback3;

var mouseX = 0, mouseY = 0;

var material, quad;

var rtTexture1, rtTexture2, rtTexture3;
var rtTexture1c, rtTexture2c, rtTexture3c;



var delta = 1.;
var currTime = 0;
init();
animate();
//var customWindow;
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

function init() {

	container = document.getElementById( 'container' );
	customWindow = Object();
	customWindow.innerWidth = 512;
	customWindow.innerHeight = 256;
	cameraRTT = new THREE.OrthographicCamera( customWindow.innerWidth / - 2, customWindow.innerWidth / 2, customWindow.innerHeight / 2, customWindow.innerHeight / - 2, -1000, 1000 );
	cameraRTT.position.z = 100;

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

	rtTexture1 = new THREE.WebGLRenderTarget( customWindow.innerWidth, customWindow.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, type: THREE.FloatType } );
	rtTexture2 = new THREE.WebGLRenderTarget( customWindow.innerWidth, customWindow.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, type: THREE.FloatType } );
	rtTexture3 = new THREE.WebGLRenderTarget( customWindow.innerWidth, customWindow.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, type: THREE.FloatType } );
	
	rtTexture1c = new THREE.WebGLRenderTarget( customWindow.innerWidth, customWindow.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, type: THREE.FloatType } );
	rtTexture2c = new THREE.WebGLRenderTarget( customWindow.innerWidth, customWindow.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, type: THREE.FloatType } );
	rtTexture3c = new THREE.WebGLRenderTarget( customWindow.innerWidth, customWindow.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, type: THREE.FloatType } );
	
	meshMaskTexture = new THREE.WebGLRenderTarget( customWindow.innerWidth, customWindow.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat } );

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
		uniforms: { renderType:{ type: "i", value: 0 }, 
		tDiffuse1: { type: "t", value: rtTexture1c },
		tDiffuse2: { type: "t", value: rtTexture2c },
		tDiffuse3: { type: "t", value: rtTexture3c },
		scaleOutput: { type: "f", value: Math.log(2.) }
		  } }
	);

	materialCompute1 = new THREE.ShaderMaterial( {

		uniforms: { tDiffuse1: { type: "t", value: rtTexture1 } , currTime: {type: "f", value:0} , omega: {type: "f", value:1.25},
		tDiffuse2: { type: "t", value: rtTexture2 },
		tDiffuse3: { type: "t", value: rtTexture3 },
		BCType: {type: "i", value: 0 } },
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentCompute1' ).textContent,

	} );
	materialCompute2 = new THREE.ShaderMaterial( {

		uniforms: {tDiffuse1: { type: "t", value: rtTexture1 } , currTime: {type: "f", value:0}, omega: {type: "f", value:1.25},
		tDiffuse2: { type: "t", value: rtTexture2 },
		tDiffuse3: { type: "t", value: rtTexture3 },
		BCType: {type: "i", value: 0 } }, 
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentCompute2' ).textContent,

	} );			
	materialCompute3 = new THREE.ShaderMaterial( {

		uniforms: {tDiffuse1: { type: "t", value: rtTexture1 } ,currTime: {type: "f", value:0}, omega: {type: "f", value:1.25},
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
	materialMesh = new THREE.ShaderMaterial( {

		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentInitMesh' ).textContent,

		depthWrite: false

	} );						
	materialBounceback1 = new THREE.ShaderMaterial( {

		uniforms: {tDiffuse1: { type: "t", value: rtTexture1 },
		tDiffuse2: { type: "t", value: rtTexture2 },
		tDiffuse3: { type: "t", value: rtTexture3 } },
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentBounceback1' ).textContent,

	} );
	materialBounceback2 = new THREE.ShaderMaterial( {

		uniforms: {tDiffuse1: { type: "t", value: rtTexture1 },
		tDiffuse2: { type: "t", value: rtTexture2 },
		tDiffuse3: { type: "t", value: rtTexture3 } },
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentBounceback2' ).textContent,

	} );
	materialBounceback3 = new THREE.ShaderMaterial( {

		uniforms: {tDiffuse1: { type: "t", value: rtTexture1 },
		tDiffuse2: { type: "t", value: rtTexture2 },
		tDiffuse3: { type: "t", value: rtTexture3 } },
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentBounceback3' ).textContent,

	} );

	var plane = new THREE.PlaneGeometry( customWindow.innerWidth, customWindow.innerHeight );

	quad = new THREE.Mesh( plane, materialMesh );
	sceneMesh.add( quad );

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

	renderer = new THREE.WebGLRenderer();
	//renderer.setViewport(333+customWindow.innerWidth,0333+customWindow.innerHeight);
	renderer.setSize( customWindow.innerWidth, customWindow.innerHeight );
	renderer.autoClear = false;

	materialStep1.uniforms.dtx.value  = 1. / customWindow.innerWidth;
	materialStep2.uniforms.dtx.value  = 1. / customWindow.innerWidth;
	materialStep3.uniforms.dtx.value  = 1. / customWindow.innerWidth;

	materialStep1.uniforms.dty.value  = 1. / customWindow.innerHeight;
	materialStep2.uniforms.dty.value  = 1. / customWindow.innerHeight;
	materialStep3.uniforms.dty.value  = 1. / customWindow.innerHeight;

	materialShow.uniforms.scaleOutput.value = Math.log(2.);

	container.appendChild( renderer.domElement );

	//stats = new Stats();
	//stats.domElement.style.position = 'absolute';
	//stats.domElement.style.top = '0px';
	//container.appendChild( stats.domElement );

}

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

function render() {

	//var time = Date.now() * 0.0015;
	renderer.clear();
	if (currTime == 0) {
		renderer.render( sceneMesh, cameraRTT, meshMaskTexture, true );
	};

	renderer.render( sceneCompute1, cameraRTT, rtTexture1c, true );
	renderer.render( sceneCompute2, cameraRTT, rtTexture2c, true );
	renderer.render( sceneCompute3, cameraRTT, rtTexture3c, true );

	renderer.render( sceneCopy1, cameraRTT, rtTexture1, true );
	renderer.render( sceneCopy2, cameraRTT, rtTexture2, true );
	renderer.render( sceneCopy3, cameraRTT, rtTexture3, true );

	renderer.render( sceneStep1, cameraRTT, rtTexture1c, true );
	renderer.render( sceneCopy1, cameraRTT, rtTexture1, true );
	
	renderer.render( sceneStep2, cameraRTT, rtTexture2c, true );
	renderer.render( sceneCopy2, cameraRTT, rtTexture2, true );
	
	renderer.render( sceneStep3, cameraRTT, rtTexture3c, true );
	renderer.render( sceneCopy3, cameraRTT, rtTexture3, true );

	renderer.render( sceneBounceback1, cameraRTT, rtTexture1c, true );
	renderer.render( sceneBounceback2, cameraRTT, rtTexture2c, true );
	renderer.render( sceneBounceback3, cameraRTT, rtTexture3c, true );

	renderer.render( sceneCopy1, cameraRTT, rtTexture1, true );
	renderer.render( sceneCopy2, cameraRTT, rtTexture2, true );
	renderer.render( sceneCopy3, cameraRTT, rtTexture3, true );
	// Render full screen quad with generated texture

	renderer.render( sceneShow, cameraRTT );

	materialStep1.uniforms.time.value += delta;
	materialStep2.uniforms.time.value += delta;
	materialStep3.uniforms.time.value += delta;

	materialCompute1.uniforms.currTime.value += delta;
	materialCompute2.uniforms.currTime.value += delta;
	materialCompute3.uniforms.currTime.value += delta;
	currTime += delta;
}

