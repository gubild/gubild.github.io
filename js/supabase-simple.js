// Простой клиент Supabase
const SUPABASE_URL = 'https://cmkfmnhgddasoxqfdjir.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNta2ZtbmhnZGRhc294cWZkamlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNzUyODUsImV4cCI6MjA4Mzg1MTI4NX0.0aHOYCxXMpCRFZKYbzmlDiLB9PDhsuQol6zZqEcgE3Y';

// Глобальные функции
window.supabaseSimple = {
    async getPublicBuilds() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/builds?select=*`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }
            
            const data = await response.json();
            console.log('✅ Загружено из Supabase:', data.length, 'билдов');
            return data.filter(build => build.is_public === true);
        } catch (error) {
            console.warn('⚠️ Не удалось загрузить из Supabase:', error.message);
            
            // Fallback
            const local = localStorage.getItem('guildbuild_public_builds');
            return local ? JSON.parse(local) : [];
        }
    },
    
    async addBuild(buildData) {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/builds`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    title: buildData.title,
                    category: buildData.category,
                    equipment: buildData.equipment,
                    skills: buildData.skills,
                    is_public: buildData.isPublic,
                    author_name: 'Игрок',
                    password_used: buildData.passwordUsed || false
                })
            });
            
            const result = await response.json();
            console.log('✅ Билд добавлен в Supabase:', result);
            return { success: true, data: result[0] };
        } catch (error) {
            console.error('❌ Ошибка добавления:', error);
            return { success: false, error: error.message };
        }
    }
};

console.log('✅ Supabase Simple загружен');
