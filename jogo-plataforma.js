// CONFIGURAÇÕES
let faseAtual = 1;
let pontos = 0;
let vidas = 3;
let jogador = {
    x: 50,
    y: 250,
    vy: 0,
    noChao: false,
    largura: 25,
    altura: 30
};
let carregandoPulo = false;
let forcaPulo = 0;
let maxForcaPulo = 15;
let movimentoEsquerda = false;
let movimentoDireita = false;
let morto = false;
let notas = []; // ARRAY DE NOTAS MUSICAIS

// FASES COM NOTAS MUSICAIS
const fases = [
    {
        plataformas: [
            { x: 0, y: 280, width: 150, height: 20 },
            { x: 200, y: 280, width: 100, height: 20 },
            { x: 350, y: 220, width: 80, height: 20 },
            { x: 500, y: 280, width: 100, height: 20 },
            { x: 650, y: 280, width: 150, height: 20 }
        ],
        coracao: { x: 700, y: 240 },
        notas: [ // NOTAS MUSICAIS DA FASE 1
            { x: 100, y: 200, pega: false },
            { x: 250, y: 200, pega: false },
            { x: 400, y: 150, pega: false },
            { x: 550, y: 200, pega: false }
        ]
    },
    {
        plataformas: [
            { x: 0, y: 280, width: 120, height: 20 },
            { x: 180, y: 200, width: 80, height: 20 },
            { x: 300, y: 280, width: 80, height: 20 },
            { x: 420, y: 180, width: 80, height: 20 },
            { x: 540, y: 280, width: 80, height: 20 },
            { x: 660, y: 280, width: 140, height: 20 }
        ],
        coracao: { x: 720, y: 240 },
        notas: [
            { x: 80, y: 150, pega: false },
            { x: 220, y: 130, pega: false },
            { x: 350, y: 200, pega: false },
            { x: 480, y: 100, pega: false },
            { x: 600, y: 180, pega: false }
        ]
    },
    {
        plataformas: [
            { x: 0, y: 280, width: 100, height: 20 },
            { x: 150, y: 220, width: 80, height: 20 },
            { x: 280, y: 160, width: 80, height: 20 },
            { x: 400, y: 220, width: 80, height: 20 },
            { x: 520, y: 280, width: 80, height: 20 },
            { x: 640, y: 220, width: 80, height: 20 },
            { x: 760, y: 280, width: 100, height: 20 }
        ],
        coracao: { x: 780, y: 240 },
        notas: [
            { x: 120, y: 150, pega: false },
            { x: 250, y: 90, pega: false },
            { x: 380, y: 150, pega: false },
            { x: 500, y: 200, pega: false },
            { x: 620, y: 150, pega: false },
            { x: 740, y: 200, pega: false }
        ]
    },
    {
        plataformas: [
            { x: 0, y: 280, width: 80, height: 20 },
            { x: 120, y: 220, width: 80, height: 20 },
            { x: 240, y: 160, width: 80, height: 20 },
            { x: 360, y: 100, width: 80, height: 20 },
            { x: 480, y: 160, width: 80, height: 20 },
            { x: 600, y: 220, width: 80, height: 20 },
            { x: 720, y: 280, width: 80, height: 20 }
        ],
        coracao: { x: 750, y: 240 },
        notas: [
            { x: 60, y: 150, pega: false },
            { x: 180, y: 100, pega: false },
            { x: 300, y: 50, pega: false },
            { x: 420, y: 90, pega: false },
            { x: 540, y: 130, pega: false },
            { x: 660, y: 170, pega: false }
        ]
    },
    {
        plataformas: [
            { x: 0, y: 280, width: 60, height: 20 },
            { x: 100, y: 200, width: 60, height: 20 },
            { x: 200, y: 120, width: 60, height: 20 },
            { x: 300, y: 200, width: 60, height: 20 },
            { x: 400, y: 280, width: 60, height: 20 },
            { x: 500, y: 200, width: 60, height: 20 },
            { x: 600, y: 120, width: 60, height: 20 },
            { x: 700, y: 200, width: 60, height: 20 },
            { x: 780, y: 280, width: 60, height: 20 }
        ],
        coracao: { x: 800, y: 240 },
        notas: [
            { x: 50, y: 150, pega: false },
            { x: 150, y: 80, pega: false },
            { x: 250, y: 50, pega: false },
            { x: 350, y: 120, pega: false },
            { x: 450, y: 180, pega: false },
            { x: 550, y: 70, pega: false },
            { x: 650, y: 90, pega: false },
            { x: 750, y: 150, pega: false }
        ]
    }
];

