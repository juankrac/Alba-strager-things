// ========== NAVEGACIÓN ==========
const cerrarBtn = document.getElementById('cerrarPortalBtn');
if (cerrarBtn) {
    cerrarBtn.addEventListener('click', () => {
        document.body.style.animation = 'shakePortal 0.3s ease-in-out';
        setTimeout(() => { window.location.href = 'index.html'; }, 300);
    });
}

// Animación de sacudida
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shakePortal { 0%,100% { transform: translate(0,0); } 25% { transform: translate(-5px,5px); } 50% { transform: translate(5px,-5px); } 75% { transform: translate(-5px,-5px); } }`;
document.head.appendChild(shakeStyle);

// Luces al mover mouse
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--x', `${x}%`);
    document.documentElement.style.setProperty('--y', `${y}%`);
});

// ========== FUNCIONES PARA MODALES ==========
function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        if (modalId === 'modalInvasores') setTimeout(() => iniciarJuego(), 100);
        if (modalId === 'modalDemoguchi') setTimeout(() => iniciarDemoguchi(), 100);
    }
}

function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
    if (window.gameAnimation) cancelAnimationFrame(window.gameAnimation);
    if (window.demoguchiInterval) clearInterval(window.demoguchiInterval);
}

// ========== EVENTOS DE LAS TARJETAS ==========
document.querySelectorAll('.tarjeta[data-modal]').forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
        const modalKey = tarjeta.getAttribute('data-modal');
        const modalId = 'modal' + modalKey.charAt(0).toUpperCase() + modalKey.slice(1);
        abrirModal(modalId);
    });
});

// ========== CERRAR MODALES ==========
document.querySelectorAll('.cerrar-modal').forEach(btn => {
    btn.addEventListener('click', () => cerrarModal(btn.getAttribute('data-modal')));
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        if (window.gameAnimation) cancelAnimationFrame(window.gameAnimation);
        if (window.demoguchiInterval) clearInterval(window.demoguchiInterval);
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
    
    document.getElementById('limpiarLienzo')?.addEventListener('click', () => {
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    document.getElementById('descargarDibujo')?.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `dibujo_${Date.now()}.png`;
        link.href = canvas.toDataURL(); link.click();
    });
}

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

// ========== SPRITES PARA JUEGO INVASORES ==========
const imagenDustin = new Image();
const imagenDemogorgon = new Image();
imagenDustin.src = 'dustin.png';
imagenDemogorgon.src = 'demogorgon.png';

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
            enemigos.push({ x: 80 + col * 70, y: 60 + row * 60, w: 45, h: 45, vivo: true });
        }
    }
    
    function dibujar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let e of enemigos) {
            if (!e.vivo) continue;
            if (imagenDemogorgon.complete && imagenDemogorgon.naturalHeight !== 0) {
                ctx.drawImage(imagenDemogorgon, e.x, e.y, e.w, e.h);
            } else {
                ctx.fillStyle = '#8B0000';
                ctx.fillRect(e.x, e.y, e.w, e.h);
                ctx.fillStyle = '#ff0000';
                ctx.fillRect(e.x + 10, e.y + 10, 25, 10);
                ctx.fillStyle = 'white';
                ctx.fillRect(e.x + 8, e.y + 25, 8, 8);
                ctx.fillRect(e.x + 28, e.y + 25, 8, 8);
            }
        }
        
        for (let p of piedras) {
            ctx.fillStyle = '#808080';
            ctx.fillRect(p.x, p.y, 6, 10);
        }
        
        if (imagenDustin.complete && imagenDustin.naturalHeight !== 0) {
            ctx.drawImage(imagenDustin, playerX, canvas.height - 75, 50, 55);
        } else {
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(playerX, canvas.height - 70, 40, 40);
            ctx.fillStyle = '#000';
            ctx.fillRect(playerX + 8, canvas.height - 62, 8, 8);
            ctx.fillRect(playerX + 24, canvas.height - 62, 8, 8);
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(playerX + 10, canvas.height - 30, 20, 8);
        }
        
        ctx.fillStyle = '#ff3300';
        ctx.beginPath();
        ctx.arc(mouseX + 20, canvas.height - 75, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(mouseX + 20, canvas.height - 77, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function actualizar() {
        if (!jugando) return;
        
        playerX = Math.min(Math.max(mouseX, 0), canvas.width - 50);
        
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
            if (playerX < e.x + e.w && playerX + 50 > e.x && 
                canvas.height - 75 < e.y + e.h && canvas.height - 20 > e.y) {
                lives--;
                document.getElementById('lives').innerText = lives;
                if (lives <= 0) { jugando = false; alert('GAME OVER - Puntuación: ' + score); return; }
                enemigos = [];
                for (let row = 0; row < 3; row++) {
                    for (let col = 0; col < 7; col++) {
                        enemigos.push({ x: 80 + col * 70, y: 60 + row * 60, w: 45, h: 45, vivo: true });
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
        mouseX = Math.min(Math.max(x - 25, 0), canvas.width - 50);
    }
    
    function onShoot() { if (jugando) piedras.push({ x: playerX + 22, y: canvas.height - 80 }); }
    
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onShoot);
    canvas.addEventListener('touchmove', (e) => { onMouseMove(e.touches[0]); });
    canvas.addEventListener('touchstart', onShoot);
    
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
let caras = { feliz: '😈', normal: '👾', triste: '😢', hambriento: '😫', cansado: '😴' };

function actualizarDemoguchiUI() {
    document.getElementById('barraHambre').style.width = demoguchiStats.hambre + '%';
    document.getElementById('barraFelicidad').style.width = demoguchiStats.felicidad + '%';
    document.getElementById('barraEnergia').style.width = demoguchiStats.energia + '%';
    document.getElementById('hambreValor').innerText = Math.floor(demoguchiStats.hambre) + '%';
    document.getElementById('felicidadValor').innerText = Math.floor(demoguchiStats.felicidad) + '%';
    document.getElementById('energiaValor').innerText = Math.floor(demoguchiStats.energia) + '%';
    
    const caraElement = document.getElementById('demoguchiCara');
    if (demoguchiStats.hambre <= 20) caraElement.innerText = caras.hambriento;
    else if (demoguchiStats.energia <= 20) caraElement.innerText = caras.cansado;
    else if (demoguchiStats.felicidad <= 30) caraElement.innerText = caras.triste;
    else if (demoguchiStats.felicidad >= 80 && demoguchiStats.hambre >= 70 && demoguchiStats.energia >= 70) caraElement.innerText = caras.feliz;
    else caraElement.innerText = caras.normal;
}

function agregarMensajeDemoguchi(msg) {
    const div = document.getElementById('demoguchiMensajes');
    const p = document.createElement('p');
    p.innerText = msg;
    div.appendChild(p);
    while (div.children.length > 5) div.removeChild(div.children[0]);
}

function alimentarDemoguchi(tipo) {
    let incremento = 0;
    let mensaje = "";
    switch(tipo) {
        case 'pizza': incremento = 25; mensaje = "🍕 ¡ÑAM! Pizza +25% hambre"; break;
        case 'huevo': incremento = 15; mensaje = "🥚 Huevo +15% hambre"; break;
        case 'carne': incremento = 30; mensaje = "🍖 Carne +30% hambre"; break;
        case 'postre': incremento = 20; demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + 10); mensaje = "🍦 Postre +20% hambre +10% felicidad"; break;
    }
    demoguchiStats.hambre = Math.min(100, demoguchiStats.hambre + incremento);
    demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + 5);
    actualizarDemoguchiUI();
    agregarMensajeDemoguchi(mensaje);
}

function jugarDemoguchi() {
    if (demoguchiStats.energia >= 15) {
        demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + 20);
        demoguchiStats.energia = Math.max(0, demoguchiStats.energia - 15);
        demoguchiStats.hambre = Math.max(0, demoguchiStats.hambre - 10);
        actualizarDemoguchiUI();
        agregarMensajeDemoguchi('🎾 ¡Jugaste con Demoguchi! +20% felicidad');
    } else agregarMensajeDemoguchi('😴 Demoguchi está muy cansado para jugar');
}

function dormirDemoguchi() {
    demoguchiStats.energia = Math.min(100, demoguchiStats.energia + 40);
    demoguchiStats.hambre = Math.max(0, demoguchiStats.hambre - 15);
    actualizarDemoguchiUI();
    agregarMensajeDemoguchi('😴 Demoguchi durmió profundamente +40% energía');
}

function resetearDemoguchi() {
    demoguchiStats = { hambre: 100, felicidad: 100, energia: 100 };
    if (demoguchiInterval) clearInterval(demoguchiInterval);
    actualizarDemoguchiUI();
    agregarMensajeDemoguchi('🐣 ¡Demoguchi ha renacido! Cuídalo bien');
    iniciarDemoguchi();
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
    
    document.querySelectorAll('.comida-btn').forEach(btn => {
        btn.onclick = () => alimentarDemoguchi(btn.getAttribute('data-comida'));
    });
    document.getElementById('jugarBtn').onclick = jugarDemoguchi;
    document.getElementById('dormirBtn').onclick = dormirDemoguchi;
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

// ========== PUZZLES ==========
function abrirPuzzle(tipo) {
    const juegoContainer = document.getElementById('juegoContainer');
    const juegoArea = document.getElementById('juegoArea');
    const puzzlesGrid = document.querySelector('.puzzles-grid');
    
    // Ocultar grid de puzzles y mostrar contenedor
    puzzlesGrid.style.display = 'none';
    juegoContainer.style.display = 'block';
    
    // Cargar el juego seleccionado
    switch(tipo) {
        case 'memoria':
            iniciarJuegoMemoria(juegoArea);
            break;
        case 'numeros':
            iniciarJuegoNumeros(juegoArea);
            break;
        case 'laberinto':
            iniciarJuegoLaberinto(juegoArea);
            break;
        case 'preguntas':
            iniciarJuegoPreguntas(juegoArea);
            break;
    }
}

// Cerrar juego
document.getElementById('cerrarJuegoBtn').addEventListener('click', () => {
    document.getElementById('juegoContainer').style.display = 'none';
    document.querySelector('.puzzles-grid').style.display = 'grid';
    document.getElementById('juegoArea').innerHTML = '';
});

// ========== PUZZLE 1: MEMORIA ==========
function iniciarJuegoMemoria(container) {
    const personajes = ['👻', '👥', '📚', '🎨', '👾', '🐣', '🏰', '⚡'];
    const cartas = [...personajes, ...personajes];
    
    // Mezclar
    for (let i = cartas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
    }
    
    let seleccionadas = [];
    let bloqueado = false;
    let paresEncontrados = 0;
    
    container.innerHTML = `
        <div class="contador-puntuacion">🧩 Parejas encontradas: ${paresEncontrados} / 8</div>
        <div class="memoria-grid" id="memoriaGrid"></div>
        <button id="resetMemoria" class="btn-puzzle" style="margin-top:15px;">🔄 Reiniciar</button>
    `;
    
    const grid = document.getElementById('memoriaGrid');
    
    function crearTablero() {
        grid.innerHTML = '';
        cartas.forEach((carta, idx) => {
            const card = document.createElement('div');
            card.className = 'memoria-card';
            card.dataset.index = idx;
            card.dataset.valor = carta;
            card.innerText = '?';
            card.addEventListener('click', () => voltearCarta(idx));
            grid.appendChild(card);
        });
    }
    
    function voltearCarta(idx) {
        if (bloqueado) return;
        const carta = grid.children[idx];
        if (carta.innerText !== '?' || seleccionadas.includes(idx)) return;
        
        carta.innerText = cartas[idx];
        seleccionadas.push(idx);
        
        if (seleccionadas.length === 2) {
            bloqueado = true;
            setTimeout(verificarPar, 700);
        }
    }
    
    function verificarPar() {
        const [idx1, idx2] = seleccionadas;
        const carta1 = grid.children[idx1];
        const carta2 = grid.children[idx2];
        
        if (cartas[idx1] === cartas[idx2]) {
            paresEncontrados++;
            document.querySelector('.contador-puntuacion').innerHTML = `🧩 Parejas encontradas: ${paresEncontrados} / 8`;
            carta1.style.background = '#330000';
            carta2.style.background = '#330000';
            if (paresEncontrados === 8) {
                setTimeout(() => alert('🎉 ¡Felicidades! Completaste el puzzle de memoria 🎉'), 100);
            }
        } else {
            carta1.innerText = '?';
            carta2.innerText = '?';
        }
        
        seleccionadas = [];
        bloqueado = false;
    }
    
    document.getElementById('resetMemoria').addEventListener('click', () => {
        iniciarJuegoMemoria(container);
    });
    
    crearTablero();
}

// ========== PUZZLE 2: NÚMEROS (15 puzzle) ==========
function iniciarJuegoNumeros(container) {
    let tiles = [];
    let vacioIndex = 15;
    
    function iniciar() {
        tiles = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,null];
        vacioIndex = 15;
        // Mezclar
        for (let i = 0; i < 200; i++) {
            const movimientos = obtenerMovimientosPosibles(vacioIndex);
            const randomMove = movimientos[Math.floor(Math.random() * movimientos.length)];
            moverTile(randomMove);
        }
        dibujar();
    }
    
    function obtenerMovimientosPosibles(vacioPos) {
        const movimientos = [];
        const fila = Math.floor(vacioPos / 4);
        const col = vacioPos % 4;
        if (fila > 0) movimientos.push(vacioPos - 4);
        if (fila < 3) movimientos.push(vacioPos + 4);
        if (col > 0) movimientos.push(vacioPos - 1);
        if (col < 3) movimientos.push(vacioPos + 1);
        return movimientos;
    }
    
    function moverTile(pos) {
        if (obtenerMovimientosPosibles(vacioIndex).includes(pos)) {
            tiles[vacioIndex] = tiles[pos];
            tiles[pos] = null;
            vacioIndex = pos;
            dibujar();
            verificarVictoria();
        }
    }
    
    function verificarVictoria() {
        let victoria = true;
        for (let i = 0; i < 15; i++) {
            if (tiles[i] !== i + 1) victoria = false;
        }
        if (victoria) {
            setTimeout(() => alert('🎉 ¡Ganaste! Ordenaste todos los números 🎉'), 100);
        }
    }
    
    function dibujar() {
        const grid = document.createElement('div');
        grid.className = 'numeros-grid';
        for (let i = 0; i < 16; i++) {
            const tile = document.createElement('div');
            tile.className = 'numero-tile';
            if (tiles[i] === null) {
                tile.classList.add('vacio');
                tile.innerText = '';
            } else {
                tile.innerText = tiles[i];
            }
            tile.addEventListener('click', () => moverTile(i));
            grid.appendChild(tile);
        }
        container.innerHTML = '';
        container.appendChild(grid);
        const resetBtn = document.createElement('button');
        resetBtn.innerText = '🔄 Reiniciar';
        resetBtn.className = 'btn-puzzle';
        resetBtn.style.marginTop = '15px';
        resetBtn.onclick = () => iniciarJuegoNumeros(container);
        container.appendChild(resetBtn);
    }
    
    iniciar();
}

// ========== PUZZLE 3: LABERINTO ==========
function iniciarJuegoLaberinto(container) {
    const size = 15;
    const cellSize = 30;
    const canvas = document.createElement('canvas');
    canvas.width = size * cellSize;
    canvas.height = size * cellSize;
    canvas.className = 'laberinto-canvas';
    const ctx = canvas.getContext('2d');
    
    // Laberinto predefinido
    const walls = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,0,1,1,1,1,1,1,1,0],
        [0,1,0,0,0,1,0,1,0,0,0,1,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,1,1,0,1,0],
        [0,1,0,1,0,0,0,0,0,1,0,0,0,1,0],
        [0,1,1,1,0,1,1,1,1,1,0,1,1,1,0],
        [0,0,0,1,0,1,0,0,0,0,0,1,0,0,0],
        [0,1,1,1,1,1,0,1,1,1,1,1,1,1,0],
        [0,1,0,0,0,1,0,1,0,0,0,0,0,1,0],
        [0,1,1,1,0,1,1,1,0,1,1,1,1,1,0],
        [0,0,0,1,0,0,0,1,0,1,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,0,1,1,1,1,1,0],
        [0,1,0,0,0,0,0,1,0,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    
    let player = { x: 1, y: 1 };
    const goal = { x: 13, y: 13 };
    
    function dibujarLaberinto() {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (walls[y][x] === 0) {
                    ctx.fillStyle = '#1a0000';
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    ctx.strokeStyle = '#ff3300';
                    ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
                } else {
                    ctx.fillStyle = '#0a0a0a';
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
        
        // Meta
        ctx.fillStyle = '#00cc44';
        ctx.fillRect(goal.x * cellSize, goal.y * cellSize, cellSize, cellSize);
        
        // Jugador (Dustin)
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
        ctx.fillStyle = '#000';
        ctx.fillRect(player.x * cellSize + 8, player.y * cellSize + 8, 5, 5);
        ctx.fillRect(player.x * cellSize + 17, player.y * cellSize + 8, 5, 5);
    }
    
    function mover(e) {
        const key = e.key;
        let newX = player.x;
        let newY = player.y;
        
        if (key === 'ArrowUp') newY--;
        if (key === 'ArrowDown') newY++;
        if (key === 'ArrowLeft') newX--;
        if (key === 'ArrowRight') newX++;
        
        if (walls[newY] && walls[newY][newX] === 1) {
            player.x = newX;
            player.y = newY;
            dibujarLaberinto();
            
            if (player.x === goal.x && player.y === goal.y) {
                alert('🎉 ¡Escapaste del Upside Down! 🎉');
                player = { x: 1, y: 1 };
                dibujarLaberinto();
            }
        }
    }
    
    container.innerHTML = '';
    container.appendChild(canvas);
    const resetBtn = document.createElement('button');
    resetBtn.innerText = '🔄 Reiniciar Laberinto';
    resetBtn.className = 'btn-puzzle';
    resetBtn.style.marginTop = '15px';
    resetBtn.onclick = () => {
        player = { x: 1, y: 1 };
        dibujarLaberinto();
    };
    container.appendChild(resetBtn);
    
    window.addEventListener('keydown', mover);
    dibujarLaberinto();
    
    // Limpiar event listener al cerrar
    const cerrarJuego = () => window.removeEventListener('keydown', mover);
    document.getElementById('cerrarJuegoBtn').onclick = () => {
        window.removeEventListener('keydown', mover);
        document.getElementById('juegoContainer').style.display = 'none';
        document.querySelector('.puzzles-grid').style.display = 'grid';
        document.getElementById('juegoArea').innerHTML = '';
    };
}

// ========== PUZZLE 4: PREGUNTAS (TRIVIA) ==========
function iniciarJuegoPreguntas(container) {
    const preguntas = [
        { pregunta: "¿Cómo se llama el mundo paralelo en Stranger Things?", respuestas: ["El Revés", "El Upside Down", "La Dimensión Oscura", "El Otro Lado"], correcta: 1 },
        { pregunta: "¿Qué número tiene Eleven en el laboratorio?", respuestas: ["007", "008", "011", "012"], correcta: 2 },
        { pregunta: "¿Cuál es el nombre del monstruo principal?", respuestas: ["Vecna", "Mind Flayer", "Demogorgon", "El Zarpazo"], correcta: 2 },
        { pregunta: "¿Quién interpreta a Dustin?", respuestas: ["Finn Wolfhard", "Gaten Matarazzo", "Caleb McLaughlin", "Noah Schnapp"], correcta: 1 },
        { pregunta: "¿En qué año se ambienta la primera temporada?", respuestas: ["1981", "1982", "1983", "1984"], correcta: 2 },
        { pregunta: "¿Cómo se llama la hermana de Mike?", respuestas: ["Nancy", "Karen", "Holly", "Barbara"], correcta: 0 },
        { pregunta: "¿Qué come Dustin en el recreo?", respuestas: ["Pizza", "Pudín", "Galletas", "Frutas"], correcta: 1 },
        { pregunta: "¿Quién es el jefe de policía de Hawkins?", respuestas: ["Hopper", "Powell", "Callahan", "Steve"], correcta: 0 }
    ];
    
    let preguntaActual = 0;
    let puntuacion = 0;
    
    function mostrarPregunta() {
        if (preguntaActual >= preguntas.length) {
            container.innerHTML = `
                <div class="trivia-resultado">
                    <h3>🎉 ¡COMPLETASTE LA TRIVIA! 🎉</h3>
                    <p>Puntuación: ${puntuacion} / ${preguntas.length}</p>
                    <button id="reiniciarTrivia" class="btn-puzzle">🔄 Jugar de nuevo</button>
                </div>
            `;
            document.getElementById('reiniciarTrivia')?.addEventListener('click', () => iniciarJuegoPreguntas(container));
            return;
        }
        
        const p = preguntas[preguntaActual];
        let html = `<div class="contador-puntuacion">📝 Pregunta ${preguntaActual + 1} de ${preguntas.length}</div>`;
        html += `<div class="trivia-pregunta"><p>❓ ${p.pregunta}</p></div>`;
        html += `<div class="trivia-opciones">`;
        p.respuestas.forEach((resp, idx) => {
            html += `<div class="trivia-opcion" data-respuesta="${idx}">${resp}</div>`;
        });
        html += `</div>`;
        html += `<div class="trivia-resultado" id="triviaResultado"></div>`;
        container.innerHTML = html;
        
        document.querySelectorAll('.trivia-opcion').forEach(opt => {
            opt.addEventListener('click', (e) => {
                const seleccionada = parseInt(e.target.dataset.respuesta);
                const resultadoDiv = document.getElementById('triviaResultado');
                if (seleccionada === p.correcta) {
                    puntuacion++;
                    resultadoDiv.innerHTML = '✅ ¡Correcto! +1 punto';
                    resultadoDiv.style.color = '#00cc44';
                } else {
                    resultadoDiv.innerHTML = `❌ Incorrecto. La respuesta era: ${p.respuestas[p.correcta]}`;
                    resultadoDiv.style.color = '#ff3300';
                }
                preguntaActual++;
                setTimeout(() => mostrarPregunta(), 1500);
            });
        });
    }
    
    mostrarPregunta();
}
console.log('✅ portal-abierto.js cargado correctamente');
