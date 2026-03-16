// CONFIGURAÇÕES DO JOGO
let faseAtual = 1;
let tentativas = 3;
let jogoAtivo = true;

// LABIRINTOS (cada fase)
const labirintos = [
    // FASE 1 - Fácil
    [
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,0,1],
        [1,0,1,2,0,0,0,1,0,1],
        [1,0,1,0,1,1,0,1,0,1],
        [1,0,0,0,1,3,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1]
    ],
    // FASE 2 - Médio
    [
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,1],
        [1,1,1,0,1,0,1,1,0,1],
        [1,2,0,0,0,0,1,0,0,1],
        [1,1,1,1,1,0,1,0,1,1],
        [1,0,0,0,1,0,0,0,3,1],
        [1,1,1,1,1,1,1,1,1,1]
    ],
    // FASE 3 - Difícil
    [
        [1,1,1,1,1,1,1,1,1,1],
        [1,2,0,1,0,0,0,1,0,1],
        [1,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,0,1,0,0,0,1],
        [1,0,1,1,0,1,1,1,0,1],
        [1,0,0,1,0,0,0,1,3,1],
        [1,1,1,1,1,1,1,1,1,1]
    ],
    // FASE 4 - Muito difícil
    [
        [1,1,1,1,1,1,1,1,1,1],
        [1,2,0,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,1,1,0,1],
        [1,1,1,1,1,0,1,0,0,1],
        [1,0,0,0,1,0,1,1,0,1],
        [1,0,1,0,0,0,0,1,3,1],
        [1,1,1,1,1,1,1,1,1,1]
    ],
    // FASE 5 - Especial
    [
        [1,1,1,1,1,1,1,1,1,1],
        [1,2,0,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,1,0,1],
        [1,1,1,1,1,0,1,1,0,1],
        [1,0,0,0,1,0,0,0,0,1],
        [1,0,1,0,0,0,1,1,3,1],
        [1,1,1,1,1,1,1,1,1,1]
    ]
];

// POSIÇÕES INICIAIS
let jogadorPos = { x: 0, y: 0 };
let bonecoPos = { x: 0, y: 0 };
let labirintoAtual = [];

// ELEMENTOS
const canvas = document.getElementById('labirintoCanvas');
const ctx = canvas.getContext('2d');
const telaInicial = document.getElementById('telaInicial');
const telaJogo = document.getElementById('telaJogo');
const telaVitoria = document.getElementById('telaVitoria');
const telaGameOver = document.getElementById('telaGameOver');
const faseSpan = document.getElementById('faseAtual');
const tentativasSpan = document.getElementById('tentativas');

// TAMANHO DAS CÉLULAS
let cellSize = 40;

// INICIAR JOGO
document.getElementById('btnJogar').addEventListener('click', () => {
    telaInicial.style.display = 'none';
    telaJogo.style.display = 'block';
    iniciarFase(1);
});

// REINICIAR FASE
document.getElementById('btnReiniciar').addEventListener('click', () => {
    iniciarFase(faseAtual);
});

// JOGAR NOVAMENTE
document.getElementById('btnJogarNovamente').addEventListener('click', () => {
    telaVitoria.style.display = 'none';
    telaInicial.style.display = 'block';
    faseAtual = 1;
    tentativas = 3;
});

// TENTAR NOVAMENTE
document.getElementById('btnTentarNovamente').addEventListener('click', () => {
    telaGameOver.style.display = 'none';
    telaInicial.style.display = 'block';
    faseAtual = 1;
    tentativas = 3;
});

function iniciarFase(fase) {
    faseAtual = fase;
    faseSpan.textContent = fase;
    tentativasSpan.textContent = tentativas;
    
    labirintoAtual = JSON.parse(JSON.stringify(labirintos[fase-1]));
    
    // ENCONTRAR POSIÇÕES INICIAIS
    for(let y = 0; y < labirintoAtual.length; y++) {
        for(let x = 0; x < labirintoAtual[y].length; x++) {
            if(labirintoAtual[y][x] === 2) {
                jogadorPos = { x, y };
            }
            if(labirintoAtual[y][x] === 3) {
                bonecoPos = { x, y };
            }
        }
    }
    
    desenharLabirinto();
    configurarControles();
}

