export class TypingGame {
  constructor(character, ui, onGameEndCallback) {
    this.character = character;
    this.ui = ui;
    this.onGameEndCallback = onGameEndCallback; // O'yin tugaganida chaqiriladigan callback

    this.allTexts = [
      "The quick brown fox jumps over the lazy dog.",
      "Pack my box with five dozen liquor jugs.",
      "How vexingly quick daft zebras jump!",
      "Waltz, bad nymph, for quick jigs vex.",
      "JavaScript is a versatile programming language.",
      "Three.js makes 3D graphics accessible to web developers.",
      "Type with precision and speed to master the keyboard.",
      "Practice makes perfect in the art of typing.",
      "Never underestimate the power of a well-placed semicolon.",
      "Coding is like solving a puzzle, one line at a time.",
      "The internet is a vast ocean of information and cat videos.",
      "Debugging is a skill, not a punishment.",
      "The early bird catches the worm, but the second mouse gets the cheese.",
      "Stay hydrated and keep coding!",
      "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      "The only way to do great work is to love what you do.",
      "If you can dream it, you can achieve it.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "The mind is everything. What you think you become.",
      "Creativity is intelligence having fun.",
      "The purpose of our lives is to be happy.",
      "Life is what happens when you're busy making other plans.",
      "Get busy living or get busy dying.",
      "You have within you right now, everything you need to deal with whatever the world can throw at you.",
      "Believe you can and you're halfway there.",
      "The only impossible journey is the one you never begin.",
      "What you get by achieving your goals is not as important as what you become by achieving your goals.",
      "It is during our darkest moments that we must focus to see the light.",
      "The best way to predict the future is to create it.",
      "Don't count the days, make the days count.",
      "It always seems impossible until it's done.",
      "If you want to live a happy life, tie it to a goal, not to people or things.",
      "The only limit to our realization of tomorrow will be our doubts of today.",
      "Do not go where the path may lead, go instead where there is no path and leave a trail.",
      "The journey of a thousand miles begins with a single step.",
      "The only true wisdom is in knowing you know nothing.",
      "Simplicity is the ultimate sophistication.",
      "Innovation distinguishes between a leader and a follower.",
      "The only person you are destined to become is the person you decide to be.",
      "The mind is not a vessel to be filled, but a fire to be kindled.",
      "Strive not to be a success, but rather to be of value.",
      "Your time is limited, don't waste it living someone else's life."
    ];

    this.availableTexts = [...this.allTexts];
    this.currentText = '';
    this.typedText = '';
    this.currentPosition = 0;
    this.errors = 0;
    this.correctCharacters = 0;
    this.totalKeystrokes = 0;
    this.startTime = null;
    this.timerInterval = null;
    this.gameDuration = 0; // O'yin davomiyligi (sekundlarda)
    this.timeRemaining = 0;
    this.isActive = false; // O'yinning faol holati
    this.consecutiveCorrect = 0;
    
    // Event listener ni faqat bir marta o'rnatish
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  resetGame() {
    this.stopGame(); // Agar o'yin hali tugamagan bo'lsa, to'xtatish
    this.availableTexts = [...this.allTexts]; // Matnlar ro'yxatini to'ldirish
    this.currentText = '';
    this.typedText = '';
    this.currentPosition = 0;
    this.errors = 0;
    this.correctCharacters = 0;
    this.totalKeystrokes = 0;
    this.startTime = null;
    this.gameDuration = 0;
    this.timeRemaining = 0;
    this.isActive = false;
    this.consecutiveCorrect = 0;
    this.loadNewText(); // Yangi matnni yuklash
    this.ui.updateStats(0, 100);
    this.ui.updateProgress(0, 0);
    this.ui.updateTime(0);
    this.ui.displayText('Select a time and click Start!', '', 0); // O'yin boshlangunga qadar matn
  }

  startNewGame(durationSeconds) {
    this.resetGame(); // Har bir yangi o'yin oldidan reset qilish
    this.gameDuration = durationSeconds;
    this.timeRemaining = durationSeconds;
    this.isActive = true; // O'yinni faollashtirish
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    this.loadNewText(); // O'yin boshlanganda yangi matnni yuklash
  }

  loadNewText() {
    if (this.availableTexts.length === 0) {
      this.availableTexts = [...this.allTexts]; // Agar barcha matnlar ishlatilgan bo'lsa, to'ldirish
    }
    
    const randomIndex = Math.floor(Math.random() * this.availableTexts.length);
    this.currentText = this.availableTexts[randomIndex];
    this.availableTexts.splice(randomIndex, 1); // Tanlangan matnni mavjudlardan olib tashlash
    
    this.typedText = '';
    this.currentPosition = 0;
    this.ui.displayText(this.currentText, this.typedText, this.currentPosition);
    this.ui.updateProgress(this.currentPosition, this.currentText.length);
  }

  handleKeyDown(e) {
    if (!this.isActive || this.timeRemaining <= 0) {
      return; // O'yin faol bo'lmasa yoki vaqt tugagan bo'lsa, hech narsa qilmaydi
    }

    // Maxsus tugmalarni e'tiborsiz qoldirish (Alt, Ctrl, Shift, F-keys, etc.)
    if (e.key.length > 1 && e.key !== 'Backspace' && e.key !== ' ') {
      return;
    }

    e.preventDefault(); // Brauzerning standart harakatini oldini olish

    if (e.key === 'Backspace') {
      this.handleBackspace();
    } else {
      this.handleCharacterInput(e.key);
    }
    
    this.updateStats();
    // Matnni faqatgina terish davomida yangilash kerak, o'yin tugagandan keyin emas
    if (this.isActive && this.timeRemaining > 0) { 
        this.ui.displayText(this.currentText, this.typedText, this.currentPosition);
    }
  }

  handleBackspace() {
    if (this.currentPosition > 0) {
      // Agar backspace bosilganda oldingi belgi to'g'ri terilgan bo'lsa, correctCharacters ni kamaytirish
      if (this.typedText[this.currentPosition - 1] === this.currentText[this.currentPosition - 1]) {
          this.correctCharacters--;
      } else {
          // Agar xato bo'lsa, xatolar sonini ham kamaytirish (qaytishda xato hisoblanmasin)
          // Bu shartni o'zingizning xohishingizga qarab o'zgartirishingiz mumkin.
          // Ba'zi o'yinlar backspace'ni xatolarni to'g'irlash deb hisoblamaydi.
          this.errors--; // Xato hisobidan qaytarish
      }
      this.currentPosition--;
      this.typedText = this.typedText.slice(0, -1);
      this.totalKeystrokes--; // Jami tugmalar sonidan ham kamaytiramiz
    }
  }

  handleCharacterInput(key) {
    const expectedChar = this.currentText[this.currentPosition];
    
    if (key === expectedChar) {
      this.typedText += key;
      this.currentPosition++;
      this.totalKeystrokes++;
      this.correctCharacters++;
      this.consecutiveCorrect++;
      
      this.character.onCorrectKeypress();
      
      if (this.consecutiveCorrect >= 10) {
        this.character.onGoodSpeed();
        this.consecutiveCorrect = 0;
      }
      
      if (key === ' ' || this.currentPosition === this.currentText.length) {
        this.character.onWordComplete();
      }
      
      if (this.currentPosition >= this.currentText.length) {
        // Matn tugaganda yangi matn yuklash
        this.loadNewText();
      }
      
    } else {
      this.typedText += key; // Xato belgisini ham qo'shamiz, chunki foydalanuvchi terdi
      this.currentPosition++; // Pozitsiyani ham oshiramiz
      this.errors++;
      this.totalKeystrokes++;
      this.consecutiveCorrect = 0;
      this.character.onIncorrectKeypress();
    }
  }

  stopGame() {
    if (!this.isActive) return; // Agar o'yin allaqachon to'xtagan bo'lsa, qaytarish

    this.isActive = false; // O'yinni nofaol holatga o'tkazish
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    
    this.ui.displayText(this.currentText, this.typedText, this.currentPosition); // Tugallangan matnni ko'rsatish
    this.character.playAnimation('Idle', true); // Belgini "Idle" holatiga qaytarish

    const finalWpm = this.calculateWPM();
    const finalAccuracy = this.calculateAccuracy();

    // Natijalarni asosiy o'yin ob'ektiga qaytarish
    if (this.onGameEndCallback) {
      this.onGameEndCallback({
        wpm: finalWpm,
        accuracy: finalAccuracy,
        correctChars: this.correctCharacters,
        errors: this.errors
      });
    }
  }

  updateTimer() {
    if (!this.isActive) return;

    const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
    this.timeRemaining = this.gameDuration - timeElapsed;

    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0;
      this.stopGame(); // Vaqt tugaganda o'yinni to'xtatish
    }
    this.ui.updateTime(this.timeRemaining);
  }

