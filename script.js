const portal = document.getElementById('madrePortal');
const triggerBtn = document.getElementById('portalTrigger');
const tarjetasContainer = document.getElementById('tarjetasContainer');
let portalAbierto = false;

// Seguimiento del mouse para luces parpadeantes
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--x', `${x}%`);
    document.documentElement.style.setProperty('--y', `${y}%`);
});

// Abrir/Cerrar portal y mostrar/ocultar tarjetas
triggerBtn.addEventListener('click', () => {
    if (!portalAbierto) {
        // ABRIR PORTAL - mostrar tarjetas
        portal.style.animation = 'palpitar 1s ease-in-out infinite';
        portal.style.transform = 'scale(1.1)';
        portal.style.opacity = '1';
        portal.style.filter = 'blur(0px)';
        tarjetasContainer.classList.add('mostrar');
        triggerBtn.textContent = '🌀 CERRAR PORTAL 🌀';
        portalAbierto = true;
        
        // Efecto de sacudida al abrir
        document.body.style.animation = 'shakePortal 0.3s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 300);
        
        console.log('⚡ PORTAL ABIERTO - Las tarjetas han aparecido ⚡');
    } else {
        // CERRAR PORTAL - ocultar tarjetas
        portal.style.animation = 'none';
        portal.style.transform = 'scale(0.3)';
        portal.style.opacity = '0';
        portal.style.filter = 'blur(30px)';
        tarjetasContainer.classList.remove('mostrar');
        triggerBtn.textContent = '⚡ ABRIR PORTAL ⚡';
        portalAbierto = false;
        
        console.log('🌀 PORTAL CERRADO 🌀');
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
    if (portalAbierto) {
        portal.style.boxShadow = '0 0 180px rgba(255, 50, 0, 0.9), inset 0 0 60px rgba(0,0,0,0.8)';
    }
});

portal.addEventListener('mouseleave', () => {
    if (portalAbierto) {
        portal.style.boxShadow = '0 0 100px rgba(255, 0, 0, 0.8), 0 0 200px rgba(255, 50, 0, 0.6)';
    }
});

// Mostrar modales al hacer clic en las tarjetas
const tarjetas = document.querySelectorAll('.tarjeta');
const modales = {
    inicio: document.getElementById('modalInicio'),
    personajes: document.getElementById('modalPersonajes'),
    curiosidades: document.getElementById('modalCuriosidades'),
    creatividad: document.getElementById('modalCreatividad')
};

tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
        const apartado = tarjeta.getAttribute('data-apartado');
        if (modales[apartado]) {
            modales[apartado].style.display = 'block';
        }
    });
});

// Cerrar modales
const cerrarBtns = document.querySelectorAll('.cerrar-modal');
cerrarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        Object.values(modales).forEach(modal => {
            if (modal) modal.style.display = 'none';
        });
    });
});

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Formulario de creatividad
const form = document.getElementById('formCreativo');
const mensajeForm = document.getElementById('mensajeForm');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        mensajeForm.textContent = '✨ ¡Tu creación ha cruzado el portal! ✨';
        mensajeForm.style.color = '#ff6600';
        form.reset();
        setTimeout(() => {
            mensajeForm.textContent = '';
        }, 3000);
    });
}

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
