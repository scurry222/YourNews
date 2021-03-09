const THREE = require('three');
var container, scene, camera, renderer, controls, stats;
var projector  = new THREE.Projector(),
	mouse2D    = new THREE.Vector3( 0, 0, 0.5 ),
	mapCanvas, mapContext, lookupCanvas, lookupContext, lookupTexture, composer;

// custom global variables
var mesh;
//	ordered lookup list for country color index
//	used for GLSL to find which country needs to be highlighted
var countryColorMap = {'PE':1,
'BF':2,'FR':3,'LY':4,'BY':5,'PK':6,'ID':7,'YE':8,'MG':9,'BO':10,'CI':11,'DZ':12,'CH':13,'CM':14,'MK':15,'BW':16,'UA':17,
'KE':18,'TW':19,'JO':20,'MX':21,'AE':22,'BZ':23,'BR':24,'SL':25,'ML':26,'CD':27,'IT':28,'SO':29,'AF':30,'BD':31,'DO':32,'GW':33,
'GH':34,'AT':35,'SE':36,'TR':37,'UG':38,'MZ':39,'JP':40,'NZ':41,'CU':42,'VE':43,'PT':44,'CO':45,'MR':46,'AO':47,'DE':48,'SD':49,
'TH':50,'AU':51,'PG':52,'IQ':53,'HR':54,'GL':55,'NE':56,'DK':57,'LV':58,'RO':59,'ZM':60,'IR':61,'MM':62,'ET':63,'GT':64,'SR':65,
'EH':66,'CZ':67,'TD':68,'AL':69,'FI':70,'SY':71,'KG':72,'SB':73,'OM':74,'PA':75,'AR':76,'GB':77,'CR':78,'PY':79,'GN':80,'IE':81,
'NG':82,'TN':83,'PL':84,'NA':85,'ZA':86,'EG':87,'TZ':88,'GE':89,'SA':90,'VN':91,'RU':92,'HT':93,'BA':94,'IN':95,'CN':96,'CA':97,
'SV':98,'GY':99,'BE':100,'GQ':101,'LS':102,'BG':103,'BI':104,'DJ':105,'AZ':106,'MY':107,'PH':108,'UY':109,'CG':110,'RS':111,'ME':112,'EE':113,
'RW':114,'AM':115,'SN':116,'TG':117,'ES':118,'GA':119,'HU':120,'MW':121,'TJ':122,'KH':123,'KR':124,'HN':125,'IS':126,'NI':127,'CL':128,'MA':129,
'LR':130,'NL':131,'CF':132,'SK':133,'LT':134,'ZW':135,'LK':136,'IL':137,'LA':138,'KP':139,'GR':140,'TM':141,'EC':142,'BJ':143,'SI':144,'NO':145,
'MD':146,'LB':147,'NP':148,'ER':149,'US':150,'KZ':151,'AQ':152,'SZ':153,'UZ':154,'MN':155,'BT':156,'NC':157,'FJ':158,'KW':159,'TL':160,'BS':161,
'VU':162,'FK':163,'GM':164,'QA':165,'JM':166,'CY':167,'PR':168,'PS':169,'BN':170,'TT':171,'CV':172,'PF':173,'WS':174,'LU':175,'KM':176,'MU':177,
'FO':178,'ST':179,'AN':180,'DM':181,'TO':182,'KI':183,'FM':184,'BH':185,'AD':186,'MP':187,'PW':188,'SC':189,'AG':190,'BB':191,'TC':192,'VC':193,
'LC':194,'YT':195,'VI':196,'GD':197,'MT':198,'MV':199,'KY':200,'KN':201,'MS':202,'BL':203,'NU':204,'PM':205,'CK':206,'WF':207,'AS':208,'MH':209,
'AW':210,'LI':211,'VG':212,'SH':213,'JE':214,'AI':215,'MF_1_':216,'GG':217,'SM':218,'BM':219,'TV':220,'NR':221,'GI':222,'PN':223,'MC':224,'VA':225,
'IM':226,'GU':227,'SG':228};

init();
animate();

