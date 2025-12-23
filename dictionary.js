// import { frequentWords } from 'russian-words';

// // Фильтруем слова
// const gameWords = frequentWords.filter(w => 
//   w.length >= 4 && w.length <= 8 && /^[а-яё]+$/.test(w)
// );

// // Для теста можно использовать подмножество
// const dictionary = gameWords.slice(0, 2000);


const russianDictionary = [
    "аккорд", "аркада", "драка", "какаду", "кокарда", "кора", "орда", "рада", "рок", "дар",
    "лампа", "пала", "план", "лапа", "дуло", "оклад", "лодка", "полка", "поклад"
    // Добавь сюда больше слов или загрузи готовый список
];

// Делаем его доступным для других файлов
window.gameDictionary = russianDictionary;