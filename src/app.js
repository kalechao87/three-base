import * as THREE from 'three';
import Detector from 'three-extras/Detector';
import DAT from 'three-extras/libs/dat.gui.min';
import Stats from 'three-extras/libs/stats.min';
import OrbitControls from 'imports-loader?THREE=three!exports-loader?THREE.OrbitControls!three-extras/controls/OrbitControls'; // eslint-disable-line import/no-webpack-loader-syntax

import createEarth from './components/earth/earth';
import createCloud from './components/earth/cloud';
import './scss/main.scss';

class Application {
  constructor(opts = {}) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.autoRotate = false;
    this.rotationSpeed = 0.001;
    this.cloudSpeed = -0.0003;

    if (opts.container) {
      this.container = opts.container;
    } else {
      const div = Application.createContainer();
      document.body.appendChild(div);
      this.container = div;
    }

    if (Detector.webgl) {
      this.init();
      this.render();
    } else {
      // TODO: style warning message
      console.log('WebGL NOT supported in your browser!');
      const warning = Detector.getWebGLErrorMessage();
      this.container.appendChild(warning);
    }
  }

  static createContainer() {
    const div = document.createElement('div');
    div.setAttribute('id', 'canvas-container');
    div.setAttribute('class', 'container');
    return div;
  }

  init() {
    this.createScene();
    this.setupRenderer();
    this.setupCamera();
    this.setupLights();
    this.setupControls();
    this.setupHelpers();
    this.setupGUI();
    this.setupStats();

    this.createEarth();
    this.createCloud();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.earthGroup = new THREE.Group();

    this.scene.add(this.earthGroup);
  }

  render() {
    this.stats.begin();
    // monitored code goes
    this.animate();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    this.stats.end();
    requestAnimationFrame(() => this.render());
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0x222222, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
  }

  setupCamera() {
    const fov = 40;
    const aspect = this.width / this.height;
    const near = 0.1;
    const far = 10000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(3.55, 0, -28);
    this.scene.add(this.camera); // this is required cause there is a light under camera
    // this.camera.lookAt(this.scene.position);
  }

  setupLights() {
    // spotlight
    this.spotLight = new THREE.SpotLight(0xffffff);
    this.spotLight.position.set(-26, 11, -11);
    this.spotLight.angle = 0.2;
    this.spotLight.castShadow = false;
    this.spotLight.penumbra = 0.4;
    this.spotLight.distance = 124;
    this.spotLight.decay = 1;
    this.spotLight.shadow.camera.near = 50;
    this.spotLight.shadow.camera.far = 200;
    this.spotLight.shadow.camera.fov = 35;
    this.spotLight.shadow.mapSize.height = 1024;
    this.spotLight.shadow.mapSize.width = 1024;
    this.scene.add(this.spotLight);
    this.ambientLight = new THREE.AmbientLight(0x393939);
    this.camera.add(this.ambientLight);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera);
    this.controls.rotateSpeed = 0.3;
    this.controls.autoRotate = false;
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.enabled = true;
  }

  setupHelpers() {
    // floor grid helper
    const gridHelper = new THREE.GridHelper(200, 16);
    this.scene.add(gridHelper);
    // XYZ axes helper (XYZ axes are RGB colors, respectively)
    const axisHelper = new THREE.AxisHelper(75);
    this.scene.add(axisHelper);

    // // directional light helper + shadow camera helper
    // const dirLightHelper = new THREE.DirectionalLightHelper(this.dirLight, 10);
    // this.scene.add(dirLightHelper);
    // const dirLightCameraHelper = new THREE.CameraHelper(this.dirLight.shadow.camera);
    // this.scene.add(dirLightCameraHelper);
    // spot light helper + shadow camera helper
    const spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
    this.scene.add(spotLightHelper);
    const spotLightCameraHelper = new THREE.CameraHelper(this.spotLight.shadow.camera);
    this.scene.add(spotLightCameraHelper);
  }

  setupGUI() {
    const gui = new DAT.GUI();
    gui
      .add(this.camera.position, 'x')
      .name('Camera X')
      .min(0)
      .max(100);
    gui
      .add(this.camera.position, 'y')
      .name('Camera Y')
      .min(0)
      .max(100);
    gui
      .add(this.camera.position, 'z')
      .name('Camera Z')
      .min(0)
      .max(100);
  }

  setupStats() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    this.container.appendChild(this.stats.dom);
  }

  createEarth() {
    const earth = createEarth();
    this.earthGroup.add(earth);
  }

  createCloud() {
    const cloud = createCloud();
    this.earthGroup.add(cloud);
    this.cloud = cloud;
  }

  animate(rotationSpeed = this.rotationSpeed, cloudSpeed = this.cloudSpeed) {
    if (this.autoRotate) {
      this.camera.position.x =
        this.camera.position.x * Math.cos(rotationSpeed) -
        this.camera.position.z * Math.sin(rotationSpeed);
      this.camera.position.z =
        this.camera.position.z * Math.cos(rotationSpeed) +
        this.camera.position.x * Math.sin(rotationSpeed);
    }

    this.cloud.rotation.y += cloudSpeed;
  }
}

(() => {
  const app = new Application({
    container: document.getElementById('canvas-container'),
  });
  console.log(app);
})();

// function startApp() {
//   const app = document.createElement('div');
//   app.setAttribute('id', 'app');
//   document.body.appendChild(app);
// }

// startApp();
