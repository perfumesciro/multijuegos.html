import * as THREE from 'three';

// --- CONFIGURACIÓN DE ESCENA ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 60, 220);

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 500);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// --- LUCES ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
dirLight.position.set(80, 120, 60);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 10;
dirLight.shadow.camera.far = 300;
const d = 120;
dirLight.shadow.camera.left = -d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = -d;
scene.add(dirLight);

// --- ESTADO DEL JUEGO ---
const state = {
  paused: false,
  inCar: false,
  money: 500,
  wanted: 0,
  health: 100,
  cameraYaw: 0,
  cameraPitch: 0.25
};

const keys = {};
const buildings = []; // Para colisiones AABB
const bullets = [];
const npcs = [];

// --- GENERACIÓN DE CIUDAD LOW-POLY ---
function createCity() {
  // Suelo asfalto
  const groundGeo = new THREE.PlaneGeometry(400, 400);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Cuadrícula de manzanas y edificios
  const blockSpacing = 36;
  const colors = [0x95a5a6, 0x7f8c8d, 0xd35400, 0x2980b9, 0x8e44ad, 0xc0392b];

  for (let x = -144; x <= 144; x += blockSpacing) {
    for (let z = -144; z <= 144; z += blockSpacing) {
      // Dejar centro despejado para aparecer
      if (Math.abs(x) < 25 && Math.abs(z) < 25) continue;

      // Acera
      const sidewalkGeo = new THREE.BoxGeometry(24, 0.3, 24);
      const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0xbdc3c7 });
      const sidewalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
      sidewalk.position.set(x, 0.15, z);
      sidewalk.receiveShadow = true;
      scene.add(sidewalk);

      // Edificio
      const width = 16 + Math.random() * 4;
      const depth = 16 + Math.random() * 4;
      const height = 12 + Math.random() * 35;
      const color = colors[Math.floor(Math.random() * colors.length)];

      const bGeo = new THREE.BoxGeometry(width, height, depth);
      const bMat = new THREE.MeshStandardMaterial({ color });
      const building = new THREE.Mesh(bGeo, bMat);
      building.position.set(x, height / 2 + 0.3, z);
      building.castShadow = true;
      building.receiveShadow = true;
      scene.add(building);

      // Guardar caja de colisión
      buildings.push({
        minX: x - width / 2,
        maxX: x + width / 2,
        minZ: z - depth / 2,
        maxZ: z + depth / 2
      });
    }
  }
}
createCity();

// --- PERSONAJE (JUGADOR) ---
const player = new THREE.Group();
const bodyMesh = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 1.4, 0.5),
  new THREE.MeshStandardMaterial({ color: 0x27ae60 }) // Camiseta verde estilo Grove Street
);
bodyMesh.position.y = 1.1;
bodyMesh.castShadow = true;
player.add(bodyMesh);

const headMesh = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  new THREE.MeshStandardMaterial({ color: 0xf1c27d })
);
headMesh.position.y = 2.05;
headMesh.castShadow = true;
player.add(headMesh);

const legsMesh = new THREE.Mesh(
  new THREE.BoxGeometry(0.7, 0.8, 0.45),
  new THREE.MeshStandardMaterial({ color: 0x2c3e50 })
);
legsMesh.position.y = 0.4;
legsMesh.castShadow = true;
player.add(legsMesh);

player.position.set(0, 0, 5);
scene.add(player);

const playerPhysics = {
  velY: 0,
  onGround: true,
  speed: 8,
  sprintSpeed: 15
};

// --- AUTO MANEJABLE ---
const car = new THREE.Group();
const chassis = new THREE.Mesh(
  new THREE.BoxGeometry(2.2, 0.9, 4.4),
  new THREE.MeshStandardMaterial({ color: 0xe74c3c })
);
chassis.position.y = 0.75;
chassis.castShadow = true;
car.add(chassis);

const cabin = new THREE.Mesh(
  new THREE.BoxGeometry(1.8, 0.7, 2.2),
  new THREE.MeshStandardMaterial({ color: 0x222222 })
);
cabin.position.set(0, 1.45, -0.2);
cabin.castShadow = true;
car.add(cabin);

