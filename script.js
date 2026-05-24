const portal = document.getElementById('portal');
const boton = document.getElementById('botonPortal');
const tarjetas = document.getElementById('tarjetas');
let abierto = false;

// Abrir/cerrar portal
boton.addEventListener('click', () => {
    if (!abierto) {
        // Abrir portal
        tarjetas.classList.add('mostrar');
        boton.textContent = '🌀 CERRAR PORTAL 🌀';
        portal.style.animation = 'palpitar 0.5s infinite';
        abierto = true;
        // Sacudida
        document.body.style.transform = 'translateX(3px)';
        setTimeout(() => document.body.style.transform = '', 100);
    } else {
        // Cerrar portal
        tarjetas.classList.remove('mostrar');
        boton.textContent = '⚡ ABRIR PORTAL ⚡';
        portal.style.animation = 'palpitar 2s infinite';
        abierto = false;
    }
});

// Abrir modales al hacer clic en tarjetas
const tarjetasLista = document.querySelectorAll('.tarjeta');
const modales = document.querySelectorAll('.modal');
const cerrarBtns = document.querySelectorAll('.cerrar');

tarjetasLista.forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
        const modalId = tarjeta.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'block';
    });
});

// Cerrar modales
cerrarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modales.forEach(modal => modal.style.display = 'none');
    });
});

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Formulario
const formulario = document.getElementById('formulario');
if (formulario) {
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('✨ ¡Tu creación cruzó el portal! ✨');
        formulario.reset();
    });
}

// Partículas
function crearParticula() {
    const p = document.createElement('div');
    p.style.position = 'fixed';
    p.style.width = '3px';
    p.style.height = '3px';
    p.style.background = '#ff3300';
    p.style.left = Math.random() * window.innerWidth + 'px';
    p.style.top = '0px';
    p.style.borderRadius = '50%';
    p.style.pointerEvents = 'none';
    p.style.zIndex = '999';
    document.body.appendChild(p);
    let y = 0;
    const caer = setInterval(() => {
        y += 3;
        p.style.transform = `translateY(${y}px)`;
        if (y > window.innerHeight) {
            clearInterval(caer);
            p.remove();
        }
    }, 30);
}
setInterval(crearParticula, 200);

// Easter Egg
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'd') {
        alert('💀 ¡MENSAJE SECRETO! 💀\nVecna te está observando...');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => document.body.style.filter = '', 1500);
    }
});

// Luces al mover mouse
document.addEventListener('mousemove', (e) => {
    const luz = document.createElement('div');
    luz.style.position = 'fixed';
    luz.style.width = '80px';
    luz.style.height = '80px';
    luz.style.background = 'radial-gradient(circle, rgba(255,0,0,0.2), transparent)';
    luz.style.left = e.clientX - 40 + 'px';
    luz.style.top = e.clientY - 40 + 'px';
    luz.style.pointerEvents = 'none';
    luz.style.zIndex = '9999';
    document.body.appendChild(luz);
    setTimeout(() => luz.remove(), 150);
});