function desenharLabirinto() {
    canvas.width = labirintoAtual[0].length * cellSize;
    canvas.height = labirintoAtual.length * cellSize;
    
    for(let y = 0; y < labirintoAtual.length; y++) {
        for(let x = 0; x < labirintoAtual[y].length; x++) {
            // PAREDE
            if(labirintoAtual[y][x] === 1) {
                ctx.fillStyle = '#0b3a3f';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                ctx.strokeStyle = '#30838c';
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
            // CAMINHO
            else if(labirintoAtual[y][x] === 0) {
                ctx.fillStyle = '#1d6a73';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
            // JOGADOR (CORAÇÃO)
            else if(labirintoAtual[y][x] === 2) {
                ctx.fillStyle = '#1d6a73';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                ctx.font = `${cellSize * 0.8}px Arial`;
                ctx.fillStyle = '#ff6b9d';
                ctx.fillText('💙', x * cellSize + cellSize * 0.1, y * cellSize + cellSize * 0.8);
            }
            // BONECO TRISTE
            else if(labirintoAtual[y][x] === 3) {
                ctx.fillStyle = '#1d6a73';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                ctx.font = `${cellSize * 0.8}px Arial`;
                ctx.fillStyle = '#ffd966';
                ctx.fillText('😢', x * cellSize + cellSize * 0.1, y * cellSize + cellSize * 0.8);
            }
        }
    }
}

function configurarControles() {
    let arrastando = false;
    let startX, startY;
    
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        startX = (touch.clientX - rect.left) * scaleX;
        startY = (touch.clientY - rect.top) * scaleY;
        
        // VERIFICAR SE CLICOU NO JOGADOR
        const jogadorX = jogadorPos.x * cellSize;
        const jogadorY = jogadorPos.y * cellSize;
        
        if(startX >= jogadorX && startX <= jogadorX + cellSize &&
           startY >= jogadorY && startY <= jogadorY + cellSize) {
            arrastando = true;
        }
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if(!arrastando || !jogoAtivo) return;
        
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const currentX = (touch.clientX - rect.left) * scaleX;
        const currentY = (touch.clientY - rect.top) * scaleY;
        
        // CALCULAR DIREÇÃO DO MOVIMENTO
        const dx = currentX - startX;
        const dy = currentY - startY;
        
        if(Math.abs(dx) > cellSize/2 || Math.abs(dy) > cellSize/2) {
            let newX = jogadorPos.x;
            let newY = jogadorPos.y;
            
            if(Math.abs(dx) > Math.abs(dy)) {
                newX += dx > 0 ? 1 : -1;
            } else {
                newY += dy > 0 ? 1 : -1;
            }
            
            // VERIFICAR SE PODE MOVER
            if(newY >= 0 && newY < labirintoAtual.length && 
               newX >= 0 && newX < labirintoAtual[0].length &&
               labirintoAtual[newY][newX] !== 1) {
                
                // ATUALIZAR POSIÇÃO
                labirintoAtual[jogadorPos.y][jogadorPos.x] = 0;
                jogadorPos.x = newX;
                jogadorPos.y = newY;
                
                // VERIFICAR SE CHEGOU NO BONECO
                if(jogadorPos.x === bonecoPos.x && jogadorPos.y === bonecoPos.y) {
                    venceuFase();
                } else {
                    labirintoAtual[jogadorPos.y][jogadorPos.x] = 2;
                }
                
                desenharLabirinto();
            }
            
            startX = currentX;
            startY = currentY;
        }
    });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        arrastando = false;
    });
}

function venceuFase() {
    if(faseAtual === 5) {
        // VENCEU O JOGO
        telaJogo.style.display = 'none';
        telaVitoria.style.display = 'block';
    } else {
        // PRÓXIMA FASE
        faseAtual++;
        iniciarFase(faseAtual);
    }
}

// AJUSTAR TAMANHO DAS CÉLULAS PRO CELULAR
function ajustarTamanho() {
    const container = document.querySelector('.labirinto-container');
    const containerWidth = container.clientWidth;
    cellSize = Math.floor(containerWidth / 10);
    if(faseAtual >= 1) {
        desenharLabirinto();
    }
}

window.addEventListener('resize', ajustarTamanho);
window.addEventListener('load', ajustarTamanho);