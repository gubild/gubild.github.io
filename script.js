// Конфигурация сайта
const CONFIG = {
    // Админ-пароль для публикации в общие билды
    ADMIN_PASSWORD: "licasikov",
    
    // Ключи для localStorage
    STORAGE_KEYS: {
        MY_BUILDS: 'guildbuild_my_builds',
        PUBLIC_BUILDS: 'guildbuild_public_builds'
    },
    
    // Категории билдов
    CATEGORIES: {
        PVP: { id: 'pvp', name: 'Player vs Player', icon: '⚔️' },
        PVE: { id: 'pve', name: 'Player vs Environment', icon: '🐉' },
        ZVZ: { id: 'zvz', name: 'Zerg vs Zerg', icon: '⚡' },
        SMALLSCALE: { id: 'smallscale', name: 'Small Scale', icon: '👥' }
    },
    
    // Типы снаряжения
    EQUIPMENT_TYPES: [
        'Оружие',
        'Шлем',
        'Броня', 
        'Обувь',
        'Плащ',
        'Еда',
        'Зелья',
        'Навыки (активные)',
        'Навыки (пассивные)'
    ]
};

// Экспорт конфигурации
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
