// ------------------------------ TSL imports && WebGPURenderer:
// import * as THREE from 'three/webgpu'
// import { sin, positionLocal, time, vec2, vec3, vec4, uv, uniform, color, fog, rangeFogFactor } from 'three/tsl'
                // TSL seems to work with WebGPURenderer. TBD.
                //Renderer: WebGPU has potentially better performance compared to WebGL


// ------------------------------ ShaderMaterial imports && WebGLRenderer:
import * as THREE from 'three'
import GrassMaterial from './View/Materials/GrassMaterial.js';
  // ShaderMaterial can only be used with THREE.WebGLRenderer
  // THREE.WebGPURenderer does not support ShaderMaterial


// ------------------------------ Other imports

// import GUI from 'lil-gui'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

/**
 * Base
 */
// Debug
// const gui = new GUI({
//     width: 400
// })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// const fogColor = uniform(color('#ffffff'))
// scene.fogNode = fog(fogColor, rangeFogFactor(10, 15))

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Helpers
 */
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);
  // The X axis is red. The Y axis is green. The Z axis is blue.

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 200)

// Orthographic Camera
const aspect = sizes.width / sizes.height;
// Define the size of the viewable area
const viewSize = 30; // Adjust this value to control the zoom level

// Create an OrthographicCamera
const camera = new THREE.OrthographicCamera(
  -viewSize * aspect / 2, // left
  viewSize * aspect / 2,  // right
  viewSize / 2,           // top
  -viewSize / 2,          // bottom
  0.1,                    // near clipping plane
  1000                    // far clipping plane
);


camera.position.set(0, 15, 15); // View the grid from above
camera.lookAt(0, 0, 0); // Looking at grid center
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer: WebGPU has potentially better performance compared to WebGL
 */
const renderer = new THREE.WebGLRenderer({ // 🍑 WebGPURenderer or WebGLRenderer
    canvas: canvas,
    // for WebGPURenderer:
      // forceWebGL: false
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.setClearColor(fogColor.value) // 🔴

/**
 * LIGHTS
*/

// Add a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Add an ambient light
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

// // Tweaks Examples
// gui.add(timeFrequency, 'value').min(0).max(5).name('timeFrequency')
// gui.add(positionFrequency, 'value').min(0).max(5).name('positionFrequency')
// gui.add(intensityFrequency, 'value').min(0).max(5).name('intensityFrequency')

// 🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱

const count = 80
const planes = []

for (let i = 0; i < count; i++) {
    const plane = new THREE.PlaneGeometry(1, 1)
    planes.push(plane)

    // Position the planes randomly on a sphere
    const spherical = new THREE.Spherical(
      1 - Math.pow(Math.random(), 3),
      Math.PI * 2 * Math.random(),
      Math.PI * Math.random()
    )

    const position = new THREE.Vector3().setFromSpherical(spherical)
    plane.rotateX(Math.random() * 9999)
    plane.rotateY(Math.random() * 9999)
    plane.rotateZ(Math.random() * 9999)
    plane.translate(
      position.x,
      position.y,
      position.z
    )

    // Update the planes' normals atribute to point outside
    const normal = position.clone().normalize()
    const normalArray = new Float32Array(12)
    for (let i = 0; i < 4; i++) {
        const i3 = i * 3

        const position = new THREE.Vector3(
          plane.attributes.position.array[i3],
          plane.attributes.position.array[i3 + 1],
          plane.attributes.position.array[i3 + 2],
        )

        const mixedNormal = position.lerp(normal, 0.4)
          // Lerp is a linear interpolation between two vectors.
          // It is used to blend between the position and the normal.

        normalArray[i3] = mixedNormal.x
        normalArray[i3 + 1] = mixedNormal.y
        normalArray[i3 + 2] = mixedNormal.z
    }

    plane.setAttribute('normal', new THREE.BufferAttribute(normalArray, 3))
      // BufferAttribute class stores data for an attribute (such as vertex positions, face indices, normals, colors, UVs, and any custom attributes ) associated with a BufferGeometry, which allows for more efficient passing of data to the GPU.
}

// Merge the planes into 1
// console.log('Planes array:', planes); // Has 80 planes!
// console.log('BufferGeometryUtils:', BufferGeometryUtils);
const geometry = BufferGeometryUtils.mergeGeometries(planes);
console.log('mergedGeometry:', geometry);

/**
 * Setting Grass Material
 */
let grassMaterial;
let matcapMaterial;

/**
 * Using GreenMatCap for some texture and debugging
 */
const textureLoader = new THREE.TextureLoader();
const texturePath = '7.png'; // greenmatcap

const greenMatCapTexture = textureLoader.load(
  texturePath,
  () => console.log('Matcap texture loaded successfully'), // Success callback
  undefined,
  (error) => console.error('Error loading matcap texture:', error) // Error callback
  );
const greenMatCapMaterial = new THREE.MeshMatcapMaterial({ matcap: greenMatCapTexture });


if (geometry) {
  // MeshBasicMaterial for debugging
  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false });
  matcapMaterial = greenMatCapMaterial;

  grassMaterial = GrassMaterial();

  /**
   * Creating Mesh
   */
  const mesh = new THREE.Mesh(geometry, matcapMaterial); // grassMaterial 😎

  // Set up transformation matrix for each instance
  const dummy = new THREE.Object3D();

  // Set up grid
  const gridSize = 10;
  const gridSpacing = 3;
  // const gridOffset = (gridSize * gridSpacing) / 2;

  // Calculate the offset to position the center element at the origin
  const centerIndex = Math.floor(gridSize / 2);

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      // New mesh for each bush
      const grassMesh = new THREE.Mesh(geometry, matcapMaterial); // grassMaterial 😎

      grassMesh.position.set(
        // i * gridSpacing - gridOffset + gridSpacing / 2,
        // 0, // Y constant as I want them on the same plane
        // j * gridSpacing - gridOffset + gridSpacing / 2

        (i - centerIndex) * gridSpacing,
        0, // Y constant as I want them on the same plane
        (j - centerIndex) * gridSpacing - 10
      );

      console.log(`Mesh at grid (${i}, ${j}) positioned at:`, grassMesh.position);

      // Set uniforms for each grass mesh
        // 😎 currently not in use.
      grassMaterial.uniforms.uPlayerPosition.value = new THREE.Vector3(grassMesh.position.x, 0, grassMesh.position.z);

      scene.add(grassMesh);
    }
  }
} else {
  console.error('Failed to create merged geometry');
}




// END OF 🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱

/**
 * Animate
 */
const tick = () =>
  {
      // Update time uniform
      if (grassMaterial && grassMaterial.uniforms) {
        // Update time uniform
        grassMaterial.uniforms.uTime.value = performance.now() / 1000;
      } else {
          console.error('grassMaterial or its uniforms are not defined');
      }

      // Update controls
      controls.update();

      // Render for WebGPURenderer
      // renderer.renderAsync(scene, camera)

      // Render for WebGLRenderer
      renderer.render(scene, camera);
  }

// Render for WebGPURenderer
// renderer.setAnimationLoop(tick)

// Use requestAnimationFrame for the animation loop
const animate = () => {
  requestAnimationFrame(animate);
  tick();
};

animate();

// issues could include lack of uniforms or wrong animation loop

/**
 * Q&A
 */
// What is a normal?
  // A normal is a vector that is perpendicular to the surface of an object.
  // It is used to determine the direction of light reflection.
  // It is used to determine the direction of the camera.
