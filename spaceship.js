const PI = Math.PI;

let Spaceship = {
    position: {
        x: 800,
        y: 0,
        z: 300
    },
    rotation: {
        x: 0,
        y: 1,
        z: 0
    }
}

let keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    q: false,
    e: false
};

const SPEED = 1;

window.addEventListener('keydown', (event) => {
    switch (event.key){
        case 'w':
        case 'W':
            keys.w = true;
            break;
        case 'a':
        case 'A':
            keys.a = true;
            break;
        case 's':
        case 'S':
            keys.s = true;
            break;
        case 'd':
        case 'D':
            keys.d = true;
            break;
        case 'q':
        case 'Q':
            keys.q = true;
            break;
        case 'e':
        case 'E':
            keys.e = true;
            break;
    }
});

// Tambahkan event listener untuk mendeteksi tombol dilepaskan
window.addEventListener('keyup', (event) => {
    switch (event.key){
        case 'w':
        case 'W':
            keys.w = false;
            break;
        case 'a':
        case 'A':
            keys.a = false;
            break;
        case 's':
        case 'S':
            keys.s = false;
            break;
        case 'd':
        case 'D':
            keys.d = false;
            break;
        case 'q':
        case 'Q':
            keys.q = false;
            break;
        case 'e':
        case 'E':
            keys.e = false;
            break;
    }
});

function updateMovement(){
    if(keys.w){
        Spaceship.position.x += Math.sin(Spaceship.rotation.y);
        Spaceship.position.z += Math.cos(Spaceship.rotation.y);
    }
    if(keys.s){
        Spaceship.position.x -= Math.sin(Spaceship.rotation.y);
        Spaceship.position.z -= Math.cos(Spaceship.rotation.y);
    }
    if(keys.a){
        Spaceship.rotation.y += PI * 0.003;
    }
    if(keys.d){
        Spaceship.rotation.y -= PI * 0.003;
    }
    if(keys.q){
        Spaceship.position.y -= SPEED;
    }
    if(keys.e){
        Spaceship.position.y += SPEED;
    }
}

function gameTick(){
    updateMovement();
    requestAnimationFrame(gameTick);
}
gameTick();

export function getSpaceShipData(){
    return Spaceship;
}