// Ruedas
const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.35, 16);
const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
const wheelOffsets = [
  [-1.15, 0.42, 1.3], [1.15, 0.42, 1.3],
  [-1.15, 0.42, -1.3], [1.15, 0.42, -1.3]
];
wheelOffsets.forEach(([wx, wy, wz]) => {
  const wheel = new THREE.Mesh(wheelGeo, wheelMat);
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(wx, wy, wz);
  car.add(wheel);
});

car.position.set(6, 0, 0);
scene.add(car);

const carPhysics = {
  speed: 0,
  maxSpeed: 38,
  reverseSpeed: -14,
  accel: 22,
  friction: 10,
  turnSpeed: 2.4
};

// --- PEATONES (NPCs) ---
function spawnNPCs(count) {
  const npcMat = new THREE.MeshStandardMaterial({ color: 0x3498db });
  for (let i = 0; i < count; i++) {
    const npc = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.8, 0.6), npcMat);
    npc.position.set((Math.random() - 0.5) * 160, 0.9, (Math.random() - 0.5) * 160);
    npc.castShadow = true;
    npc.userData = {
      angle: Math.random() * Math.PI * 2,
      timer: Math.random() * 4,
      alive: true
    };
    scene.add(npc);
    npcs.push(npc);
  }
}
spawnNPCs(25);

// --- CONTROLES Y EVENTOS ---
window.addEventListener('keydown', (e) => {
  keys[e.code] = true;

  if (e.code === 'Escape') {
    togglePause();
  }

  // Entrar / Salir del vehículo
  if (e.code === 'KeyF' && !state.paused) {
    if (!state.inCar) {
      const dist = player.position.distanceTo(car.position);
      if (dist < 4.5) {
        state.inCar = true;
        player.visible = false;
        document.getElementById('mode-indicator').textContent = 'MODO: VEHÍCULO';
      }
    } else {
      state.inCar = false;
      player.visible = true;
      player.position.copy(car.position);
      player.position.x -= Math.cos(car.rotation.y) * 2.5;
      player.position.z += Math.sin(car.rotation.y) * 2.5;
      document.getElementById('mode-indicator').textContent = 'MODO: A PIE';
    }
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// Bloqueo de ratón para girar cámara
renderer.domElement.addEventListener('click', () => {
  if (!state.paused && document.pointerLockElement !== renderer.domElement) {
    renderer.domElement.requestPointerLock();
  }
});

window.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement === renderer.domElement && !state.paused) {
    state.cameraYaw -= e.movementX * 0.0025;
    state.cameraPitch = Math.max(0.05, Math.min(1.1, state.cameraPitch + e.movementY * 0.002));
  }
});

// Disparar (Clic izquierdo)
window.addEventListener('mousedown', (e) => {
  if (e.button === 0 && document.pointerLockElement === renderer.domElement && !state.paused && !state.inCar) {
    shoot();
  }
});

function shoot() {
  const bullet = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 6, 6),
    new THREE.MeshBasicMaterial({ color: 0xf1c40f })
  );
  bullet.position.copy(player.position).add(new THREE.Vector3(0, 1.5, 0));

  // Dirección hacia donde mira la cámara
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  bullet.userData = { vel: dir.multiplyScalar(65), life: 1.5 };

  scene.add(bullet);
  bullets.push(bullet);
}

// Menú Pausa y Reinicio
const pauseMenu = document.getElementById('pause-menu');
function togglePause() {
  state.paused = !state.paused;
  pauseMenu.classList.toggle('hidden', !state.paused);
  if (state.paused && document.pointerLockElement) {
    document.exitPointerLock();
  }
}

document.getElementById('resume-btn').addEventListener('click', togglePause);
document.getElementById('reset-btn').addEventListener('click', () => {
  state.inCar = false;
  player.visible = true;
  player.position.set(0, 0, 5);
  car.position.set(6, 0, 0);
  car.rotation.set(0, 0, 0);
  carPhysics.speed = 0;
  state.wanted = 0;
  updateHUD();
  togglePause();
});

