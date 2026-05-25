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

// ========== MODALES ==========
function cerrarTodosModales() {
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => { modal.style.display = 'none'; });
    if (window.invasoresAnimacion) cancelAnimationFrame(window.invasoresAnimacion);
    if (window.demoguchiInterval) clearInterval(window.demoguchiInterval);
}

// Tarjetas normales
document.querySelectorAll('.tarjeta[data-modal]').forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
        const modalId = tarjeta.getAttribute('data-modal');
        const modal = document.getElementById(`modal${modalId.charAt(0).toUpperCase() + modalId.slice(1)}`);
        if (modal) {
            cerrarTodosModales();
            modal.style.display = 'block';
            if (modalId === 'invasores') iniciarJuegoInvasores();
            if (modalId === 'demoguchi') iniciarDemoguchi();
        }
    });
});

// Castillo Byers
const castilloBtn = document.getElementById('castilloBtn');
if (castilloBtn) {
    castilloBtn.addEventListener('click', () => {
        cerrarTodosModales();
        const modalCastillo = document.getElementById('modalCastillo');
        if (modalCastillo) modalCastillo.style.display = 'block';
    });
}

// Cerrar con X
document.querySelectorAll('.cerrar-modal').forEach(btn => {
    btn.addEventListener('click', cerrarTodosModales);
});

