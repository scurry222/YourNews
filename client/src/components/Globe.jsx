import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import path from 'path';

// Camera Globals
const VIEW_ANGLE = 45;
const NEAR = 0.1;
const FAR = 10000;

// Globe Globals
const RADIUS = 200;
const SEGMENTS = 50;
const RINGS = 50;

export default class Globe extends Component {
    constructor(props) {
        super(props);

        this.state = {
            wWidth: window.windowWidth,
            wHeight: window.windowHeight,
            wAspect: window.windowWidth / window.windowHeight,

            renderer: new THREE.WebGLRenderer(),
            scene: new THREE.Scene(),
            camera: new THREE.PerspectiveCamera(VIEW_ANGLE, window.windowWidth / window.windowHeight, NEAR, FAR),
            controls: ''
        }
    }
    componentDidMount() {
        const { windowWidth, windowHeight, scene, renderer, camera } = this.state;

        renderer.setSize(windowWidth, windowHeight);
        
        this.setState({
            controls: new OrbitControls(this.state.camera, this.state.renderer.domElement)
        })

        camera.position.set( 0, 0, 1000 );

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        scene.background = new THREE.Color( '#000' );
        
        scene.add(camera);
        
        this.mount.appendChild(renderer.domElement);

        
        const globe = new THREE.Group();
        scene.add(globe);
        
        const loader = new THREE.TextureLoader();
        loader.load(path.join(__dirname, '../../static/land_ocean_ice_cloud_2048.jpg'), function(texture) {
            const sphere = new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS);
            const material = new THREE.MeshBasicMaterial({ map: texture });
            const mesh = new THREE.Mesh( sphere, material );
            globe.add(mesh);
        })
        
        globe.position.z = 0;
        
        const pointLight = new THREE.PointLight(0xFFFFFF);
        
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 400;
        
        scene.add(pointLight);
        function update () {

            //Render:
            renderer.render(scene, camera);
            // Schedule the next frame:
            requestAnimationFrame(update);  
          }
          // Schedule the first frame:
          requestAnimationFrame(update);
          function animationBuilder(direction) {
            return function animateRotate() {
              switch (direction) {
                case 'up':
                  globe.rotation.x -= 0.2;
                  break;
                case 'down':
                  globe.rotation.x += 0.2;
                  break;
                case 'left':
                  globe.rotation.y -= 0.2;
                  break;
                case 'right':
                  globe.rotation.y += 0.2;
                  break;
                default:
                  break;
              }
            }
          }
          var animateDirection = {
            up: animationBuilder('up'),
            down: animationBuilder('down'),
            left: animationBuilder('left'),
            right: animationBuilder('right')
          }
          function checkKey(e) {
            e = e || window.event;
            e.preventDefault();
           
            //based on keycode, trigger appropriate animation:
            if (e.keyCode == '38') {
              animateDirection.up();
            } else if (e.keyCode == '40') {
              animateDirection.down();
            } else if (e.keyCode == '37') {
              animateDirection.left();
            } else if (e.keyCode == '39') {
              animateDirection.right();
            }
          }
          document.onkeydown = checkKey;
        //   var lastMove = [window.innerWidth/2, window.innerHeight/2];
        //   function rotateOnMouseMove(e) {
        //     e = e || window.event;
          
        //     //calculate difference between current and last mouse position
        //     const moveX = ( e.clientX - lastMove[0]);
        //     const moveY = ( e.clientY - lastMove[1]);
        //     //rotate the globe based on distance of mouse moves (x and y) 
        //     globe.rotation.y += ( moveX * .005);
        //     globe.rotation.x += ( moveY * .005);
          
        //     //store new position in lastMove
        //     lastMove[0] = e.clientX;
        //     lastMove[1] = e.clientY;
        //   }
        //   document.addEventListener('mousemove', rotateOnMouseMove);
    }
    onDocumentMouseMove( event ) {

        event.preventDefault();

        mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

        raycaster.setFromCamera( mouse, camera );

        const intersects = raycaster.intersectObjects( objects );

        if ( intersects.length > 0 ) {

            const intersect = intersects[ 0 ];

            rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
            rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );

        }

        render();

    }
    onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    render() {
        return (
            <div ref={ref => (this.mount = ref)}/>
        )
    }
}

