import glsl from 'vite-plugin-glsl';

export default {
    root: 'src/', // Sources files (typically where index.html is)
    publicDir: '../public/', // Path from "root" to static assets (files that are served as they are)
    plugins: [glsl()], // Plugin for glsl shaders
    server:
    {
        host: true, // Open to local network and display URL
    },
    build:
    {
        outDir: '../dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: true // Add sourcemap
    },

    // resolve:
    // {
    //     alias:
    //     {
    //         'three/examples/jsm': 'three/examples/jsm',
    //         'three/addons': 'three/examples/jsm',
    //         'three/tsl': 'three/webgpu',
    //         'three': 'three/webgpu',
    //     }
    // }
}
