<template>
  <div class="main-view" ref="mainView">
    <div id="renderCanvas"></div>
    <input type="file" id="fileInput">
    <button id="renderButton" @click="render">Render</button>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';

export default {
  name: 'MainView',
  mounted() {
    // File input change event
    document.getElementById('fileInput').addEventListener('change', this.handleFileSelect, false);

    // Render button click event
    document.getElementById('renderButton').addEventListener('click', () => {
      try {
        this.render();
      } catch (error) {
        alert('Rendering error: ' + error.message);
      }
    });

    // Start render loop
    this.initThree();
    this.animate();
  },
  methods: {
    initThree() {
      // Create scene
      this.scene = new THREE.Scene();

      // Create camera
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 5;

      // Create renderer
      this.renderer = new THREE.WebGLRenderer();
      this.canvasContainer = document.getElementById('renderCanvas');
      this.renderer.setSize(this.canvasContainer.clientWidth, this.$refs.mainView.clientHeight);
      this.canvasContainer.appendChild(this.renderer.domElement);

      window.addEventListener('resize', this.onWindowResize);
      this.onWindowResize();

      // Create gradient background
      this.gradientTexture = this.createGradientTexture();
      this.scene.background = new THREE.Color(0x78A083); // 将背景设置为蓝色

      // Draw world coordinate system
      this.createAxes(this.scene);

      // Add orbit controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);

      // Set control properties
      this.controls.enableDamping = true; // Enable damping effect for smoother animation
      this.controls.dampingFactor = 0.25; // Damping factor

      this.render();
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.render();
    },
    render() {
      this.renderer.render(this.scene, this.camera);
      console.log("Scene has points? ", this.scene.hasPoints);
      this.controls.update(); // Update controls to respond to mouse input
    },
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const buffer = event.target.result;
          const loader = new PLYLoader();
          const geometry = loader.parse(buffer);

          const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
          const points = new THREE.Points(geometry, material);

          // Check if loaded points exist and print the result
          const nbrGeoPnts = geometry.attributes.position.length;
          const hasPoints = nbrGeoPnts > 0;
          console.log("Points exist in the point cloud:", hasPoints);
          console.log("Number of points in geometry is:", nbrGeoPnts);

          this.scene.add(points);
          this.controls.target.copy(points.position); // Set control target to point cloud position for initial view
          this.controls.update(); // Update controls

          // Automatically adjust camera view to fit loaded point cloud
          const box = new THREE.Box3().setFromObject(points);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const fov = this.camera.fov * (Math.PI / 180);
          let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
          cameraZ *= 1.5; // Enlarge camera view to leave some margin
          this.camera.position.z = cameraZ;
        };
        reader.readAsArrayBuffer(file);
      }
    },
    onWindowResize() {
      const width = this.canvasContainer.clientWidth;
      const height = this.$refs.mainView.clientHeight;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    },
    createGradientTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 256;
      const context = canvas.getContext('2d');

      // Create gradient
      const gradient = context.createLinearGradient(0, 0, 0, 256);
      gradient.addColorStop(0, '#000000'); // Black
      gradient.addColorStop(1, '#0000FF'); // Blue

      // Fill gradient
      context.fillStyle = gradient;
      context.fillRect(0, 0, 1, 256);

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    },
    createAxes(scene) {
      // Create arrowheads for axes
      const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1.5, 0xff0000, 0.4, 0.2); // Increase arrow length, width, and head length
      const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1.5, 0x00ff00, 0.4, 0.2);
      const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1.5, 0x0000ff, 0.4, 0.2);

      // Create axes
      const axesHelper = new THREE.Group();
      axesHelper.add(arrowX);
      axesHelper.add(arrowY);
      axesHelper.add(arrowZ);

      // Create spherical marker
      const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      axesHelper.add(sphere);

      scene.add(axesHelper);
    }
  }
}
</script>

<style scoped>
.main-view {
  width: 70%;
  float: left;
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid #ccc; /* Add border */
}
#renderCanvas {
  width: 100%;
  height: 100%; /* Occupy full parent container */
}
</style>
