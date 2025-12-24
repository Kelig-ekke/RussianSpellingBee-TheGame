let dictionary = [];
let gameSet = { center: '', others: [] };
let currentWord = '';
let foundWords = [];

// 1. Инициализация
async function init() {
    await loadAndCleanDictionary();
    // По умолчанию загружаем слово дня
    loadLevelByDate(new Date());
}

// Загрузка уровня на основе конкретной даты
function loadLevelByDate(date) {
    // Создаем уникальное число из даты (ГГГГММДД)
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    setupLevel(seed);
}

// Функция для кнопки "Сгенерировать новое"
function refreshLevel() {
    if (!confirm("Весь прогресс текущего уровня будет потерян. Продолжить?")) return;
    const randomSeed = Math.floor(Math.random() * 1000000);
    setupLevel(randomSeed);
}

// Общая логика настройки уровня
function setupLevel(seed) {
    const level = generateLevel(seed);
    gameSet.center = level.center;
    gameSet.others = level.others;
    foundWords = []; // Сброс найденных слов
    currentWord = '';
    
    document.getElementById('currentWord').textContent = '';
    updateFoundList();
    createHive();
    showMessage("Уровень загружен!", true);
}

// 3. Генерация уровня с использованием Seed
function generateLevel(seed) {
    const pangrams = dictionary.filter(word => {
        const uniqueLetters = new Set(word.split(''));
        return uniqueLetters.size === 7;
    });

    if (pangrams.length === 0) {
        return { center: 'д', others: ['а', 'к', 'о', 'р', 'л', 'п'] };
    }

    // Используем seed для выбора одного и того же слова в течение дня
    const index = seed % pangrams.length;
    let randomPangram = pangrams[index];

    randomPangram = randomPangram.replace(/ё/g, 'е');
    
    const uniqueLetters = Array.from(new Set(randomPangram.split('')));
    
    // Детерминированное перемешивание на основе сида
    // (чтобы у всех игроков буквы стояли одинаково)
    let shuffled = uniqueLetters.sort((a, b) => {
        const hashA = (a.charCodeAt(0) * seed) % 100;
        const hashB = (b.charCodeAt(0) * seed) % 100;
        return hashA - hashB;
    });

    const notCenters = ['ь', 'ъ', 'ы', 'ш', 'щ', 'й', 'ф', 'ц'];

    if (notCenters.includes(shuffled[0])) {
        const validIndex = shuffled.findIndex(char => !notCenters.includes(char));
        
        if (validIndex !== -1) {
            const temp = shuffled[0];
            shuffled[0] = shuffled[validIndex];
            shuffled[validIndex] = temp;
        }
    }

    return {
        center: shuffled[0],
        others: shuffled.slice(1)
    };
}


async function loadAndCleanDictionary() {
    try {
        const response = await fetch('dictionary.json');
        const data = await response.json();

        dictionary = Object.keys(data)
            .map(word => word.trim().toLowerCase())
            .filter(word => word.length >= 4 && /^[а-яё]+$/.test(word))
            .map(word => word.replace(/ё/g, 'e'));

        dictionary = Array.from(new Set(dictionary));
        console.log("Словарь готов!");
    } catch (e) {
        console.error("Ошибка словаря:", e);
    }
}

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

function addLetter(letter) {
    currentWord += letter;
    document.getElementById('currentWord').textContent = currentWord.toUpperCase();
}

function deleteLetter() {
    currentWord = currentWord.slice(0, -1);
    document.getElementById('currentWord').textContent = currentWord.toUpperCase();
}

function submitWord() {
    const word = currentWord.toLowerCase().trim().replace(/ё/g, 'е');
    if (word.length < 4) return showMessage('Минимум 4 буквы!');
    if (!word.includes(gameSet.center)) return showMessage(`Нужна буква ${gameSet.center.toUpperCase()}!`);
    if (!dictionary.includes(word)) return showMessage('Нет в словаре!');
    if (foundWords.includes(word)) {
        currentWord = '';
        document.getElementById('currentWord').textContent = '';
        return showMessage('Уже было!');
    }

    let isPangram = new Set(word.split('')).size === 7;
    foundWords.push(word);
    currentWord = '';
    document.getElementById('currentWord').textContent = '';
    updateFoundList();
    showMessage(isPangram ? 'ПАНГРАММА!' : 'Отлично!', true);
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

window.onload = init;