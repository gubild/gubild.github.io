// Supabase клиент для GuildBuild
const SUPABASE_CONFIG = {
    URL: 'https://cmkfmnhgddasoxqfdjir.supabase.co',
    KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNta2ZtbmhnZGRhc294cWZkamlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNzUyODUsImV4cCI6MjA4Mzg1MTI4NX0.0aHOYCxXMpCRFZKYbzmlDiLB9PDhsuQol6zZqEcgE3Y'
};

// Создаём клиент Supabase
const supabaseClient = supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.KEY);

class SupabaseAPI {
    constructor() {
        this.client = supabaseClient;
        this.isConnected = false;
    }
    
    // Проверка подключения
    async checkConnection() {
        try {
            const { data, error } = await this.client
                .from('builds')
                .select('count')
                .limit(1);
            
            this.isConnected = !error;
            console.log('✅ Supabase подключен!');
            return this.isConnected;
        } catch (error) {
            console.error('❌ Ошибка подключения:', error.message);
            this.isConnected = false;
            return false;
        }
    }
    
    // Получить ВСЕ публичные билды
    async getAllPublicBuilds() {
        try {
            console.log('📥 Загружаю билды из Supabase...');
            
            const { data, error } = await this.client
                .from('builds')
                .select('*')
                .eq('is_public', true)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            console.log(`✅ Загружено ${data.length} билдов`);
            return data;
        } catch (error) {
            console.error('❌ Ошибка загрузки:', error.message);
            
            // Fallback
            const saved = localStorage.getItem('guildbuild_public_builds');
            return saved ? JSON.parse(saved) : [];
        }
    }
    
    // Добавить новый билд
    async addBuild(buildData) {
        try {
            console.log('📤 Отправляю билд в Supabase...');
            
            const supabaseBuild = {
                title: buildData.title,
                category: buildData.category,
                equipment: buildData.equipment,
                skills: buildData.skills,
                is_public: buildData.isPublic,
                author_name: buildData.authorName || 'Игрок',
                password_used: buildData.passwordUsed || false
            };
            
            const { data, error } = await this.client
                .from('builds')
                .insert([supabaseBuild])
                .select();
            
            if (error) throw error;
            
            console.log('✅ Билд добавлен в Supabase!');
            return { success: true, data: data[0] };
            
        } catch (error) {
            console.error('❌ Ошибка добавления:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    // Поиск билдов
    async searchBuilds(searchTerm) {
        try {
            const { data, error } = await this.client
                .from('builds')
                .select('*')
                .eq('is_public', true)
                .or(`title.ilike.%${searchTerm}%,equipment->>weapon.ilike.%${searchTerm}%`);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('❌ Ошибка поиска:', error.message);
            return [];
        }
    }
}

// Создаём глобальный экземпляр API
const supabaseAPI = new SupabaseAPI();

// Проверяем подключение при загрузке
document.addEventListener('DOMContentLoaded', async () => {
    await supabaseAPI.checkConnection();
});

// Экспорт
if (typeof window !== 'undefined') {
    window.supabaseAPI = supabaseAPI;
}
