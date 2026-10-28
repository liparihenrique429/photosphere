// --- LÓGICA DE RENDERIZAÇÃO E INICIALIZAÇÃO DO FEED ---

let currentUser = null;

function initFeed() {
    const sessionEmail = localStorage.getItem('activeSession');
    if (!sessionEmail) { 
        window.location.href = 'index.html'; 
        return; 
    }
    currentUser = JSON.parse(localStorage.getItem(sessionEmail));
    
    // Define o avatar do utilizador no canto superior direito
    const navAvatar = document.getElementById('nav-user-avatar');
    if (navAvatar) {
        navAvatar.src = currentUser.profilePic || "https://dicebear.com" + currentUser.nickname;
    }
    
    renderPosts();

    // Sincroniza em tempo real se existirem várias abas abertas no mesmo PC
    window.addEventListener('storage', () => { renderPosts(); });
}

function renderPosts() {
    const timeline = document.getElementById('feed-timeline');
    if (!timeline) return;
    
    timeline.innerHTML = "";
    const allPosts = typeof getStoragePosts === 'function' ? getStoragePosts() : [];

    // Verifica se o utilizador logado é o administrador do sistema
    const isAdmin = (currentUser.email === "liparihenrique429@gmail.com");

    allPosts.forEach(post => {
        const hasLiked = post.likes ? post.likes.includes(currentUser.nickname) : false;
        const card = document.createElement('article');
        card.className = 'post-card';
        
        let commentsHTML = post.comments ? post.comments.map(c => `<p class="comment-line"><strong>${c.user}</strong> ${c.text}</p>`).join('') : '';

        // Define se o botão de apagar deve ser exibido (se for dono da foto ou admin)
        let deleteButtonHTML = "";
        if (post.nickname === currentUser.nickname || isAdmin) {
            deleteButtonHTML = `<button class="delete-post-btn" onclick="deletePost('${post.id}')" title="Eliminar Publicação">🗑️</button>`;
        }

        card.innerHTML = `
            <div class="post-header-area">
                <div class="post-user-info">
                    <img src="${post.avatar}" alt="User">
                    <span class="post-username">${post.nickname} ${isAdmin && post.nickname !== currentUser.nickname ? '<span class="admin-tag">(Moderação)</span>' : ''}</span>
                </div>
                ${deleteButtonHTML}
            </div>
            
            <div class="post-image-container">
                <img src="${post.image}" alt="Post">
            </div>
            
            <div class="post-actions-bar">
                <button class="action-btn ${hasLiked ? 'liked' : ''}" onclick="toggleLike('${post.id}', '${currentUser.nickname}')">
                    ${hasLiked ? '❤️' : '🤍'} ${post.likes ? post.likes.length : 0}
                </button>
                <button class="action-btn" onclick="sharePost('${post.id}')">
                    ↩️ Partilhar
                </button>
            </div>

            <div class="post-caption-box">
                <p><strong>${post.nickname}</strong> ${post.title}</p>
                <div class="comments-section">${commentsHTML}</div>
            </div>

            <form class="comment-form" onsubmit="addComment(event, '${post.id}', '${currentUser.nickname}')">
                <input type="text" id="input-comment-${post.id}" required placeholder="Adicione um comentário público...">
                <button type="submit" class="send-comment-btn">Publicar</button>
            </form>
        `;
        timeline.appendChild(card);
    });

    // Re-aplica o filtro de pesquisa após desenhar se o utilizador tiver algo escrito
    if (typeof filterFeedBySearch === 'function') {
        filterFeedBySearch();
    }
}

// Funções utilitárias do Modal de Publicação
function openPublishModal() { 
    const modal = document.getElementById('publish-modal');
    if (modal) modal.classList.add('active'); 
}

function closePublishModal() { 
    const modal = document.getElementById('publish-modal');
    if (modal) {
        modal.classList.remove('active'); 
        document.getElementById('post-preview').style.display = 'none';
        document.getElementById('preview-placeholder').style.display = 'block';
    }
}

function previewPostImage(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImg = document.getElementById('post-preview');
            const placeholder = document.getElementById('preview-placeholder');
            
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
            placeholder.style.display = 'none';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function handlePublish(event) {
    event.preventDefault();
    const title = document.getElementById('post-title').value.trim();
    const imageSrc = document.getElementById('post-preview').src;

    if (!imageSrc || imageSrc === "" || document.getElementById('post-preview').style.display === 'none') {
        alert("Por favor, selecione uma imagem válida antes de publicar.");
        return;
    }

    const newPost = {
        id: "post_" + Date.now(),
        nickname: currentUser.nickname,
        avatar: currentUser.profilePic || "https://dicebear.com" + currentUser.nickname,
        title: title,
        image: imageSrc,
        likes: [],
        comments: []
    };

    const globalPosts = getStoragePosts();
    globalPosts.unshift(newPost);
    saveStoragePosts(globalPosts);

    closePublishModal();
    event.target.reset();
    renderPosts();
}

function logout() { 
    localStorage.removeItem('activeSession'); 
    window.location.href = 'index.html'; 
}
