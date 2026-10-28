// Inicializa o banco de dados de posts vazio no LocalStorage do PC
function getStoragePosts() {
    const posts = localStorage.getItem('photoSphereGlobalPosts');
    if (!posts) {
        const emptyPosts = [];
        localStorage.setItem('photoSphereGlobalPosts', JSON.stringify(emptyPosts));
        return emptyPosts;
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
        renderPosts(); 
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

// LÓGICA DO BOTÃO DE ELIMINAR (NOVO)
function deletePost(postId) {
    if (confirm("Tens a certeza de que desejas eliminar permanentemente esta publicação?")) {
        let posts = getStoragePosts();
        
        // Filtra a lista mantendo apenas os posts que NÃO têm o ID selecionado
        let updatedPosts = posts.filter(p => p.id !== postId);
        
        saveStoragePosts(updatedPosts);
        renderPosts(); // Recarrega a timeline instantaneamente
    }
}
