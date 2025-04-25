// JavaScript for About Section Enhancements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize stat counters
    initStatCounters();
    
    // Add magic reveal effect to elements
    initMagicReveal();
    
    // Initialize hover effects for interest items
    initInterestItems();
});

// Animated Stat Counters
function initStatCounters() {
    const statValues = document.querySelectorAll('.stat-value');
    
    if (statValues.length === 0) return;
    
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16); // Update every 16ms (60fps)
        
        const updateCounter = () => {
            start += increment;
            
            if (start >= target) {
                element.textContent = target;
                return;
            }
            
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        };
        
        updateCounter();
    };
    
    // Animate counters when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, { threshold: 0.5 });
    
    statValues.forEach(stat => {
        observer.observe(stat);
    });
}

// Magic Reveal Animation for About Elements
function initMagicReveal() {
    const magicRevealElements = document.querySelectorAll('.magic-reveal');
    
    if (magicRevealElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    magicRevealElements.forEach(element => {
        observer.observe(element);
    });
}

// Interest Items Hover Effects
function initInterestItems() {
    const interestItems = document.querySelectorAll('.interest-item');
    
    if (interestItems.length === 0) return;
    
    interestItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Apply magnetic-like effect on hover
            this.style.transform = 'translateY(-10px) scale(1.1)';
            
            // Change icon color with gradient
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.backgroundImage = 'var(--gradient-primary)';
                icon.style.webkitBackgroundClip = 'text';
                icon.style.backgroundClip = 'text';
                icon.style.color = 'transparent';
            }
            
            // Show the label
            const span = this.querySelector('span');
            if (span) {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            // Reset to original state
            this.style.transform = '';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.backgroundImage = '';
                icon.style.webkitBackgroundClip = '';
                icon.style.backgroundClip = '';
                icon.style.color = '';
            }
            
            const span = this.querySelector('span');
            if (span) {
                span.style.opacity = '';
                span.style.transform = '';
            }
        });
    });
}