// Cerrar al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) cerrarTodosModales();
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
    
    document.getElementById('limpiarLienzo')?.addEventListener('click', () => {
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    document.getElementById('descargarDibujo')?.addEventListener('click', () => {
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

// ========== JUEGO INVASORES CON SPRITES ==========
let invasoresAnimacion = null;

// Cargar las imágenes de los sprites
const imagenDustin = new Image();
const imagenDemogorgon = new Image();
imagenDustin.src = 'dustin.png';
imagenDemogorgon.src = 'demogorgon.png';

// Variables para saber si las imágenes ya cargaron
let imagenesCargadas = false;
let contadorImagenes = 0;

function verificarCarga() {
    contadorImagenes++;
    if (contadorImagenes === 2) {
        imagenesCargadas = true;
        console.log('✅ Sprites cargados correctamente');
    }
}

imagenDustin.onload = verificarCarga;
imagenDemogorgon.onload = verificarCarga;
imagenDustin.onerror = () => console.error('❌ Error cargando dustin.png');
imagenDemogorgon.onerror = () => console.error('❌ Error cargando demogorgon.png');

function iniciarJuegoInvasores() {
    if (invasoresAnimacion) cancelAnimationFrame(invasoresAnimacion);
    
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 700; canvas.height = 500;
    let playerX = canvas.width / 2;
    let piedras = [];
    let demogorgons = [];
    let score = 0;
    let lives = 3;
    let mouseX = playerX;
    let jugando = true;
    
    // Crear Demogorgons
    function crearDemogorgons() {
        demogorgons = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 7; col++) {
                demogorgons.push({ x: 80 + col * 70, y: 60 + row * 60, w: 45, h: 45, vivo: true });
            }
        }
    }
    crearDemogorgons();
    
    function dibujar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Fondo estilo Upside Down
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Partículas de fondo
        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = `rgba(255, 51, 0, ${Math.random() * 0.3})`;
            ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
        }
        
        // Dibujar Demogorgons con sprite
        for (let d of demogorgons) {
            if (!d.vivo) continue;
            if (imagenDemogorgon.complete && imagenDemogorgon.naturalHeight !== 0) {
                ctx.drawImage(imagenDemogorgon, d.x, d.y, d.w, d.h);
            } else {
                // Fallback: círculo rojo si no carga la imagen
                ctx.fillStyle = '#8B0000';
                ctx.beginPath();
                ctx.arc(d.x + d.w/2, d.y + d.h/2, 20, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ff0000';
                ctx.beginPath();
                ctx.moveTo(d.x + 10, d.y + 5);
                ctx.lineTo(d.x + d.w/2, d.y);
                ctx.lineTo(d.x + d.w - 10, d.y + 5);
                ctx.fill();
            }
        }
        
        // Dibujar piedras
        for (let p of piedras) {
            ctx.fillStyle = '#808080';
            ctx.shadowBlur = 0;
            ctx.fillRect(p.x, p.y, 6, 10);
        }
        
        // Dibujar Dustin con sprite
        if (imagenDustin.complete && imagenDustin.naturalHeight !== 0) {
            ctx.drawImage(imagenDustin, playerX, canvas.height - 75, 50, 55);
        } else {
            // Fallback: cuadrado amarillo
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(playerX, canvas.height - 70, 50, 50);
            ctx.fillStyle = '#000';
            ctx.fillRect(playerX + 10, canvas.height - 60, 8, 8);
            ctx.fillRect(playerX + 32, canvas.height - 60, 8, 8);
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(playerX + 15, canvas.height - 30, 20, 8);
        }
        
        // Mira del mouse
        ctx.fillStyle = '#ff3300';
        ctx.beginPath();
        ctx.arc(mouseX + 25, canvas.height - 65, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(mouseX + 25, canvas.height - 67, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function actualizar() {
        if (!jugando) return;
        
        // Mover jugador
        playerX = Math.min(Math.max(mouseX, 0), canvas.width - 50);
        
        // Mover piedras
        for (let i = 0; i < piedras.length; i++) {
            piedras[i].y -= 5;
            if (piedras[i].y + 10 < 0) { piedras.splice(i,1); i--; }
        }
        
        // Colisiones piedras vs Demogorgons
        for (let i = 0; i < piedras.length; i++) {
            for (let j = 0; j < demogorgons.length; j++) {
                let d = demogorgons[j];
                if (d.vivo && piedras[i].x < d.x + d.w && piedras[i].x + 6 > d.x && 
                    piedras[i].y < d.y + d.h && piedras[i].y + 10 > d.y) {
                    d.vivo = false;
                    piedras.splice(i,1);
                    score += 10;
                    document.getElementById('score').innerText = score;
                    i--; break;
                }
            }
        }
        
        // Eliminar Demogorgons muertos
        for (let i = 0; i < demogorgons.length; i++) {
            if (!demogorgons[i].vivo) {
                demogorgons.splice(i,1);
                i--;
            }
        }
        
        // Mover Demogorgons
        let bajar = false;
        for (let d of demogorgons) {
            d.x += 1.5;
            if (d.x + d.w > canvas.width || d.x < 0) bajar = true;
        }
        if (bajar) {
            for (let d of demogorgons) { 
                d.y += 12; 
                d.x += d.x > canvas.width/2 ? -15 : 15;
            }
        }
        
        // Colisión jugador vs Demogorgons
        for (let d of demogorgons) {
            if (playerX < d.x + d.w && playerX + 50 > d.x && 
                canvas.height - 75 < d.y + d.h && canvas.height - 20 > d.y) {
                lives--;
                document.getElementById('lives').innerText = lives;
                if (lives <= 0) { 
                    jugando = false; 
                    alert('💀 GAME OVER 💀\nPuntuación: ' + score); 
                    return; 
                }
                crearDemogorgons();
                break;
            }
        }
        
        // Victoria
        if (demogorgons.length === 0) {
            jugando = false;
            alert('🎉 ¡VICTORIA! 🎉\nHas derrotado a todos los Demogorgons\nPuntuación: ' + score);
            return;
        }
        
        dibujar();
        invasoresAnimacion = requestAnimationFrame(actualizar);
    }
    
    // Eventos del mouse
    function onMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        let x;
        if (e.touches) {
            x = (e.touches[0].clientX - rect.left) * scaleX;
        } else {
            x = (e.clientX - rect.left) * scaleX;
        }
        mouseX = Math.min(Math.max(x - 25, 0), canvas.width - 50);
    }
    
    function onShoot(e) { 
        if (jugando) {
            piedras.push({ x: playerX + 22, y: canvas.height - 80 });
            // Efecto de sonido visual
            const mira = document.getElementById('gameCanvas');
            mira.style.transform = 'scale(0.98)';
            setTimeout(() => { if(mira) mira.style.transform = ''; }, 100);
        }
        e.preventDefault(); 
    }
    
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onShoot);
    canvas.addEventListener('touchmove', (e) => { onMouseMove(e.touches[0]); });
    canvas.addEventListener('touchstart', onShoot);
    
    actualizar();
    
    // Botón reset
    const resetBtn = document.getElementById('resetGame');
    const newReset = resetBtn.cloneNode(true);
    resetBtn.parentNode.replaceChild(newReset, resetBtn);
    newReset.addEventListener('click', () => {
        if (invasoresAnimacion) cancelAnimationFrame(invasoresAnimacion);
        jugando = false;
        setTimeout(() => iniciarJuegoInvasores(), 50);
    });
}

// ========== DEMOGUCHI ==========
let demoguchiStats = { hambre: 100, felicidad: 100, energia: 100 };
let demoguchiInterval = null;

function actualizarDemoguchi() {
    document.getElementById('barraHambre').style.width = demoguchiStats.hambre + '%';
    document.getElementById('barraFelicidad').style.width = demoguchiStats.felicidad + '%';
    document.getElementById('barraEnergia').style.width = demoguchiStats.energia + '%';
    document.getElementById('hambreValor').innerText = Math.floor(demoguchiStats.hambre) + '%';
    document.getElementById('felicidadValor').innerText = Math.floor(demoguchiStats.felicidad) + '%';
    document.getElementById('energiaValor').innerText = Math.floor(demoguchiStats.energia) + '%';
    
    const cara = document.getElementById('demoguchiCara');
    if (demoguchiStats.hambre <= 20) cara.innerText = '😫';
    else if (demoguchiStats.energia <= 20) cara.innerText = '😴';
    else if (demoguchiStats.felicidad <= 30) cara.innerText = '😢';
    else if (demoguchiStats.felicidad >= 80 && demoguchiStats.hambre >= 70) cara.innerText = '😈';
    else cara.innerText = '👾';
}

function mensajeDemoguchi(msg) {
    const div = document.getElementById('demoguchiMensajes');
    const p = document.createElement('p');
    p.innerText = msg;
    div.appendChild(p);
    while (div.children.length > 5) div.removeChild(div.children[0]);
}

function alimentar(tipo) {
    let add = { hambre: 0, felicidad: 0 };
    if (tipo === 'pizza') { add.hambre = 25; mensajeDemoguchi('🍕 ¡ÑAM! Pizza +25% hambre'); }
    if (tipo === 'huevo') { add.hambre = 15; mensajeDemoguchi('🥚 Huevo +15% hambre'); }
    if (tipo === 'carne') { add.hambre = 30; mensajeDemoguchi('🍖 Carne +30% hambre'); }
    if (tipo === 'postre') { add.hambre = 20; add.felicidad = 10; mensajeDemoguchi('🍦 Postre +20% hambre +10% felicidad'); }
    demoguchiStats.hambre = Math.min(100, demoguchiStats.hambre + add.hambre);
    demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + add.felicidad);
    actualizarDemoguchi();
}

function jugarDemoguchi() {
    if (demoguchiStats.energia >= 15) {
        demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + 20);
        demoguchiStats.energia = Math.max(0, demoguchiStats.energia - 15);
        demoguchiStats.hambre = Math.max(0, demoguchiStats.h
