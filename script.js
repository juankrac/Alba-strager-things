const abrirBtn = document.getElementById('abrirPortalBtn');

document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--x', `${x}%`);
    document.documentElement.style.setProperty('--y', `${y}%`);
});

abrirBtn.addEventListener('click', () => {
    document.body.style.animation = 'shakePortal 0.3s ease-in-out';
    setTimeout(() => {
        window.location.href = 'portal-abierto.html';
    }, 300);
});

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shakePortal {
        0%,100% { transform: translate(0,0); }
        25% { transform: translate(-5px,5px); }
        50% { transform: translate(5px,-5px); }
        75% { transform: translate(-5px,-5px); }
    }
`;
document.head.appendChild(shakeStyle);

function crearParticula() {
    const p = document.createElement('div');
    p.style.cssText = `position:fixed; width:2px; height:2px; background:#ff3300; left:${Math.random() * window.innerWidth}px; top:0; opacity:${Math.random()}; border-radius:50%; pointer-events:none; z-index:999;`;
    document.body.appendChild(p);
    let y = 0;
    const int = setInterval(() => {
        y += 5;
        p.style.transform = `translateY(${y}px)`;
        if (y > window.innerHeight) { clearInterval(int); p.remove(); }
    }, 30);
}
setInterval(crearParticula, 300);

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'd') {
        alert('💀✨ ¡MENSAJE SECRETO! ✨💀\nEl Vecna te está observando...');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => document.body.style.filter = '', 2000);
    }
});
