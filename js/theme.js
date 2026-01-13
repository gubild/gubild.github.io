// Логика переключения темы
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
});

function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabels = document.querySelectorAll('.theme-label');
    
    if (!themeToggle) return;
    
    // Проверяем сохранённую тему
    const savedTheme = localStorage.getItem('guildbuild-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Устанавливаем начальную тему
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
        updateThemeLabels('dark');
    } else {
        updateThemeLabels('light');
    }
    
    // Обработчик переключения
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('guildbuild-theme', 'dark');
            updateThemeLabels('dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('guildbuild-theme', 'light');
            updateThemeLabels('light');
        }
    });
}

// Обновление надписей переключателя
function updateThemeLabels(theme) {
    const themeLabels = document.querySelectorAll('.theme-label');
    
    themeLabels.forEach((label, index) => {
        if (theme === 'dark') {
            // Первая надпись - "Светлая", вторая - "Тёмная"
            label.textContent = index === 0 ? 'Светлая' : 'Тёмная';
        } else {
            label.textContent = index === 0 ? 'Светлая' : 'Тёмная';
        }
    });
}

// Экспорт для использования
if (typeof window !== 'undefined') {
    window.initializeTheme = initializeTheme;
    window.updateThemeLabels = updateThemeLabels;
}
