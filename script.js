const portal = document.getElementById('madrePortal');
const triggerBtn = document.getElementById('portalTrigger');
let portalAbierto = true;

// Seguimiento del mouse para luces parpadeantes
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--x', `${x}%`);
    document.documentElement.style.setProperty('--y', `${y}%`);
});

// Efecto de abrir/cerrar portal
triggerBtn.addEventListener('click', () => {
    if (portalAbierto) {
        // Cerrar portal
        portal.style.animation = 'none';
        portal.style.transform = 'scale(0.3)';
        portal.style.opacity = '0';
        portal.style.filter = 'blur(30px)';
        triggerBtn.textContent = '🌀 ABRIR PORTAL 🌀';
        portalAbierto = false;
        
        console.log('🌀 Portal cerrado...');
    } else {
        // Abrir portal
        portal.style.animation = 'palpitar 1s ease-in-out infinite';
        portal.style.transform = 'scale(1)';
        portal.style.opacity = '1';
        portal.style.filter = 'blur(0px)';
        triggerBtn.textContent = '⚡ CERRAR PORTAL ⚡';
        portalAbierto = true;
        
        // Efecto de sacudida
        document.body.style.animation = 'shakePortal 0.3s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 300);
        console.log('⚡ Portal abierto ⚡');
    }
});

// Efecto de sacudida
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shakePortal {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(-5px, 5px); }
        50% { transform: translate(5px, -5px); }
        75% { transform: translate(-5px, -5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Interacción con el portal
portal.addEventListener('mouseenter', () => {
    portal.style.boxShadow = '0 0 180px rgba(255, 50, 0, 0.9), inset 0 0 60px rgba(0,0,0,0.8)';
    portal.style.transform = 'scale(1.02)';
});

portal.addEventListener('mouseleave', () => {
    portal.style.boxShadow = '0 0 100px rgba(255, 0, 0, 0.8), 0 0 200px rgba(255, 50, 0, 0.6)';
    portal.style.transform = 'scale(1)';
});

// Easter Egg
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'd') {
        alert('💀✨ ¡HAS DESCUBIERTO EL MENSAJE SECRETO! ✨💀\n"Vecna está mirando desde el otro lado..."');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 2000);
    }
});

// Partículas rojas que caen
function crearParticula() {
    const particula = document.createElement('div');
    particula.classList.add('particula');
    particula.style.position = 'fixed';
    particula.style.width = '2px';
    particula.style.height = '2px';
    particula.style.backgroundColor = '#ff3300';
    particula.style.top = '0px';
    particula.style.left = Math.random() * window.innerWidth + 'px';
    particula.style.opacity = Math.random();
    particula.style.borderRadius = '50%';
    particula.style.pointerEvents = 'none';
    particula.style.zIndex = '999';
    document.body.appendChild(particula);
    
    let posY = 0;
    const interval = setInterval(() => {
        posY += 5;
        particula.style.transform = `translateY(${posY}px)`;
        if (posY > window.innerHeight) {
            clearInterval(interval);
            particula.remove();
        }
    }, 30);
}

setInterval(crearParticula, 300);
