// ============================================
// CORAÇÕES FLUTUANTES (seu código original)
// ============================================
function createHeart() {
    const heartsDiv = document.getElementById('hearts');
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '💙';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
    heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
    heartsDiv.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 10000);
}

// ============================================
// SONS DOS INSTRUMENTOS (NOVO!)
// ============================================

// Função para tocar som com reset
function tocarSom(idAudio) {
    const audio = document.getElementById(idAudio);
    
    if (audio) {
        // Reseta o som para o início (permite tocar várias vezes seguidas)
        audio.currentTime = 0;
        
        // Toca o som
        audio.play().catch(error => {
            console.log("Erro ao tocar áudio:", error);
            // Se falhou, tenta criar um elemento novo (fallback)
            criarFallbackAudio(idAudio);
        });
    }
}

// Fallback caso o áudio não carregue
function criarFallbackAudio(instrumento) {
    const audioFallback = new Audio();
    
    // Mapeia os instrumentos para arquivos de som online (exemplos grátis)
    const sonsOnline = {
        'som-violao': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Exemplo genérico
        'som-guitarra': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        'som-piano': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        'som-bateria': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    };
    
    audioFallback.src = sonsOnline[instrumento] || sonsOnline['som-violao'];
    audioFallback.play();
}

// ============================================
// INICIALIZAÇÃO - ADICIONAR EVENTOS AOS CARDS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Mapeamento dos cards para os sons
    const instrumentos = [
        { cardIndex: 0, somId: 'som-violao', nome: 'Violão' },
        { cardIndex: 1, somId: 'som-guitarra', nome: 'Guitarra' },
        { cardIndex: 2, somId: 'som-piano', nome: 'Piano' },
        { cardIndex: 3, somId: 'som-bateria', nome: 'Bateria' }
    ];
    
    // Pegar todos os cards
    const cards = document.querySelectorAll('.instrument-card');
    
    // Adicionar evento de clique em cada card
    instrumentos.forEach(instrumento => {
        if (cards[instrumento.cardIndex]) {
            cards[instrumento.cardIndex].addEventListener('click', function() {
                // Toca o som
                tocarSom(instrumento.somId);
                
                // Feedback visual adicional
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
                
                // Cria algumas notas musicais flutuando
                criarNotasFlutuantes(instrumento.nome);
            });
        }
    });
    
    // Continuar com os corações flutuantes
    setInterval(createHeart, 500);
});

// ============================================
// EFEITO VISUAL EXTRA: NOTAS MUSICAIS
// ============================================
function criarNotasFlutuantes(instrumento) {
    const numNotas = 5;
    
    for (let i = 0; i < numNotas; i++) {
        setTimeout(() => {
            const nota = document.createElement('div');
            nota.innerHTML = '🎵';
            nota.style.position = 'fixed';
            nota.style.left = Math.random() * 100 + '%';
            nota.style.bottom = '0';
            nota.style.fontSize = (Math.random() * 2 + 1.5) + 'rem';
            nota.style.color = '#ffd966';
            nota.style.zIndex = '9999';
            nota.style.pointerEvents = 'none';
            nota.style.animation = 'sobeNota 2s ease forwards';
            nota.style.textShadow = '0 0 10px #ff6b9d';
            
            document.body.appendChild(nota);
            
            setTimeout(() => {
                nota.remove();
            }, 2000);
        }, i * 100);
    }
}

// CSS extra para animação das notas
const style = document.createElement('style');
style.textContent = `
    @keyframes sobeNota {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// PRÉ-CARREGAR ÁUDIOS (OPCIONAL)
// ============================================
window.addEventListener('load', function() {
    // Força o carregamento dos áudios em background
    const audios = ['som-violao', 'som-guitarra', 'som-piano', 'som-bateria'];
    audios.forEach(id => {
        const audio = document.getElementById(id);
        if (audio) {
            audio.load(); // Pré-carrega
        }
    });
});