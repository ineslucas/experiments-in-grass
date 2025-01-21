import * as THREE from 'three'

import vertexShader from './Shaders/Grass/vertex.glsl'
import fragmentShader from './Shaders/Grass/fragment.glsl'

export default function GrassMaterial()
{
    const material = new THREE.ShaderMaterial({
        uniforms:
        {
            // Perhaps multiple instances of grass material is why these were set to null and added later.
            // uTime: { value: null },
            // uGrassDistance: { value: null },
            // uPlayerPosition: { value: null },
            // uTerrainSize: { value: null },
            // uTerrainTextureSize: { value: null },
            // uTerrainATexture: { value: null },
            // uTerrainAOffset: { value: null },
            // uTerrainBTexture: { value: null },
            // uTerrainBOffset: { value: null },
            // uTerrainCTexture: { value: null },
            // uTerrainCOffset: { value: null },
            // uTerrainDTexture: { value: null },
            // uTerrainDOffset: { value: null },
            // uNoiseTexture: { value: null },
            // uFresnelOffset: { value: null },
            // uFresnelScale: { value: null },
            // uFresnelPower: { value: null },
            // uSunPosition: { value: null },

            uTime: { value: 0.0 }, // Typically used for time-based animations. Represents elapsed time.
            uGrassDistance: { value: 100.0 }, // How far the grass can be rendered or how it fades out with distance.
            uPlayerPosition: { value: new THREE.Vector3(0, 0, 0) },
            uTerrainSize: { value: 100.0 }, // Likely used to scale and map textures onto the terrain correctly.
            uTerrainTextureSize: { value: 256.0 },
            uTerrainATexture: { value: new THREE.Texture() },
            uTerrainAOffset: { value: new THREE.Vector2(0, 0) },
            uTerrainBTexture: { value: new THREE.Texture() },
            uTerrainBOffset: { value: new THREE.Vector2(0, 0) },
            uTerrainCTexture: { value: new THREE.Texture() },
            uTerrainCOffset: { value: new THREE.Vector2(0, 0) },
            uTerrainDTexture: { value: new THREE.Texture() },
            uTerrainDOffset: { value: new THREE.Vector2(0, 0) },
            uNoiseTexture: { value: new THREE.Texture() },
            uFresnelOffset: { value: 0.0 },
            uFresnelScale: { value: 0.5 },
            uFresnelPower: { value: 2.0 },
            uSunPosition: { value: new THREE.Vector3(0, 1, 0) }, // Calculate lighting effects based on the sun's position, affecting how the grass is shaded.
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    return material
}
