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

const mapCanvas = document.createElement('canvas');
mapCanvas.width = 4096;
mapCanvas.height = 2048;
const mapContext = mapCanvas.getContext('2d');

const lookupCanvas = document.createElement('canvas');
lookupCanvas.width = 256;
lookupCanvas.height = 1;

const lookupContext = lookupCanvas.getContext('2d');
const lookupTexture = new THREE.Texture(lookupCanvas);
lookupTexture.magFilter = THREE.NearestFilter;
lookupTexture.minFilter = THREE.NearestFilter;

//	ordered lookup list for country color index
//	used for GLSL to find which country needs to be highlighted
const countryColorMap = { 'PE': 1, 'BF': 2, 'FR': 3, 'LY': 4, 'BY': 5, 'PK': 6, 'ID': 7, 'YE': 8, 'MG': 9, 'BO': 10, 'CI': 11, 'DZ': 12, 'CH': 13, 'CM': 14, 'MK': 15, 'BW': 16, 'UA': 17, 'KE': 18, 'TW': 19, 'JO': 20, 'MX': 21, 'AE': 22, 'BZ': 23, 'BR': 24, 'SL': 25, 'ML': 26, 'CD': 27, 'IT': 28, 'SO': 29, 'AF': 30, 'BD': 31, 'DO': 32, 'GW': 33, 'GH': 34, 'AT': 35, 'SE': 36, 'TR': 37, 'UG': 38, 'MZ': 39, 'JP': 40, 'NZ': 41, 'CU': 42, 'VE': 43, 'PT': 44, 'CO': 45, 'MR': 46, 'AO': 47, 'DE': 48, 'SD': 49, 'TH': 50, 'AU': 51, 'PG': 52, 'IQ': 53, 'HR': 54, 'GL': 55, 'NE': 56, 'DK': 57, 'LV': 58, 'RO': 59, 'ZM': 60, 'IR': 61, 'MM': 62, 'ET': 63, 'GT': 64, 'SR': 65, 'EH': 66, 'CZ': 67, 'TD': 68, 'AL': 69, 'FI': 70, 'SY': 71, 'KG': 72, 'SB': 73, 'OM': 74, 'PA': 75, 'AR': 76, 'GB': 77, 'CR': 78, 'PY': 79, 'GN': 80, 'IE': 81, 'NG': 82, 'TN': 83, 'PL': 84, 'NA': 85, 'ZA': 86, 'EG': 87, 'TZ': 88, 'GE': 89, 'SA': 90, 'VN': 91, 'RU': 92, 'HT': 93, 'BA': 94, 'IN': 95, 'CN': 96, 'CA': 97, 'SV': 98, 'GY': 99, 'BE': 100, 'GQ': 101, 'LS': 102, 'BG': 103, 'BI': 104, 'DJ': 105, 'AZ': 106, 'MY': 107, 'PH': 108, 'UY': 109, 'CG': 110, 'RS': 111, 'ME': 112, 'EE': 113, 'RW': 114, 'AM': 115, 'SN': 116, 'TG': 117, 'ES': 118, 'GA': 119, 'HU': 120, 'MW': 121, 'TJ': 122, 'KH': 123, 'KR': 124, 'HN': 125, 'IS': 126, 'NI': 127, 'CL': 128, 'MA': 129, 'LR': 130, 'NL': 131, 'CF': 132, 'SK': 133, 'LT': 134, 'ZW': 135, 'LK': 136, 'IL': 137, 'LA': 138, 'KP': 139, 'GR': 140, 'TM': 141, 'EC': 142, 'BJ': 143, 'SI': 144, 'NO': 145, 'MD': 146, 'LB': 147, 'NP': 148, 'ER': 149, 'US': 150, 'KZ': 151, 'AQ': 152, 'SZ': 153, 'UZ': 154, 'MN': 155, 'BT': 156, 'NC': 157, 'FJ': 158, 'KW': 159, 'TL': 160, 'BS': 161, 'VU': 162, 'FK': 163, 'GM': 164, 'QA': 165, 'JM': 166, 'CY': 167, 'PR': 168, 'PS': 169, 'BN': 170, 'TT': 171, 'CV': 172, 'PF': 173, 'WS': 174, 'LU': 175, 'KM': 176, 'MU': 177, 'FO': 178, 'ST': 179, 'AN': 180, 'DM': 181, 'TO': 182, 'KI': 183, 'FM': 184, 'BH': 185, 'AD': 186, 'MP': 187, 'PW': 188, 'SC': 189, 'AG': 190, 'BB': 191, 'TC': 192, 'VC': 193, 'LC': 194, 'YT': 195, 'VI': 196, 'GD': 197, 'MT': 198, 'MV': 199, 'KY': 200, 'KN': 201, 'MS': 202, 'BL': 203, 'NU': 204, 'PM': 205, 'CK': 206, 'WF': 207, 'AS': 208, 'MH': 209, 'AW': 210, 'LI': 211, 'VG': 212, 'SH': 213, 'JE': 214, 'AI': 215, 'MF_1_': 216, 'GG': 217, 'SM': 218, 'BM': 219, 'TV': 220, 'NR': 221, 'GI': 222, 'PN': 223, 'MC': 224, 'VA': 225, 'IM': 226, 'GU': 227, 'SG': 228 };


