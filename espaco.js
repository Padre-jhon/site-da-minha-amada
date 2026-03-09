// CRIAR ESTRELAS DE FUNDO
function criarEstrelas() {
    const estrelasDiv = document.getElementById('estrelas');
    const numEstrelas = 200;
    
    for (let i = 0; i < numEstrelas; i++) {
        const estrela = document.createElement('div');
        estrela.classList.add('estrela');
        
        // Tamanho aleatório
        const tamanho = Math.random() * 3 + 1;
        estrela.style.width = tamanho + 'px';
        estrela.style.height = tamanho + 'px';
        
        // Posição aleatória
        estrela.style.left = Math.random() * 100 + '%';
        estrela.style.top = Math.random() * 100 + '%';
        
        // Animação com delay aleatório
        estrela.style.animationDelay = Math.random() * 3 + 's';
        
        estrelasDiv.appendChild(estrela);
    }
}

// CRIAR ESTRELAS CADENTES
function criarEstrelaCadente() {
    const estrelasDiv = document.getElementById('estrelas');
    const estrela = document.createElement('div');
    estrela.classList.add('estrela-cadente');
    
    estrela.style.left = Math.random() * 100 + '%';
    estrela.style.animationDuration = (Math.random() * 2 + 2) + 's';
    
    estrelasDiv.appendChild(estrela);
    
    setTimeout(() => {
        estrela.remove();
    }, 5000);
}

// COLOQUE AQUI OS LINKS DAS FOTOS DE VOCÊS
const fotos = [
    'fotos/WhatsApp Image 2026-03-06 at 21.19.32 (3).jpeg',
    'fotos/WhatsApp Image 2026-03-06 at 21.19.32 (4).jpeg',
    'fotos/WhatsApp Image 2026-03-06 at 21.19.32 (5).jpeg',
    'fotos/WhatsApp Image 2026-03-06 at 21.19.32 (6).jpeg',
    'fotos/WhatsApp Image 2026-03-06 at 21.19.32.jpeg',
    'fotos/WhatsApp Image 2026-03-06 at 21.19.33 (1).jpeg',
    'fotos/WhatsApp Image 2026-03-06 at 21.19.33 (2).jpeg',
    'fotos/WhatsApp Image 2026-03-06 at 21.19.33 (3).jpeg',
    'fotos/WhatsApp Image 2026-03-06 at 21.19.33 (4).jpeg',
    'fotos/WhatsApp Image 2026-03-06 at 21.19.33 (5).jpeg',
    'fotos/WhatsApp Image 2026-03-06 at 21.19.33 (6).jpeg',
    'fotos/WhatsApp Image 2026-03-06 at 21.19.33 (7).jpeg',
    'fotos/WhatsApp Image 2026-03-06 at 21.19.33.jpeg',
    'fotos/WhatsApp Image 2026-03-06 at 21.19.34 (1).jpeg',
    'fotos/WhatsApp Image 2026-03-06 at 21.19.34 (2).jpeg',
    'fotos/WhatsApp Image 2026-03-06 at 21.19.34.jpeg'
];

// CRIAR FOTO SUBINDO
function criarFoto() {
    const container = document.getElementById('fotosContainer');
    const fotoItem = document.createElement('div');
    fotoItem.classList.add('foto-item');
    
    // Posição horizontal aleatória (entre 5% e 85% pra não encostar nas bordas)
    const leftPos = Math.random() * 80 + 5;
    fotoItem.style.left = leftPos + '%';
    
    // Escolher uma foto aleatória
    const fotoIndex = Math.floor(Math.random() * fotos.length);
    
    // Criar a imagem
    const img = document.createElement('img');
    img.src = fotos[fotoIndex];
    img.alt = 'Nossa foto';
    img.loading = 'lazy'; // CARREGA SOB DEMANDA
    
    fotoItem.appendChild(img);
    container.appendChild(fotoItem);
    
    // Remover a foto depois que subir
    setTimeout(() => {
        if (fotoItem && fotoItem.parentNode) {
            fotoItem.remove();
        }
    }, 15000);
}

// INICIAR TUDO
window.onload = () => {
    criarEstrelas();
    
    // Criar estrelas cadentes a cada 3 segundos
    setInterval(criarEstrelaCadente, 3000);
    
    // Criar fotos a cada 1.5 segundos (mais suave)
    setInterval(criarFoto, 1500);
    
    // GARANTIR QUE NÃO TEM SCROLL
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
};