// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all creative elements
    initCustomCursor();
    
    // Only initialize particle effects if not on mobile (for better performance)
    if (window.innerWidth > 768) {
        initParticlesJS();
    } else {
        // Simplified particles for mobile
        initLightParticlesJS();
    }
    
    // Only use tilt effect on non-mobile devices
    if (window.innerWidth > 768) {
        initVanillaTilt();
    }
    
    // Hide loader after page is fully loaded
    window.addEventListener('load', () => {
        const loaderContainer = document.querySelector('.loader-container');
        setTimeout(() => {
            loaderContainer.style.opacity = '0';
            setTimeout(() => {
                loaderContainer.style.display = 'none';
            }, 500);
        }, 1000); // Reduced timing for better mobile experience
    });

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.querySelector('body');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        // Prevent body scrolling when menu is open
        if (navLinks.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });

    // Close navbar when clicking outside the menu (mobile)
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.hamburger')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Close navbar when clicking on a nav link (mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // In a real implementation, you would send this data to your backend
            const formData = new FormData(contactForm);
            const formObject = Object.fromEntries(formData.entries());
            
            // For demo purposes, show an alert
            alert('Thank you for your message! This is a demo form.');
            contactForm.reset();
        });
    }

    // Initialize Three.js background
    initThreeJsBackground();

    // Function to add 3D flip effect on profile image click
    function initProfileImageInteractivity() {
        const profileImage = document.querySelector('.mobile-profile-image');
        const profileSection = document.querySelector('.mobile-profile-section');
        if (!profileImage || !profileSection) return;
        
        let isFlipped = false;
        
        profileImage.addEventListener('click', (e) => {
            isFlipped = !isFlipped;
            
            if (isFlipped) {
                profileSection.classList.add('flipped');
                // Create info elements dynamically when flipped
                const infoBox = document.createElement('div');
                infoBox.className = 'profile-info-box';
                infoBox.innerHTML = `
                    <h3>Bherabhai Kumbhar</h3>
                    <p>Python Developer</p>
                    <div class="skills-icons">
                        <i class="fab fa-python"></i>
                        <i class="fab fa-html5"></i>
                        <i class="fab fa-css3-alt"></i>
                        <i class="fab fa-js"></i>
                    </div>
                `;
                
                // Remove previous info box if exists
                const existingInfoBox = profileSection.querySelector('.profile-info-box');
                if (existingInfoBox) {
                    profileSection.removeChild(existingInfoBox);
                }
                
                profileSection.appendChild(infoBox);
            } else {
                profileSection.classList.remove('flipped');
                // Remove info box when flipped back
                const infoBox = profileSection.querySelector('.profile-info-box');
                if (infoBox) {
                    profileSection.removeChild(infoBox);
                }
            }
        });
    }

    // Initialize the new profile image interactivity
    initProfileImageInteractivity();
});

// Three.js 3D animated background
function initThreeJsBackground() {
    // Skip if Three.js isn't loaded
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('bg-canvas');
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for better mobile performance
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Create particles - reduce count on mobile
    const isMobile = window.innerWidth <= 768;
    const particlesCount = isMobile ? 1000 : 2000;
    
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Create material
    const particlesMaterial = new THREE.PointsMaterial({
        size: isMobile ? 0.02 : 0.01, // Larger particles on mobile for better visibility
        color: 0x4070f4,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    // Create mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Set camera position
    camera.position.z = 5;
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    
    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - window.innerWidth / 2) / 100;
        mouseY = (event.clientY - window.innerHeight / 2) / 100;
    }
    
    // Touch movement effect for mobile
    function onDocumentTouchMove(event) {
        if (event.touches.length === 1) {
            mouseX = (event.touches[0].clientX - window.innerWidth / 2) / 100;
            mouseY = (event.touches[0].clientY - window.innerHeight / 2) / 100;
        }
    }
    
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('touchmove', onDocumentTouchMove);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.x += 0.001;
        particlesMesh.rotation.y += 0.001;
        
        // Respond to mouse movement (reduced sensitivity on mobile)
        const sensitivityFactor = isMobile ? 0.005 : 0.01;
        particlesMesh.rotation.x += mouseY * sensitivityFactor;
        particlesMesh.rotation.y += mouseX * sensitivityFactor;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Lightweight version of particles.js for mobile
function initLightParticlesJS() {
    // Get the particles container
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) return;
    
    // Configuration for mobile
    const mobileConfig = {
        particles: {
            number: {
                value: 30, // Reduced number of particles
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#4070f4"
            },
            shape: {
                type: "circle",
            },
            opacity: {
                value: 0.5,
                random: false,
            },
            size: {
                value: 3,
                random: true,
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#4070f4",
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2, // Reduced speed
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.8
                    }
                },
                push: {
                    particles_nb: 2 // Push fewer particles
                }
            }
        },
        retina_detect: false // Disable retina detection for performance
    };
    
    // Initialize particles.js with mobile config
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", mobileConfig);
    }
}

