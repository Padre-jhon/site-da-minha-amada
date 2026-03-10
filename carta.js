// PEGAR ELEMENTOS
const selo = document.getElementById('selo');
const textoEscondido = document.getElementById('textoEscondido');
const botaoFechar = document.getElementById('botaoFechar');

// ABRIR CARTA
selo.addEventListener('click', function() {
    // Esconde o selo com animação
    selo.style.animation = 'fechar 0.5s ease forwards';
    
    setTimeout(() => {
        selo.style.display = 'none';
        // Mostra o texto
        textoEscondido.classList.add('mostrar');
        
        // Cria corações extras
        criarCoracoes(10);
    }, 500);
});

// FECHAR CARTA
botaoFechar.addEventListener('click', function() {
    // Animação de fechar no texto
    textoEscondido.classList.add('fechando');
    
    setTimeout(() => {
        textoEscondido.classList.remove('mostrar', 'fechando');
        
        // Mostra o selo novamente
        selo.style.display = 'block';
        selo.classList.add('reaparecer');
        
        // Remove a classe de animação depois que terminar
        setTimeout(() => {
            selo.classList.remove('reaparecer');
            selo.style.animation = ''; // Reseta a animação
        }, 800);
        
        // Cria alguns corações quando fechar também
        criarCoracoes(5);
    }, 500);
});

// CRIAR CORAÇÕES
function criarCoracoes(quantidade) {
    for (let i = 0; i < quantidade; i++) {
        setTimeout(() => {
            const coracao = document.createElement('div');
            coracao.innerHTML = '💙';
            coracao.style.position = 'fixed';
            coracao.style.left = Math.random() * 100 + '%';
            coracao.style.bottom = '0';
            coracao.style.fontSize = (Math.random() * 2 + 1) + 'rem';
            coracao.style.color = '#ff6b9d';
            coracao.style.zIndex = '9999';
            coracao.style.pointerEvents = 'none';
            coracao.style.animation = 'subir 3s ease forwards';
            
            document.body.appendChild(coracao);
            
            setTimeout(() => {
                coracao.remove();
            }, 3000);
        }, i * 150);
    }
}

// CSS extra para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes subir {
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

// PLAYER DE ÁUDIO PERSONALIZADO
function initAudioPlayers() {
    const players = document.querySelectorAll('.custom-player');
    
    players.forEach(player => {
        const audioId = player.dataset.audio;
        const audio = document.getElementById(audioId);
        const playBtn = player.querySelector('.play-btn');
        const playIcon = playBtn.querySelector('.play-icon');
        const progressBar = player.querySelector('.progress-bar');
        const progressContainer = player.querySelector('.progress-container');
        const timeDisplay = player.querySelector('.time-display');
        
        // Formatar tempo
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return mins + ':' + (secs < 10 ? '0' : '') + secs;
        }
        
        // Atualizar tempo
        audio.addEventListener('timeupdate', () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = progress + '%';
            timeDisplay.textContent = formatTime(audio.currentTime);
        });
        
        // Quando o áudio terminar
        audio.addEventListener('ended', () => {
            playIcon.textContent = '▶';
            progressBar.style.width = '0%';
            timeDisplay.textContent = '0:00';
        });
        
        // Play/Pause
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (audio.paused) {
                // Pausar todos os outros áudios
                document.querySelectorAll('audio').forEach(otherAudio => {
                    if (otherAudio !== audio && !otherAudio.paused) {
                        otherAudio.pause();
                        // Resetar o ícone do player correspondente
                        const otherPlayer = document.querySelector(`[data-audio="${otherAudio.id}"]`);
                        if (otherPlayer) {
                            otherPlayer.querySelector('.play-icon').textContent = '▶';
                        }
                    }
                });
                
                audio.play();
                playIcon.textContent = '⏸';
            } else {
                audio.pause();
                playIcon.textContent = '▶';
            }
        });
        
        // Clicar na barra de progresso
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const percentage = clickX / width;
            
            if (audio.duration) {
                audio.currentTime = percentage * audio.duration;
            }
        });
    });
}

// Inicializar players quando a página carregar
window.addEventListener('load', initAudioPlayers);
document.head.appendChild(style);