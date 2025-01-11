// import GUI from 'lil-gui'
import * as THREE from 'three/webgpu'
// import { sin, positionLocal, time, vec2, vec3, vec4, uv, uniform, color, fog, rangeFogFactor } from 'three/tsl'
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
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 6
camera.position.y = 3
camera.position.z = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer -  uses WebGPU for potentially better performance compared to WebGL
 */
const renderer = new THREE.WebGPURenderer({
    canvas: canvas,
    forceWebGL: false
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.setClearColor(fogColor.value) // 🔴

/**
 * Dummy
 */
// Material
// const material = new THREE.MeshBasicNodeMaterial()

// // Uniforms
// const timeFrequency = uniform(0.5)
// const positionFrequency = uniform(2)
// const intensityFrequency = uniform(0.5)

// // Position
// const oscillation = sin(time.mul(timeFrequency).add(positionLocal.y.mul(positionFrequency))).mul(intensityFrequency)
// material.positionNode = vec3(
//     positionLocal.x.add(oscillation),
//     positionLocal.y,
//     positionLocal.z
// )

// // Color
// material.colorNode = vec4(
//     uv().mul(vec2(32, 8)).fract(),
//     1,
//     1
// )

// // Mesh
// const mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(1, 0.35, 128, 32), material)
// scene.add(mesh)

// // Tweaks
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
console.log('Planes array:', planes); // Has 80 planes!
console.log('BufferGeometryUtils:', BufferGeometryUtils);
const geometry = BufferGeometryUtils.mergeGeometries(planes);
console.log('mergedGeometry:', geometry);

if (geometry) {
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
} else {
  console.error('Failed to create merged geometry');
}

// END OF 🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱

/**
 * Animate
 */
const tick = () =>
  {
      // Update controls
      controls.update()

      // Render
      renderer.renderAsync(scene, camera)
  }
  renderer.setAnimationLoop(tick)


/**
 * Q&A
 */
// What is a normal?
  // A normal is a vector that is perpendicular to the surface of an object.
  // It is used to determine the direction of light reflection.
  // It is used to determine the direction of the camera.
