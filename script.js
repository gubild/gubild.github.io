// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgBZeqSZmZZu68dUxAPDV6s9MbMa3c1IM",
  authDomain: "albion-builds-9dd65.firebaseapp.com",
  projectId: "albion-builds-9dd65",
  storageBucket: "albion-builds-9dd65.firebasestorage.app",
  messagingSenderId: "1035634542354",
  appId: "1:1035634542354:web:2d2543302ea25f8333d5cb",
  measurementId: "G-F95SH9SSGM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// ==================== КОНСТАНТЫ ====================
const SECRET_PASSWORD = "92421lis932"; // Твой пароль

// ==================== СОЗДАНИЕ БИЛДА ====================
function createBuild(name, description, items, category, imageURL, videoURL) {
    console.log('Создаю билд:', name);
    
    let builds = JSON.parse(localStorage.getItem('builds')) || [];
    
    const newBuild = {
        id: Date.now(),
        name: name || 'Без названия',
        description: description || '',
        items: items || [],
        category: category || 'pvp',
        imageURL: imageURL || '',
        videoURL: videoURL || '',
        createdAt: new Date().toISOString()
    };
    
    builds.push(newBuild);
    localStorage.setItem('builds', JSON.stringify(builds));
    
    // Обновляем отображение если есть функция
    if (typeof renderBuilds === 'function') {
        renderBuilds();
    }
    
    if (typeof updateStats === 'function') {
        updateStats();
    }
    
    return newBuild;
}

