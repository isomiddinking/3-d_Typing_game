import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class CharacterController {
  constructor(scene) {
    this.scene = scene;
    this.model = null;
    this.mixer = null;
    this.animations = {};
    this.currentAnimation = null;
    this.emotionTimer = 0;
    this.idleTimer = 0;
  }

  async init() {
    const loader = new GLTFLoader();
    
    try {
      const gltf = await loader.loadAsync('https://play.rosebud.ai/assets/Cube Guy Character.glb?rYdC');
      
      this.model = gltf.scene;
      this.model.position.set(0, 0, 0);
      this.model.scale.setScalar(1.2);
      this.model.castShadow = true;
      
      // Barcha meshlar uchun soyalarni yoqish
      this.model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      this.scene.add(this.model);
      
      // Animatsiyalarni sozlash
      this.mixer = new THREE.AnimationMixer(this.model);
      gltf.animations.forEach((clip) => {
        const action = this.mixer.clipAction(clip);
        const animName = this.getSimpleAnimName(clip.name);
        this.animations[animName] = action;
      });
      
      // "Idle" animatsiyasini boshlash
      this.playAnimation('Idle', true);
      
    } catch (error) {
      console.error('Belgini yuklash muvaffaqiyatsiz tugadi:', error);
    }
  }

  getSimpleAnimName(fullName) {
    // To'liq animatsiya yo'lidan oddiy nomni ajratib olish
    const parts = fullName.split('|');
    return parts[parts.length - 1];
  }

  playAnimation(animName, loop = false) {
    if (!this.animations[animName]) return;
    
    // Joriy animatsiyani to'xtatish
    if (this.currentAnimation) {
      this.currentAnimation.stop();
    }
    
    const action = this.animations[animName];
    action.reset();
    action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce);
    action.play();
    
    this.currentAnimation = action;
    
    // Agar takrorlanmasa, animatsiyadan keyin "Idle" holatiga qaytish
    if (!loop) {
      setTimeout(() => {
        this.playAnimation('Idle', true);
      }, action.getClip().duration * 1000);
    }
  }

  // Belgining terish ishlashiga reaksiyalari
  onCorrectKeypress() {
    if (Math.random() < 0.3) { // 30% ehtimollik bilan tabriklash
      this.playAnimation('Yes');
    }
  }

  onIncorrectKeypress() {
    this.playAnimation('No');
  }

  onGoodSpeed() {
    this.playAnimation('Wave');
  }

  onWordComplete() {
    if (Math.random() < 0.5) {
      this.playAnimation('Punch'); // G'alaba mushti
    }
  }

  onPerfectAccuracy() {
    this.playAnimation('Wave');
  }

  update(deltaTime) {
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }
    
    // Nozik "Idle" harakati
    this.idleTimer += deltaTime;
    if (this.model) {
      this.model.rotation.y = Math.sin(this.idleTimer * 0.5) * 0.1;
      this.model.position.y = Math.sin(this.idleTimer * 2) * 0.02;
    }
  }
}