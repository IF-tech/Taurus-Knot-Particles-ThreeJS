import "./style.scss";

import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { ObjectLoader } from "three";

//obj loader
const objLoader = new ObjectLoader();

// Texture Loader
const loader = new THREE.TextureLoader();

// Debug
const gui = new dat.GUI();
dat.GUI.toggleHide();

// Canvas
const canvas = document.querySelector("canvas.webgl");
const star = loader.load("./star.png");

// Scene
const scene = new THREE.Scene();

// Objects
// const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
const geometry = new THREE.TorusKnotGeometry(0.5, 0.18, 200, 100);
const particlesGeometry = new THREE.BufferGeometry();
const particlesCnt = 5000;

const posArray = new Float32Array(particlesCnt * 3);

for (let i = 0; i < particlesCnt * 3; i++) {
  //   posArray[i] = Math.random();
  posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3)
);

// Materials

const material = new THREE.PointsMaterial({
  size: 0.003,
});
material.color = new THREE.Color(
  "#" + Math.floor(Math.random() * 16777215).toString(16)
);

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.01,
  map: star,
  transparent: true,
});

// Mesh

const torusKnot = new THREE.Points(geometry, material);
// const sphere = new THREE.Points(geometry, material);
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);
scene.add(torusKnot);
// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = -.3;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color("#080808"), 1);

//Mouse

document.addEventListener("mousemove", animateParticles);
// document.addEventListener("mouseleave", startAutoRotate);

let mouseX = 0;
let mouseY = 0;

function startAutoRotate(event) {
  mouseX = 0;
}

function animateParticles(event) {
  mouseY = event.clientY;
  mouseX = event.clientX;
}

/**
 * Animate
 */

const clock = new THREE.Clock();
let ticks = 0;

const tick = () => {
  ticks += 1;

  const elapsedTime = clock.getElapsedTime();

  // Update objects
  //   sphere.rotation.y = 0.5 * elapsedTime;

  torusKnot.rotation.y = 0.6 * elapsedTime;
  torusKnot.rotation.x = -0.4 * elapsedTime;
  particlesMesh.rotation.y = -0.004 * elapsedTime;
  particlesMesh.rotation.x = -0.005 * elapsedTime;

  if (mouseX != 0) {
    particlesMesh.rotation.x = -particlesMesh.rotation.x -mouseY * 0.00005 ;
    particlesMesh.rotation.y = -particlesMesh.rotation.y -mouseX * 0.00005 ;
  }

  if (ticks % 150 == 0) {
    material.color = new THREE.Color(
      "#" + Math.floor(Math.random() * 16777215).toString(16)
    );
    ticks = 0;
  }

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
