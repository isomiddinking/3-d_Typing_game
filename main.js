import * as THREE from 'three';
import { SceneManager } from './sceneSetup.js';
import { CharacterController } from './character.js';
import { TypingGame } from './typingGame.js';
import { UIManager } from './ui.js';

class Game {
  constructor() {
    this.container = document.getElementById('gameContainer');
    this.clock = new THREE.Clock();
    this.sceneManager = null;
    this.character = null;
    this.ui = null;
    this.typingGame = null;
    
    this.startButton = document.getElementById('startButton');
    this.restartButton = document.getElementById('restartButton');
    this.timeLimitSelect = document.getElementById('timeLimit');
    
    this.initGameComponents(); // Sahna va belgi kabi komponentlarni dastlabki ishga tushirish
    this.setupEventListeners();
  }

  async initGameComponents() {
    // Sahna, belgi va UI ni faqat bir marta ishga tushirish
    if (!this.sceneManager) {
      this.sceneManager = new SceneManager(this.container);
    }
    if (!this.character) {
      this.character = new CharacterController(this.sceneManager.scene);
      await this.character.init();
    }
    if (!this.ui) {
      this.ui = new UIManager();
    }
    
    // TypingGame ni character, ui va o'yin tugashi callbacki bilan birga init qilish
    // Bu callback orqali o'yin tugaganda main.js ga xabar beriladi
    this.typingGame = new TypingGame(this.character, this.ui, this.endGame.bind(this));
    
    // O'yinni boshlang'ich holatga keltirish
    this.typingGame.resetGame();
    this.ui.hideResultScreen(); // Natija ekranini yashirish
    this.ui.showInstructions('Select a time limit and click "Start Game" to begin!');
    this.animate(); // Render tsiklini doimiy ushlab turish
  }

  setupEventListeners() {
    this.startButton.addEventListener('click', () => this.startGame());
    this.restartButton.addEventListener('click', () => this.resetAndStartGame());
  }

  startGame() {
    const timeLimit = parseInt(this.timeLimitSelect.value); // Tanlangan vaqtni olish
    this.ui.hideInstructions(); // Instruksiyalarni yashirish
    this.typingGame.startNewGame(timeLimit); // TypingGame ga vaqt chegarasini o'tkazish
  }

  endGame(finalStats) {
    // O'yin tugaganda natijalarni ko'rsatish
    this.ui.displayResultScreen(finalStats);
    this.ui.showResultScreen();
    this.ui.showInstructions('Click "Play Again" to restart.');
  }

  resetAndStartGame() {
    // O'yinni qayta boshlash
    this.ui.hideResultScreen(); // Natija ekranini yashirish
    this.typingGame.resetGame(); // O'yin holatini asl holiga qaytarish
    this.ui.showInstructions('Select a time limit and click "Start Game" to begin!');
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    const deltaTime = this.clock.getDelta();
    
    if (this.character) {
      this.character.update(deltaTime);
    }
    
    if (this.typingGame) {
      this.typingGame.update(deltaTime);
    }
    
    this.sceneManager.render();
  }
}

// O'yinni boshlash
window.addEventListener('load', () => {
  new Game();
});