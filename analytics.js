// --- SISTEMA DE ANALYTICS PESSOAL (REAL-TIME) ---

function openAnalyticsModal() {
    // Abre o popup do painel de estatísticas
    const modal = document.getElementById('analytics-modal');
    if (!modal) return;
    
    modal.classList.add('active');
    calculateUserStats();
}

function closeAnalyticsModal() {
    const modal = document.getElementById('analytics-modal');
    if (modal) modal.classList.remove('active');
}

function calculateUserStats() {
    // 1. Ir buscar a sessão e os posts globais
    const sessionEmail = localStorage.getItem('activeSession');
    if (!sessionEmail) return;
    
    const currentUser = JSON.parse(localStorage.getItem(sessionEmail));
    const userNickname = currentUser.nickname;
    
    // Função global que criámos no social.js
    const allPosts = typeof getStoragePosts === 'function' ? getStoragePosts() : [];
    
    // 2. Filtrar apenas as publicações feitas por este utilizador
    const myPosts = allPosts.filter(post => post.nickname === userNickname);
    
    let totalPosts = myPosts.length;
    let totalLikes = 0;
    let averageLikes = 0;
    let bestPostTitle = "Nenhum post publicado";
    let maxLikesInAPost = -1;

    // 3. Processar métricas se houver posts
    if (totalPosts > 0) {
        myPosts.forEach(post => {
            const numLikes = post.likes ? post.likes.length : 0;
            totalLikes += numLikes;
            
            // Verifica se este é o post mais popular de sempre
            if (numLikes > maxLikesInAPost) {
                maxLikesInAPost = numLikes;
                bestPostTitle = post.title;
            }
        });
        
        // Calcula a média arredondada a 1 casa decimal
        averageLikes = (totalLikes / totalPosts).toFixed(1);
    }

    // 4. Injetar os valores reais nos elementos do ecrã
    document.getElementById('stat-total-posts').textContent = totalPosts;
    document.getElementById('stat-total-likes').textContent = totalLikes;
    document.getElementById('stat-avg-likes').textContent = averageLikes;
    document.getElementById('stat-best-post').textContent = bestPostTitle;
}