// ELEMENTOS
const telaInicial = document.getElementById('telaInicial');
const telaJogo = document.getElementById('telaJogo');
const telaVitoria = document.getElementById('telaVitoria');
const telaGameOver = document.getElementById('telaGameOver');
const cenario = document.getElementById('cenario');
const faseSpan = document.getElementById('faseAtual');
const pontosSpan = document.getElementById('pontos');
const vidasSpan = document.getElementById('vidas');

// SONS (usando Web Audio API)
let audioCtx;
let somNota, somPuloSom, somMoeda;

function iniciarAudio() {
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // FUNÇÃO PARA CRIAR SOM DE NOTA
        function criarSomNota(frequencia = 523.25, duracao = 0.2) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = frequencia;
            
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duracao);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duracao);
        }
        
        somNota = () => criarSomNota(523.25, 0.2); // DÓ
        somPuloSom = () => criarSomNota(392.00, 0.1); // SOL
        somMoeda = () => criarSomNota(659.25, 0.3); // MI
    } catch(e) {
        console.log("Áudio não suportado");
        // FALLBACK: SEM SOM
        somNota = () => {};
        somPuloSom = () => {};
        somMoeda = () => {};
    }
}

// INICIAR ÁUDIO NO PRIMEIRO CLIQUE
document.addEventListener('click', () => {
    if(!audioCtx) {
        iniciarAudio();
    }
}, { once: true });

// ========== BOTÕES DE NAVEGAÇÃO ==========
document.getElementById('btnJogar').addEventListener('click', (e) => {
    e.preventDefault();
    telaInicial.style.display = 'none';
    telaJogo.style.display = 'block';
    vidas = 3;
    pontos = 0;
    carregarFase(1);
});

document.getElementById('btnReiniciar').addEventListener('click', (e) => {
    e.preventDefault();
    carregarFase(faseAtual);
});

document.getElementById('btnJogarNovamente').addEventListener('click', (e) => {
    e.preventDefault();
    telaVitoria.style.display = 'none';
    telaInicial.style.display = 'block';
    faseAtual = 1;
    pontos = 0;
    vidas = 3;
});

document.getElementById('btnTentarNovamente').addEventListener('click', (e) => {
    e.preventDefault();
    telaGameOver.style.display = 'none';
    telaInicial.style.display = 'block';
    faseAtual = 1;
    pontos = 0;
    vidas = 3;
});

// ========== BOTÕES DE CONTROLE ==========
document.getElementById('btnEsquerda').addEventListener('mousedown', (e) => {
    e.preventDefault();
    movimentoEsquerda = true;
});

document.getElementById('btnEsquerda').addEventListener('mouseup', (e) => {
    e.preventDefault();
    movimentoEsquerda = false;
});

document.getElementById('btnEsquerda').addEventListener('mouseleave', (e) => {
    e.preventDefault();
    movimentoEsquerda = false;
});

document.getElementById('btnDireita').addEventListener('mousedown', (e) => {
    e.preventDefault();
    movimentoDireita = true;
});

document.getElementById('btnDireita').addEventListener('mouseup', (e) => {
    e.preventDefault();
    movimentoDireita = false;
});

document.getElementById('btnDireita').addEventListener('mouseleave', (e) => {
    e.preventDefault();
    movimentoDireita = false;
});

// ===== PULO COM INDICADOR =====
const btnPular = document.getElementById('btnPular');
let indicadorCarga = null;

