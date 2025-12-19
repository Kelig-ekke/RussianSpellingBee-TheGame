// game.js
import { frequentWords } from 'russian-words';

// Фильтруем сразу при старте
const gameWords = frequentWords.filter(w => 
  w.length >= 4 && w.length <= 8 && /^[а-яё]+$/.test(w)
);

// Для теста можно использовать подмножество
const testWords = gameWords.slice(0, 2000);

export class SpellingBee {
  constructor() {
    this.dictionary = new Set(testWords);
  }
  
  // ... остальная логика игры
}