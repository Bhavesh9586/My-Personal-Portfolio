// DOM Elements
const loadingScreen = document.querySelector('.loading-screen');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const header = document.querySelector('header');
const skillLevels = document.querySelectorAll('.skill-level');

// Three.js Scene Setup
let camera, scene, renderer;
let particles, particlesGeometry, particlesMaterial;
let raycaster, mouse, intersects;
let sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
let clock = new THREE.Clock();

// Force hide loading screen after 3 seconds to prevent indefinite loading
setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        animateHomeSection();
    }, 500);
}, 3000);

// Colors for particles
const particleColors = [
    new THREE.Color(0x2563eb), // Primary color
    new THREE.Color(0x4f46e5), // Secondary color
    new THREE.Color(0x0284c7), // Accent blue
    new THREE.Color(0x0369a1)  // Deep blue
];

// Simplified Loading Manager
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
        // Hide loading screen immediately when loaded
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            // Animate the home section elements
            animateHomeSection();
        }, 500);
    }
);

// Animate Home Section
function animateHomeSection() {
    const homeContent = document.querySelector('#home .content');
    if (!homeContent) return;
    
    const homeElements = homeContent.children;
    
    gsap.fromTo(homeElements[0], {
        opacity: 0,
        y: 50
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8
    });
    
    gsap.fromTo(homeElements[1], {
        opacity: 0,
        y: 50
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2
    });
    
    gsap.fromTo(homeElements[2], {
        opacity: 0,
        y: 50
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.4
    });
    
    gsap.fromTo(homeElements[3], {
        opacity: 0,
        y: 50
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.6
    });
}

// Initialize Three.js
function init() {
    try {
        // Camera
        camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
        camera.position.z = 2;

        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8fafc);
        
        // Create a gradient background
        const bgTexture = createGradientTexture();
        scene.background = bgTexture;

        // Particles
        particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1000; // Reduced count for better performance
        const posArray = new Float32Array(particlesCount * 3);
        const colorsArray = new Float32Array(particlesCount * 3);
        
        for(let i = 0; i < particlesCount; i++) {
            // Position
            posArray[i * 3] = (Math.random() - 0.5) * 5;
            posArray[i * 3 + 1] = (Math.random() - 0.5) * 5;
            posArray[i * 3 + 2] = (Math.random() - 0.5) * 5;
            
            // Color
            const randomColor = particleColors[Math.floor(Math.random() * particleColors.length)];
            colorsArray[i * 3] = randomColor.r;
            colorsArray[i * 3 + 1] = randomColor.g;
            colorsArray[i * 3 + 2] = randomColor.b;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
        
        particlesMaterial = new THREE.PointsMaterial({
            size: 0.01,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        // Create particle clusters
        createParticleClusters();

        // Renderer
        renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('canvas.webgl'),
            antialias: true,
            alpha: true
        });
        
        if (!renderer) throw new Error("Could not create renderer");
        
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Raycaster
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        // Event Listeners
        window.addEventListener('resize', onWindowResize);
        document.addEventListener('mousemove', onMouseMove);
        
        // Start Animation
        animate();
        
        // Hide loading screen since everything initialized successfully
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                animateHomeSection();
            }, 500);
        }, 1000);
        
    } catch (error) {
        console.error("Error initializing Three.js:", error);
        // Hide loading screen even if there's an error
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Create a gradient background texture
function createGradientTexture() {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 2;
        canvas.height = 512;
        
        const context = canvas.getContext('2d');
        if (!context) return new THREE.Color(0xf8fafc);
        
        // Create gradient
        const gradient = context.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(1, '#f0f9ff');
        
        // Fill with gradient
        context.fillStyle = gradient;
        context.fillRect(0, 0, 2, 512);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        
        return texture;
    } catch (error) {
        console.error("Error creating gradient texture:", error);
        return new THREE.Color(0xf8fafc);
    }
}

// Create particle clusters
function createParticleClusters() {
    try {
        // Create cluster for skills section
        createCluster(1.5, 0.5, 0.8, 150);
        
        // Create cluster for projects section
        createCluster(-1.5, -0.5, 0.6, 100);
    } catch (error) {
        console.error("Error creating particle clusters:", error);
    }
}

// Create a cluster of particles
function createCluster(x, y, radius, count) {
    try {
        const clusterGeometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(count * 3);
        const colorsArray = new Float32Array(count * 3);
        
        for(let i = 0; i < count; i++) {
            // Generate position within a sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = radius * Math.cbrt(Math.random());
            
            posArray[i * 3] = x + r * Math.sin(phi) * Math.cos(theta);
            posArray[i * 3 + 1] = y + r * Math.sin(phi) * Math.sin(theta);
            posArray[i * 3 + 2] = r * Math.cos(phi);
            
            // Color
            const randomColor = particleColors[Math.floor(Math.random() * particleColors.length)];
            colorsArray[i * 3] = randomColor.r;
            colorsArray[i * 3 + 1] = randomColor.g;
            colorsArray[i * 3 + 2] = randomColor.b;
        }
        
        clusterGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        clusterGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
        
        const clusterMaterial = new THREE.PointsMaterial({
            size: 0.008,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true
        });
        
        const cluster = new THREE.Points(clusterGeometry, clusterMaterial);
        scene.add(cluster);
    } catch (error) {
        console.error("Error creating cluster:", error);
    }
}

