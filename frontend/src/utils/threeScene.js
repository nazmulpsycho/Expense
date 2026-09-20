import * as THREE from "three";

export function createFinanceScene(container, options = {}) {
  const {
    width = container.clientWidth,
    height = container.clientHeight,
    colorA = "#00E5FF",
    colorB = "#A855F7",
    particleCount = 120,
    speed = 0.15,
  } = options;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, 0, 14);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(colorA, 1.2);
  dirLight.position.set(-4, 6, 10);
  scene.add(dirLight);
  const dirLight2 = new THREE.DirectionalLight(colorB, 1.0);
  dirLight2.position.set(6, -4, 10);
  scene.add(dirLight2);

  // Currency symbols group
  const currencyGroup = new THREE.Group();

  function makeTextSprite(text, color) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 256, 256);

    // glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 40;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(128, 128, 92, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#050816";
    ctx.font = "bold 130px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 128, 138);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(2.2, 2.2, 1);
    return sprite;
  }

  const symbols = ["$", "€", "£", "¥", "₿", "₹", "¢"];
  symbols.forEach((sym, i) => {
    const sprite = makeTextSprite(sym, i % 2 === 0 ? colorA : colorB);
    const angle = (i / symbols.length) * Math.PI * 2;
    const r = 2.8 + Math.random() * 1.4;
    sprite.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
    sprite.material.opacity = 0.85;
    currencyGroup.add(sprite);
  });

  // Coins ring
  const coinGeom = new THREE.TorusGeometry(0.7, 0.18, 16, 40);
  const coinMat = new THREE.MeshStandardMaterial({
    color: colorA,
    metalness: 0.9,
    roughness: 0.3,
    emissive: colorA,
    emissiveIntensity: 0.4,
  });
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const coin = new THREE.Mesh(coinGeom, coinMat);
    coin.position.set(Math.cos(angle) * 3.6, Math.sin(angle) * 3.6, 0.2);
    coin.rotation.z = angle + Math.PI / 2;
    coin.rotation.x = Math.random() * 0.3;
    coin.userData = { angle, speed: 0.2 + Math.random() * 0.2, wobble: Math.random() * Math.PI * 2 };
    currencyGroup.add(coin);
  }

  scene.add(currencyGroup);

  // Particles
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const velocities = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = -2 + Math.random() * 8;
    const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.18, 0.9, 0.6);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
    sizes[i] = 0.06 + Math.random() * 0.12;
    velocities[i] = speed * (0.6 + Math.random() * 0.8);
  }

  const particleGeom = new THREE.BufferGeometry();
  particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  particleGeom.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const particleMat = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const particleSystem = new THREE.Points(particleGeom, particleMat);
  scene.add(particleSystem);

  // Glow orbs
  const glowGroup = new THREE.Group();
  const glowGeom = new THREE.SphereGeometry(1.6, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: colorA,
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending,
  });
  const glow = new THREE.Mesh(glowGeom, glowMat);
  glow.position.set(0, 0, -1);
  glowGroup.add(glow);
  const glow2 = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 32, 32),
    new THREE.MeshBasicMaterial({ color: colorB, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending })
  );
  glow2.position.set(-2, 1.2, -0.5);
  glowGroup.add(glow2);
  scene.add(glowGroup);

  // Mouse tracking
  let mouseX = 0,
    mouseY = 0;
  const mouse = new THREE.Vector2();

  function handleMouseMove(e) {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  // Resize
  const resizeObserver = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  resizeObserver.observe(container);

  return {
    scene,
    camera,
    renderer,
    currencyGroup,
    particleSystem,
    particleGeom,
    glowGroup,
    handleMouseMove,
    dispose() {
      resizeObserver.disconnect();
      container.removeChild(renderer.domElement);
      renderer.dispose();
    },
    updateAnimating(animate) {
      // No-op; provide loop externally
    },
  };
}

export function animateFinanceScene(ctx, clock) {
  const { camera, currencyGroup, particleSystem, particleGeom, glowGroup, handleMouseMove } = ctx;

  const t = clock.getElapsedTime();

  // Coins orbit + wobble
  currencyGroup.children.forEach((child) => {
    if (child.type === "Sprite") {
      const base = child.userData?.basePos || child.position.clone();
      if (!child.userData.basePos) child.userData.basePos = base;
      child.position.y = base.y + Math.sin(t * 0.8 + child.id) * 0.3;
      child.material.opacity = 0.6 + Math.sin(t * 0.5 + child.id) * 0.2;
      child.position.z = Math.sin(t * 0.4 + child.id * 0.7) * 0.6;
    } else if (child.isMesh && child.geometry.type === "TorusGeometry") {
      const d = child.userData;
      child.position.x = Math.cos(d.angle + t * d.speed) * (3.6 + Math.sin(t * 0.3 + d.wobble) * 0.2);
      child.position.y = Math.sin(d.angle + t * d.speed) * (3.6 + Math.sin(t * 0.3 + d.wobble) * 0.2);
      child.position.z = Math.sin(t * 0.6 + d.wobble) * 0.3;
      child.rotation.x += 0.02;
      child.rotation.y += 0.03;
    }
  });

  // Particles slowly drift upward
  const positions = particleGeom.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += 0.004;
    if (positions[i + 1] > 5) positions[i + 1] = -5;
  }
  particleGeom.attributes.position.needsUpdate = true;

  // Glow group subtle pulse + mouse rotation
  glowGroup.rotation.y = Math.sin(t * 0.2) * 0.15;
  glowGroup.rotation.x = Math.cos(t * 0.25) * 0.1;
  camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04;
  camera.position.y += (mouse.y * 0.4 - camera.position.y) * 0.04;
  camera.lookAt(0, 0, 0);

  ctx.renderer.render(ctx.scene, ctx.camera);
}
