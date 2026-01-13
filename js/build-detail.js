// Логика для детальной страницы билда
document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.pathname.includes('build-detail.html')) return;
    
    initializeBuildDetail();
});

function initializeBuildDetail() {
    // Получаем ID билда из URL
    const urlParams = new URLSearchParams(window.location.search);
    const buildId = urlParams.get('id');
    
    if (!buildId) {
        showError('Билд не найден');
        return;
    }
    
    // Загружаем билд
    const build = loadBuildById(buildId);
    
    if (!build) {
        showError('Билд не найден или был удалён');
        return;
    }
    
    // Отображаем билд
    displayBuild(build);
    
    // Настраиваем кнопки
    setupButtons(build);
    
    // Обновляем год в футере
    updateCurrentYear();
}

// Загрузка билда по ID
function loadBuildById(buildId) {
    // Сначала ищем в "Моих билдах"
    let builds = getMyBuilds();
    let build = builds.find(b => b.id === buildId);
    
    // Если не нашли, ищем в общих
    if (!build) {
        builds = getPublicBuilds();
        build = builds.find(b => b.id === buildId);
    }
    
    return build;
}

// Отображение билда на странице
function displayBuild(build) {
    // Получаем информацию о категории
    const categoryInfo = CONFIG.getCategoryInfo(build.category);
    
    // Заголовок страницы
    document.title = `${build.title} | GuildBuild`;
    
    // Заголовок билда
    const header = document.querySelector('.detail-header');
    if (header) {
        header.style.background = `linear-gradient(135deg, ${categoryInfo.color}, ${CONFIG.UI.COLORS.PRIMARY})`;
    }
    
    // Обновляем элементы
    updateElementText('build-category', `${categoryInfo.icon} ${categoryInfo.name}`);
    updateElementText('build-title', build.title);
    updateElementText('build-date', formatDate(build.createdAt));
    updateElementText('build-visibility', build.isPublic ? 'Общий билд' : 'Личный билд');
    
    // Снаряжение
    updateEquipmentElement('equipment-weapon', build.equipment.weapon);
    updateEquipmentElement('equipment-helmet', build.equipment.helmet);
    updateEquipmentElement('equipment-armor', build.equipment.armor);
    updateEquipmentElement('equipment-boots', build.equipment.boots);
    updateEquipmentElement('equipment-cape', build.equipment.cape);
    updateEquipmentElement('equipment-food', build.equipment.food);
    updateEquipmentElement('equipment-potion', build.equipment.potion);
    
    // Навыки
    displaySkills('skills-active', build.skills.active);
    displaySkills('skills-passive', build.skills.passive);
}

// Обновление элемента снаряжения
function updateEquipmentElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const valueSpan = element.querySelector('.equipment-value');
    if (valueSpan) {
        valueSpan.textContent = value || 'Не указано';
        
        // Если значение не указано, делаем текст бледнее
        if (!value) {
            valueSpan.style.opacity = '0.6';
            valueSpan.style.fontStyle = 'italic';
        }
    }
}

// Отображение навыков
function displaySkills(containerId, skills) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    if (!skills || skills.length === 0) {
        container.innerHTML = `
            <div class="equipment-item-detail">
                <em>Навыки не указаны</em>
            </div>
        `;
        return;
    }
    
    // Добавляем каждый навык
    skills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'equipment-item-detail';
        skillElement.textContent = skill.trim();
        container.appendChild(skillElement);
    });
}

// Настройка кнопок
function setupButtons(build) {
    const copyBtn = document.getElementById('copy-build-btn');
    const editBtn = document.getElementById('edit-build-btn');
    
    // Кнопка "Копировать себе"
    if (copyBtn) {
        // Не показываем для своих же билдов
        const myBuilds = getMyBuilds();
        const isMyBuild = myBuilds.some(b => b.id === build.id);
        
        if (isMyBuild) {
            copyBtn.style.display = 'none';
        } else {
            copyBtn.addEventListener('click', function() {
                copyBuildToMine(build.id);
            });
        }
    }
    
    // Кнопка "Редактировать" (показываем только для своих билдов)
    if (editBtn) {
        const myBuilds = getMyBuilds();
        const isMyBuild = myBuilds.some(b => b.id === build.id);
        
        if (isMyBuild) {
            editBtn.style.display = 'inline-flex';
            editBtn.addEventListener('click', function() {
                editBuild(build.id);
            });
        }
    }
}

// Копирование билда
function copyBuildToMine(buildId) {
    const build = loadBuildById(buildId);
    
    if (!build) {
        alert('Билд не найден!');
        return;
    }
    
    const myBuilds = getMyBuilds();
    
    // Проверяем, нет ли уже копии
    const alreadyCopied = myBuilds.some(b => 
        b.title === build.title && 
        b.category === build.category &&
        b.equipment.weapon === build.equipment.weapon
    );
    
    if (alreadyCopied) {
        alert('Этот билд уже есть в вашей коллекции!');
        return;
    }
    
    // Создаём копию
    const copiedBuild = {
        ...build,
        id: generateId(),
        isPublic: false,
        isCopied: true,
        originalId: build.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Сохраняем
    myBuilds.push(copiedBuild);
    localStorage.setItem(CONFIG.STORAGE_KEYS.MY_BUILDS, JSON.stringify(myBuilds));
    
    // Показываем уведомление
    alert('✅ Билд успешно скопирован в "Мои билды"!');
    
    // Обновляем кнопку
    const copyBtn = document.getElementById('copy-build-btn');
    if (copyBtn) {
        copyBtn.disabled = true;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Скопировано';
        copyBtn.classList.remove('btn-primary');
        copyBtn.classList.add('btn-secondary');
    }
}

// Редактирование билда (заглушка)
function editBuild(buildId) {
    // TODO: Реализовать редактирование
    alert('Редактирование билдов появится в следующей версии!');
}

// Форматирование даты
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Обновление текста элемента
function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

// Показать ошибку
function showError(message) {
    const detailContent = document.querySelector('.detail-content');
    if (detailContent) {
        detailContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i>
                <h3>Ошибка</h3>
                <p>${message}</p>
                <a href="builds.html" class="btn btn-primary">
                    <i class="fas fa-arrow-left"></i> Вернуться к списку билдов
                </a>
            </div>
        `;
    }
}

// Обновить год в футере
function updateCurrentYear() {
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.current-year').forEach(el => {
        el.textContent = currentYear;
    });
}

// Экспорт функций
if (typeof window !== 'undefined') {
    window.copyBuildToMine = copyBuildToMine;
}