function criarIndicador() {
    if(indicadorCarga) {
        indicadorCarga.remove();
        indicadorCarga = null;
    }
    
    indicadorCarga = document.createElement('div');
    indicadorCarga.classList.add('indicador-carga-simples');
    indicadorCarga.id = 'indicadorCarga';
    indicadorCarga.style.position = 'fixed';
    indicadorCarga.style.bottom = '120px';
    indicadorCarga.style.left = '50%';
    indicadorCarga.style.transform = 'translateX(-50%)';
    indicadorCarga.style.width = '250px';
    indicadorCarga.style.height = '25px';
    indicadorCarga.style.backgroundColor = '#222';
    indicadorCarga.style.border = '4px solid #ffd966';
    indicadorCarga.style.borderRadius = '30px';
    indicadorCarga.style.overflow = 'hidden';
    indicadorCarga.style.zIndex = '9999';
    indicadorCarga.style.boxShadow = '0 0 30px rgba(255, 217, 102, 0.5)';
    
    const barra = document.createElement('div');
    barra.id = 'barraCarga';
    barra.style.height = '100%';
    barra.style.width = '0%';
    barra.style.transition = 'width 0.05s linear';
    
    indicadorCarga.appendChild(barra);
    document.body.appendChild(indicadorCarga);
}

function atualizarIndicador(forca) {
    const barra = document.getElementById('barraCarga');
    if(barra) {
        const porcentagem = (forca / maxForcaPulo) * 100;
        barra.style.width = porcentagem + '%';
        
        if(forca < maxForcaPulo * 0.3) {
            barra.style.backgroundColor = '#ffd966';
        } else if(forca < maxForcaPulo * 0.6) {
            barra.style.backgroundColor = '#ffa500';
        } else {
            barra.style.backgroundColor = '#ff4444';
        }
    }
}

function removerIndicador() {
    if(indicadorCarga) {
        indicadorCarga.remove();
        indicadorCarga = null;
    }
}

btnPular.addEventListener('mousedown', (e) => {
    e.preventDefault();
    if(jogador.noChao && !carregandoPulo && !morto) {
        carregandoPulo = true;
        forcaPulo = 5;
        criarIndicador();
        atualizarIndicador(forcaPulo);
        if(somPuloSom) somPuloSom();
    }
});

btnPular.addEventListener('mouseup', (e) => {
    e.preventDefault();
    if(carregandoPulo) {
        removerIndicador();
        if(jogador.noChao) {
            jogador.vy = -forcaPulo;
            jogador.noChao = false;
        }
        carregandoPulo = false;
    }
});

btnPular.addEventListener('mouseleave', (e) => {
    e.preventDefault();
    if(carregandoPulo) {
        removerIndicador();
        carregandoPulo = false;
    }
});

// TOUCH
btnPular.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if(jogador.noChao && !carregandoPulo && !morto) {
        carregandoPulo = true;
        forcaPulo = 5;
        criarIndicador();
        atualizarIndicador(forcaPulo);
        if(somPuloSom) somPuloSom();
    }
});

btnPular.addEventListener('touchend', (e) => {
    e.preventDefault();
    if(carregandoPulo) {
        removerIndicador();
        if(jogador.noChao) {
            jogador.vy = -forcaPulo;
            jogador.noChao = false;
        }
        carregandoPulo = false;
    }
});

// IMPEDIR CLIQUE PADRÃO
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', (e) => e.preventDefault());
});

// LOOP DE CARREGAMENTO
setInterval(() => {
    if(carregandoPulo && forcaPulo < maxForcaPulo && !morto) {
        forcaPulo += 0.5;
        atualizarIndicador(forcaPulo);
    }
}, 50);