  calculateWPM() {
    // Agar o'yin boshlanmagan bo'lsa yoki vaqt o'tmagan bo'lsa, 0 qaytarish
    if (!this.startTime || this.totalKeystrokes === 0) return 0;
    
    // O'yin davom etgan vaqtni hisoblash (minutlarda)
    const activeTimeInSeconds = this.gameDuration - this.timeRemaining;
    const timeInMinutes = activeTimeInSeconds / 60;
    
    if (timeInMinutes === 0) return 0;

    // Har bir to'g'ri terilgan 5 belgi bir so'zga teng (Standart hisoblash)
    const wordsTyped = this.correctCharacters / 5;
    
    return Math.round(wordsTyped / timeInMinutes);
  }

  calculateAccuracy() {
    if (this.totalKeystrokes === 0) return 100;
    // To'g'ri belgilarni jami terilgan belgilarga bo'lib aniqlikni hisoblash
    return Math.round((this.correctCharacters / this.totalKeystrokes) * 100);
  }

  updateStats() {
    const wpm = this.calculateWPM();
    const accuracy = this.calculateAccuracy();
    
    this.ui.updateStats(wpm, accuracy);
    this.ui.updateProgress(this.currentPosition, this.currentText.length);
  }

  update(deltaTime) {
    // Bu yerda o'yinning davomiy yangilanishlari bo'lishi mumkin
  }
}