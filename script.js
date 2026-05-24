const portal = document.getElementById('madrePortal');
const triggerBtn = document.getElementById('portalTrigger');
const tarjetasOverlay = document.getElementById('tarjetasOverlay');
let portalAbierto = false;

// Luces al mover mouse
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--x', `${x}%`);
    document.documentElement.style.setProperty('--y', `${y}%`);
});

// Abrir/Cerrar portal
triggerBtn.addEventListener('click', () => {
    if (!portalAbierto) {
        // Abrir portal
        portal.style.animation = 'palpitar 1s ease-in-out infinite';
        portal.style.transform = 'scale(1)';
        portal.style.opacity = '1';
        portal.style.filter = 'blur(0px)';
        tarjetasOverlay.classList.add('mostrar');
        triggerBtn.textContent = '🌀 CERRAR PORTAL 🌀';
        portalAbierto = true;
        
        // Sacudida
        document.body.style.animation = 'shakePortal 0.3s ease-in-out';
        setTimeout(() => document.body.style.animation = '', 300);
    } else {
        // Cerrar portal
        portal.style.animation = 'none';
        portal.style.transform = 'scale(0.3)';
        portal.style.opacity = '0';
        portal.style.filter = 'blur(30px)';
        tarjetasOverlay.classList.remove('mostrar');
        triggerBtn.textContent = '⚡ ABRIR PORTAL ⚡';
        portalAbierto = false;
    }
});

// Animación de sacudida
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

// Interacción con portal
portal.addEventListener('mouseenter', () => {
    if (portalAbierto) {
        portal.style.boxShadow = '0 0 180px rgba(255, 50, 0, 0.9), inset 0 0 60px rgba(0,0,0,0.8)';
    }
});

portal.addEventListener('mouseleave', () => {
    if (portalAbierto) {
        portal.style.boxShadow = '0 0 100px rgba(255, 0, 0, 0.8), 0 0 200px rgba(255, 50, 0, 0.6)';
    }
});

// Funciones para modales
function mostrarModal(id) {
    const modal = document.getElementById('modal' + id.charAt(0).toUpperCase() + id.slice(1));
    if (modal) modal.style.display = 'block';
}

function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
}

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Formulario
function enviarFormulario(event) {
    event.preventDefault();
    alert('✨ ¡Tu creación cruzó el portal! ✨');
    document.getElementById('nombre').value = '';
    document.getElementById('mensaje').value = '';
}

// Partículas
function crearParticula() {
    const particula = document.createElement('div');
    particula.style.position = 'fixed';
    particula.style.width = '2px';
    particula.style.height = '2px';
    particula.style.backgroundColor = '#ff3300';
    particula.style.left = Math.random() * window.innerWidth + 'px';
    particula.style.top = '0px';
    particula.style.opacity = Math.random();
    particula.style.borderRadius = '50%';
    particula.style.pointerEvents = 'none';
    particula.style.zIndex = '999';
    document.body.appendChild(particula);
    
    let y = 0;
    const caer = setInterval(() => {
        y += 5;
        particula.style.transform = `translateY(${y}px)`;
        if (y > window.innerHeight) {
            clearInterval(caer);
            particula.remove();
        }
    }, 30);
}
setInterval(crearParticula, 300);

// Easter Egg
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'd') {
        alert('💀✨ ¡MENSAJE SECRETO! ✨💀\nVecna te está observando...');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => document.body.style.filter = '', 2000);
    }
});
