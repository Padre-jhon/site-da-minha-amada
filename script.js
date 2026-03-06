// CORAÇÕES FLUTUANTES
function createHeart() {
    const heartsDiv = document.getElementById('hearts');
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '💙';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 5 + 5) + 's'; // entre 5s e 10s
    heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
    heartsDiv.appendChild(heart);

    // Remover coração após a animação terminar
    setTimeout(() => {
        heart.remove();
    }, 10000);
}

// Criar um coração a cada 500ms
setInterval(createHeart, 500);