const portal = document.getElementById('madrePortal');
const triggerBtn = document.getElementById('portalTrigger');
const portalSections = document.getElementById('portalSections');
let portalAbierto = false;

// Abrir/Cerrar portal mostrando las secciones dentro
triggerBtn.addEventListener('click', () => {
    if (!portalAbierto) {
        // Abrir portal
        portal.style.transform = 'scale(1.1)';
        portalSections.classList.add('active');
        triggerBtn.textContent = '🌀 CERRAR PORTAL 🌀';
        portalAbierto = true;
        
        // Sacudida
        document.body.style.animation = 'shake 0.3s ease-in-out';
        setTimeout(() => document.body.style.animation = '', 300);
    } else {
        // Cerrar portal
        portal.style.transform = 'scale(1)';
        portalSections.classList.remove('active');
        triggerBtn.textContent = '⚡ ABRIR PORTAL ⚡';
        portalAbierto = false;
    }
});

// Al hacer clic en una tarjeta, mostrar su sección completa
document.querySelectorAll('.section-card').forEach(card => {
    card.addEventListener('click', () => {
        const seccion = card.dataset.section;
        const seccionDiv = document.getElementById(seccion);
        if (seccionDiv) {
            seccionDiv.style.display = 'block';
            // Botón para cerrar
            if (!document.querySelector('.cerrar-seccion')) {
                const cerrarBtn = document.createElement('button');
                cerrarBtn.textContent = 'X CERRAR';
                cerrarBtn.className = 'cerrar-seccion';
                cerrarBtn.onclick = () => {
                    seccionDiv.style.display = 'none';
                };
                seccionDiv.insertBefore(cerrarBtn, seccionDiv.firstChild);
            }
        }
    });
});

// Efectos visuales
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--x', `${x}%`);
    document.documentElement.style.setProperty('--y', `${y}%`);
});

// Easter Egg
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'd') {
        alert('💀✨ ¡HAS CRUZADO EL PORTAL! ✨💀\n"Vecna te está observando..."');
    }
});

// Partículas
function crearParticula() {
    const particula = document.createElement('div');
    particula.classList.add('particula');
    particula.style.cssText = `
        position: fixed; width: 2px; height: 2px; background: #ff3300;
        top: 0px; left: ${Math.random() * window.innerWidth}px;
        opacity: ${Math.random()}; border-radius: 50%; pointer-events: none; z-index: 999;
    `;
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
