// ========== BLOQUEAR MENU APENAS NOS BOTÕES DE CONTROLE ==========
const botoesControle = ['btnEsquerda', 'btnDireita', 'btnPular'];

botoesControle.forEach(id => {
    const btn = document.getElementById(id);
    if(btn) {
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }
});

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
let notas = [];
let offsetCamera = 0; // DESLOCAMENTO DA CÂMERA
let larguraTotalFase = 900; // LARGURA TOTAL DA FASE

// FASES
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
        notas: [
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

// ========== ÁUDIO ==========
let audioCtx;
let somNota, somPuloSom, somMoeda;

function iniciarAudio() {
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
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
        
        somNota = () => criarSomNota(523.25, 0.2);
        somPuloSom = () => criarSomNota(392.00, 0.1);
        somMoeda = () => criarSomNota(659.25, 0.3);
    } catch(e) {
        console.log("Áudio não suportado");
        somNota = () => {};
        somPuloSom = () => {};
        somMoeda = () => {};
    }
}

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
    console.log('COMEÇAR CLICADO');
});

document.getElementById('btnReiniciar').addEventListener('click', (e) => {
    e.preventDefault();
    carregarFase(faseAtual);
    console.log('REINICIAR CLICADO');
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
const btnEsquerda = document.getElementById('btnEsquerda');
const btnDireita = document.getElementById('btnDireita');
const btnPular = document.getElementById('btnPular');

// ESQUERDA
btnEsquerda.addEventListener('mousedown', (e) => {
    e.preventDefault();
    movimentoEsquerda = true;
});

btnEsquerda.addEventListener('mouseup', (e) => {
    e.preventDefault();
    movimentoEsquerda = false;
});

btnEsquerda.addEventListener('mouseleave', (e) => {
    e.preventDefault();
    movimentoEsquerda = false;
});

btnEsquerda.addEventListener('touchstart', (e) => {
    e.preventDefault();
    movimentoEsquerda = true;
}, { passive: false });

btnEsquerda.addEventListener('touchend', (e) => {
    e.preventDefault();
    movimentoEsquerda = false;
}, { passive: false });

// DIREITA
btnDireita.addEventListener('mousedown', (e) => {
    e.preventDefault();
    movimentoDireita = true;
});

btnDireita.addEventListener('mouseup', (e) => {
    e.preventDefault();
    movimentoDireita = false;
});

btnDireita.addEventListener('mouseleave', (e) => {
    e.preventDefault();
    movimentoDireita = false;
});

btnDireita.addEventListener('touchstart', (e) => {
    e.preventDefault();
    movimentoDireita = true;
}, { passive: false });

btnDireita.addEventListener('touchend', (e) => {
    e.preventDefault();
    movimentoDireita = false;
}, { passive: false });

// ===== PULO COM CARGA =====
let indicadorCarga = null;
let intervaloPulo = null;

function criarIndicador() {
    if(indicadorCarga) {
        indicadorCarga.remove();
        indicadorCarga = null;
    }
    
    indicadorCarga = document.createElement('div');
    indicadorCarga.classList.add('indicador-carga-simples');
    indicadorCarga.id = 'indicadorCarga';
    document.body.appendChild(indicadorCarga);
}

function atualizarIndicador(forca) {
    const indicador = document.getElementById('indicadorCarga');
    if(indicador) {
        let barra = indicador.querySelector('#barraCarga');
        if(!barra) {
            indicador.innerHTML = '';
            barra = document.createElement('div');
            barra.id = 'barraCarga';
            indicador.appendChild(barra);
        }
        
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
    if(intervaloPulo) {
        clearInterval(intervaloPulo);
        intervaloPulo = null;
    }
}

function comecarCarregarPulo() {
    if(jogador.noChao && !carregandoPulo && !morto) {
        carregandoPulo = true;
        forcaPulo = 5;
        criarIndicador();
        atualizarIndicador(forcaPulo);
        if(somPuloSom) somPuloSom();
        
        intervaloPulo = setInterval(() => {
            if(carregandoPulo && forcaPulo < maxForcaPulo) {
                forcaPulo += 0.5;
                atualizarIndicador(forcaPulo);
            }
        }, 50);
    }
}

function executarPulo() {
    if(carregandoPulo) {
        removerIndicador();
        if(jogador.noChao) {
            jogador.vy = -forcaPulo;
            jogador.noChao = false;
        }
        carregandoPulo = false;
    }
}

// EVENTOS DE PULO
btnPular.addEventListener('mousedown', (e) => {
    e.preventDefault();
    comecarCarregarPulo();
});

btnPular.addEventListener('mouseup', (e) => {
    e.preventDefault();
    executarPulo();
});

btnPular.addEventListener('mouseleave', (e) => {
    e.preventDefault();
    executarPulo();
});

btnPular.addEventListener('touchstart', (e) => {
    e.preventDefault();
    comecarCarregarPulo();
}, { passive: false });

btnPular.addEventListener('touchend', (e) => {
    e.preventDefault();
    executarPulo();
}, { passive: false });

// ========== FUNÇÕES DO JOGO ==========
function carregarFase(fase) {
    faseAtual = fase;
    faseSpan.textContent = fase;
    pontosSpan.textContent = pontos;
    if(vidasSpan) vidasSpan.textContent = vidas;
    
    morto = false;
    movimentoEsquerda = false;
    movimentoDireita = false;
    offsetCamera = 0;
    
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
    cenario.style.overflow = 'hidden';
    
    const fase = fases[faseAtual-1];
    
    cenario.className = 'cenario fundo-' + faseAtual;
    
    // FUNDO FIXO
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
    
    // WRAPPER DO CENÁRIO QUE VAI SE MOVER
    const cenarioWrapper = document.createElement('div');
    cenarioWrapper.id = 'cenarioWrapper';
    cenarioWrapper.style.position = 'relative';
    cenarioWrapper.style.width = larguraTotalFase + 'px';
    cenarioWrapper.style.height = '100%';
    cenarioWrapper.style.transition = 'left 0.05s linear';
    
    // PLATAFORMAS
    for(let p of fase.plataformas) {
        const plataforma = document.createElement('div');
        plataforma.classList.add('plataforma');
        plataforma.style.left = p.x + 'px';
        plataforma.style.bottom = (cenario.clientHeight - p.y - p.height) + 'px';
        plataforma.style.width = p.width + 'px';
        plataforma.style.height = p.height + 'px';
        cenarioWrapper.appendChild(plataforma);
    }
    
    // NOTAS
    for(let i = 0; i < notas.length; i++) {
        if(!notas[i].pega) {
            const nota = document.createElement('div');
            nota.classList.add('nota-musical');
            nota.id = `nota-${i}`;
            nota.style.left = notas[i].x + 'px';
            nota.style.bottom = (cenario.clientHeight - notas[i].y - 20) + 'px';
            nota.textContent = ['🎵', '🎶', '♪', '♫', '♩'][i % 5];
            cenarioWrapper.appendChild(nota);
        }
    }
    
    // CORAÇÃO FINAL
    const coracao = document.createElement('div');
    coracao.classList.add('coracao-final');
    coracao.style.left = fase.coracao.x + 'px';
    coracao.style.bottom = (cenario.clientHeight - fase.coracao.y - 40) + 'px';
    coracao.textContent = '💙';
    cenarioWrapper.appendChild(coracao);
    
    // JOGADOR (NÃO MOVE COM CÂMERA)
    const jogadorEl = document.createElement('div');
    jogadorEl.classList.add('jogador');
    jogadorEl.id = 'jogador';
    jogadorEl.style.left = '200px'; // POSIÇÃO FIXA NA TELA
    jogadorEl.style.bottom = (cenario.clientHeight - jogador.y - jogador.altura) + 'px';
    jogadorEl.textContent = '💙';
    
    cenario.appendChild(cenarioWrapper);
    cenario.appendChild(jogadorEl);
}

function atualizarCamera() {
    const wrapper = document.getElementById('cenarioWrapper');
    if(wrapper) {
        // CALCULAR O OFFSET DA CÂMERA (JOGADOR SEMPRE NO CENTRO)
        // QUEREMOS QUE O JOGADOR FIQUE POR VOLTA DE 200px DA ESQUERDA
        const cameraTarget = jogador.x - 200;
        
        // LIMITAR PARA NÃO MOSTRAR FORA DO CENÁRIO
        offsetCamera = Math.max(0, Math.min(cameraTarget, larguraTotalFase - 400));
        
        // APLICAR O OFFSET
        wrapper.style.left = -offsetCamera + 'px';
        
        // DEBUG
        console.log('Jogador X:', jogador.x, 'Camera:', offsetCamera);
    }
}

function verificarNotas() {
    for(let i = 0; i < notas.length; i++) {
        if(!notas[i].pega) {
            if(Math.abs(jogador.x - notas[i].x) < 30 &&
               Math.abs(jogador.y - notas[i].y) < 30) {
                
                notas[i].pega = true;
                pontos += 50;
                pontosSpan.textContent = pontos;
                if(somNota) somNota();
                
                const notaEl = document.getElementById(`nota-${i}`);
                if(notaEl) {
                    notaEl.remove();
                }
            }
        }
    }
}

function morrer() {
    if(morto) return;
    
    morto = true;
    vidas--;
    removerIndicador();
    
    if(vidasSpan) vidasSpan.textContent = vidas;
    
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
    if(movimentoDireita && jogador.x < larguraTotalFase - 50) {
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
    
    // ATUALIZAR CÂMERA
    atualizarCamera();
    
    // ATUALIZAR POSIÇÃO JOGADOR
    const jogadorEl = document.getElementById('jogador');
    if(jogadorEl) {
        jogadorEl.style.bottom = (cenario.clientHeight - jogador.y - jogador.altura) + 'px';
    }
}

setInterval(atualizarJogo, 33);

console.log('JOGO CARREGADO COM CÂMERA!');