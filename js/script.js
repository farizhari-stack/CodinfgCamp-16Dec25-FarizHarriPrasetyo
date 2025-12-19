// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');

// Form inputs
const namaInput = document.getElementById('nama');
const tanggalInput = document.getElementById('tanggal');
const pesanInput = document.getElementById('pesan');
const genderInputs = document.querySelectorAll('input[name="gender"]');

// Preview elements
const previewNama = document.getElementById('previewNama');
const previewTanggal = document.getElementById('previewTanggal');
const previewGender = document.getElementById('previewGender');
const previewPesan = document.getElementById('previewPesan');
const currentTimeElement = document.getElementById('currentTime');

// ===== Navigation Scroll Effect =====
let lastScrollY = window.scrollY;

function handleScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleScroll, { passive: true });

// ===== Mobile Navigation Toggle =====
function toggleMobileNav() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

navToggle.addEventListener('click', toggleMobileNav);

// Close mobile nav when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMobileNav();
        }
    });
});

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
        toggleMobileNav();
    }
});

// ===== Active Navigation Link on Scroll =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });

// ===== Smooth Scroll for Navigation =====
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Current Time Display =====
function updateCurrentTime() {
    const now = new Date();
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };

    currentTimeElement.textContent = now.toLocaleString('en-US', options);
}

// Update time every second
updateCurrentTime();
setInterval(updateCurrentTime, 1000);

// ===== Form Live Preview =====
function updatePreview() {
    // Update nama
    previewNama.textContent = namaInput.value || '-';

    // Update tanggal
    if (tanggalInput.value) {
        const date = new Date(tanggalInput.value);
        previewTanggal.textContent = date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } else {
        previewTanggal.textContent = '-';
    }

    // Update gender
    const selectedGender = document.querySelector('input[name="gender"]:checked');
    previewGender.textContent = selectedGender ? selectedGender.value : '-';

    // Update pesan
    previewPesan.textContent = pesanInput.value || '-';
}

// Add event listeners for live preview
namaInput.addEventListener('input', updatePreview);
tanggalInput.addEventListener('change', updatePreview);
pesanInput.addEventListener('input', updatePreview);
genderInputs.forEach(input => {
    input.addEventListener('change', updatePreview);
});

// Initial preview update
updatePreview();

// ===== Form Submission =====
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Add loading state
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.querySelector('span').textContent;
    submitBtn.querySelector('span').textContent = 'Mengirim...';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        // Show toast notification
        showToast('Pesan berhasil dikirim!');

        // Reset form
        contactForm.reset();
        updatePreview();

        // Reset button
        submitBtn.querySelector('span').textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// ===== Toast Notification =====
function showToast(message) {
    const toastMessage = toast.querySelector('.toast-message');
    toastMessage.textContent = message;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
};

const observer = new IntersectionObserver(animateOnScroll, observerOptions);

// Observe elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// ===== Parallax Effect for Hero =====
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

function handleParallax() {
    if (window.innerWidth > 768) {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.3;

        if (hero && scrolled < hero.offsetHeight) {
            heroContent.style.transform = `translateY(${rate}px)`;
            heroContent.style.opacity = 1 - (scrolled / hero.offsetHeight);
        }
    }
}

window.addEventListener('scroll', handleParallax, { passive: true });

// ===== Magnetic Effect for Cards =====
const hqCards = document.querySelectorAll('.hq-card');

hqCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotateX = (y / rect.height) * -10;
        const rotateY = (x / rect.width) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== Typing Effect for Hero Title =====
const welcomeText = document.querySelector('.hero-title .welcome');
const originalWelcomeText = welcomeText ? welcomeText.textContent : '';

function typeWriter(element, text, speed = 80) {
    element.textContent = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Run typing effect on page load
if (welcomeText) {
    setTimeout(() => {
        typeWriter(welcomeText, originalWelcomeText);
    }, 500);
}

// ===== Input Focus Animation =====
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
    });
});

// ===== Ripple Effect for Buttons =====
const buttons = document.querySelectorAll('.btn, .btn-submit');