// Handle Window Resize
function onWindowResize() {
    try {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        if (camera) {
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();
        }

        if (renderer) {
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
    } catch (error) {
        console.error("Error handling window resize:", error);
    }
}

// Handle Mouse Movement
function onMouseMove(event) {
    try {
        // Normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    } catch (error) {
        console.error("Error handling mouse movement:", error);
    }
}

// Animation Loop
function animate() {
    try {
        requestAnimationFrame(animate);
        
        if (!particles || !renderer || !scene || !camera) return;
        
        const elapsedTime = clock.getElapsedTime();
        
        // Rotate particles
        particles.rotation.x = elapsedTime * 0.05;
        particles.rotation.y = elapsedTime * 0.03;
        
        // Create subtle wave effect
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];
            
            // Apply sine wave displacement
            positions[i + 2] = z + Math.sin(elapsedTime + x * 2) * 0.01;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Update Raycaster
        raycaster.setFromCamera(mouse, camera);
        intersects = raycaster.intersectObject(particles);
        
        // Particle hover effect
        if (intersects.length > 0) {
            gsap.to(camera.position, {
                x: mouse.x * 0.3,
                y: mouse.y * 0.3,
                duration: 2,
                ease: "power2.out"
            });
        }
        
        renderer.render(scene, camera);
    } catch (error) {
        console.error("Error in animation loop:", error);
    }
}

// Navigation
function navSlide() {
    try {
        if (!burger) return;
        
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');
            
            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
            
            // Burger Animation
            burger.classList.toggle('toggle');
        });
    } catch (error) {
        console.error("Error in navigation:", error);
    }
}

// Smooth Scrolling
function smoothScroll() {
    try {
        navLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                
                // Close mobile menu if open
                if (nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                    navLinks.forEach(link => {
                        link.style.animation = '';
                    });
                }
                
                // Get section id
                const id = link.getAttribute('href');
                const section = document.querySelector(id);
                if (!section) return;
                
                const sectionPos = section.offsetTop;
                
                // Scroll to section
                window.scrollTo({
                    top: sectionPos - 80,
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(link => link.classList.remove('active'));
                link.classList.add('active');
            });
        });
    } catch (error) {
        console.error("Error in smooth scrolling:", error);
    }
}

// Animate Project Cards
function animateProjectCards() {
    try {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            // Add mouse enter animation
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -20,
                    scale: 1.03,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                    duration: 0.3
                });
            });
            
            // Add mouse leave animation
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
                    duration: 0.3
                });
            });
        });
    } catch (error) {
        console.error("Error animating project cards:", error);
    }
}

// Active Section on Scroll
function activeSection() {
    try {
        window.addEventListener('scroll', () => {
            // Header background on scroll
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Update active section
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
            
            // Animate sections on scroll
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (sectionTop < windowHeight - 150) {
                    section.classList.add('active');
                    
                    // Animate skill bars when skills section is visible
                    if (section.id === 'skills') {
                        animateSkillBars();
                    }
                    
                    // Animate timeline items when experience or education section is visible
                    if (section.id === 'experience' || section.id === 'education') {
                        animateTimeline(section);
                    }
                }
            });
        });
    } catch (error) {
        console.error("Error in active section:", error);
    }
}

// Animate Skill Bars
function animateSkillBars() {
    try {
        skillLevels.forEach((skill, index) => {
            const width = skill.style.width;
            skill.style.width = '0';
            
            setTimeout(() => {
                gsap.to(skill, {
                    width: width,
                    duration: 1,
                    ease: "power2.out",
                    delay: index * 0.1
                });
            }, 300);
        });
    } catch (error) {
        console.error("Error animating skill bars:", error);
    }
}

// Animate Timeline Items
function animateTimeline(section) {
    try {
        const timelineItems = section.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            gsap.fromTo(item, {
                opacity: 0,
                x: -50
            }, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                delay: index * 0.2
            });
        });
    } catch (error) {
        console.error("Error animating timeline items:", error);
    }
}

// Form Submission
function handleFormSubmit() {
    try {
        const form = document.getElementById('contact-form');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data
                const name = form.elements['name'].value;
                const email = form.elements['email'].value;
                const subject = form.elements['subject'].value;
                const message = form.elements['message'].value;
                
                // You would typically send this data to a server
                console.log('Form submitted:', { name, email, subject, message });
                
                // Show submit animation
                const submitBtn = form.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                
                // Simulate form submission
                setTimeout(() => {
                    // Reset form
                    form.reset();
                    
                    // Reset button
                    submitBtn.textContent = 'Message Sent!';
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 2000);
                }, 1500);
            });
        }
    } catch (error) {
        console.error("Error handling form submission:", error);
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Start Three.js
        init();
        
        // Initialize Navigation
        navSlide();
        smoothScroll();
        activeSection();
        
        // Initialize Form
        handleFormSubmit();
        
        // Initialize Project Card Animations
        animateProjectCards();
    } catch (error) {
        console.error("Error initializing app:", error);
        // Make sure loading screen is hidden even if there's an error
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
});
