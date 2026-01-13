// Логика для страницы builds.html
document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.pathname.includes('builds.html')) return;
    
    initializeBuildsPage();
});

function initializeBuildsPage() {
    // Инициализация переключателя
    const tabButtons = document.querySelectorAll('.tab-btn');
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    
    // Активный таб по умолчанию
    let activeTab = 'my';
    
    // Обработчики переключателя
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.dataset.tab;
            
            // Обновляем активную кнопку
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            activeTab = tab;
            loadBuilds();
        });
    });
    
    // Обработчики фильтров
    if (categoryFilter) {
        categoryFilter.addEventListener('change', loadBuilds);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(loadBuilds, 300));
    }
    
    // Загружаем билды при открытии страницы
    loadBuilds();
    
    // Обновляем год в футере
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
}

// Загрузка и отображение билдов
function loadBuilds() {
    const container = document.getElementById('builds-container');
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    
    if (!container) return;
    
    // Получаем билды в зависимости от активного таба
    let builds = [];
    if (activeTab === 'my') {
        builds = getMyBuilds();
    } else {
        builds = getPublicBuilds();
    }
    
    // Применяем фильтры
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
    
    let filteredBuilds = builds.filter(build => {
        // Фильтр по категории
        if (selectedCategory !== 'all' && build.category !== selectedCategory) {
            return false;
        }
        
        // Фильтр по поиску
        if (searchQuery) {
            const titleMatch = build.title.toLowerCase().includes(searchQuery);
            const weaponMatch = build.equipment?.weapon?.toLowerCase().includes(searchQuery) || false;
            const armorMatch = build.equipment?.armor?.toLowerCase().includes(searchQuery) || false;
            
            return titleMatch || weaponMatch || armorMatch;
        }
        
        return true;
    });
    
    // Сортируем по дате (новые сначала)
    filteredBuilds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Если билдов нет
    if (filteredBuilds.length === 0) {
        const emptyMessage = activeTab === 'my' ? 
            'У вас пока нет сохранённых билдов' : 
            'В общедоступном разделе пока нет билдов';
        
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-${activeTab === 'my' ? 'folder' : 'users'}"></i>
                <p>${emptyMessage}</p>
                <a href="add-build.html" class="btn btn-outline">Добавить первый билд</a>
            </div>
        `;
        return;
    }
    
    // Создаём карточки билдов
    filteredBuilds.forEach(build => {
        const buildCard = createBuildCard(build, true);
        container.appendChild(buildCard);
    });
}

// Утилита для дебаунса (задержки поиска)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Если мы в браузере, экспортируем функции
if (typeof window !== 'undefined') {
    window.loadBuilds = loadBuilds;
}
