
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats, materialCopy, materialStep, materialShow;

var cameraRTT, camera, sceneStep1, sceneStep2, sceneStep3, sceneShow, scene, renderer, sceneCopy1, sceneCopy2, sceneCopy3;
var sceneCompute1, sceneCompute2 , sceneCompute3, sceneMesh, meshMaskTexture  ;
var sceneBounceback1, sceneBounceback2, sceneBounceback3, sceneParticle, sceneModifyMesh;
var sceneCopyMesh, currMeshTexture;
var mouseX = 0, mouseY = 0;

var material, quad;

var rtTexture1, rtTexture2, rtTexture3;
var rtTexture1c, rtTexture2c, rtTexture3c;

var triangle,plane;
var delta = 1.;
var currTime = 0;
document.addEventListener( 'mousedown', onDocumentMouseDown, false );



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
	customWindow.innerHeight = 128;

	cameraRTT = new THREE.OrthographicCamera( customWindow.innerWidth / - 2, customWindow.innerWidth / 2, customWindow.innerHeight / 2, customWindow.innerHeight / - 2, -1000, 1000 );
	//cameraRTT.position.z = 999;
	//cameraRTT = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 1000 );

	console.log($('#container'));
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
		varying: attributes,
		vertexShader: document.getElementById( 'vertexParticleShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentParticle' ).textContent,

	} );
	plane = new THREE.PlaneGeometry( customWindow.innerWidth, customWindow.innerHeight );
	triangle = new THREE.CircleGeometry( 2, 5 );
	

	quad = new THREE.Mesh( plane, materialMesh );
	sceneMesh.add( quad );
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
	sceneCopyMesh.add( quad );


	quad = new THREE.Sprite(  );
	sceneParticle.add( quad );


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

	materialShow.uniforms.dtx.value  = 1. / customWindow.innerWidth;
	materialShow.uniforms.dty.value  = 1. / customWindow.innerHeight;	

	materialMesh.uniforms.dtx.value  = 1. / customWindow.innerWidth;
	materialMesh.uniforms.dty.value  = 1. / customWindow.innerHeight;	

	materialModifyMesh.uniforms.dtx.value  = 1. / customWindow.innerWidth;
	materialModifyMesh.uniforms.dty.value  = 1. / customWindow.innerHeight;	
	

	materialShow.uniforms.scaleOutput.value = Math.log(2.);
	console.log(sceneMesh);
	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

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
		//renderer.render( sceneMesh, cameraRTT, meshMaskTexture, true );
	};
//renderer.render( sceneModifyMesh, cameraRTT, meshMaskTexture, true );
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
	triangle.verticesNeedUpdate = true;
	renderer.render( sceneParticle, cameraRTT );


	materialStep1.uniforms.time.value += delta;
	materialStep2.uniforms.time.value += delta;
	materialStep3.uniforms.time.value += delta;

	materialCompute1.uniforms.currTime.value += delta;
	materialCompute2.uniforms.currTime.value += delta;
	materialCompute3.uniforms.currTime.value += delta;
	currTime += delta;
}


function onDocumentMouseDown( event ) {
	//var projector = new THREE.Projector();
	var canvas = document.getElementById( 'container' );
	var xRatio = window.innerWidth/customWindow.innerWidth;
	var yRatio = window.innerHeight/customWindow.innerHeight;
	var offsetTop = canvas.offsetTop;
	var offsetLeft = canvas.offsetLeft;
	
	var vector = new THREE.Vector3(
	    ( ((event.clientX-0) / window.innerWidth ) * 2 - 1)*xRatio,
	    (- ( (event.clientY) / window.innerHeight  ) * 2  + 1)*yRatio - (offsetTop/3)/yRatio -2,
	    .5 );
	var vector2 = new THREE.Vector3(
	    ( event.clientX / window.innerWidth ) * 2 - 1,
	    - ( event.clientY / window.innerHeight ) * 2 + 1,
	    0.5 );	
	//console.log( yRatio );
	//console.log( xRatio );
	//console.log( offsetTop );
	//console.log( offsetLeft );

	//console.log(window.innerWidth);
	//console.log(window.innerHeight);

	//console.log( canvas.scrollWidth );
	//console.log( canvas.scrollHeight ); 
	console.log(vector);
	// use picking ray since it's an orthographic camera
	//console.log("picking")
	//ballSprite = new THREE.Sprite(  );
	//ballSprite.scale.set( 3,3,1 );
	//ballSprite.position.set( 256*vector.x, 64*vector.y, 0 );
	//sceneParticle.add( ballSprite );	
	materialModifyMesh.uniforms.x.value = .5 - .5*vector.x;
	materialModifyMesh.uniforms.y.value = .5 - .5*vector.y;
	//renderer.clear();
	renderer.render( sceneModifyMesh, cameraRTT, currMeshTexture, true );
	renderer.render( sceneCopyMesh, cameraRTT,meshMaskTexture, true);
	renderer.render( sceneShow, cameraRTT );
	//	renderer.render( sceneMesh, cameraRTT, meshMaskTexture, true );

	//var ray = projector.pickingRay( vector, cameraRTT );

//	var intersects = ray.intersectObjects( sceneMesh );

/*raycaster = new THREE.Raycaster();
var vector3 = vector.clone().unproject( cameraRTT );
var direction = new THREE.Vector3( 0, 0, -1 ).transformDirection( cameraRTT.matrixWorld );
raycaster.set( vector3, direction );
var intersects = raycaster.intersectObject( sceneMesh );
	if ( intersects.length > 0 ) {
		console.log("1")

	    console.log( intersects[ 0 ] );


	}
//	ray = projector.pickingRay( vector2, cameraRTT );

//	intersects = ray.intersectObjects( sceneMesh );

	if ( intersects.length > 0 ) {
		console.log("2")

	    console.log( intersects[ 0 ] );


	}	
	*/
}