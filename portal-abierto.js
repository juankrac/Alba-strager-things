// ========== ESTUDIO DE DIBUJO (CORREGIDO) ==========
const canvas = document.getElementById('lienzoDibujo');
const ctx = canvas.getContext('2d');
let dibujando = false;
let colorActual = '#ff0000'; // Rojo por defecto

// Configurar el lienzo (300x300, fondo blanco)
canvas.width = 300;
canvas.height = 300;
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = colorActual;

// Seleccionar color - FUNCIONA CORRECTAMENTE
const colores = document.querySelectorAll('.color-btn');
colores.forEach(btn => {
    btn.addEventListener('click', () => {
        // Quitar clase activa de todos
        colores.forEach(b => b.classList.remove('activo'));
        // Activar el seleccionado
        btn.classList.add('activo');
        colorActual = btn.getAttribute('data-color');
        console.log('Color seleccionado:', colorActual); // Para verificar
    });
});
// Activar color rojo por defecto
const rojoBtn = document.querySelector('.color-btn[data-color="#ff0000"]');
if (rojoBtn) rojoBtn.classList.add('activo');

// Funciones de dibujo
function empezarDibujar(e) {
    dibujando = true;
    dibujar(e);
    e.preventDefault();
}

function dejarDibujar() {
    dibujando = false;
    ctx.beginPath();
}

function dibujar(e) {
    if (!dibujando) return;
    e.preventDefault();
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let x, y;
    if (e.touches) {
        x = (e.touches[0].clientX - rect.left) * scaleX;
        y = (e.touches[0].clientY - rect.top) * scaleY;
    } else {
        x = (e.clientX - rect.left) * scaleX;
        y = (e.clientY - rect.top) * scaleY;
    }
    
    // Limitar coordenadas al canvas
    x = Math.min(Math.max(0, x), canvas.width);
    y = Math.min(Math.max(0, y), canvas.height);
    
    ctx.strokeStyle = colorActual;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Eventos para mouse
canvas.addEventListener('mousedown', empezarDibujar);
canvas.addEventListener('mouseup', dejarDibujar);
canvas.addEventListener('mousemove', dibujar);
canvas.addEventListener('mouseleave', dejarDibujar);

// Eventos para táctil
canvas.addEventListener('touchstart', empezarDibujar);
canvas.addEventListener('touchend', dejarDibujar);
canvas.addEventListener('touchmove', dibujar);
canvas.addEventListener('touchcancel', dejarDibujar);

// Evitar que el mouse se salga del canvas mientras dibuja
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

// Limpiar lienzo (fondo blanco)
const limpiarBtn = document.getElementById('limpiarLienzo');
if (limpiarBtn) {
    limpiarBtn.addEventListener('click', () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = colorActual;
    });
}

// Descargar dibujo
const descargarBtn = document.getElementById('descargarDibujo');
if (descargarBtn) {
    descargarBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `stranger_things_dibujo_${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

// Formulario (conservar el original)
const formulario = document.getElementById('formCreativo');
const mensajeForm = document.getElementById('mensajeForm');

if (formulario) {
    // Eliminar event listeners anteriores si existen
    const nuevoForm = formulario.cloneNode(true);
    formulario.parentNode.replaceChild(nuevoForm, formulario);
    
    nuevoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        mensajeForm.textContent = '✨ ¡Tu dibujo ha cruzado el portal! ✨';
        mensajeForm.style.color = '#ff6600';
        nuevoForm.reset();
        setTimeout(() => {
            mensajeForm.textContent = '';
        }, 3000);
    });
}
