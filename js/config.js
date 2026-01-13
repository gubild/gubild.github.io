// Минимальная конфигурация
const CONFIG = {
    STORAGE_KEYS: {
        MY_BUILDS: 'guildbuild_my_builds',
        PUBLIC_BUILDS: 'guildbuild_public_builds',
        SETTINGS: 'guildbuild_settings',
        THEME: 'guildbuild_theme'
    },
    
    ADMIN_PASSWORD: "licapepaswa",
    
    CATEGORIES: {
        PVP: { id: 'pvp', name: 'Player vs Player', icon: '⚔️' },
        PVE: { id: 'pve', name: 'Player vs Environment', icon: '🐉' },
        ZVZ: { id: 'zvz', name: 'Zerg vs Zerg', icon: '⚡' },
        SMALLSCALE: { id: 'smallscale', name: 'Small Scale', icon: '👥' }
    }
};

// Экспорт
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    console.log('✅ CONFIG загружен');
}
