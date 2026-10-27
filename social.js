// Inicializa o banco de dados de posts e utilizadores no LocalStorage do PC
function getStoragePosts() {
    const posts = localStorage.getItem('photoSphereGlobalPosts');
    if (!posts) {
        // Posts falsos para o site não iniciar completamente vazio
        const fakePosts = [
            { id: "post_1", nickname: "@lara_travels", avatar: "https://dicebear.com", title: "A explorar novas montanhas neste fim de semana de sonho! 🏔️✨", image: "https://unsplash.com", likes: [], comments: [{ user: "@tech_alex", text: "Que fotografia incrível! 😮" }] },
            { id: "post_2", nickname: "@tech_alex", avatar: "https://dicebear.com", title: "Setup Cyberpunk finalmente concluído no meu quarto! 💻🔥", image: "https://unsplash.com", likes: [], comments: [] }
        ];
        localStorage.setItem('photoSphereGlobalPosts', JSON.stringify(fakePosts));
        return fakePosts;
    }
    return JSON.parse(posts);
}

function saveStoragePosts(posts) {
    localStorage.setItem('photoSphereGlobalPosts', JSON.stringify(posts));
}

// LÓGICA DE DAR LIKE
function toggleLike(postId, userNickname) {
    let posts = getStoragePosts();
    let post = posts.find(p => p.id === postId);
    
    if (post) {
        const index = post.likes.indexOf(userNickname);
        if (index === -1) {
            post.likes.push(userNickname);
        } else {
            post.likes.splice(index, 1);
        }
        saveStoragePosts(posts);
        renderPosts(); // Função que está dentro do feed.html
    }
}

// LÓGICA DE COMENTAR
function addComment(event, postId, userNickname) {
    event.preventDefault();
    const input = document.getElementById(`input-comment-${postId}`);
    const text = input.value.trim();
    
    if (!text) return;

    let posts = getStoragePosts();
    let post = posts.find(p => p.id === postId);

    if (post) {
        post.comments.push({ user: userNickname, text: text });
        saveStoragePosts(posts);
        input.value = ""; 
        renderPosts(); 
    }
}

// LÓGICA DE COMPARTILHAR
function sharePost(postId) {
    const fakeLink = `${window.location.origin}${window.location.pathname}?post=${postId}`;
    navigator.clipboard.writeText(fakeLink).then(() => {
        alert("🔗 Link da publicação copiado para a Área de Transferência!");
    });
}