// ========== FUNÇÕES DO JOGO ==========
function carregarFase(fase) {
    faseAtual = fase;
    faseSpan.textContent = fase;
    pontosSpan.textContent = pontos;
    if(vidasSpan) vidasSpan.textContent = vidas;
    
    morto = false;
    movimentoEsquerda = false;
    movimentoDireita = false;
    carregandoPulo = false;
    removerIndicador();
    
    // CARREGAR NOTAS DA FASE
    notas = fases[fase-1].notas.map(nota => ({ ...nota, pega: false }));
    
    jogador = {
        x: 50,
        y: 250,
        vy: 0,
        noChao: true,
        largura: 25,
        altura: 30
    };
    
    desenharCenario();
}

function desenharCenario() {
    cenario.innerHTML = '';
    
    const fase = fases[faseAtual-1];
    
    cenario.className = 'cenario fundo-' + faseAtual;
    
    // ESTRELAS
    for(let i = 0; i < 30; i++) {
        const estrela = document.createElement('div');
        estrela.classList.add('estrela');
        estrela.style.left = Math.random() * 100 + '%';
        estrela.style.top = Math.random() * 100 + '%';
        estrela.style.width = (Math.random() * 3 + 1) + 'px';
        estrela.style.height = estrela.style.width;
        estrela.style.animationDelay = Math.random() * 3 + 's';
        cenario.appendChild(estrela);
    }
    
    // PLANETAS
    for(let i = 0; i < 3; i++) {
        const planeta = document.createElement('div');
        planeta.classList.add('planeta');
        planeta.style.width = (Math.random() * 40 + 20) + 'px';
        planeta.style.height = planeta.style.width;
        planeta.style.left = Math.random() * 80 + 10 + '%';
        planeta.style.top = Math.random() * 50 + 10 + '%';
        cenario.appendChild(planeta);
    }
    
    // PLATAFORMAS
    for(let p of fase.plataformas) {
        const plataforma = document.createElement('div');
        plataforma.classList.add('plataforma');
        plataforma.style.left = p.x + 'px';
        plataforma.style.bottom = (cenario.clientHeight - p.y - p.height) + 'px';
        plataforma.style.width = p.width + 'px';
        plataforma.style.height = p.height + 'px';
        cenario.appendChild(plataforma);
    }
    
    // NOTAS MUSICAIS
    for(let i = 0; i < notas.length; i++) {
        if(!notas[i].pega) {
            const nota = document.createElement('div');
            nota.classList.add('nota-musical');
            nota.id = `nota-${i}`;
            nota.style.left = notas[i].x + 'px';
            nota.style.bottom = (cenario.clientHeight - notas[i].y - 20) + 'px';
            
            // EMOJI DIFERENTE PRA CADA NOTA
            const emojis = ['🎵', '🎶', '♪', '♫', '♩', '🎵'];
            nota.textContent = emojis[i % emojis.length];
            
            cenario.appendChild(nota);
        }
    }
    
    // JOGADOR
    const jogadorEl = document.createElement('div');
    jogadorEl.classList.add('jogador');
    jogadorEl.id = 'jogador';
    jogadorEl.style.left = jogador.x + 'px';
    jogadorEl.style.bottom = (cenario.clientHeight - jogador.y - jogador.altura) + 'px';
    jogadorEl.textContent = '💙';
    cenario.appendChild(jogadorEl);
    
    // CORAÇÃO FINAL
    const coracao = document.createElement('div');
    coracao.classList.add('coracao-final');
    coracao.style.left = fase.coracao.x + 'px';
    coracao.style.bottom = (cenario.clientHeight - fase.coracao.y - 40) + 'px';
    coracao.textContent = '💙';
    cenario.appendChild(coracao);
}

function verificarNotas() {
    for(let i = 0; i < notas.length; i++) {
        if(!notas[i].pega) {
            // VERIFICAR COLISÃO COM NOTA
            if(Math.abs(jogador.x - notas[i].x) < 30 &&
               Math.abs(jogador.y - notas[i].y) < 30) {
                
                notas[i].pega = true;
                pontos += 50;
                pontosSpan.textContent = pontos;
                
                // SOM DE NOTA
                if(somNota) somNota();
                
                // EFEITO VISUAL
                const notaEl = document.getElementById(`nota-${i}`);
                if(notaEl) {
                    notaEl.style.animation = 'pegarNota 0.3s ease';
                    setTimeout(() => {
                        if(notaEl.parentNode) notaEl.remove();
                    }, 300);
                }
                
                // CRIAR PARTÍCULAS
                criarParticulasNota(notas[i].x, notas[i].y);
            }
        }
    }
}

