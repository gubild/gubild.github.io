// ==================== КОНФИГУРАЦИЯ ====================
const CATEGORIES = {
    'pvp': { id: 1, name: '⚔️ ПВП', page: 'pvp.html' },
    'pve': { id: 2, name: '🐉 ПВЕ', page: 'pve.html' },
    'zvz': { id: 3, name: '⚡ ZvZ', page: 'Zvz.html' },
    'smallscale': { id: 4, name: '👥 Смолскейл', page: 'smallscale.html' }
};

// ТВОЙ СЕКРЕТНЫЙ ПАРОЛЬ (один для всего)
const SECRET_PASSWORD = "92421lis932"; // ← ЗАМЕНИ НА СВОЙ!

// ==================== СОЗДАНИЕ БИЛДА ====================
function createBuild(name, description, items, category, imageURL, videoURL) {
    console.log('🛠️ Создаю билд:', name);
    
    let builds = JSON.parse(localStorage.getItem('builds')) || [];
    
    const newBuild = {
        id: Date.now(),
        name: name || 'Без названия',
        description: description || '',
        items: items || [],
        category: category || 'pvp',
        categoryId: CATEGORIES[category]?.id || 1,
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
    
    return newBuild;
}

// ==================== ОТОБРАЖЕНИЕ БИЛДОВ НА ГЛАВНОЙ ====================
function renderBuilds() {
    const container = document.getElementById('buildsContainer');
    if (!container) return;
    
    const builds = JSON.parse(localStorage.getItem('builds')) || [];
    
    if (builds.length === 0) {
        container.innerHTML = '<p class="empty-state">😔 Пока нет созданных билдов</p>';
        return;
    }
    
    // Сортируем по дате (новые сначала)
    builds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    let html = '<div class="builds-grid">';
    
    builds.forEach(build => {
        // Определяем иконку категории
        let categoryIcon = '📦';
        let categoryName = 'Другое';
        
        switch(build.category) {
            case 'pvp': categoryIcon = '⚔️'; categoryName = 'ПВП'; break;
            case 'pve': categoryIcon = '🐉'; categoryName = 'ПВЕ'; break;
            case 'zvz': categoryIcon = '⚡'; categoryName = 'ZvZ'; break;
            case 'smallscale': categoryIcon = '👥'; categoryName = 'Смолскейл'; break;
        }
        
        // Форматируем дату
        const date = new Date(build.createdAt);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        html += `
            <div class="build-card">
                <div class="build-header">
                    <div>
                        <div class="build-name" style="cursor: pointer; color: #4cc9f0;" 
                             onclick="showBuildInfo(${build.id})">
                            ${escapeHtml(build.name)}
                        </div>
                        <div class="build-category">${categoryIcon} ${categoryName}</div>
                    </div>
                </div>
                
                <p class="build-description">${escapeHtml(build.description || 'Нет описания')}</p>
                
                <div class="build-footer">
                    <div class="build-date">
                        <i class="far fa-calendar"></i> ${formattedDate}
                    </div>
                    <div class="build-actions">
                        <button onclick="showBuildInfo(${build.id})" 
                                style="background: rgba(76, 201, 240, 0.1); color: #4cc9f0; margin-right: 8px; padding: 6px 12px; border-radius: 6px; border: 1px solid #30363d; cursor: pointer;">
                            <i class="fas fa-eye"></i> Просмотр
                        </button>
                        <button onclick="showDeleteModal(${build.id})" 
                                style="background: rgba(248, 81, 73, 0.1); color: #f85149; padding: 6px 12px; border-radius: 6px; border: 1px solid #30363d; cursor: pointer;">
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

// ==================== ПОКАЗАТЬ ИНФОРМАЦИЮ О БИЛДЕ ====================
function showBuildInfo(buildId) {
    const builds = JSON.parse(localStorage.getItem('builds')) || [];
    const build = builds.find(b => b.id === buildId);
    
    if (!build) {
        alert('Билд не найден!');
        return;
    }
    
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
    
    // Создаем модальное окно
    const modalHTML = `
        <div id="buildInfoModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 2000;">
            <div style="background: #161b22; border-radius: 15px; padding: 30px; width: 90%; max-width: 600px; border: 2px solid #4cc9f0; max-height: 80vh; overflow-y: auto;">
                <div style="text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #30363d;">
                    <h3 style="color: #4cc9f0; font-size: 1.5rem;">
                        <i class="fas fa-info-circle"></i> Информация о билде
                    </h3>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <div style="background: rgba(76, 201, 240, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                        <h4 style="color: #4cc9f0; margin-bottom: 10px;">${escapeHtml(build.name)}</h4>
                        <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 10px;">
                            <span style="background: rgba(76, 201, 240, 0.2); padding: 5px 10px; border-radius: 5px;">
                                ${categoryName}
                            </span>
                            <span style="color: #8b949e;">
                                <i class="far fa-calendar"></i> ${date}
                            </span>
                        </div>
                    </div>
                    
                    ${build.description ? `
                        <div style="margin-bottom: 20px;">
                            <h5 style="color: #72efdd; margin-bottom: 10px;"><i class="fas fa-scroll"></i> Описание</h5>
                            <p style="color: #c9d1d9; line-height: 1.6;">${escapeHtml(build.description)}</p>
                        </div>
                    ` : ''}
                    
                    ${build.items && build.items.length > 0 ? `
                        <div style="margin-bottom: 20px;">
                            <h5 style="color: #72efdd; margin-bottom: 10px;"><i class="fas fa-box-open"></i> Экипировка</h5>
                            <ul style="list-style: none; padding: 0; margin: 0; background: rgba(13,17,23,0.5); padding: 15px; border-radius: 8px;">
                                ${build.items.map(item => `<li style="padding: 5px 0; border-bottom: 1px solid #30363d; color: #c9d1d9;">${escapeHtml(item)}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="closeBuildInfo()" 
                            style="padding: 12px 30px; border-radius: 8px; border: 1px solid #30363d; background: rgba(248,81,73,0.1); color: #f85149; font-weight: 600; cursor: pointer;">
                        <i class="fas fa-times"></i> Закрыть
                    </button>
                </div>
            </div>
        </div>
    `;
    
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
}

// ==================== УДАЛЕНИЕ БИЛДА С ПАРОЛЕМ ====================
function showDeleteModal(buildId) {
    const modalHTML = `
        <div id="deleteModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 2000;">
            <div style="background: #161b22; border-radius: 15px; padding: 30px; width: 90%; max-width: 500px; border: 2px solid #f85149;">
                <div style="text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #30363d;">
                    <h3 style="color: #f85149; font-size: 1.5rem;">
                        <i class="fas fa-exclamation-triangle"></i> Удаление билда
                    </h3>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <p style="color: #8b949e; text-align: center; margin-bottom: 20px;">
                        Введите пароль для подтверждения удаления:
                    </p>
                    
                    <div>
                        <label style="display: block; margin-bottom: 8px; color: #b8c1ec; font-weight: 500;">
                            <i class="fas fa-key"></i> Пароль подтверждения
                        </label>
                        <input type="password" id="deletePassword" 
                               style="width: 100%; padding: 12px 15px; background: rgba(30,30,46,0.8); border: 1px solid #4a4a6d; border-radius: 10px; color: #f0f0f0; font-size: 1rem;"
                               placeholder="Введите пароль">
                        <div id="deleteError" style="color: #f85149; font-size: 0.85rem; margin-top: 5px; display: none;">
                            <i class="fas fa-exclamation-circle"></i> Неверный пароль!
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="closeDeleteModal()" 
                            style="padding: 12px 30px; border-radius: 8px; border: 1px solid #30363d; background: rgba(88,166,255,0.1); color: #58a6ff; font-weight: 600; cursor: pointer;">
                        <i class="fas fa-times"></i> Отмена
                    </button>
                    <button onclick="confirmDelete(${buildId})" 
                            style="padding: 12px 30px; border-radius: 8px; border: none; background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; font-weight: 600; cursor: pointer;">
                        <i class="fas fa-trash"></i> Удалить
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Фокус на поле пароля
    setTimeout(() => {
        const input = document.getElementById('deletePassword');
        if (input) input.focus();
    }, 100);
    
    // Enter для подтверждения
    const passwordInput = document.getElementById('deletePassword');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                confirmDelete(buildId);
            }
        });
    }
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) modal.remove();
}

function confirmDelete(buildId) {
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
    
    // Удаляем билд
    let builds = JSON.parse(localStorage.getItem('builds')) || [];
    const initialLength = builds.length;
    
    builds = builds.filter(build => build.id !== buildId);
    localStorage.setItem('builds', JSON.stringify(builds));
    
    if (builds.length < initialLength) {
        alert('✅ Билд успешно удален!');
        closeDeleteModal();
        
        // Обновляем отображение
        if (typeof renderBuilds === 'function') {
            renderBuilds();
        }
        
        // Перезагружаем через 0.5 сек
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}

function closeBuildInfo() {
    const modal = document.getElementById('buildInfoModal');
    if (modal) modal.remove();
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Старая функция удаления (для совместимости)
function deleteBuild(buildId) {
    showDeleteModal(buildId);
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
// Автоматически запускаем renderBuilds на главной
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof renderBuilds === 'function') {
            renderBuilds();
        }
    });
}

// Сделаем функции доступными глобально
window.createBuild = createBuild;
window.renderBuilds = renderBuilds;
window.showBuildInfo = showBuildInfo;
window.closeBuildInfo = closeBuildInfo;
window.showDeleteModal = showDeleteModal;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;
window.deleteBuild = deleteBuild;
