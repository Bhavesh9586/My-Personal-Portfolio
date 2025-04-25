// JavaScript for Stunning Effects

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all stunning effects
    initScrollProgressBar();
    initMagicReveal();
    initTypingEffect();
    initParallaxEffect();
    setupMagneticButtons();
    init3DText();
});

// Scroll Progress Bar
function initScrollProgressBar() {
    const scrollProgress = document.querySelector('.scroll-progress');
    
    if (!scrollProgress) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        scrollProgress.style.transform = `scaleX(${scrollPercent / 100})`;
        
        // Fade in the scroll progress bar after scrolling a bit
        if (scrollTop > 100) {
            scrollProgress.style.opacity = '1';
        } else {
            scrollProgress.style.opacity = '0';
        }
    });
}

// Magic Reveal Animation (reveals elements as they come into view)
function initMagicReveal() {
    const revealElements = document.querySelectorAll('.magic-reveal');
    
    if (revealElements.length === 0) return;
    
    const revealOnScroll = () => {
        for (let i = 0; i < revealElements.length; i++) {
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                revealElements[i].classList.add('revealed');
            }
        }
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on initial load
}

// Text Typing Effect
function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-text');
    
    if (typingElements.length === 0) return;
    
    typingElements.forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        
        let i = 0;
        const typeChar = () => {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, 100);
            } else {
                setTimeout(() => {
                    el.textContent = '';
                    i = 0;
                    typeChar();
                }, 2000);
            }
        };
        
        typeChar();
    });
}

// Parallax Effect
function initParallaxEffect() {
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    
    if (parallaxBgs.length === 0) return;
    
    window.addEventListener('scroll', () => {
        parallaxBgs.forEach(bg => {
            const scrollY = window.pageYOffset;
            const section = bg.closest('.parallax-section');
            const sectionTop = section.offsetTop;
            const distance = scrollY - sectionTop;
            
            if (Math.abs(distance) < window.innerHeight) {
                bg.style.transform = `translateY(${distance * 0.5}px)`;
            }
        });
    });
}

// Magnetic Buttons
function setupMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    if (magneticBtns.length === 0) return;
    
    magneticBtns.forEach(btn => {
        const content = btn.querySelector('.magnetic-btn-content');
        
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / 10;
            const deltaY = (y - centerY) / 10;
            
            content.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            content.style.transform = 'translate(0, 0)';
        });
    });
}

// 3D Text Effect
function init3DText() {
    const glowTexts = document.querySelectorAll('.glow-text');
    
    if (glowTexts.length === 0) return;
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        
        glowTexts.forEach(text => {
            const textRect = text.getBoundingClientRect();
            const textCenterX = textRect.left + textRect.width / 2;
            const textCenterY = textRect.top + textRect.height / 2;
            
            const deltaX = (e.clientX - textCenterX) / 30;
            const deltaY = (e.clientY - textCenterY) / 30;
            
            // Apply 3D rotation based on mouse position
            text.style.transform = `rotateY(${deltaX}deg) rotateX(${-deltaY}deg)`;
            
            // Adjust text shadow for dynamic lighting effect
            const shadowX = x * 10;
            const shadowY = y * 10;
            const distance = 5;
            
            text.style.textShadow = `
                ${shadowX}px ${shadowY}px ${distance}px rgba(64, 112, 244, 0.7),
                ${-shadowX}px ${-shadowY}px ${distance}px rgba(52, 152, 219, 0.7)
            `;
        });
    });
}

// Activate glitch effect on hover
document.addEventListener('DOMContentLoaded', function() {
    const glitchElements = document.querySelectorAll('.glitch-effect');
    
    glitchElements.forEach(el => {
        const text = el.textContent;
        el.innerHTML = `${text}<span>${text}</span><span>${text}</span>`;
    });
});

// Initialize holographic cards
document.addEventListener('DOMContentLoaded', function() {
    const holographicCards = document.querySelectorAll('.holographic-card');
    
    holographicCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;
            
            // Update CSS variable for the holographic effect position
            card.style.setProperty('--mouseX', percentX);
            card.style.setProperty('--mouseY', percentY);
            
            // Add some subtle rotation
            card.style.transform = `
                perspective(1000px)
                rotateY(${percentX * 5}deg)
                rotateX(${-percentY * 5}deg)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateY(0) rotateX(0)';
        });
    });
});
