let dictionary = [];
let gameSet = { center: '', others: [] };
let currentWord = '';
let foundWords = [];

// 1. Главная функция запуска
async function init() {
    await loadAndCleanDictionary();
    const level = generateLevel();
    
    gameSet.center = level.center;
    gameSet.others = level.others;
    
    createHive();
}

// 2. Загрузка и очистка словаря
async function loadAndCleanDictionary() {
    try {
        const response = await fetch('dictionary.json');
        const data = await response.json();

        dictionary = Object.keys(data)
            .map(word => word.toLowerCase())
            .filter(word => {
                const isLongEnough = word.length >= 4;
                const onlyLetters = /^[а-яё]+$/.test(word);
                return isLongEnough && onlyLetters;
            });

        console.log("Словарь готов! Слов:", dictionary.length);
    } catch (e) {
        console.error("Ошибка загрузки. Проверьте, что файл dictionary.json лежит рядом с index.html", e);
    }
}

// 3. Генерация уровня на основе панграммы
function generateLevel() {
    const pangrams = dictionary.filter(word => {
        const uniqueLetters = new Set(word.split(''));
        return uniqueLetters.size === 7;
    });

    if (pangrams.length === 0) {
        return { center: 'д', others: ['а', 'к', 'о', 'р', 'л', 'п'] }; // Запасной вариант
    }

    const randomPangram = pangrams[Math.floor(Math.random() * pangrams.length)];
    const uniqueLetters = Array.from(new Set(randomPangram.split('')));
    
    uniqueLetters.sort(() => Math.random() - 0.5);

    return {
        center: uniqueLetters[0],
        others: uniqueLetters.slice(1)
    };
}

// 4. Отрисовка интерфейса
function createHive() {
    const hive = document.getElementById('hive');
    if (!hive) return;
    hive.innerHTML = '';
    
    const allLetters = [gameSet.center, ...gameSet.others];
    
    allLetters.forEach((letter, index) => {
        const div = document.createElement('div');
        div.className = 'letter' + (index === 0 ? ' main' : '');
        div.textContent = letter.toUpperCase();
        div.onclick = () => addLetter(letter);
        hive.appendChild(div);
    });
}

// --- Логика игры ---

function addLetter(letter) {
    currentWord += letter;
    document.getElementById('currentWord').textContent = currentWord.toUpperCase();
}

function deleteLetter() {
    currentWord = currentWord.slice(0, -1);
    document.getElementById('currentWord').textContent = currentWord.toUpperCase();
}

function submitWord() {
    const word = currentWord.toLowerCase();
    
    if (word.length < 4) {
        showMessage('Минимум 4 буквы!');
        return;
    }
    if (!word.includes(gameSet.center)) {
        showMessage(`Нужна буква ${gameSet.center.toUpperCase()}!`);
        return;
    }
    if (!dictionary.includes(word)) {
        showMessage('Нет в словаре!');
        return;
    }
    if (foundWords.includes(word)) {
        showMessage('Уже было!');
        return;
    }

    foundWords.push(word);
    currentWord = '';
    document.getElementById('currentWord').textContent = '';
    updateFoundList();
    showMessage('Отлично!', true);
}

function updateFoundList() {
    const listDiv = document.getElementById('foundWords');
    if (listDiv) {
        listDiv.innerHTML = `<strong>Найдено слов: ${foundWords.length}</strong><br>` + foundWords.join(', ');
    }
}

function showMessage(text, success = false) {
    const m = document.getElementById('message');
    m.textContent = text;
    m.style.color = success ? 'green' : 'red';
    setTimeout(() => { m.textContent = ''; }, 2000);
}

// Единая точка входа
window.onload = init;