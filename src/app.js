import * as THREE from 'three';
import Detector from 'three-extras/Detector';
import DAT from 'three-extras/libs/dat.gui.min';
import Stats from 'three-extras/libs/stats.min';
import OrbitControls from 'imports-loader?THREE=three!exports-loader?THREE.OrbitControls!three-extras/controls/OrbitControls'; // eslint-disable-line import/no-webpack-loader-syntax
import './scss/main.scss';

class Application {
  constructor(opts = {}) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

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
    this.scene = new THREE.Scene();
    this.setupRenderer();
    this.setupCamera();
    this.setupControls();
    this.setupHelpers();
    this.setupGUI();
    this.setupStats();
  }

  render() {
    this.stats.begin();
    // monitored code goes
    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    this.stats.end();
    requestAnimationFrame(() => this.render());
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0x222222);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
  }

  setupCamera() {
    const fov = 75;
    const aspect = this.width / this.height;
    const near = 0.1;
    const far = 10000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(100, 100, 100);
    this.camera.lookAt(this.scene.position);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enabled = true;
    this.controls.maxDistance = 1500;
    this.controls.minDistance = 0;
    this.controls.autoRotate = true;
  }

  setupHelpers() {
    // floor grid helper
    const gridHelper = new THREE.GridHelper(200, 16);
    this.scene.add(gridHelper);
    // XYZ axes helper (XYZ axes are RGB colors, respectively)
    const axisHelper = new THREE.AxisHelper(75);
    this.scene.add(axisHelper);
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
}

// (() => {
//   const app = new Application({
//     // container: document.getElementById('canvas-container'),
//   });
//   console.log(app);
// })();

function startApp() {
  const app = document.createElement('div');
  app.setAttribute('id', 'app');
  document.body.appendChild(app);
}

startApp();
