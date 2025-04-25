// Animated Particle Background using tsParticles
// https://github.com/matteobruni/tsparticles

document.addEventListener('DOMContentLoaded', function () {
    if (!window.tsParticles) return;
    tsParticles.load('particles-bg', {
        fpsLimit: 60,
        background: { color: 'transparent' },
        particles: {
            number: { value: 60, density: { enable: true, area: 800 } },
            color: { value: ['#4070f4', '#834dff', '#00c3ff', '#ffd700'] },
            shape: { type: 'circle' },
            opacity: { value: 0.55 },
            size: { value: { min: 2, max: 5 } },
            move: { enable: true, speed: 1.2, direction: 'none', random: true, straight: false, outModes: 'out' },
            links: { enable: true, distance: 120, color: '#4070f4', opacity: 0.2, width: 1 }
        },
        detectRetina: true
    });
});
