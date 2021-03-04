import React, { Component } from 'react';
import * as THREE from 'three';
import path from 'path';

export default class Globe extends Component {
    componentDidMount() {
        const container = document.getElementById('globe');
        
        
        const renderer = new THREE.WebGLRenderer();
        
        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        
        const VIEW_ANGLE = 45;
        const ASPECT = WIDTH / HEIGHT;
        const NEAR = 0.1;
        const FAR = 10000;
        
        
        const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        
        camera.position.set( 0, 0, 1000 );
        
        const scene = new THREE.Scene();
        scene.background = new THREE.Color( '#000' );
        
        scene.add(camera);
        
        container.appendChild(renderer.domElement);
        
        const RADIUS = 200;
        const SEGMENTS = 50;
        const RINGS = 50;
        
        const globe = new THREE.Group();
        scene.add(globe);
        
        const loader = new THREE.TextureLoader();
        loader.load(path.join(__dirname, '../../static/land_ocean_ice_cloud_2048.jpg'), function(texture) {
            const sphere = new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS);
            const material = new THREE.MeshBasicMaterial({ map: texture });
            const mesh = new THREE.Mesh( sphere, material );
            globe.add(mesh);
        })
        
        globe.position.z = 100;
        
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
          var lastMove = [window.innerWidth/2, window.innerHeight/2];
          function rotateOnMouseMove(e) {
            e = e || window.event;
          
            //calculate difference between current and last mouse position
            const moveX = ( e.clientX - lastMove[0]);
            const moveY = ( e.clientY - lastMove[1]);
            //rotate the globe based on distance of mouse moves (x and y) 
            globe.rotation.y += ( moveX * .005);
            globe.rotation.x += ( moveY * .005);
          
            //store new position in lastMove
            lastMove[0] = e.clientX;
            lastMove[1] = e.clientY;
          }
          document.addEventListener('mousemove', rotateOnMouseMove);
    }
    render() {
        return (
            <div />
        )
    }
}

