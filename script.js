// ==================== КОНФИГУРАЦИЯ ====================
const CATEGORIES = {
    'pvp': { id: 1, name: '⚔️ ПВП', page: 'pvp.html' },
    'pve': { id: 2, name: '🐉 ПВЕ', page: 'pve.html' },
    'zvz': { id: 3, name: '⚡ ZvZ', page: 'Zvz.html' },
    'smallscale': { id: 4, name: '👥 Смолскейл', page: 'smallscale.html' }
};

// ==================== ОСНОВНЫЕ ФУНКЦИИ ====================
function createBuild(name, description, items, category, imageURL, videoURL) {
    console.log('Создаю билд:', name);
    let builds = JSON.parse(localStorage.getItem('builds')) || [];

    const newBuild = {
        id: Date.now(),
        name: name || 'Без названия',
        description: description || '',
        items: items || [],
        category: category || 'pvp', // Используем текстовый ключ: 'pvp', 'pve' и т.д.
        imageURL: imageURL || '',
        videoURL: videoURL || '',
        createdAt: new Date().toISOString()
    };

    builds.push(newBuild);
    localStorage.setItem('builds', JSON.stringify(builds));
    alert(`✅ Билд "${name}" создан в категории ${CATEGORIES[category]?.name || category}!`);
    return newBuild;
}

// Функция для ОТОБРАЖЕНИЯ билдов на главной (index.html)
function renderBuilds() {
    const container = document.getElementById('buildsContainer');
    if (!container) return;

    const builds = JSON.parse(localStorage.getItem('builds')) || [];
    if (builds.length === 0) {
        container.innerHTML = '<p>Пока нет созданных билдов.</p>';
        return;
    }

    let html = '<h2>Все билды</h2><div class="builds-grid">';
    builds.forEach(build => {
        const cat = CATEGORIES[build.category] || CATEGORIES.pvp;
        html += `
            <div class="build-card">
                <h4>${build.name}</h4>
                <span class="category-badge">${cat.name}</span>
                <p>${build.description || 'Нет описания'}</p>
                <a href="${cat.page}">Перейти в категорию →</a>
            </div>`;
    });
    container.innerHTML = html + '</div>';
}

// САМАЯ ВАЖНАЯ ФУНКЦИЯ: загрузка билдов для КОНКРЕТНОЙ страницы категории (pvp.html, pve.html и т.д.)
function loadCategoryBuilds() {
    // 1. Определяем, на какой странице категории мы находимся
    const currentPage = window.location.pathname.split('/').pop(); // 'pvp.html', 'pve.html' и т.д.
    let currentCategoryKey = null;

    // 2. Ищем, какой ключ категории соответствует этой странице
    for (const [key, cat] of Object.entries(CATEGORIES)) {
        if (cat.page === currentPage) {
            currentCategoryKey = key;
            break;
        }
    }

    // Если мы не на странице категории — выходим
    if (!currentCategoryKey) return;

    // 3. Загружаем все билды и фильтруем
    const allBuilds = JSON.parse(localStorage.getItem('builds')) || [];
    const categoryBuilds = allBuilds.filter(build => build.category === currentCategoryKey);

    const container = document.getElementById('categoryBuildsContainer');
    if (!container) return;

    // 4. Отображаем
    if (categoryBuilds.length === 0) {
        container.innerHTML = `<p>В категории "${CATEGORIES[currentCategoryKey].name}" пока нет билдов.</p>`;
    } else {
        let html = `<h2>${CATEGORIES[currentCategoryKey].name} (${categoryBuilds.length})</h2><div class="builds-grid">`;
        categoryBuilds.forEach(build => {
            html += `
                <div class="build-card">
                    <h3>${build.name}</h3>
                    <p>${build.description || 'Нет описания'}</p>
                    <p><strong>Предметы:</strong> ${build.items.join(', ') || 'Нет'}</p>
                </div>`;
        });
        container.innerHTML = html + '</div>';
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена');

    // Если есть форма для создания билда (add-build.html) — настраиваем её
    const buildForm = document.getElementById('buildForm');
    if (buildForm) {
        // Заполняем select в форме ТОЛЬКО нашими категориями
        const categorySelect = document.getElementById('buildCategory');
        if (categorySelect) {
            categorySelect.innerHTML = ''; // Очищаем
            for (const [key, cat] of Object.entries(CATEGORIES)) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = cat.name;
                categorySelect.appendChild(option);
            }
        }

        buildForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('buildName')?.value;
            const desc = document.getElementById('buildDescription')?.value;
            const cat = document.getElementById('buildCategory')?.value;
            // items можно добавить позже
            createBuild(name, desc, [], cat, '', '');
            this.reset();
        });
    }

    // Автоматически определяем, что отображать:
    // Если на главной — показываем все билды
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        renderBuilds();
    }
    // Если на странице категории — показываем фильтрованные билды
    else if (['pvp.html', 'pve.html', 'Zvz.html', 'smallscale.html']
             .some(page => window.location.pathname.endsWith(page))) {
        loadCategoryBuilds();
    }
});
