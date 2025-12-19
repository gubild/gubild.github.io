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

// ==================== ФУНКЦИИ ДЛЯ ПРОСМОТРА И УДАЛЕНИЯ БИЛДОВ ====================

// Показать окно с информацией о билде
function showBuildInfo(buildId) {
    const builds = JSON.parse(localStorage.getItem('builds')) || [];
    const build = builds.find(b => b.id === buildId);
    
    if (!build) {
        alert('Билд не найден!');
        return;
    }
    
    // Создаем HTML для информации о билде
    const categoryNames = {
        'pvp': '⚔️ ПВП',
        'pve': '🐉 ПВЕ',
        'zvz': '⚡ ZvZ',
        'smallscale': '👥 Смолскейл'
    };
    
    const categoryName = categoryNames[build.category] || build.category;
    const date = new Date(build.createdAt).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let itemsHTML = '';
    if (build.items && build.items.length > 0) {
        itemsHTML = '<ul style="list-style: none; padding: 0; margin: 15px 0;">';
        build.items.forEach(item => {
            itemsHTML += `<li style="padding: 5px 0; border-bottom: 1px solid #30363d;">${item}</li>`;
        });
        itemsHTML += '</ul>';
    }
    
    const modalHTML = `
        <div id="buildInfoModal" class="modal-overlay" style="display: flex;">
            <div class="confirm-modal" style="max-width: 700px;">
                <div class="modal-header">
                    <h3><i class="fas fa-info-circle"></i> Информация о билде</h3>
                </div>
                
                <div class="modal-body" style="max-height: 400px; overflow-y: auto;">
                    <div style="background: rgba(76, 201, 240, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                        <h4 style="color: #4cc9f0; margin-bottom: 10px;">${build.name}</h4>
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <span style="background: rgba(76, 201, 240, 0.2); padding: 5px 10px; border-radius: 5px;">
                                ${categoryName}
                            </span>
                            <span style="color: #8b949e;">
                                <i class="far fa-calendar"></i> ${date}
                            </span>
                            <span style="color: #8b949e;">
                                <i class="fas fa-hashtag"></i> ID: ${build.id}
                            </span>
                        </div>
                    </div>
                    
                    ${build.description ? `
                        <div style="margin-bottom: 20px;">
                            <h5 style="color: #72efdd; margin-bottom: 10px;"><i class="fas fa-scroll"></i> Описание</h5>
                            <p style="color: #c9d1d9; line-height: 1.6;">${build.description}</p>
                        </div>
                    ` : ''}
                    
                    ${build.items && build.items.length > 0 ? `
                        <div style="margin-bottom: 20px;">
                            <h5 style="color: #72efdd; margin-bottom: 10px;"><i class="fas fa-box-open"></i> Экипировка и расходники</h5>
                            ${itemsHTML}
                        </div>
                    ` : ''}
                    
                    <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #30363d;">
                        <h5 style="color: #f85149; margin-bottom: 10px;"><i class="fas fa-trash-alt"></i> Опасная зона</h5>
                        <p style="color: #8b949e; font-size: 0.9rem;">
                            Чтобы удалить этот билд, введите пароль подтверждения:
                        </p>
                        
                        <div class="password-input-group">
                            <label for="deletePassword"><i class="fas fa-key"></i> Пароль для удаления</label>
                            <input type="password" id="deletePassword" placeholder="Введите пароль для удаления">
                            <div id="deleteError" style="color: #f85149; font-size: 0.85rem; margin-top: 5px; display: none;">
                                <i class="fas fa-exclamation-circle"></i> Неверный пароль!
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="modal-btn cancel" onclick="closeBuildInfo()">
                        <i class="fas fa-times"></i> Закрыть
                    </button>
                    <button type="button" class="modal-btn" onclick="deleteBuildWithPassword(${build.id})" 
                            style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);">
                        <i class="fas fa-trash"></i> Удалить билд
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем модальное окно в body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Закрытие по клику на фон
    const modal = document.getElementById('buildInfoModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeBuildInfo();
            }
        });
    }
    
    // Enter в поле пароля
    const passwordInput = document.getElementById('deletePassword');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                deleteBuildWithPassword(build.id);
            }
        });
    }
}

// Закрыть окно информации
function closeBuildInfo() {
    const modal = document.getElementById('buildInfoModal');
    if (modal) {
        modal.remove();
    }
}

// Удалить билд с проверкой пароля
function deleteBuildWithPassword(buildId) {
    const passwordInput = document.getElementById('deletePassword');
    const errorElement = document.getElementById('deleteError');
    
    if (!passwordInput || !passwordInput.value.trim()) {
        if (errorElement) {
            errorElement.textContent = "Введите пароль!";
            errorElement.style.display = 'block';
            passwordInput.style.borderColor = '#f85149';
            passwordInput.focus();
        }
        return;
    }
    
    // ТОТ ЖЕ ПАРОЛЬ, ЧТО И ПРИ СОЗДАНИИ (92421lis932)
    const SECRET_PASSWORD = "92421lis932"; // ← ЗАМЕНИ НА СВОЙ ПАРОЛЬ!
    
    if (passwordInput.value !== SECRET_PASSWORD) {
        if (errorElement) {
            errorElement.textContent = "Неверный пароль!";
            errorElement.style.display = 'block';
            passwordInput.style.borderColor = '#f85149';
            passwordInput.value = '';
            passwordInput.focus();
        }
        return;
    }
    
    // Пароль верный - удаляем
    let builds = JSON.parse(localStorage.getItem('builds')) || [];
    const initialLength = builds.length;
    
    builds = builds.filter(build => build.id !== buildId);
    localStorage.setItem('builds', JSON.stringify(builds));
    
    if (builds.length < initialLength) {
        alert('✅ Билд успешно удален!');
        closeBuildInfo();
        
        // Обновляем отображение на странице, если есть функция renderBuilds
        if (typeof renderBuilds === 'function') {
            renderBuilds();
        }
        
        // Перезагружаем страницу, если находимся на категории
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}

// Сделать функции доступными глобально
window.showBuildInfo = showBuildInfo;
window.closeBuildInfo = closeBuildInfo;
window.deleteBuildWithPassword = deleteBuildWithPassword;
