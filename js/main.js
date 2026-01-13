// Загрузка данных и инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация на главной странице
    if (document.querySelector('.hero-stats')) {
        updateStats();
        loadRecentBuilds();
    }
    
    // Обновляем год в футере
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.current-year').forEach(el => {
        el.textContent = currentYear;
    });
});

// Обновление статистики на главной
function updateStats() {
    const myBuilds = getMyBuilds();
    const publicBuilds = getPublicBuilds();
    const allBuilds = [...myBuilds, ...publicBuilds];
    
    // Считаем по категориям
    const pvpCount = allBuilds.filter(b => b.category === 'pvp').length;
    const pveCount = allBuilds.filter(b => b.category === 'pve').length;
    const zvzCount = allBuilds.filter(b => b.category === 'zvz').length;
    const ssCount = allBuilds.filter(b => b.category === 'smallscale').length;
    
    // Обновляем цифры на странице
    const totalEl = document.getElementById('total-builds');
    const pvpEl = document.getElementById('pvp-builds');
    const pveEl = document.getElementById('pve-builds');
    const zvzEl = document.getElementById('zvz-builds');
    
    if (totalEl) totalEl.textContent = allBuilds.length;
    if (pvpEl) pvpEl.textContent = pvpCount;
    if (pveEl) pvpEl.textContent = pveCount;
    if (zvzEl) zvzEl.textContent = zvzCount;
    
    // Для smallscale нужно добавить элемент на страницу
    const ssEl = document.getElementById('ss-builds');
    if (ssEl) ssEl.textContent = ssCount;
}

// Загрузка последних общих билдов
function loadRecentBuilds() {
    const container = document.getElementById('recent-builds');
    if (!container) return;
    
    const publicBuilds = getPublicBuilds();
    const recentBuilds = publicBuilds.slice(0, 3); // Последние 3
    
    if (recentBuilds.length === 0) {
        return; // Показываем пустое состояние из HTML
    }
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Добавляем билды
    recentBuilds.forEach(build => {
        const buildCard = createBuildCard(build, false);
        container.appendChild(buildCard);
    });
}

// Создание карточки билда
function createBuildCard(build, showActions = true) {
    const card = document.createElement('div');
    card.className = 'build-card';
    card.dataset.id = build.id;
    
    const category = CONFIG.CATEGORIES[build.category.toUpperCase()] || CONFIG.CATEGORIES.PVP;
    
    card.innerHTML = `
        <div class="build-card-header">
            <div class="build-category">${category.icon} ${category.name}</div>
            <div class="build-date">${formatDate(build.createdAt)}</div>
        </div>
        <h3 class="build-title">${escapeHtml(build.title)}</h3>
        <div class="build-equipment">
            <div class="equipment-item">
                <strong>Оружие:</strong> ${escapeHtml(build.equipment.weapon || 'Не указано')}
            </div>
            <div class="equipment-item">
                <strong>Броня:</strong> ${escapeHtml(build.equipment.armor || 'Не указано')}
            </div>
        </div>
        ${showActions ? `
        <div class="build-card-actions">
            <a href="build-detail.html?id=${build.id}" class="btn btn-outline btn-sm">Подробнее</a>
            ${build.isPublic ? '' : `
            <button class="btn btn-primary btn-sm" onclick="copyBuildToMine('${build.id}')">
                <i class="fas fa-copy"></i> Копировать
            </button>
            `}
            <!-- КНОПКА УДАЛЕНИЯ (только для моих билдов) -->
            ${!build.isPublic ? `
            <button class="btn btn-danger btn-sm" onclick="deleteBuild('${build.id}', this)">
                <i class="fas fa-trash"></i> Удалить
            </button>
            ` : ''}
        </div>
        ` : ''}
    `;
    
    return card;
}
    
    const category = CONFIG.CATEGORIES[build.category.toUpperCase()] || CONFIG.CATEGORIES.PVP;
    
    card.innerHTML = `
        <div class="build-card-header">
            <div class="build-category">${category.icon} ${category.name}</div>
            <div class="build-date">${formatDate(build.createdAt)}</div>
        </div>
        <h3 class="build-title">${escapeHtml(build.title)}</h3>
        <div class="build-equipment">
            <div class="equipment-item">
                <strong>Оружие:</strong> ${escapeHtml(build.equipment.weapon || 'Не указано')}
            </div>
            <div class="equipment-item">
                <strong>Броня:</strong> ${escapeHtml(build.equipment.armor || 'Не указано')}
            </div>
        </div>
        ${showActions ? `
        <div class="build-card-actions">
            <a href="build-detail.html?id=${build.id}" class="btn btn-outline btn-sm">Подробнее</a>
            ${build.isPublic ? '' : `
            <button class="btn btn-primary btn-sm" onclick="copyBuildToMine('${build.id}')">
                <i class="fas fa-copy"></i> Копировать себе
            </button>
            `}
        </div>
        ` : ''}
    `;
    
    return card;
}

// Вспомогательные функции
function getMyBuilds() {
    // Проверяем есть ли CONFIG
    const storageKey = window.CONFIG ? 
        window.CONFIG.STORAGE_KEYS.MY_BUILDS : 
        'guildbuild_my_builds';
    
    const buildsJson = localStorage.getItem(storageKey);
    return buildsJson ? JSON.parse(buildsJson) : [];
}
}

function getPublicBuilds() {
    const buildsJson = localStorage.getItem(CONFIG.STORAGE_KEYS.PUBLIC_BUILDS);
    return buildsJson ? JSON.parse(buildsJson) : [];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Копирование билда в "Мои билды"
function copyBuildToMine(buildId) {
    const publicBuilds = getPublicBuilds();
    const buildToCopy = publicBuilds.find(b => b.id === buildId);
    
    if (!buildToCopy) {
        alert('Билд не найден!');
        return;
    }
    
    const myBuilds = getMyBuilds();
    
    // Создаём копию с новым ID
    const copiedBuild = {
        ...buildToCopy,
        id: generateId(),
        isPublic: false,
        createdAt: new Date().toISOString(),
        isCopied: true
    };
    
    myBuilds.push(copiedBuild);
    localStorage.setItem(CONFIG.STORAGE_KEYS.MY_BUILDS, JSON.stringify(myBuilds));
    
    alert('Билд скопирован в "Мои билды"!');
    
    // Если мы на странице билдов, обновляем список
    if (window.location.pathname.includes('builds.html')) {
        loadBuilds();
    }
}

// Генерация уникального ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Экспорт функций для использования в других файлах
if (typeof window !== 'undefined') {
    window.copyBuildToMine = copyBuildToMine;
    window.getMyBuilds = getMyBuilds;
    window.getPublicBuilds = getPublicBuilds;
    window.CONFIG = CONFIG;
}
// Загрузка данных и инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация темы
    if (typeof initializeTheme === 'function') {
        initializeTheme();
    } else {
        // Загружаем theme.js если он ещё не загружен
        loadThemeScript();
    }
    
    // Остальной код...
});

// Динамическая загрузка theme.js если нужно
function loadThemeScript() {
    const script = document.createElement('script');
    script.src = 'js/theme.js';
    script.onload = function() {
        if (typeof initializeTheme === 'function') {
            initializeTheme();
        }
    };
    document.head.appendChild(script);
}
