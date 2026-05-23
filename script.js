// Script interactivo para la página de Stranger Things

// Smooth scroll para los links de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efecto de aparición de elementos al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Agregar animación fadeInUp al CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Observar tarjetas de personajes y curiosidades
document.querySelectorAll('.character-card, .curiosity-card, .creativity-card').forEach(element => {
    observer.observe(element);
});

// Efecto de glow en el cursor
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Crear pequeños puntos de luz que siguen el cursor
    if (Math.random() > 0.98) {
        createCursorParticle(mouseX, mouseY);
    }
});

function createCursorParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = '#8b00ff';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.boxShadow = '0 0 10px #8b00ff';
    particle.style.zIndex = '1000';
    
    document.body.appendChild(particle);
    
    let opacity = 1;
    let life = 30;
    
    const animate = () => {
        life--;
        opacity = life / 30;
        particle.style.opacity = opacity;
        particle.style.transform = `translate(${(Math.random() - 0.5) * 20}px, ${Math.random() * 20 - 10}px)`;
        
        if (life > 0) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    };
    
    animate();
}

// Validación del formulario de contacto
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputs = this.querySelectorAll('input, textarea');
        let allValid = true;
        
        inputs.forEach(input => {
            if (input.value.trim() === '') {
                allValid = false;
                input.style.borderColor = '#ff0078';
                input.style.boxShadow = '0 0 10px rgba(255, 0, 120, 0.5)';
            } else {
                input.style.borderColor = '#8b00ff';
                input.style.boxShadow = '0 0 10px rgba(139, 0, 255, 0.3)';
            }
        });
        
        if (allValid) {
            // Mostrar mensaje de éxito
            alert('¡Tu creación ha sido enviada! 🎉\nGracias por ser parte de nuestra comunidad Stranger Things.');
            this.reset();
        }
    });
}

// Activar clase de sección visible
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.style.color = '#ff0078';
            link.style.textShadow = '0 0 10px #ff0078';
        } else {
            link.style.color = '#fff';
            link.style.textShadow = 'none';
        }
    });
});

// Efecto de glitch en el título
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('mouseenter', function() {
        this.style.animation = 'glitch 0.3s ease-out';
    });
}

// Agregar animación de glitch
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
`;
document.head.appendChild(glitchStyle);

// Efecto de parpadeo en elementos con clase "glow"
function addGlowEffect() {
    const glowElements = document.querySelectorAll('[class*="glow"]');
    glowElements.forEach(element => {
        element.style.animation = 'glow-pulse 2s ease-in-out infinite';
    });
}

const glowPulseStyle = document.createElement('style');
glowPulseStyle.textContent = `
    @keyframes glow-pulse {
        0%, 100% { text-shadow: 0 0 10px currentColor; }
        50% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
    }
`;
document.head.appendChild(glowPulseStyle);

// Inicializar efectos
document.addEventListener('DOMContentLoaded', function() {
    addGlowEffect();
    
    // Agregar clase de carga completada
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// Easter egg: Esconder un mensaje secreto
document.addEventListener('keydown', function(event) {
    if (event.key === 'd' && event.ctrlKey) {
        event.preventDefault();
        const secretMessage = document.createElement('div');
        secretMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(139, 0, 255, 0.9);
            color: #ff0078;
            padding: 2rem;
            border-radius: 10px;
            font-size: 1.2rem;
            z-index: 9999;
            text-align: center;
            border: 2px solid #ff0078;
            box-shadow: 0 0 30px #8b00ff;
        `;
        secretMessage.innerHTML = '¡Encontraste el Upside Down! 🌀<br>Las cosas extrañas suceden aquí...';
        document.body.appendChild(secretMessage);
        
        setTimeout(() => {
            secretMessage.style.opacity = '0';
            secretMessage.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => secretMessage.remove(), 500);
        }, 3000);
    }
});

// Animar números en estadísticas si existen
function animateCountUp(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Reproducir sonido de introducción (si está disponible)
function playIntroSound() {
    // Este es un comentario para agregar sonido en el futuro
    // const audio = new Audio('intro-sound.mp3');
    // audio.play();
}

// Hacer que el formulario sea más interactivo
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.style.background = 'rgba(255, 0, 120, 0.15)';
    });
    
    input.addEventListener('blur', function() {
        this.style.background = 'rgba(255, 255, 255, 0.1)';
    });
});