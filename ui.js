export class UIManager {
  constructor() {
    this.textDisplay = document.getElementById('textDisplay');
    this.wpmElement = document.getElementById('wpm');
    this.accuracyElement = document.getElementById('accuracy');
    this.progressElement = document.getElementById('progress');
    this.timeElement = document.getElementById('time');
    this.instructionsElement = document.getElementById('instructions');
    this.resultScreen = document.getElementById('resultScreen');
    this.finalWpmElement = document.getElementById('finalWpm');
    this.finalAccuracyElement = document.getElementById('finalAccuracy');
    this.finalCorrectCharsElement = document.getElementById('finalCorrectChars');
    this.finalErrorsElement = document.getElementById('finalErrors');
  }

  displayText(fullText, typedText, currentPosition) {
    let html = '';
    
    for (let i = 0; i < fullText.length; i++) {
      const char = fullText[i];
      
      if (i < typedText.length) {
        // Allaqaqon terilgan
        if (typedText[i] === char) {
          html += `<span class="typed">${char === ' ' ? '&nbsp;' : char}</span>`;
        } else {
          // Xato terilgan belgi, fon qizil, matn oq
          html += `<span class="incorrect">${char === ' ' ? '&nbsp;' : char}</span>`;
        }
      } else if (i === currentPosition) {
        // Hozirgi teriladigan belgi (kursor)
        html += `<span class="current">${char === ' ' ? '&nbsp;' : char}</span>`;
      } else {
        // Hali terilmagan belgilar
        html += `<span>${char === ' ' ? '&nbsp;' : char}</span>`;
      }
    }
    
    this.textDisplay.innerHTML = html;
  }

  updateStats(wpm, accuracy) {
    this.wpmElement.textContent = wpm;
    this.accuracyElement.textContent = `${accuracy}%`;
    
    // WPM rangini yangilash
    if (wpm > 60) {
      this.wpmElement.style.color = '#2ecc71'; // Yashil
    } else if (wpm > 30) {
      this.wpmElement.style.color = '#f1c40f'; // Sariq
    } else {
      this.wpmElement.style.color = '#e74c3c'; // Qizil
    }
    
    // Accuracy rangini yangilash
    if (accuracy >= 95) {
      this.accuracyElement.style.color = '#2ecc71';
    } else if (accuracy >= 85) {
      this.accuracyElement.style.color = '#f1c40f';
    } else {
      this.accuracyElement.style.color = '#e74c3c';
    }
  }

  updateProgress(current, total) {
    this.progressElement.textContent = `${current}/${total}`;
    
    if (total > 0 && current === total) {
      this.progressElement.style.color = '#2ecc71';
    } else {
      this.progressElement.style.color = '#334e68'; // Asosiy matn rangi
    }
  }

  updateTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    this.timeElement.textContent = formattedTime;
    
    // Vaqt kamayganda rangini va animatsiyani o'zgartirish
    if (seconds <= 10 && seconds > 0) {
      this.timeElement.classList.add('critical'); // Yangi 'critical' sinfini qo'shamiz
    } else {
      this.timeElement.classList.remove('critical'); // Sinfni olib tashlaymiz
    }
  }

  showInstructions(message) {
    this.instructionsElement.textContent = message;
    this.instructionsElement.classList.remove('hidden');
  }

  hideInstructions() {
    this.instructionsElement.classList.add('hidden');
  }

  displayResultScreen(stats) {
    this.finalWpmElement.textContent = stats.wpm;
    this.finalAccuracyElement.textContent = `${stats.accuracy}%`;
    this.finalCorrectCharsElement.textContent = stats.correctChars;
    this.finalErrorsElement.textContent = stats.errors;
  }

  showResultScreen() {
    this.resultScreen.classList.remove('hidden');
  }

  hideResultScreen() {
    this.resultScreen.classList.add('hidden');
  }
}