buttons.forEach(button => {
    button.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple styles dynamically
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    .btn, .btn-submit {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);

// ===== Cursor Glow Effect =====
function createCursorGlow() {
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    const cursorStyles = document.createElement('style');
    cursorStyles.textContent = `
        .cursor-glow {
            position: fixed;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(0, 122, 255, 0.08) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
        }
        
        @media (max-width: 768px) {
            .cursor-glow {
                display: none;
            }
        }
    `;
    document.head.appendChild(cursorStyles);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

// Initialize cursor glow on desktop
if (window.innerWidth > 768) {
    createCursorGlow();
}

// ===== Page Load Animation =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Animate elements sequentially
    const animatedElements = document.querySelectorAll('.hero-text, .hero-image, .hq-card, .contact-form-container, .contact-preview');

    animatedElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// ===== Set Default Date =====
const today = new Date().toISOString().split('T')[0];
tanggalInput.value = today;
updatePreview();

console.log('🚀 Website loaded successfully!');
console.log('✨ Designed with Apple Liquid Style & Glassmorphism');

// ===== Code Typing Animation =====
// ===== 3D Robot Animation =====
const robotContainer = document.getElementById('robot-container');

function init3DAnimation() {
    if (!robotContainer) return;

    // Scene Setup
    const scene = new THREE.Scene();

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(50, robotContainer.clientWidth / robotContainer.clientHeight, 0.1, 1000);
    camera.position.z = 6;
    camera.position.y = 0.5;

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(robotContainer.clientWidth, robotContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    robotContainer.appendChild(renderer.domElement);

    // Robot Group
    const robot = new THREE.Group();
    scene.add(robot);

    // Materials
    const whiteMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    });

    const darkMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.8,
        roughness: 0.2,
    });

    const glowMaterial = new THREE.MeshStandardMaterial({
        color: 0x007AFF,
        emissive: 0x007AFF,
        emissiveIntensity: 3,
        toneMapped: false
    });

    // --- Robot Parts ---

    // Head
    const headGroup = new THREE.Group();
    robot.add(headGroup);

    const headGeo = new THREE.SphereGeometry(1, 64, 64);
    const head = new THREE.Mesh(headGeo, whiteMaterial);
    headGroup.add(head);

    // Face Screen (Visor)
    const faceGeo = new THREE.SphereGeometry(0.85, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.35);
    const face = new THREE.Mesh(faceGeo, darkMaterial);
    face.position.z = 0.18;
    face.rotation.x = -Math.PI / 2;
    headGroup.add(face);

    // Right Eye
    const eyeGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const rightEye = new THREE.Mesh(eyeGeo, glowMaterial);
    rightEye.position.set(0.35, 0.1, 0.92);
    // Flatten eye slightly
    rightEye.scale.set(1, 1, 0.3);
    headGroup.add(rightEye);

    // Left Eye
    const leftEye = new THREE.Mesh(eyeGeo, glowMaterial);
    leftEye.position.set(-0.35, 0.1, 0.92);
    leftEye.scale.set(1, 1, 0.3);
    headGroup.add(leftEye);

    // Body (Floating below head)
    const bodyGroup = new THREE.Group();
    bodyGroup.position.y = -1.8;
    robot.add(bodyGroup);

    const bodyGeo = new THREE.CylinderGeometry(0.6, 0.4, 1.2, 32);
    const body = new THREE.Mesh(bodyGeo, whiteMaterial);
    bodyGroup.add(body);

    const neckGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32);
    const neck = new THREE.Mesh(neckGeo, darkMaterial);
    neck.position.y = 0.7;
    bodyGroup.add(neck);

    // Hovering Rings (Orbitals)
    const ringGeo = new THREE.TorusGeometry(2, 0.05, 16, 100);
    const ring1 = new THREE.Mesh(ringGeo, glowMaterial);
    const ring2 = new THREE.Mesh(ringGeo, glowMaterial);
    const ring3 = new THREE.Mesh(ringGeo, glowMaterial);

    ring1.rotation.x = Math.PI / 2;
    ring1.scale.set(0.8, 0.8, 0.8);

    ring2.rotation.x = Math.PI / 2;
    ring2.rotation.y = Math.PI / 3;
    ring2.scale.set(0.7, 0.7, 0.7);

    ring3.rotation.x = Math.PI / 2;
    ring3.rotation.y = -Math.PI / 3;
    ring3.scale.set(0.6, 0.6, 0.6);

    robot.add(ring1);
    robot.add(ring2);
    robot.add(ring3);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 10, 7);
    scene.add(mainLight);

    const blueLight = new THREE.PointLight(0x007AFF, 2, 10);
    blueLight.position.set(-2, 1, 4);
    scene.add(blueLight);

    const pinkLight = new THREE.PointLight(0xFF2D55, 2, 10);
    pinkLight.position.set(2, -1, 4);
    scene.add(pinkLight);

    // Mouse Tracking
    let mouse = new THREE.Vector2();
    let targetRotation = new THREE.Vector2();
    let windowHalfX = robotContainer.clientWidth / 2;
    let windowHalfY = robotContainer.clientHeight / 2;

    document.addEventListener('mousemove', (event) => {
        // Calculate mouse position relative to container
        const rect = robotContainer.getBoundingClientRect();

        // Only track if mouse is near the hero section
        if (event.clientY < window.innerHeight) {
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // Normalize to -1 to 1
            mouse.x = (x / rect.width) * 2 - 1;
            mouse.y = -(y / rect.height) * 2 + 1;

            // Limit rotation angles for natural movement
            targetRotation.x = mouse.y * 0.5; // Up/Down
            targetRotation.y = mouse.x * 0.8; // Left/Right
        }
    });

    // Animation Loop
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // 1. Smooth Head Rotation (Look at cursor)
        headGroup.rotation.x += (targetRotation.x - headGroup.rotation.x) * 0.1;
        headGroup.rotation.y += (targetRotation.y - headGroup.rotation.y) * 0.1;

        // Slight body rotation
        bodyGroup.rotation.x += (targetRotation.x * 0.2 - bodyGroup.rotation.x) * 0.05;
        bodyGroup.rotation.y += (targetRotation.y * 0.2 - bodyGroup.rotation.y) * 0.05;

        // 2. Floating Animation (Bobbing)
        robot.position.y = Math.sin(time * 1.5) * 0.2;

        // 3. Ring Rotations (Gyroscopic effect)
        ring1.rotation.y += 0.02;
        ring1.rotation.x = Math.PI / 2 + Math.sin(time * 0.5) * 0.2;

        ring2.rotation.z += 0.02;
        ring2.rotation.x = Math.PI / 2 + Math.cos(time * 0.4) * 0.2;

        ring3.rotation.x += 0.02;
        ring3.rotation.y = Math.sin(time * 0.6) * 0.2;

        renderer.render(scene, camera);
    }

    // Handle Resize
    window.addEventListener('resize', () => {
        if (!robotContainer) return;

        windowHalfX = robotContainer.clientWidth / 2;
        windowHalfY = robotContainer.clientHeight / 2;

        camera.aspect = robotContainer.clientWidth / robotContainer.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(robotContainer.clientWidth, robotContainer.clientHeight);
    });

    // Start Animation
    animate();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // ===== Welcome Modal Logic =====
    const welcomeModal = document.getElementById('welcomeModal');
    const closeWelcomeBtn = document.getElementById('closeWelcomeBtn');

    if (welcomeModal && closeWelcomeBtn) {
        // Show Welcome Modal
        setTimeout(() => {
            welcomeModal.classList.add('show');
            console.log('Welcome Modal Triggered');
        }, 500);

        closeWelcomeBtn.addEventListener('click', () => {
            welcomeModal.classList.remove('show');
        });
    } else {
        console.error('Welcome Modal elements not found!');
    }

    // Initialize 3D Animation (wait for resources mainly for robustness, but can start)
    setTimeout(init3DAnimation, 100);
});


// ===== Scroll Progress Bar =====
const scrollProgressBar = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    if (!scrollProgressBar) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // Avoid division by zero
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    scrollProgressBar.style.width = `${scrollPercent}%`;
}, { passive: true });