// --- DETECCIÓN DE COLISIONES ---
function checkBuildingCollision(x, z, radius) {
  for (const b of buildings) {
    if (x + radius > b.minX && x - radius < b.maxX && z + radius > b.minZ && z - radius < b.maxZ) {
      return true;
    }
  }
  return false;
}

// --- ACTUALIZAR HUD Y MINIMAPA ---
const minimapCanvas = document.getElementById('minimap');
const mCtx = minimapCanvas.getContext('2d');

function updateHUD() {
  document.getElementById('money-display').textContent = `$${String(state.money).padStart(8, '0')}`;
  const stars = Array.from({ length: 5 }, (_, i) => (i < state.wanted ? '★' : '☆')).join(' ');
  const starsEl = document.getElementById('wanted-stars');
  starsEl.textContent = stars;
  starsEl.style.color = state.wanted > 0 ? '#f1c40f' : 'rgba(255,255,255,0.25)';
}

function drawMinimap() {
  mCtx.fillStyle = '#1e272e';
  mCtx.fillRect(0, 0, 160, 160);

  const target = state.inCar ? car : player;
  const scale = 0.75;

  mCtx.save();
  mCtx.translate(80, 80);
  mCtx.rotate(state.cameraYaw);

  // Dibujar edificios cercanos
  mCtx.fillStyle = '#576574';
  for (const b of buildings) {
    const bx = (b.minX - target.position.x) * scale;
    const bz = (b.minZ - target.position.z) * scale;
    const bw = (b.maxX - b.minX) * scale;
    const bd = (b.maxZ - b.minZ) * scale;
    mCtx.fillRect(bx, bz, bw, bd);
  }

  // Dibujar auto si estás a pie
  if (!state.inCar) {
    mCtx.fillStyle = '#e74c3c';
    mCtx.beginPath();
    mCtx.arc((car.position.x - target.position.x) * scale, (car.position.z - target.position.z) * scale, 4, 0, Math.PI * 2);
    mCtx.fill();
  }

  mCtx.restore();

  // Jugador en el centro
  mCtx.fillStyle = '#2ecc71';
  mCtx.beginPath();
  mCtx.moveTo(80, 74);
  mCtx.lineTo(85, 85);
  mCtx.lineTo(75, 85);
  mCtx.closePath();
  mCtx.fill();
}

