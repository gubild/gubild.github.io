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
