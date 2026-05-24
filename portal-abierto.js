const portal = document.getElementById('madrePortal');
const cerrarBtn = document.getElementById('cerrarPortalBtn');

// Luces al mover mouse
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--x', `${x}%`);
    document.documentElement.style.setProperty('--y', `${y}%`);
});

// Cerrar portal - volver a la página principal
cerrarBtn.addEventListener('click', () => {
    document.body.style.animation = 'shakePortal 0.3s ease-in-out';
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 300);
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
    portal.style.boxShadow = '0 0 180px rgba(255, 50, 0, 0.9), inset 0 0 60px rgba(0,0,0,0.8)';
    portal.style.transform = 'scale(1.02)';
});

portal.addEventListener('mouseleave', () => {
    portal.style.boxShadow = '0 0 100px rgba(255, 0, 0, 0.8), 0 0 200px rgba(255, 50, 0, 0.6)';
    portal.style.transform = 'scale(1)';
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
        const modalKey = tarjeta.getAttribute('data-modal');
        if (modales[modalKey]) {
            modales[modalKey].style.display = 'block';
        }
    });
});

// Cerrar modales con la X
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

// Formulario
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
        alert('💀✨ ¡MENSAJE SECRETO! ✨💀\n"Vecna está observando desde las sombras..."');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => document.body.style.filter = '', 2000);
    }
});