// FUNCTIONS 		
function init() 
{
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,250,250);
	camera.lookAt(scene.position);	
	// RENDERER
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:false} );
	else
		renderer = new THREE.CanvasRenderer(); 
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	
	renderer.sortObjects = false;
	renderer.generateMipmaps = false;
	renderer.setClearColor(0x000000);
	
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	// CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(100,250,100);
	scene.add(light);
	
	// SKYBOX
	/*
	var imagePrefix = "images/nebula-",
		directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"],
		imageSuffix = ".png",
		materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	var skyBox = new THREE.Mesh( new THREE.CubeGeometry( 5000, 5000, 5000 ), new THREE.MeshFaceMaterial( materialArray ) );
	scene.add( skyBox );
	*/
	
	////////////
	// CUSTOM //
	////////////
	
	// Create the "lookup texture", which contains a colored pixel for each country 
	//  -- the pixel at (x,1) is the color of the country labelled with gray RGB_Color(x,x,x,1).
	lookupCanvas = document.createElement('canvas');	
	lookupCanvas.width = 256;
	lookupCanvas.height = 1;
	lookupContext = lookupCanvas.getContext('2d');
	lookupTexture = new THREE.Texture( lookupCanvas );
	lookupTexture.magFilter = THREE.NearestFilter;
	lookupTexture.minFilter = THREE.NearestFilter;
	lookupTexture.needsUpdate = true;
	
	var mapTexture = THREE.ImageUtils.loadTexture("images/earth-index-shifted-gray.png");
	mapTexture.magFilter = THREE.NearestFilter;
	mapTexture.minFilter = THREE.NearestFilter;
	mapTexture.needsUpdate = true;
	
	var outlineTexture = THREE.ImageUtils.loadTexture("images/earth-outline-shifted-gray.png");
	outlineTexture.needsUpdate = true;
	
	var blendImage = THREE.ImageUtils.loadTexture("images/earth-day.jpg");
	
	var planeMaterial = new THREE.ShaderMaterial( 
	{
		uniforms:
		{
			width:      { type: "f", value: window.innerWidth },
			height:     { type: "f", value: window.innerHeight },
			mapIndex:   { type: "t", value: mapTexture },
			outline:    { type: "t", value: outlineTexture },
			lookup:     { type: "t", value: lookupTexture },
			blendImage: { type: "t", value: blendImage }
		},
		vertexShader:   document.getElementById( 'globeVertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'globeFragmentShader' ).textContent
	});
	
	var geometry = new THREE.SphereGeometry( 100, 64, 32 );
	mesh = new THREE.Mesh( geometry, planeMaterial );
	mesh.position.set(0,0,0);
	scene.add(mesh);
	
	document.addEventListener( 'mousemove', mouseMove,  false );
	document.addEventListener( 'mousedown', mouseClick, false );

	mapCanvas = document.createElement('canvas');
	mapCanvas.width = 4096;
	mapCanvas.height = 2048;
    mapContext = mapCanvas.getContext('2d');
    var imageObj = new Image();
    imageObj.onload = function() 
	{
        mapContext.drawImage(imageObj, 0, 0);
    };
    imageObj.src = 'images/earth-index-shifted-gray.png';
	
	////////////////////
	// POSTPROCESSING //
	////////////////////
	
	renderer.autoClear = false;
	
	composer = new THREE.EffectComposer( renderer );

	var renderModel = new THREE.RenderPass( scene, camera );

	var effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
	var width = window.innerWidth || 2;
	var height = window.innerHeight || 2;
	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / width, 1 / height );

	var effectCopy = new THREE.ShaderPass( THREE.CopyShader );
	effectCopy.renderToScreen = true;
	
	composer.addPass( renderModel );
	composer.addPass( effectFXAA );
	composer.addPass( effectCopy );
}

// update the mouse position
function mouseMove( event ) 
{ 
	mouse2D.x =   ( event.clientX / window.innerWidth  ) * 2 - 1;
	mouse2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function mouseClick( event ) 
{
	mouse2D.x =   ( event.clientX / window.innerWidth  ) * 2 - 1;
	mouse2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	// console.log("CLICK");
	var countryCode = -1;
	var rayCaster = projector.pickingRay( mouse2D.clone(), camera );
	var intersectionList = rayCaster.intersectObject( mesh );
	if (intersectionList.length > 0 )
	{
		data = intersectionList[0];
		var d = data.point.clone().normalize();
		var u = Math.round(4096 * (1 - (0.5 + Math.atan2(d.z, d.x) / (2 * Math.PI))));
		var v = Math.round(2048 * (0.5 - Math.asin(d.y) / Math.PI));
		var p = mapContext.getImageData(u,v,1,1).data;
		countryCode = p[0];

		for( var prop in countryColorMap ) {
        if( countryColorMap.hasOwnProperty( prop ) ) {
             if( countryColorMap[ prop ] === countryCode )
                 console.log(prop, countryCode);
			}
		} // end for loop
		
		lookupContext.clearRect(0,0,256,1);
		
		for (var i = 0; i < 228; i++)
		{
			if (i == 0) 
				lookupContext.fillStyle = "rgba(0,0,0,1.0)"
			else if (i == countryCode)
				lookupContext.fillStyle = "rgba(50,50,0,0.5)"
			else
				lookupContext.fillStyle = "rgba(0,0,0,1.0)"
				
			lookupContext.fillRect( i, 0, 1, 1 );
		}
		
		lookupTexture.needsUpdate = true;
	}

} // end mouseClick function

function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{
	controls.update();
	stats.update();
	if (camera.position.length() < 300) camera.position.setLength(300);
	if (camera.position.length() > 1000) camera.position.setLength(1000);
}

function render() 
{
	renderer.clear();
	renderer.render( scene, camera );
	// composer.render(); // use this line for anti-aliasing
}
