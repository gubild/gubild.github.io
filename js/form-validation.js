// Логика для формы добавления билда
document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.pathname.includes('add-build.html')) return;
    
    initializeForm();
});

function initializeForm() {
    const form = document.getElementById('add-build-form');
    const makePublicCheckbox = document.getElementById('make-public');
    const passwordField = document.getElementById('password-field');
    const successAlert = document.getElementById('success-alert');
    const errorAlert = document.getElementById('error-alert');
    const errorMessage = document.getElementById('error-message');
    
    // Обновляем год в футере
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
    
    // Показ/скрытие поля пароля
    if (makePublicCheckbox && passwordField) {
        makePublicCheckbox.addEventListener('change', function() {
            passwordField.style.display = this.checked ? 'block' : 'none';
            
            // Делаем поле пароля обязательным если чекбокс активен
            const passwordInput = document.getElementById('admin-password');
            if (passwordInput) {
                passwordInput.required = this.checked;
            }
        });
    }
    
    // Обработка отправки формы
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Скрываем предыдущие алерты
            if (successAlert) successAlert.style.display = 'none';
            if (errorAlert) errorAlert.style.display = 'none';
            
            // Валидация формы
            if (!validateForm()) {
                return;
            }
            
            // Собираем данные формы
            const buildData = collectFormData();
            
            // Сохраняем билд
            const saved = saveBuild(buildData);
            
            if (saved) {
                // Показываем успех
                if (successAlert) {
                    successAlert.style.display = 'block';
                    
                    // Очищаем форму через 2 секунды
                    setTimeout(() => {
                        form.reset();
                        if (passwordField) passwordField.style.display = 'none';
                    }, 2000);
                }
            }
        });
    }
}

// Валидация формы
function validateForm() {
    const makePublic = document.getElementById('make-public').checked;
    const passwordInput = document.getElementById('admin-password');
    const errorAlert = document.getElementById('error-alert');
    const errorMessage = document.getElementById('error-message');
    
    // Проверка пароля если публикуем
    if (makePublic) {
        const enteredPassword = passwordInput.value.trim();
        
        if (!enteredPassword) {
            showError('Введите пароль для публикации');
            return false;
        }
        
        if (enteredPassword !== CONFIG.ADMIN_PASSWORD) {
            showError('Неверный админ-пароль');
            return false;
        }
    }
    
    // Проверка обязательных полей
    const requiredFields = document.querySelectorAll('[required]');
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            showError(`Заполните поле: ${field.previousElementSibling?.textContent || ''}`);
            field.focus();
            return false;
        }
    }
    
    return true;
}

// Сбор данных формы
function collectFormData() {
    const makePublic = document.getElementById('make-public').checked;
    
    // Разделяем навыки на массив (по строкам)
    const activeSkills = document.getElementById('skills-active').value
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    
    const passiveSkills = document.getElementById('skills-passive').value
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    
    return {
        id: generateId(),
        title: document.getElementById('build-title').value.trim(),
        category: document.getElementById('build-category').value,
        equipment: {
            weapon: document.getElementById('equipment-weapon').value.trim(),
            helmet: document.getElementById('equipment-helmet').value.trim(),
            armor: document.getElementById('equipment-armor').value.trim(),
            boots: document.getElementById('equipment-boots').value.trim(),
            cape: document.getElementById('equipment-cape').value.trim() || null,
            food: document.getElementById('equipment-food').value.trim() || null,
            potion: document.getElementById('equipment-potion').value.trim() || null
        },
        skills: {
            active: activeSkills,
            passive: passiveSkills
        },
        isPublic: makePublic,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}

// Сохранение билда
function saveBuild(buildData) {
    try {
        if (buildData.isPublic) {
            // Сохраняем в общие билды
            const publicBuilds = getPublicBuilds();
            publicBuilds.push(buildData);
            localStorage.setItem(CONFIG.STORAGE_KEYS.PUBLIC_BUILDS, JSON.stringify(publicBuilds));
            
            // Также сохраняем в "Мои билды" если это первый раз
            const myBuilds = getMyBuilds();
            const alreadyInMyBuilds = myBuilds.some(b => b.id === buildData.id);
            
            if (!alreadyInMyBuilds) {
                const myCopy = { ...buildData, isPublic: false };
                myBuilds.push(myCopy);
                localStorage.setItem(CONFIG.STORAGE_KEYS.MY_BUILDS, JSON.stringify(myBuilds));
            }
        } else {
            // Сохраняем только в "Мои билды"
            const myBuilds = getMyBuilds();
            myBuilds.push(buildData);
            localStorage.setItem(CONFIG.STORAGE_KEYS.MY_BUILDS, JSON.stringify(myBuilds));
        }
        
        return true;
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        showError('Ошибка при сохранении билда');
        return false;
    }
}

// Показать ошибку
function showError(message) {
    const errorAlert = document.getElementById('error-alert');
    const errorMessage = document.getElementById('error-message');
    
    if (errorAlert && errorMessage) {
        errorMessage.textContent = message;
        errorAlert.style.display = 'block';
        
        // Прокрутка к ошибке
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Экспорт функций
if (typeof window !== 'undefined') {
    window.validateForm = validateForm;
    window.collectFormData = collectFormData;
    window.saveBuild = saveBuild;
}
