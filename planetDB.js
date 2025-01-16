export const PLANETS = {
    "mercury": {
        name: "Mercury",
        radius: 3.2,
        location: {
            x: 58,
            z: 320,
            y: 0
        },
        texture: "./src/assets/textures/mercury.jpg"
    },
    "venus": {
        name: "Venus",
        radius: 4.8,
        location: {
            x: 80,
            z: 320,
            y: 0
        },
        texture:"./src/assets/textures/venus.jpg"
    },
    "earth": {
        name: "Earth",
        radius: 4.8,
        location: {
            x: 100,
            z: 320,
            y: 0
        },
        texture: "./src/assets/textures/earth.jpg"
    },
    "mars": {
        name: "Mars",
        radius: 4.0,
        location: {
            x: 130,
            z: 320,
            y: 0
        },
        texture: "./src/assets/textures/mars.jpg"
    },
    "jupiter": {
        name: "Jupiter",
        radius: 13.0,
        location: {
            x: 175,
            z: 320,
            y: 0
        },
        texture: "./src/assets/textures/jupiter.jpg"
    },
    "saturn": {
        name: "Saturn",
        radius: 10.0,
        location: {
            x: 240,
            z: 320,
            y: 0
        },
        texture: "./src/assets/textures/saturn.jpg",
        ring: {
            inner: 16,
            outer: 32,
            theta: 64,
            texture: "./src/assets/textures/saturn_ring.png"
        }
    },
    "uranus": {
        name: "Uranus",
        radius: 8.0,
        location: {
            x: 280,
            z: 320,
            y: 0
        },
        texture: "./src/assets/textures/uranus.jpg",
        ring: {
            inner: 16,
            outer: 21,
            theta: 64,
            texture: "./src/assets/textures/uranus_ring.png"
        }
    },
    "neptune": {
        name: "Nepture",
        radius: 6.0,
        location: {
            x: 320,
            z: 320,
            y: 0
        },
        texture: "./src/assets/textures/neptune.jpg"
    }
}