function criarParticulasNota(x, y) {
    for(let i = 0; i < 8; i++) {
        const particula = document.createElement('div');
        particula.classList.add('particula-nota');
        particula.style.left = x + 'px';
        particula.style.bottom = (cenario.clientHeight - y - 10) + 'px';
        particula.style.setProperty('--dx', (Math.random() - 0.5) * 60 + 'px');
        particula.style.setProperty('--dy', (Math.random() * -80) + 'px');
        particula.textContent = ['🎵', '🎶', '♪'][Math.floor(Math.random() * 3)];
        particula.style.fontSize = '1rem';
        cenario.appendChild(particula);
        setTimeout(() => particula.remove(), 500);
    }
}

function morrer() {
    if(morto) return;
    
    morto = true;
    vidas--;
    
    if(vidasSpan) vidasSpan.textContent = vidas;
    removerIndicador();
    
    const jogadorEl = document.getElementById('jogador');
    if(jogadorEl) {
        jogadorEl.style.animation = 'morrer 0.5s ease';
        jogadorEl.style.opacity = '0';
    }
    
    setTimeout(() => {
        if(vidas <= 0) {
            telaJogo.style.display = 'none';
            telaGameOver.style.display = 'block';
        } else {
            carregarFase(faseAtual);
        }
    }, 500);
}

// ========== FÍSICA ==========
function atualizarJogo() {
    if(telaJogo.style.display !== 'block' || morto) return;
    
    const fase = fases[faseAtual-1];
    
    // MOVIMENTO
    if(movimentoEsquerda && jogador.x > 10) {
        jogador.x -= 4;
    }
    if(movimentoDireita && jogador.x < 820) {
        jogador.x += 4;
    }
    
    // GRAVIDADE
    jogador.vy += 0.8;
    jogador.y += jogador.vy;
    
    // COLISÃO
    jogador.noChao = false;
    
    for(let p of fase.plataformas) {
        const platEsq = p.x;
        const platDir = p.x + p.width;
        const platTopo = p.y;
        
        const jogadorEsq = jogador.x;
        const jogadorDir = jogador.x + jogador.largura;
        const jogadorBase = jogador.y + jogador.altura;
        
        if(jogadorDir > platEsq && jogadorEsq < platDir) {
            if(jogador.vy >= 0 && jogadorBase >= platTopo - 5 && jogadorBase <= platTopo + 15) {
                jogador.y = platTopo - jogador.altura;
                jogador.vy = 0;
                jogador.noChao = true;
                break;
            }
        }
    }
    
    // VERIFICAR NOTAS
    verificarNotas();
    
    // CAIU
    if(jogador.y + jogador.altura > 420) {
        morrer();
        return;
    }
    
    // CORAÇÃO
    if(Math.abs(jogador.x - fase.coracao.x) < 40 &&
       Math.abs(jogador.y - fase.coracao.y) < 40) {
        pontos += 100;
        pontosSpan.textContent = pontos;
        if(somMoeda) somMoeda();
        
        if(faseAtual === fases.length) {
            telaJogo.style.display = 'none';
            telaVitoria.style.display = 'block';
        } else {
            faseAtual++;
            carregarFase(faseAtual);
        }
        return;
    }
    
    // ATUALIZAR
    const jogadorEl = document.getElementById('jogador');
    if(jogadorEl) {
        jogadorEl.style.left = jogador.x + 'px';
        jogadorEl.style.bottom = (cenario.clientHeight - jogador.y - jogador.altura) + 'px';
    }
}

// LOOP
setInterval(atualizarJogo, 33);