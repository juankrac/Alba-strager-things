// CERRAR PORTAL
const cerrarBtn = document.getElementById('cerrarPortalBtn');
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--x', `${x}%`);
    document.documentElement.style.setProperty('--y', `${y}%`);
});

if (cerrarBtn) {
    cerrarBtn.addEventListener('click', () => {
        document.body.style.animation = 'shakePortal 0.3s ease-in-out';
        setTimeout(() => { window.location.href = 'index.html'; }, 300);
    });
}

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shakePortal { 0%,100% { transform: translate(0,0); } 25% { transform: translate(-5px,5px); } 50% { transform: translate(5px,-5px); } 75% { transform: translate(-5px,-5px); } }`;
document.head.appendChild(shakeStyle);

// ========== MODALES - CORREGIDO ==========
const tarjetas = document.querySelectorAll('.tarjeta');
const modales = {
    inicio: document.getElementById('modalInicio'),
    personajes: document.getElementById('modalPersonajes'),
    curiosidades: document.getElementById('modalCuriosidades'),
    creatividad: document.getElementById('modalCreatividad'),
    invasores: document.getElementById('modalInvasores'),
    demoguchi: document.getElementById('modalDemoguchi')
};

// Función para cerrar todos los modales y detener juegos
function cerrarTodosModales() {
    Object.values(modales).forEach(modal => { 
        if (modal) modal.style.display = 'none'; 
    });
    // Detener juego de invasores
    if (window.invasoresAnimationId) {
        cancelAnimationFrame(window.invasoresAnimationId);
        window.invasoresAnimationId = null;
    }
    // Detener Demoguchi
    if (window.demoguchiInterval) {
        clearInterval(window.demoguchiInterval);
        window.demoguchiInterval = null;
    }
}

// Abrir modales desde tarjetas
tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
        const modalKey = tarjeta.getAttribute('data-modal');
        if (modalKey && modales[modalKey]) {
            cerrarTodosModales();
            modales[modalKey].style.display = 'block';
            if (modalKey === 'invasores') iniciarJuegoInvasores();
            if (modalKey === 'demoguchi') iniciarDemoguchi();
        }
    });
});

// CASTILLO BYERS (tarjeta especial con ID)
const castilloBtn = document.getElementById('castilloBtn');
if (castilloBtn) {
    castilloBtn.addEventListener('click', () => {
        cerrarTodosModales();
        const modalCastillo = document.getElementById('modalCastillo');
        if (modalCastillo) modalCastillo.style.display = 'block';
    });
}

// Cerrar modales con la X
const cerrarBtns = document.querySelectorAll('.cerrar-modal');
cerrarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        cerrarTodosModales();
    });
});

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        cerrarTodosModales();
    }
});

// ========== ESTUDIO DE DIBUJO ==========
const canvas = document.getElementById('lienzoDibujo');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let dibujando = false, colorActual = '#ff0000';
    canvas.width = 300; canvas.height = 300;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            colorActual = btn.getAttribute('data-color');
        });
    });
    document.querySelector('.color-btn[data-color="#ff0000"]')?.classList.add('activo');
    
    const dibujar = (e) => {
        if (!dibujando) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
        let x, y;
        if (e.touches) { x = (e.touches[0].clientX - rect.left) * scaleX; y = (e.touches[0].clientY - rect.top) * scaleY; }
        else { x = (e.clientX - rect.left) * scaleX; y = (e.clientY - rect.top) * scaleY; }
        x = Math.min(Math.max(0, x), canvas.width); y = Math.min(Math.max(0, y), canvas.height);
        ctx.strokeStyle = colorActual; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y);
    };
    canvas.addEventListener('mousedown', (e) => { dibujando = true; dibujar(e); });
    canvas.addEventListener('mouseup', () => { dibujando = false; ctx.beginPath(); });
    canvas.addEventListener('mousemove', dibujar);
    canvas.addEventListener('mouseleave', () => { dibujando = false; ctx.beginPath(); });
    canvas.addEventListener('touchstart', (e) => { dibujando = true; dibujar(e); });
    canvas.addEventListener('touchend', () => { dibujando = false; ctx.beginPath(); });
    canvas.addEventListener('touchmove', dibujar);
    
    document.getElementById('limpiarLienzo').addEventListener('click', () => {
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    document.getElementById('descargarDibujo').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `dibujo_${Date.now()}.png`;
        link.href = canvas.toDataURL(); link.click();
    });
}

// FORMULARIO
const formulario = document.getElementById('formCreativo');
const mensajeForm = document.getElementById('mensajeForm');
if (formulario) {
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        mensajeForm.textContent = '✨ ¡Tu dibujo ha cruzado el portal! ✨';
        formulario.reset();
        setTimeout(() => mensajeForm.textContent = '', 3000);
    });
}

// ========== JUEGO INVASORES (CORREGIDO) ==========
let invasoresAnimationId = null;

function iniciarJuegoInvasores() {
    if (invasoresAnimationId) {
        cancelAnimationFrame(invasoresAnimationId);
        invasoresAnimationId = null;
    }
    
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 700;
    canvas.height = 500;
    
    let player = { x: canvas.width / 2, y: canvas.height - 50, width: 30, height: 30 };
    let piedras = [];
    let demogorgons = [];
    let score = 0;
    let lives = 3;
    let mouseX = player.x;
    let gameRunning = true;
    
    function crearDemogorgons() {
        demogorgons = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 7; col++) {
                demogorgons.push({
                    x: 80 + col * 70,
                    y: 60 + row * 60,
                    width: 40,
                    height: 40,
                    alive: true
                });
            }
        }
    }
    
    function dibujarDustin(x, y) {
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.arc(x + 15, y + 15, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x + 8, y + 10, 3, 0, Math.PI * 2);
        ctx.arc(x + 22, y + 10, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 5, y + 22, 20, 8);
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(x + 12, y - 5, 6, 10);
    }
    
    function dibujarDemogorgon(x, y) {
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.ellipse(x + 20, y + 20, 18, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.moveTo(x + 10, y + 5);
        ctx.lineTo(x + 20, y);
        ctx.lineTo(x + 30, y + 5);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x + 12, y + 18, 4, 0, Math.PI * 2);
        ctx.arc(x + 28, y + 18, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x + 11, y + 17, 2, 0, Math.PI * 2);
        ctx.arc(x + 27, y + 17, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function dibujarPiedra(x, y) {
        ctx.fillStyle = '#808080';
        ctx.beginPath();
        ctx.ellipse(x + 4, y + 4, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function moverMouse(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        let x;
        if (e.touches) {
            x = (e.touches[0].clientX - rect.left) * scaleX;
        } else {
            x = (e.clientX - rect.left) * scaleX;
        }
        mouseX = Math.min(Math.max(x - player.width / 2, 0), canvas.width - player.width);
    }
    
    function disparar(e) {
        if (!gameRunning) return;
        e.preventDefault();
        piedras.push({
            x: player.x + player.width / 2 - 3,
            y: player.y,
            width: 6,
            height: 10,
            active: true
        });
    }
    
    canvas.addEventListener('mousemove', moverMouse);
    canvas.addEventListener('touchmove', moverMouse);
    canvas.addEventListener('click', disparar);
    canvas.addEventListener('touchstart', disparar);
    
    function actualizarJuego() {
        if (!gameRunning) return;
        
        player.x = mouseX;
        player.x = Math.min(Math.max(player.x, 0), canvas.width - player.width);
        
        for (let i = 0; i < piedras.length; i++) {
            piedras[i].y -= 5;
            if (piedras[i].y + piedras[i].height < 0) {
                piedras.splice(i, 1);
                i--;
            }
        }
        
        for (let i = 0; i < piedras.length; i++) {
            for (let j = 0; j < demogorgons.length; j++) {
                const p = piedras[i];
                const d = demogorgons[j];
                if (d.alive && p.x < d.x + d.width && p.x + p.width > d.x && p.y < d.y + d.height && p.y + p.height > d.y) {
                    d.alive = false;
                    piedras.splice(i, 1);
                    score += 10;
                    document.getElementById('score').innerText = score;
                    i--;
                    break;
                }
            }
        }
        
        demogorgons = demogorgons.filter(d => d.alive);
        
        let moverAbajo = false;
        for (let d of demogorgons) {
            d.x += 1.5;
            if (d.x + d.width > canvas.width || d.x < 0) moverAbajo = true;
        }
        
        if (moverAbajo) {
            for (let d of demogorgons) {
                d.y += 15;
                d.x += d.x > canvas.width / 2 ? -15 : 15;
            }
        }
        
        for (let d of demogorgons) {
            if (player.x < d.x + d.width && player.x + player.width > d.x && player.y < d.y + d.height && player.y + player.height > d.y) {
                lives--;
                document.getElementById('lives').innerText = lives;
                if (lives <= 0) {
                    gameRunning = false;
                    cancelAnimationFrame(invasoresAnimationId);
                    invasoresAnimationId = null;
                    alert('💀 GAME OVER 💀\nPuntuación: ' + score);
                    return;
                }
                crearDemogorgons();
                break;
            }
        }
        
        if (demogorgons.length === 0) {
            gameRunning = false;
            cancelAnimationFrame(invasoresAnimationId);
            invasoresAnimationId = null;
            alert('🎉 ¡HAS DERROTADO A LOS DEMOGORGONS! 🎉\nPuntuación: ' + score);
            return;
        }
        
        dibujar();
        invasoresAnimationId = requestAnimationFrame(actualizarJuego);
    }
    
    function dibujar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = `rgba(255, 51, 0, ${Math.random() * 0.3})`;
            ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
        }
        
        for (let d of demogorgons) dibujarDemogorgon(d.x, d.y);
        for (let p of piedras) dibujarPiedra(p.x, p.y);
        dibujarDustin(player.x, player.y);
        
        ctx.fillStyle = '#ff3300';
        ctx.beginPath();
        ctx.arc(mouseX + 15, player.y - 10, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(mouseX + 15, player.y - 12, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    crearDemogorgons();
    actualizarJuego();
    
    const resetBtn = document.getElementById('resetGame');
    const newResetBtn = resetBtn.cloneNode(true);
    resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
    newResetBtn.addEventListener('click', () => {
        if (invasoresAnimationId) cancelAnimationFrame(invasoresAnimationId);
        gameRunning = false;
        score = 0;
        lives = 3;
        piedras = [];
        document.getElementById('score').innerText = score;
        document.getElementById('lives').innerText = lives;
        crearDemogorgons();
        gameRunning = true;
        actualizarJuego();
    });
}

// ========== DEMOGUCHI ==========
let demoguchiStats = { hambre: 100, felicidad: 100, energia: 100 };
let demoguchiInterval = null;

function actualizarBarras() {
    document.getElementById('barraHambre').style.width = demoguchiStats.hambre + '%';
    document.getElementById('barraFelicidad').style.width = demoguchiStats.felicidad + '%';
    document.getElementById('barraEnergia').style.width = demoguchiStats.energia + '%';
    document.getElementById('hambreValor').innerText = Math.floor(demoguchiStats.hambre) + '%';
    document.getElementById('felicidadValor').innerText = Math.floor(demoguchiStats.felicidad) + '%';
    document.getElementById('energiaValor').innerText = Math.floor(demoguchiStats.energia) + '%';
    
    const caraElement = document.getElementById('demoguchiCara');
    if (demoguchiStats.hambre <= 20) caraElement.innerText = '😫';
    else if (demoguchiStats.energia <= 20) caraElement.innerText = '😴';
    else if (demoguchiStats.felicidad <= 30) caraElement.innerText = '😢';
    else if (demoguchiStats.felicidad >= 80 && demoguchiStats.hambre >= 70 && demoguchiStats.energia >= 70) caraElement.innerText = '😈';
    else caraElement.innerText = '👾';
}

function agregarMensajeDemoguchi(msg) {
    const mensajesDiv = document.getElementById('demoguchiMensajes');
    const p = document.createElement('p');
    p.innerText = msg;
    mensajesDiv.appendChild(p);
    if (mensajesDiv.children.length > 5) mensajesDiv.removeChild(mensajesDiv.children[0]);
}

function decaerEstadisticas() {
    if (!document.getElementById('modalDemoguchi') || document.getElementById('modalDemoguchi').style.display !== 'block') return;
    
    demoguchiStats.hambre = Math.max(0, demoguchiStats.hambre - (Math.random() * 2 + 1));
    demoguchiStats.energia = Math.max(0, demoguchiStats.energia - (Math.random() * 1.5 + 0.5));
    
    if (demoguchiStats.hambre <= 0) demoguchiStats.felicidad = Math.max(0, demoguchiStats.felicidad - 5);
    if (demoguchiStats.hambre > 30 && demoguchiStats.energia > 30) demoguchiStats.felicidad = Math.max(0, demoguchiStats.felicidad - 1);
    
    actualizarBarras();
}

function alimentarDemoguchi(tipo) {
    let incremento = 0;
    switch(tipo) {
        case 'pizza': incremento = 25; agregarMensajeDemoguchi("🍕 ¡ÑAM! Le encantó la pizza. +25% hambre"); break;
        case 'huevo': incremento = 15; agregarMensajeDemoguchi("🥚 ¡Crack! El huevo del Upside Down. +15% hambre"); break;
        case 'carne': incremento = 30; agregarMensajeDemoguchi("🍖 ¡RAAAAWR! Devoró la carne. +30% hambre"); break;
        case 'postre': incremento = 20; demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + 10); agregarMensajeDemoguchi("🍦 ¡Qué rico! +20% hambre, +10% felicidad"); break;
    }
    demoguchiStats.hambre = Math.min(100, demoguchiStats.hambre + incremento);
    demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + 5);
    actualizarBarras();
}

function jugarDemoguchi() {
    if (demoguchiStats.energia >= 15) {
        demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + 20);
        demoguchiStats.energia = Math.max(0, demoguchiStats.energia - 15);
        demoguchiStats.hambre = Math.max(0, demoguchiStats.hambre - 10);
        agregarMensajeDemoguchi("🎾 ¡Jugaste con Demoguchi! +20% felicidad");
        actualizarBarras();
    } else {
        agregarMensajeDemoguchi("😴 Demoguchi está muy cansado para jugar.");
    }
}

function dormirDemoguchi() {
    demoguchiStats.energia = Math.min(100, demoguchiStats.energia + 40);
    demoguchiStats.hambre = Math.max(0, demoguchiStats.hambre - 15);
    agregarMensajeDemoguchi("😴 Demoguchi durmió profundamente. +40% energía");
    actualizarBarras();
}

function resetearDemoguchi() {
    demoguchiStats = { hambre: 100, felicidad: 100, energia: 100 };
    if (demoguchiInterval) clearInterval(demoguchiInterval);
    actualizarBarras();
    const mensajesDiv = document.getElementById('demoguchiMensajes');
    mensajesDiv.innerHTML = '<p>🐣 ¡Demoguchi ha renacido! Cuídalo bien...</p>';
    iniciarDemoguchi();
}

function iniciarDemoguchi() {
    if (demoguchiInterval) clearInterval(demoguchiInterval);
    if (!demoguchiStats) demoguchiStats = { hambre: 100, felicidad: 100, energia: 100 };
    actualizarBarras();
    
    const mensajesDiv = document.getElementById('demoguchiMensajes');
    if (mensajesDiv) mensajesDiv.innerHTML = '<p>🐣 ¡Hola! Soy Demoguchi, cuídame...</p>';
    
    demoguchiInterval = setInterval(() => {
        if (document.getElementById('modalDemoguchi') && document.getElementById('modalDemoguchi').style.display === 'block') {
            decaerEstadisticas();
        }
    }, 5000);
    
    const comidaBtns = document.querySelectorAll('.comida-btn');
    comidaBtns.forEach(btn => {
        btn.removeEventListener('click', window._comidaHandler);
        window._comidaHandler = () => alimentarDemoguchi(btn.getAttribute('data-comida'));
        btn.addEventListener('click', window._comidaHandler);
    });
    
    const jugarBtn = document.getElementById('jugarBtn');
    if (jugarBtn) {
        jugarBtn.removeEventListener('click', window._jugarHandler);
        window._jugarHandler = () => jugarDemoguchi();
        jugarBtn.addEventListener('click', window._jugarHandler);
    }
    
    const dormirBtn = document.getElementById('dormirBtn');
    if (dormirBtn) {
        dormirBtn.removeEventListener('click', window._dormirHandler);
        window._dormirHandler = () => dormirDemoguchi();
        dormirBtn.addEventListener('click', window._dormirHandler);
    }
    
    const resetBtn = document.getElementById('resetDemoguchiBtn');
    if (resetBtn) {
        resetBtn.removeEventListener('click', window._resetHandler);
        window._resetHandler = () => resetearDemoguchi();
        resetBtn.addEventListener('click', window._resetHandler);
    }
}

// ========== CASTILLO BYERS (CONTRASEÑA) ==========
function initCastilloByers() {
    const entrarBtn = document.getElementById('entrarCastilloBtn');
    const passwordInput = document.getElementById('passwordCastillo');
    const errorMsg = document.getElementById('errorPassword');
    const loginDiv = document.getElementById('castilloLogin');
    const contenidoDiv = document.getElementById('castilloContenido');
    const cerrarCastilloBtn = document.getElementById('cerrarCastilloBtn');
    
    if (entrarBtn) {
        entrarBtn.addEventListener('click', () => {
            const password = passwordInput.value;
            if (password === 'Radagast') {
                loginDiv.style.display = 'none';
                contenidoDiv.style.display = 'block';
                errorMsg.innerText = '';
            } else {
                errorMsg.innerText = '❌ Contraseña incorrecta. Acceso denegado.';
                passwordInput.value = '';
            }
        });
    }
    
    if (cerrarCastilloBtn) {
        cerrarCastilloBtn.addEventListener('click', () => {
            loginDiv.style.display = 'block';
            contenidoDiv.style.display = 'none';
            passwordInput.value = '';
            errorMsg.innerText = '';
            const modalCastillo = document.getElementById('modalCastillo');
            if (modalCastillo) modalCastillo.style.display = 'none';
        });
    }
}

// Inicializar Castillo Byers cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCastilloByers);
} else {
    initCastilloByers();
}

// ========== PARTÍCULAS ==========
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

// ========== EASTER EGG ==========
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'd') {
        alert('💀✨ ¡MENSAJE SECRETO! ✨💀\nVecna te está observando...');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => document.body.style.filter = '', 2000);
    }
});
