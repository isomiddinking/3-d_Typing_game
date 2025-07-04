import * as THREE from 'three';

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    // Sahna
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f2f5);
    this.scene.fog = new THREE.Fog(0xf0f2f5, 10, 50);

    // Kamera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 2, 5);
    this.camera.lookAt(0, 1, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    // Yoritishni sozlash
    this.setupLighting();
    
    // Muhit
    this.createEnvironment();

    // Hajmni o'zgartirishni boshqarish
    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupLighting() {
    // Yumshoq atrof-muhit yorug'ligi
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Asosiy yo'nalishli yorug'lik
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    this.scene.add(directionalLight);

    // Yumshoq soyalar uchun qo'shimcha yorug'lik
    const fillLight = new THREE.DirectionalLight(0xb3c6e7, 0.3);
    fillLight.position.set(-3, 5, -3);
    this.scene.add(fillLight);

    // Belgining ta'rifi uchun halqa yorug'ligi
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
    rimLight.position.set(0, 3, -5);
    this.scene.add(rimLight);
  }

  createEnvironment() {
    // Yer tekisligi
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xfafafa,
      transparent: true,
      opacity: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Chuqurlik uchun nozik geometrik elementlar
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.BoxGeometry(0.5, 0.1, 0.5);
      const material = new THREE.MeshLambertMaterial({ 
        color: 0xe8eaf6,
        transparent: true,
        opacity: 0.4
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(
        (Math.random() - 0.5) * 15,
        0.05,
        (Math.random() - 0.5) * 15
      );
      cube.receiveShadow = true;
      this.scene.add(cube);
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}