// ==================== ОТОБРАЖЕНИЕ БИЛДОВ ====================
function renderBuilds() {
    const container = document.getElementById('buildsContainer');
    if (!container) return;
    
    const builds = JSON.parse(localStorage.getItem('builds')) || [];
    
    if (builds.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📁</div>
                <h3 style="color: #e6e6ff; margin-bottom: 15px;">Пока нет созданных билдов</h3>
                <p style="color: #c0c0ff; margin-bottom: 25px;">Начните с добавления первого билда в коллекцию</p>
                <a href="add-build.html" class="add-build-btn" style="display: inline-flex;">
                    <i class="fas fa-plus-circle"></i> Создать первый билд
                </a>
            </div>
        `;
        return;
    }
    
    // Сортируем по дате (новые сверху)
    builds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    let html = '<div class="builds-grid">';
    
    builds.forEach(build => {
        // Иконка категории
        let categoryIcon = '📦';
        let categoryName = 'Другое';
        
        switch(build.category) {
            case 'pvp': categoryIcon = '⚔️'; categoryName = 'ПВП'; break;
            case 'pve': categoryIcon = '🐉'; categoryName = 'ПВЕ'; break;
            case 'zvz': categoryIcon = '⚡'; categoryName = 'ZvZ'; break;
            case 'smallscale': categoryIcon = '👥'; categoryName = 'Смолскейл'; break;
        }
        
        // Дата
        const date = new Date(build.createdAt);
        const formattedDate = date.toLocaleDateString('ru-RU');
        
        // Превью предметов (первые 3)
        const previewItems = build.items ? build.items.slice(0, 3) : [];
        
        html += `
            <div class="build-card">
                <div class="build-header">
                    <div>
                        <div class="build-name" onclick="viewBuild(${build.id})">${escapeHtml(build.name)}</div>
                        <div class="build-category">${categoryIcon} ${categoryName}</div>
                    </div>
                </div>
                
                <p class="build-description">${escapeHtml(build.description || 'Нет описания')}</p>
                
                ${previewItems.length > 0 ? `
                    <div class="build-items-preview">
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            ${previewItems.map(item => `<li style="padding: 3px 0; color: #c0c0ff;">• ${escapeHtml(item)}</li>`).join('')}
                            ${build.items.length > 3 ? `<li style="padding: 3px 0; color: #9370db;">... и ещё ${build.items.length - 3}</li>` : ''}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="build-footer">
                    <div class="build-date">
                        <i class="far fa-calendar"></i> ${formattedDate}
                    </div>
                    <div class="build-actions">
                        <button class="action-btn view-btn" onclick="viewBuild(${build.id})">
                            <i class="fas fa-eye"></i> Просмотр
                        </button>
                        <button class="action-btn delete-btn" onclick="showDeleteModal(${build.id})">
                            <i class="fas fa-trash"></i> Удалить
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== ДЛЯ СТРАНИЦ КАТЕГОРИЙ ====================
function renderCategoryBuilds(category) {
    const container = document.getElementById('buildsContainer');
    if (!container) return;
    
    const allBuilds = JSON.parse(localStorage.getItem('builds')) || [];
    const categoryBuilds = allBuilds.filter(b => b.category === category);
    
    if (categoryBuilds.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📁</div>
                <h3 style="color: #e6e6ff; margin-bottom: 15px;">Пока нет билдов в этой категории</h3>
                <a href="add-build.html" class="add-build-btn" style="display: inline-flex;">
                    <i class="fas fa-plus-circle"></i> Создать билд
                </a>
            </div>
        `;
        return;
    }
    
    // Тот же код что и в renderBuilds, но фильтруем по категории
    let html = '<div class="builds-grid">';
    
    categoryBuilds.forEach(build => {
        // ... тот же HTML что и выше ...
        // (скопируй из renderBuilds и измени только фильтрацию)
    });
    
    container.innerHTML = html;
}

// ==================== ЭКСПОРТ ФУНКЦИЙ ====================
window.createBuild = createBuild;
window.renderBuilds = renderBuilds;
window.renderCategoryBuilds = renderCategoryBuilds;
window.escapeHtml = escapeHtml;
// ========== НАЧАЛО ДОБАВЛЯЕМОГО КОДА ==========

// ==== НАСТРОЙКИ GITHUB ====
const GITHUB_USER = 'gubild';
const GITHUB_REPO = 'gubild.github.io';
const GITHUB_TOKEN = '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'; // Вставь свой GitHub Token
const USE_GITHUB = true; // Включить синхронизацию с GitHub

// ==== ФУНКЦИИ ДЛЯ GITHUB СИНХРОНИЗАЦИИ ====

// Загрузка билдов с GitHub (используется вместо localStorage)
async function loadBuildsFromGitHub() {
    if (!USE_GITHUB) {
        // Если GitHub отключен, используем старый код
        const saved = localStorage.getItem('albion_builds');
        return saved ? JSON.parse(saved) : { builds: {} };
    }
    
    try {
        // Пытаемся загрузить с GitHub
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/builds.json`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : ''
                }
            }
        );
        
        if (response.ok) {
            const data = await response.json();
            const content = atob(data.content); // Декодируем base64
            const buildsData = JSON.parse(content);
            
            // Сохраняем также локально на всякий случай
            localStorage.setItem('albion_builds_backup', JSON.stringify(buildsData));
            
            console.log('✅ Билды загружены с GitHub');
            return buildsData;
        }
    } catch (error) {
        console.log('⚠️ GitHub недоступен, используем локальные данные:', error);
    }
    
    // Если GitHub недоступен, пробуем взять из localStorage
    const localData = localStorage.getItem('albion_builds');
    return localData ? JSON.parse(localData) : { builds: {} };
}

// Сохранение билдов в GitHub
async function saveBuildsToGitHub(buildsData) {
    if (!USE_GITHUB) {
        // Старый код - сохраняем только локально
        localStorage.setItem('albion_builds', JSON.stringify(buildsData));
        return true;
    }
    
    try {
        // 1. Получаем информацию о текущем файле
        const getResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/builds.json`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `token ${GITHUB_TOKEN}`
                }
            }
        );
        
        let sha = '';
        if (getResponse.ok) {
            const fileInfo = await getResponse.json();
            sha = fileInfo.sha;
        }
        
        // 2. Обновляем файл
        const updateResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/builds.json`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    message: `Update builds ${new Date().toLocaleString('ru-RU')}`,
                    content: btoa(JSON.stringify(buildsData, null, 2)),
                    sha: sha || undefined
                })
            }
        );
        
        if (updateResponse.ok) {
            console.log('✅ Билды сохранены на GitHub');
            
            // Также сохраняем локально как резервную копию
            localStorage.setItem('albion_builds', JSON.stringify(buildsData));
            
            return true;
        } else {
            console.error('❌ Ошибка сохранения в GitHub');
            // Сохраняем локально как запасной вариант
            localStorage.setItem('albion_builds', JSON.stringify(buildsData));
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка подключения к GitHub:', error);
        // Сохраняем локально
        localStorage.setItem('albion_builds', JSON.stringify(buildsData));
        return false;
    }
}

// ==== ПЕРЕХВАТЫВАЕМ СУЩЕСТВУЮЩИЕ ФУНКЦИИ ====

// Сохраняем старые функции чтобы не сломать существующий код
const originalLoadBuilds = window.loadBuilds || function() {
    const saved = localStorage.getItem('albion_builds');
    return saved ? JSON.parse(saved) : { builds: {} };
};

const originalSaveBuilds = window.saveBuilds || function(buildsData) {
    localStorage.setItem('albion_builds', JSON.stringify(buildsData));
    return true;
};

// ==== ЗАМЕНЯЕМ ФУНКЦИИ НА НОВЫЕ ====

// Заменяем функцию загрузки билдов
window.loadBuilds = async function() {
    try {
        return await loadBuildsFromGitHub();
    } catch (error) {
        console.log('Используем оригинальную функцию загрузки');
        return originalLoadBuilds();
    }
};

// Заменяем функцию сохранения билдов
window.saveBuilds = async function(buildsData) {
    try {
        return await saveBuildsToGitHub(buildsData);
    } catch (error) {
        console.log('Используем оригинальную функцию сохранения');
        return originalSaveBuilds(buildsData);
    }
};

// ==== АВТООБНОВЛЕНИЕ БИЛДОВ ====

// Функция для автообновления билдов
async function autoRefreshBuilds() {
    if (!USE_GITHUB) return;
    
    try {
        const buildsData = await loadBuildsFromGitHub();
        
        // Если на странице есть функция displayBuilds, вызываем её
        if (typeof window.displayBuilds === 'function') {
            // Определяем тип страницы
            let pageType = 'pvp';
            if (window.location.pathname.includes('pve')) pageType = 'pve';
            if (window.location.pathname.includes('ss')) pageType = 'ss';
            if (window.location.pathname.includes('zvz')) pageType = 'zvz';
            
            const buildsForPage = buildsData.builds?.[pageType] || [];
            window.displayBuilds(buildsForPage);
        }
    } catch (error) {
        console.log('Автообновление не удалось:', error);
    }
}

// Запускаем автообновление каждые 30 секунд
if (USE_GITHUB) {
    setInterval(autoRefreshBuilds, 30000);
}

// ==== ОБНОВЛЯЕМ СУЩЕСТВУЮЩИЕ ОБРАБОТЧИКИ ====

// Перехватываем отправку форм добавления билдов
document.addEventListener('DOMContentLoaded', function() {
    // Находим все формы добавления билдов
    const buildForms = document.querySelectorAll('form[id*="build"], form[class*="build"]');
    
    buildForms.forEach(form => {
        // Удаляем старые обработчики
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        // Добавляем новый обработчик
        newForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Получаем данные формы (адаптируй под свои поля)
            const formData = new FormData(this);
            const buildData = Object.fromEntries(formData);
            
            // Добавляем недостающие поля
            buildData.id = Date.now();
            buildData.date = new Date().toLocaleString('ru-RU');
            buildData.type = buildData.type || currentPageType || 'pvp';
            
            // Загружаем текущие билды
            const allBuilds = await window.loadBuilds();
            
            // Инициализируем структуру если нужно
            if (!allBuilds.builds) allBuilds.builds = {};
            if (!allBuilds.builds[buildData.type]) {
                allBuilds.builds[buildData.type] = [];
            }
            
            // Добавляем новый билд
            allBuilds.builds[buildData.type].push(buildData);
            
            // Сохраняем
            const saved = await window.saveBuilds(allBuilds);
            
            if (saved) {
                alert('✅ Билд добавлен и будет виден всем!');
            } else {
                alert('✅ Билд добавлен локально. Синхронизация с GitHub не удалась.');
            }
            
            // Обновляем отображение если есть такая функция
            if (typeof window.displayBuilds === 'function') {
                window.displayBuilds(allBuilds.builds[buildData.type]);
            }
            
            // Очищаем форму
            this.reset();
        });
    });
});

// ========== КОНЕЦ ДОБАВЛЯЕМОГО КОДА ==========
