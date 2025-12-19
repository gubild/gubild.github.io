// РАБОТАЮЩАЯ функция создания билда
function createBuild(name, description, items, category, imageURL, videoURL) {
    // 1. Получаем текущие билды ИЗ ХРАНИЛИЩА
    const builds = JSON.parse(localStorage.getItem('builds')) || [];
    
    // 2. Проверяем данные (важно!)
    console.log("Создаю билд с данными:", {name, description, items, category});
    
    // 3. Создаем объект билда
    const newBuild = {
        id: Date.now(), // уникальный ID
        name: name || 'Без названия',
        description: description || '',
        items: items || [],
        category: category || 'pvp',
        imageURL: imageURL || '',
        createdAt: new Date().toISOString()
    };
    
    // 4. Добавляем в массив
    builds.push(newBuild);
    
    // 5. СОХРАНЯЕМ в localStorage (самое важное!)
    localStorage.setItem('builds', JSON.stringify(builds));
    
    // 6. Проверяем что сохранилось
    const checkBuilds = JSON.parse(localStorage.getItem('builds')) || [];
    console.log("После сохранения, всего билдов:", checkBuilds.length);
    console.log("Последний билд:", checkBuilds[checkBuilds.length - 1]);
    
    alert(`✅ Билд "${newBuild.name}" создан! В системе теперь ${checkBuilds.length} билдов.`);
    
    return newBuild;
}

// Функция для отображения билдов
function renderBuilds() {
    const builds = JSON.parse(localStorage.getItem('builds')) || [];
    const container = document.getElementById('buildsContainer');
    
    if (!container) {
        console.log("Контейнер buildsContainer не найден!");
        return;
    }
    
    if (builds.length === 0) {
        container.innerHTML = '<p>Пока нет созданных билдов</p>';
        return;
    }
    
    let html = '<h2>Ваши билды (' + builds.length + ')</h2>';
    
    builds.forEach(build => {
        html += `
            <div style="border: 1px solid #ccc; padding: 15px; margin: 10px; border-radius: 8px;">
                <h3>${build.name}</h3>
                <p><strong>Категория:</strong> ${build.category}</p>
                <p>${build.description}</p>
                <p><strong>Предметы:</strong> ${build.items.join(', ') || 'Нет предметов'}</p>
                <small>Создан: ${new Date(build.createdAt).toLocaleDateString()}</small>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Запускаем отображение при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log("Страница загружена, проверяем билды...");
    renderBuilds();
});
// =============== ФУНКЦИЯ ОТОБРАЖЕНИЯ БИЛДОВ ===============
function renderBuilds() {
    console.log("🔄 renderBuilds вызвана");
    
    // 1. Ищем контейнер для билдов
    const buildsContainer = document.getElementById('buildsContainer');
    if (!buildsContainer) {
        console.log("❌ Не найден элемент с id='buildsContainer'!");
        return;
    }
    
    // 2. Загружаем билды из хранилища
    const builds = JSON.parse(localStorage.getItem('builds')) || [];
    console.log("📊 Найдено билдов:", builds.length);
    
    // 3. Если билдов нет — показываем сообщение
    if (builds.length === 0) {
        buildsContainer.innerHTML = '<p class="no-builds">😔 Пока нет созданных билдов</p>';
        return;
    }
    
    // 4. Создаем HTML для каждого билда
    let html = '<div class="builds-grid">';
    
    builds.forEach(build => {
        html += `
            <div class="build-card">
                <div class="build-header">
                    <h3>${escapeHtml(build.name)}</h3>
                    <span class="build-category">${getCategoryName(build.category)}</span>
                </div>
                <p class="build-description">${escapeHtml(build.description || 'Нет описания')}</p>
                <div class="build-items">
                    <strong>🎒 Предметы:</strong>
                    <ul>
                        ${(build.items || []).map(item => `<li>${escapeHtml(item)}</li>`).join('')}
                    </ul>
                </div>
                <div class="build-footer">
                    <small>Создан: ${new Date(build.createdAt).toLocaleDateString()}</small>
                    <button onclick="deleteBuild(${build.id})" class="delete-btn">🗑️ Удалить</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    buildsContainer.innerHTML = html;
    
    console.log("✅ Билды отображены успешно!");
}

// =============== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===============
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getCategoryName(categoryKey) {
    const categories = {
        'pvp': '⚔️ ПВП',
        'pve': '🐉 ПВЕ', 
        'zvz': '⚡ ZvZ',
        'smallscale': '👥 Смолскейл'
    };
    return categories[categoryKey] || '❓ Другое';
}

function deleteBuild(buildId) {
    if (!confirm('Удалить этот билд?')) return;
    
    let builds = JSON.parse(localStorage.getItem('builds')) || [];
    builds = builds.filter(build => build.id !== buildId);
    localStorage.setItem('builds', JSON.stringify(builds));
    
    renderBuilds(); // Обновляем отображение
    alert('🗑️ Билд удален!');
}
