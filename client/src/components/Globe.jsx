import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import path from 'path';
import { debounce } from '../utils';

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
            controls: '',
            globe: new THREE.Group(),
            loader: new THREE.TextureLoader(),
            pointLight: new THREE.PointLight(0xFFFFFF),
        }
        this.onWindowResize = this.onWindowResize.bind(this);
    }
    componentDidMount() {
        const {
            windowWidth, windowHeight, scene, renderer,
            camera, globe, loader, pointLight,
        } = this.state;

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

        scene.add(globe);
        
        loader.load(path.join(__dirname, '../../static/land_ocean_ice_cloud_2048.jpg'), function(texture) {
            const sphere = new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS);
            const material = new THREE.MeshBasicMaterial({ map: texture });
            const mesh = new THREE.Mesh( sphere, material );
            globe.add(mesh);
        })
        
        globe.position.z = 0;
        
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
        window.addEventListener('resize', this.onWindowResize);
    }

    onWindowResize() {
        const debouncedHandleResize = debounce(() => {
            this.setState({
                wWidth: window.innerWidth,
                wHeight: window.innerHeight,
                wAspect: window.innerWidth / window.innerHeight,
            }, () => {
                const { camera, renderer, wWidth, wHeight, wAspect } = this.state;
                camera.aspect = wAspect;
                camera.updateProjectionMatrix();
        
                renderer.setSize( wWidth, wHeight );
            })

        }, 1000);
        debouncedHandleResize();

    }

    render() {
        return (
            <div ref={ref => (this.mount = ref)}/>
        )
    }
}

