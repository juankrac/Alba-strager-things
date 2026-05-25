// ========== NAVEGACIÓN ==========
const cerrarBtn = document.getElementById('cerrarPortalBtn');
if (cerrarBtn) {
    cerrarBtn.addEventListener('click', () => {
        document.body.style.animation = 'shakePortal 0.3s ease-in-out';
        setTimeout(() => { window.location.href = 'index.html'; }, 300);
    });
}

document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--x', `${x}%`);
    document.documentElement.style.setProperty('--y', `${y}%`);
});

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shakePortal { 0%,100% { transform: translate(0,0); } 25% { transform: translate(-5px,5px); } 50% { transform: translate(5px,-5px); } 75% { transform: translate(-5px,-5px); } }`;
document.head.appendChild(shakeStyle);

// ========== FUNCIONES MODALES ==========
function abrirModal(id) {
    const modalId = 'modal' + id.charAt(0).toUpperCase() + id.slice(1);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        if (id === 'invasores') iniciarJuego();
        if (id === 'demoguchi') iniciarDemoguchi();
    }
}

function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
    if (window.gameAnimation) cancelAnimationFrame(window.gameAnimation);
    if (window.demoguchiInterval) clearInterval(window.demoguchiInterval);
}

// ========== JUEGO INVASORES ==========
let gameAnimation = null;

function iniciarJuego() {
    if (gameAnimation) cancelAnimationFrame(gameAnimation);
    
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 700; canvas.height = 500;
    let playerX = canvas.width / 2;
    let piedras = [];
    let enemigos = [];
    let score = 0;
    let lives = 3;
    let mouseX = playerX;
    let jugando = true;
    
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 7; col++) {
            enemigos.push({ x: 80 + col * 70, y: 60 + row * 60, w: 40, h: 40, vivo: true });
        }
    }
    
    function dibujar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let e of enemigos) {
            if (!e.vivo) continue;
            ctx.fillStyle = '#8B0000';
            ctx.fillRect(e.x, e.y, e.w, e.h);
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(e.x + 10, e.y + 10, 20, 10);
            ctx.fillStyle = 'white';
            ctx.fillRect(e.x + 8, e.y + 25, 8, 8);
            ctx.fillRect(e.x + 24, e.y + 25, 8, 8);
        }
        
        for (let p of piedras) {
            ctx.fillStyle = '#808080';
            ctx.fillRect(p.x, p.y, 6, 10);
        }
        
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(playerX, canvas.height - 60, 40, 40);
        ctx.fillStyle = '#000';
        ctx.fillRect(playerX + 8, canvas.height - 52, 8, 8);
        ctx.fillRect(playerX + 24, canvas.height - 52, 8, 8);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(playerX + 10, canvas.height - 25, 20, 8);
    }
    
    function actualizar() {
        if (!jugando) return;
        
        playerX = Math.min(Math.max(mouseX, 0), canvas.width - 40);
        
        for (let i = 0; i < piedras.length; i++) {
            piedras[i].y -= 5;
            if (piedras[i].y + 10 < 0) { piedras.splice(i,1); i--; }
        }
        
        for (let i = 0; i < piedras.length; i++) {
            for (let j = 0; j < enemigos.length; j++) {
                let e = enemigos[j];
                if (e.vivo && piedras[i].x < e.x + e.w && piedras[i].x + 6 > e.x && 
                    piedras[i].y < e.y + e.h && piedras[i].y + 10 > e.y) {
                    e.vivo = false;
                    piedras.splice(i,1);
                    score += 10;
                    document.getElementById('score').innerText = score;
                    i--; break;
                }
            }
        }
        
        for (let i = 0; i < enemigos.length; i++) {
            if (!enemigos[i].vivo) { enemigos.splice(i,1); i--; }
        }
        
        let bajar = false;
        for (let e of enemigos) {
            e.x += 1.5;
            if (e.x + e.w > canvas.width || e.x < 0) bajar = true;
        }
        if (bajar) {
            for (let e of enemigos) { e.y += 12; e.x += e.x > canvas.width/2 ? -15 : 15; }
        }
        
        for (let e of enemigos) {
            if (playerX < e.x + e.w && playerX + 40 > e.x && 
                canvas.height - 60 < e.y + e.h && canvas.height - 20 > e.y) {
                lives--;
                document.getElementById('lives').innerText = lives;
                if (lives <= 0) { jugando = false; alert('GAME OVER - Puntuación: ' + score); return; }
                enemigos = [];
                for (let row = 0; row < 3; row++) {
                    for (let col = 0; col < 7; col++) {
                        enemigos.push({ x: 80 + col * 70, y: 60 + row * 60, w: 40, h: 40, vivo: true });
                    }
                }
                break;
            }
        }
        
        if (enemigos.length === 0) {
            jugando = false;
            alert('¡VICTORIA! Puntuación: ' + score);
            return;
        }
        
        dibujar();
        gameAnimation = requestAnimationFrame(actualizar);
    }
    
    function onMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        let x = (e.clientX - rect.left) * scaleX;
        mouseX = Math.min(Math.max(x - 20, 0), canvas.width - 40);
    }
    
    function onShoot() { if (jugando) piedras.push({ x: playerX + 17, y: canvas.height - 70 }); }
    
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onShoot);
    
    actualizar();
    
    const resetBtn = document.getElementById('resetGame');
    if (resetBtn) {
        const newBtn = resetBtn.cloneNode(true);
        resetBtn.parentNode.replaceChild(newBtn, resetBtn);
        newBtn.addEventListener('click', () => {
            if (gameAnimation) cancelAnimationFrame(gameAnimation);
            jugando = false;
            setTimeout(() => iniciarJuego(), 50);
        });
    }
}

// ========== DEMOGUCHI ==========
let demoguchiStats = { hambre: 100, felicidad: 100, energia: 100 };
let demoguchiInterval = null;

function actualizarDemoguchiUI() {
    document.getElementById('hambreBar').value = demoguchiStats.hambre;
    document.getElementById('felicidadBar').value = demoguchiStats.felicidad;
    document.getElementById('energiaBar').value = demoguchiStats.energia;
    document.getElementById('hambreVal').innerText = Math.floor(demoguchiStats.hambre) + '%';
    document.getElementById('felicidadVal').innerText = Math.floor(demoguchiStats.felicidad) + '%';
    document.getElementById('energiaVal').innerText = Math.floor(demoguchiStats.energia) + '%';
}

function agregarMensajeDemoguchi(msg) {
    const div = document.getElementById('demoguchiMensajes');
    const p = document.createElement('p');
    p.innerText = msg;
    div.appendChild(p);
    while (div.children.length > 4) div.removeChild(div.children[0]);
}

function alimentarDemoguchi() {
    demoguchiStats.hambre = Math.min(100, demoguchiStats.hambre + 25);
    demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + 5);
    actualizarDemoguchiUI();
    agregarMensajeDemoguchi('🍕 ¡ÑAM! Demoguchi comió feliz +25% hambre');
}

function jugarDemoguchi() {
    if (demoguchiStats.energia >= 15) {
        demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + 20);
        demoguchiStats.energia = Math.max(0, demoguchiStats.energia - 15);
        demoguchiStats.hambre = Math.max(0, demoguchiStats.hambre - 10);
        actualizarDemoguchiUI();
        agregarMensajeDemoguchi('🎾 ¡Jugaste con Demoguchi! +20% felicidad');
    } else {
        agregarMensajeDemoguchi('😴 Demoguchi está muy cansado para jugar');
    }
}

function dormirDemoguchi() {
    demoguchiStats.energia = Math.min(100, demoguchiStats.energia + 40);
    demoguchiStats.hambre = Math.max(0, demoguchiStats.hambre - 15);
    actualizarDemoguchiUI();
    agregarMensajeDemoguchi('😴 Demoguchi durmió profundamente +40% energía');
}

function resetearDemoguchi() {
    demoguchiStats = { hambre: 100, felicidad: 100, energia: 100 };
    actualizarDemoguchiUI();
    agregarMensajeDemoguchi('🐣 ¡Demoguchi ha renacido! Cuídalo bien');
}

function iniciarDemoguchi() {
    if (demoguchiInterval) clearInterval(demoguchiInterval);
    actualizarDemoguchiUI();
    
    demoguchiInterval = setInterval(() => {
        if (document.getElementById('modalDemoguchi').style.display === 'block') {
            demoguchiStats.hambre = Math.max(0, demoguchiStats.hambre - 2);
            demoguchiStats.energia = Math.max(0, demoguchiStats.energia - 1.5);
            if (demoguchiStats.hambre <= 0) demoguchiStats.felicidad = Math.max(0, demoguchiStats.felicidad - 5);
            actualizarDemoguchiUI();
        }
    }, 5000);
    
    document.getElementById('alimentarBtn').onclick = alimentarDemoguchi;
    document.getElementById('jugarDemoguchiBtn').onclick = jugarDemoguchi;
    document.getElementById('dormirDemoguchiBtn').onclick = dormirDemoguchi;
    document.getElementById('resetDemoguchiBtn').onclick = resetearDemoguchi;
}

// ========== CASTILLO BYERS ==========
function initCastillo() {
    const entrarBtn = document.getElementById('entrarCastillo');
    const salirBtn = document.getElementById('salirCastillo');
    const loginDiv = document.getElementById('castilloLogin');
    const contenidoDiv = document.getElementById('castilloContenido');
    const errorMsg = document.getElementById('errorPass');
    
    if (entrarBtn) {
        entrarBtn.addEventListener('click', () => {
            const pass = document.getElementById('passCastillo').value;
            if (pass === 'Radagast') {
                loginDiv.style.display = 'none';
                contenidoDiv.style.display = 'block';
                errorMsg.innerText = '';
            } else {
                errorMsg.innerText = '❌ Contraseña incorrecta';
                document.getElementById('passCastillo').value = '';
            }
        });
    }
    
    if (salirBtn) {
        salirBtn.addEventListener('click', () => {
            loginDiv.style.display = 'block';
            contenidoDiv.style.display = 'none';
            document.getElementById('passCastillo').value = '';
            cerrarModal('modalCastillo');
        });
    }
}

initCastillo();

// ========== FORMULARIO CREATIVIDAD ==========
const form = document.getElementById('formCreativo');
const msgForm = document.getElementById('mensajeForm');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        msgForm.innerText = '✨ ¡Tu creación ha cruzado el portal! ✨';
        form.reset();
        setTimeout(() => msgForm.innerText = '', 3000);
    });
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