// --- BUCLE PRINCIPAL ---
const clock = new THREE.Clock();
let frameCount = 0;
let fpsTimer = 0;

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  // Contador FPS
  frameCount++;
  fpsTimer += dt;
  if (fpsTimer >= 0.5) {
    document.getElementById('fps-counter').textContent = `FPS: ${Math.round(frameCount / fpsTimer)}`;
    frameCount = 0;
    fpsTimer = 0;
  }

  if (state.paused) return;

  // 1. MOVIMIENTO A PIE
  if (!state.inCar) {
    const moveSpeed = keys['ShiftLeft'] ? playerPhysics.sprintSpeed : playerPhysics.speed;
    let moveX = 0;
    let moveZ = 0;

    if (keys['KeyW']) moveZ -= 1;
    if (keys['KeyS']) moveZ += 1;
    if (keys['KeyA']) moveX -= 1;
    if (keys['KeyD']) moveX += 1;

    if (moveX !== 0 || moveZ !== 0) {
      const inputAngle = Math.atan2(moveX, moveZ) + state.cameraYaw;
      player.rotation.y = inputAngle;

      const nextX = player.position.x + Math.sin(inputAngle) * moveSpeed * dt;
      const nextZ = player.position.z + Math.cos(inputAngle) * moveSpeed * dt;

      if (!checkBuildingCollision(nextX, player.position.z, 0.6)) player.position.x = nextX;
      if (!checkBuildingCollision(player.position.x, nextZ, 0.6)) player.position.z = nextZ;
    }

    // Salto y gravedad
    if (keys['Space'] && playerPhysics.onGround) {
      playerPhysics.velY = 9;
      playerPhysics.onGround = false;
    }
    playerPhysics.velY -= 24 * dt;
    player.position.y += playerPhysics.velY * dt;
    if (player.position.y <= 0) {
      player.position.y = 0;
      playerPhysics.velY = 0;
      playerPhysics.onGround = true;
    }
  }

  // 2. CONDUCCIÓN DE VEHÍCULO
  if (state.inCar) {
    if (keys['KeyW']) {
      carPhysics.speed = Math.min(carPhysics.maxSpeed, carPhysics.speed + carPhysics.accel * dt);
    } else if (keys['KeyS']) {
      carPhysics.speed = Math.max(carPhysics.reverseSpeed, carPhysics.speed - carPhysics.accel * dt);
    } else {
      // Fricción natural
      if (Math.abs(carPhysics.speed) < 0.3) carPhysics.speed = 0;
      else carPhysics.speed -= Math.sign(carPhysics.speed) * carPhysics.friction * dt;
    }

    // Freno de mano
    if (keys['Space']) {
      carPhysics.speed *= 0.92;
    }

    // Giro proporcional a la velocidad
    if (Math.abs(carPhysics.speed) > 0.5) {
      const dir = carPhysics.speed > 0 ? 1 : -1;
      if (keys['KeyA']) car.rotation.y += carPhysics.turnSpeed * dt * dir;
      if (keys['KeyD']) car.rotation.y -= carPhysics.turnSpeed * dt * dir;
    }

    const nextCarX = car.position.x + Math.sin(car.rotation.y) * carPhysics.speed * dt;
    const nextCarZ = car.position.z + Math.cos(car.rotation.y) * carPhysics.speed * dt;

    if (!checkBuildingCollision(nextCarX, nextCarZ, 1.8)) {
      car.position.x = nextCarX;
      car.position.z = nextCarZ;
    } else {
      carPhysics.speed *= -0.4; // Rebote al chocar
    }
  }

  // 3. BALAS Y NPCs
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.position.addScaledVector(b.userData.vel, dt);
    b.userData.life -= dt;

    // Colisión con NPCs
    for (const npc of npcs) {
      if (npc.userData.alive && b.position.distanceTo(npc.position) < 1.2) {
        npc.userData.alive = false;
        npc.rotation.x = Math.PI / 2;
        npc.position.y = 0.3;
        state.money += 50;
        state.wanted = Math.min(5, state.wanted + 1);
        updateHUD();
        b.userData.life = 0;
      }
    }

    if (b.userData.life <= 0) {
      scene.remove(b);
      bullets.splice(i, 1);
    }
  }

  // Movimiento básico de peatones
  for (const npc of npcs) {
    if (!npc.userData.alive) continue;
    npc.userData.timer -= dt;
    if (npc.userData.timer <= 0) {
      npc.userData.angle = Math.random() * Math.PI * 2;
      npc.userData.timer = 2 + Math.random() * 4;
    }
    const nx = npc.position.x + Math.sin(npc.userData.angle) * 2.5 * dt;
    const nz = npc.position.z + Math.cos(npc.userData.angle) * 2.5 * dt;
    if (!checkBuildingCollision(nx, nz, 0.6)) {
      npc.position.x = nx;
      npc.position.z = nz;
      npc.rotation.y = npc.userData.angle;
    } else {
      npc.userData.angle += Math.PI;
    }
  }

  // 4. CÁMARA EN TERCERA PERSONA
  const target = state.inCar ? car : player;
  const camDist = state.inCar ? 10 : 6;
  const camHeight = state.inCar ? 3.5 : 2.5;

  const camX = target.position.x + Math.sin(state.cameraYaw) * camDist * Math.cos(state.cameraPitch);
  const camZ = target.position.z + Math.cos(state.cameraYaw) * camDist * Math.cos(state.cameraPitch);
  const camY = target.position.y + camHeight + Math.sin(state.cameraPitch) * camDist;

  camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.18);
  camera.lookAt(target.position.x, target.position.y + 1.5, target.position.z);

  drawMinimap();
  renderer.render(scene, camera);
}

// Ajustar ventana
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