export default class Globe extends Component {
    constructor(props) {
        super(props);

        this.state = {
            wWidth: window.windowWidth,
            wHeight: window.windowHeight,
            wAspect: window.windowWidth / window.windowHeight,

            mesh: '',
            renderer: new THREE.WebGLRenderer(),
            scene: new THREE.Scene(),
            camera: new THREE.PerspectiveCamera(VIEW_ANGLE, window.windowWidth / window.windowHeight, NEAR, FAR),
            controls: '',
            globe: new THREE.Group(),
            pointLight: new THREE.PointLight(0xFFFFFF),
            mouse2D: new THREE.Vector3(0, 0, 0.5),
            raycaster: new THREE.Raycaster(),
        }
        this.onWindowResize = this.onWindowResize.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseClick = this.mouseClick.bind(this);
    }
    componentDidMount() {
        const {
            windowWidth, windowHeight, scene, renderer,
            camera, globe, pointLight,
        } = this.state;


        renderer.setSize(windowWidth, windowHeight);

        this.setState({
            controls: new OrbitControls(this.state.camera, this.state.renderer.domElement)
        })

        camera.position.set(0, 0, 500);

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

        scene.background = new THREE.Color('#000');

        scene.add(camera);

        this.mount.appendChild(renderer.domElement);

        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 400;

        scene.add(pointLight);

        var mapTexture = new THREE.TextureLoader()
            .load(path.join(__dirname, '../../static/earth-outline-shifted-gray.png'))

        var outlineTexture = new THREE.TextureLoader()
            .load(path.join(__dirname, '../../static/earth-outline-shifted-gray.png'));

        var blendImage = new THREE.TextureLoader()
            .load(path.join(__dirname, '../../static/land_ocean_ice_cloud_2048.jpg'));

        var planeMaterial = new THREE.ShaderMaterial(
            {
                uniforms:
                {
                    width: { type: "f", value: window.innerWidth },
                    height: { type: "f", value: window.innerHeight },
                    mapIndex: { type: "t", value: mapTexture },
                    outline: { type: "t", value: outlineTexture },
                    lookup: { type: "t", value: lookupTexture },
                    blendImage: { type: "t", value: blendImage }
                },
                vertexShader: document.getElementById('globeVertexShader').textContent,
                fragmentShader: document.getElementById('globeFragmentShader').textContent
            });

        const geometry = new THREE.SphereGeometry(100, 64, 32);
        this.setState({
            mesh: new THREE.Mesh(geometry, planeMaterial)
        }, () => {
            const { mesh } = this.state;
            mesh.position.set(0, 0, 0);
            scene.add(mesh);
        })

        document.addEventListener('mousemove', this.mouseMove, false);
        document.addEventListener('mousedown', this.mouseClick, false);

        var imageObj = new Image();
        imageObj.onload = function () {
            mapContext.drawImage(imageObj, 0, 0);
        };
        imageObj.src = path.join(__dirname, '../../static/earth-index-shifted-gray.png');

        function update() {
            //Render:
            renderer.clear();
            renderer.render(scene, camera);
            // Schedule the next frame:
            requestAnimationFrame(update);
        }
        // Schedule the first frame:
        requestAnimationFrame(update);
        window.addEventListener('resize', this.onWindowResize);
    }
    // update the mouse position
    mouseMove(event) {
        let { mouse2D } = this.state;
        mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse2D.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    mouseClick(event) {
        const { scene, mouse2D, raycaster, camera } = this.state;
        mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse2D.y = - (event.clientY / window.innerHeight) * 2 + 1;
        console.log("CLICK");
        var countryCode = -1;
        raycaster.setFromCamera( mouse2D, camera )
        // var material = new THREE.LineBasicMaterial({
        //     color: 0x0000ff
        // });
        // var arrow = new THREE.ArrowHelper( camera.getWorldDirection(), camera.getWorldPosition(), 1000, Math.random() * 0xffffff );
        // scene.add( arrow );
        var intersectionList = raycaster.intersectObjects(scene.children, true);
        console.log(intersectionList)
        if (intersectionList.length > 0) {
            var data = intersectionList[0];
            var d = data.point.clone().normalize();
            var u = Math.round(4096 * (1 - (0.5 + Math.atan2(d.z, d.x) / (2 * Math.PI))));
            var v = Math.round(2048 * (0.5 - Math.asin(d.y) / Math.PI));
            var p = mapContext.getImageData(u, v, 1, 1).data;
            countryCode = p[0];
            console.log(countryCode)

            for (var prop in countryColorMap) {
                if (countryColorMap.hasOwnProperty(prop)) {
                    if (countryColorMap[prop] === countryCode)
                        console.log(prop, countryCode);
                }
            } // end for loop

            lookupContext.clearRect(0, 0, 256, 1);

            for (var i = 0; i < 228; i++) {
                if (i == 0)
                    lookupContext.fillStyle = "rgba(0,0,0,1.0)"
                else if (i == countryCode)
                    lookupContext.fillStyle = "rgba(50,50,0,0.5)"
                else
                    lookupContext.fillStyle = "rgba(0,0,0,1.0)"

                lookupContext.fillRect(i, 0, 1, 1);
            }

            lookupTexture.needsUpdate = true;
        }

    } // end mouseClick function


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

                renderer.setSize(wWidth, wHeight);
            })

        }, 1000);
        debouncedHandleResize();

    }

    render() {
        return (
            <div ref={ref => (this.mount = ref)} />
        )
    }
}

