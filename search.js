// --- SISTEMA FILTRADO DE PESQUISA INTELIGENTE ---

function filterFeedBySearch() {
    const searchInput = document.getElementById('nav-search-input');
    if (!searchInput) return;

    // Converte o texto digitado para letras minúsculas para ignorar maiúsculas/minúsculas
    const query = searchInput.value.trim().toLowerCase();
    
    // Captura todas as caixas de publicações (cards) que estão atualmente desenhadas no ecrã
    const postCards = document.querySelectorAll('.post-card');

    postCards.forEach(card => {
        // Localiza o elemento de texto que contém o nickname do utilizador dentro deste card
        const usernameElement = card.querySelector('.post-username');
        
        if (usernameElement) {
            const usernameText = usernameElement.textContent.toLowerCase();

            // Se o nickname contiver o texto que digitaste, o card fica visível. Caso contrário, é ocultado.
            if (usernameText.includes(query)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease'; // Adiciona um efeito suave ao reaparecer
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Inicializa os ouvintes de eventos assim que o script for carregado em segundo plano
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('nav-search-input');
    if (searchInput) {
        // O evento 'input' deteta cada letra que digitas ou apagas no teclado em tempo real
        searchInput.addEventListener('input', filterFeedBySearch);
    }
});