// Custom cursor implementation
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-dot-outline');
    
    if (!cursorDot || !cursorOutline) return;
    
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
        
        // Smoother animation with GSAP
        gsap.to(cursorDot, {
            x: posX,
            y: posY,
            duration: 0.1
        });
        
        gsap.to(cursorOutline, {
            x: posX,
            y: posY,
            duration: 0.3
        });
    });
    
    // Handle cursor effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .skill-item, .project-card, input, textarea');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(255, 107, 107, 0.3)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'rgba(64, 112, 244, 0.3)';
        });
    });
    
    // Hide cursor when mouse leaves window
    document.body.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
    });
    
    document.body.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    });
}

// Initialize particles.js
function initParticlesJS() {
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#4070f4'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#4070f4',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
}

// Initialize Vanilla Tilt
function initVanillaTilt() {
    if (typeof VanillaTilt !== 'undefined') {
        // Initialize for skill cards
        VanillaTilt.init(document.querySelectorAll('.skill-3d'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.3,
        });
        
        // Initialize for project cards
        VanillaTilt.init(document.querySelectorAll('.project-card'), {
            max: 5,
            speed: 400,
            glare: true,
            'max-glare': 0.2,
        });
    }
}

// Skill animations with GSAP
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Initialize ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        // Animate skill items on scroll
        const skillItems = document.querySelectorAll('.skill-item');
        
        gsap.from(skillItems, {
            scrollTrigger: {
                trigger: '.skills',
                start: 'top 80%',
            },
            y: 50,
            opacity: 0,
            rotation: 5,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });
        
        // Animate skill bubbles
        const skillBubbles = document.querySelectorAll('.skill-bubble');
        
        skillBubbles.forEach((bubble) => {
            gsap.to(bubble, {
                scrollTrigger: {
                    trigger: '.skills',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0.9,
                scale: 1.1,
                duration: 1,
                ease: 'power2.out',
                yoyo: true,
                repeat: -1,
                repeatDelay: 2
            });
        });

        // Animate timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        gsap.from(timelineItems, {
            scrollTrigger: {
                trigger: '.timeline',
                start: 'top 80%',
            },
            x: -50,
            opacity: 0,
            duration: 1,
            stagger: 0.3,
            ease: 'power3.out'
        });

        // Animate project cards
        const projectCards = document.querySelectorAll('.project-card');
        
        gsap.from(projectCards, {
            scrollTrigger: {
                trigger: '.projects',
                start: 'top 80%',
            },
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.3,
            ease: 'power3.out'
        });
        
        // Animate contact form
        const contactForm = document.querySelector('.contact-form');
        
        gsap.from(contactForm, {
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 80%',
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
        
        // Animate form elements
        const formGroups = document.querySelectorAll('.form-group');
        
        gsap.from(formGroups, {
            scrollTrigger: {
                trigger: '.contact-form',
                start: 'top 80%',
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out'
        });
        
        // Hero section animations
        gsap.from('.hero-text h1', {
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-text h2', {
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.4,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-text p', {
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.6,
            ease: 'power3.out'
        });
        
        gsap.from('.cta-buttons', {
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.8,
            ease: 'power3.out'
        });
        
        gsap.from('.profile-image-container', {
            opacity: 0,
            scale: 0.8,
            duration: 1.2,
            delay: 0.3,
            ease: 'power3.out'
        });
        
        // Animate shapes
        gsap.to('.shape1', {
            x: 20,
            y: 20,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
        
        gsap.to('.shape2', {
            x: -20,
            y: -10,
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 0.5
        });
        
        gsap.to('.shape3', {
            x: 15,
            y: -15,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1
        });
    }
});
