// ANIMAÇÃO PARA ABRIR O TEXTO
const selo = document.getElementById('selo');
const textoEscondido = document.getElementById('textoEscondido');

selo.addEventListener('click', function() {
    // Esconde o selo com animação
    selo.style.animation = 'fechar 0.5s ease forwards';
    
    setTimeout(() => {
        selo.style.display = 'none';
        // Mostra o texto
        textoEscondido.classList.add('mostrar');
        
        // Cria corações extras
        criarCoracoes();
    }, 500);
});

// CRIAR CORAÇÕES QUANDO ABRIR
function criarCoracoes() {
    for (let i = 0; i < 10; i++) {
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
        }, i * 200);
    }
}

// CSS extra para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes fechar {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(0);
            opacity: 0;
        }
    }
    
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
document.head.appendChild(style);