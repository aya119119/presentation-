// Three.js 3D Earth Setup
let scene, camera, renderer, earth, stars, clouds;
let earthRotation = 0;

function initEarth() {
    // Scene setup
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 3;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    const container = document.getElementById('earth-container');
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Earth geometry
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Try to load Earth texture, fallback to realistic material
    const textureLoader = new THREE.TextureLoader();
    let earthMaterial;
    
    // Attempt to load Earth texture
    textureLoader.load(
        'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg',
        // Success
        function(texture) {
            earthMaterial = new THREE.MeshPhongMaterial({
                map: texture,
                bumpScale: 0.05,
                specular: new THREE.Color(0x333333),
                shininess: 15
            });
            earth.material = earthMaterial;
        },
        // Progress
        undefined,
        // Error - use fallback
        function() {
            console.log('Using fallback Earth material');
        }
    );
    
    // Fallback material - realistic looking Earth
    earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a3a52,  // Deep ocean blue
        emissive: 0x0a1520,
        specular: 0x111111,
        shininess: 15,
        bumpScale: 0.02
    });
    
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    
    // Subtle wireframe overlay
    const wireframeGeometry = new THREE.SphereGeometry(1.005, 32, 32);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x444444,
        wireframe: true,
        transparent: true,
        opacity: 0.03
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    earth.add(wireframe);
    
    // Clouds layer
    const cloudsGeometry = new THREE.SphereGeometry(1.01, 32, 32);
    const cloudsMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.04,
        side: THREE.DoubleSide
    });
    clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(clouds);
    
    // Stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.02,
        transparent: true,
        opacity: 0.8
    });
    
    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 50;
        const y = (Math.random() - 0.5) * 50;
        const z = (Math.random() - 0.5) * 50;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(starsVertices, 3)
    );
    
    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Start animation
    animateEarth();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animateEarth() {
    requestAnimationFrame(animateEarth);
    
    // Rotate Earth
    earthRotation += 0.001;
    earth.rotation.y = earthRotation;
    
    // Rotate clouds slightly faster
    clouds.rotation.y = earthRotation * 1.2;
    
    // Subtle star rotation
    stars.rotation.y = earthRotation * 0.1;
    
    // Camera movement based on scroll
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    camera.position.x = Math.sin(scrollPercent * Math.PI * 2) * 0.5;
    camera.position.y = Math.cos(scrollPercent * Math.PI) * 0.3;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Scroll-triggered animations - FIXED
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Trigger background for this section
                const section = entry.target;
                const sectionBg = section.querySelector('.section-background');
                if (sectionBg) {
                    sectionBg.classList.add('active');
                }
                
                // Add stagger animation to children
                const children = entry.target.querySelectorAll('.crisis-card, .phase-card, .financial-year, .market-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0) scale(1)';
                    }, index * 150);
                });
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
        
        // Pre-style children for animation
        const children = section.querySelectorAll('.crisis-card, .phase-card, .financial-year, .market-card');
        children.forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px) scale(0.95)';
            child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    });
}

// Image loading with YOUR local images
function setupImagePlaceholders() {
    const placeholders = document.querySelectorAll('.image-placeholder');
    
    // Map of placeholder types to YOUR local image paths
    const imageMap = {
        'satellite-1': 'images/space/satellite_1.jpg',
        'satellite-2': 'images/space/satellite_2.jpg',
        'earth-2': 'images/space/earth_2.jpg',
        'earth-3': 'images/space/earth_3.jpg',
        'iss': 'images/space/iss.jpg',
        'starlink': 'images/space/starlink.jpg',
        'phase1': 'images/phases/phase1-licensing.jpg',
        'phase2': 'images/phases/phase2-platform.jpg',
        'phase3': 'images/phases/phase3-data.jpg'
    };
    
    placeholders.forEach(placeholder => {
        const imageKey = placeholder.dataset.image;
        if (imageMap[imageKey]) {
            // Create image element
            const img = document.createElement('img');
            img.src = imageMap[imageKey];
            img.alt = imageKey;
            
            // Add loading animation
            img.onload = () => {
                img.classList.add('loaded');
            };
            
            // Fallback if image doesn't load
            img.onerror = () => {
                console.log(`Image ${imageKey} not found at ${imageMap[imageKey]}`);
                placeholder.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))';
            };
            
            placeholder.appendChild(img);
        }
    });
}

// Smooth scroll for navigation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navigation scroll effect
function initNavScroll() {
    const nav = document.querySelector('.nav');
    const progressBarFill = document.getElementById('progressBarFill');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Update progress bar
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (currentScroll / windowHeight) * 100;
        if (progressBarFill) {
            progressBarFill.style.width = scrolled + '%';
        }
        
        lastScroll = currentScroll;
    });
}

// Parallax effect for backgrounds
function initParallax() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                
                // Parallax for section backgrounds
                document.querySelectorAll('.section-background').forEach((bg, index) => {
                    const speed = 0.3 + (index * 0.1);
                    const yPos = -(scrolled * speed);
                    bg.style.transform = `translate3d(0, ${yPos}px, 0) scale(1.1)`;
                });
                
                // Parallax for hero background
                const heroBackground = document.querySelector('.hero-background');
                if (heroBackground) {
                    heroBackground.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// Stats counter animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-number, .stat-large, .stat-value');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                
                // Check if it's a number
                const match = text.match(/[\d,]+/);
                if (match) {
                    const number = parseInt(match[0].replace(/,/g, ''));
                    animateNumber(target, 0, number, 2000, text);
                }
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element, start, end, duration, originalText) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        // Update text while preserving other characters
        element.textContent = originalText.replace(/[\d,]+/, current.toLocaleString());
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Hide scroll indicator after scrolling
function initScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;
    
    let hasScrolled = false;
    
    window.addEventListener('scroll', () => {
        if (!hasScrolled && window.scrollY > 100) {
            indicator.style.opacity = '0';
            indicator.style.pointerEvents = 'none';
            hasScrolled = true;
        }
    });
}

// Loading animation
function initLoadingAnimation() {
    document.body.style.opacity = '0';
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.style.transition = 'opacity 1s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
}

// Custom cursor effect
function initCustomCursor() {
    // Create cursor elements
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    
    document.body.appendChild(cursorGlow);
    document.body.appendChild(cursorDot);
    
    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor follow
    function animateCursor() {
        // Glow follows with delay
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        // Dot follows faster
        dotX += (mouseX - dotX) * 0.25;
        dotY += (mouseY - dotY) * 0.25;
        
        cursorGlow.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
        cursorDot.style.transform = `translate(${dotX - 2}px, ${dotY - 2}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Scale cursor on hover
    document.querySelectorAll('a, button, .card, .stat-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorGlow.style.transform += ' scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorGlow.style.transform = cursorGlow.style.transform.replace(' scale(1.5)', '');
        });
    });
}

// Initialize all backgrounds on page load
function initSectionBackgrounds() {
    // Make all section backgrounds visible immediately
    document.querySelectorAll('.section-background').forEach(bg => {
        bg.classList.add('active');
    });
}

// Performance optimization: pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations
        if (renderer) renderer.setAnimationLoop(null);
    } else {
        // Resume animations
        animateEarth();
    }
});

// Create animated starfield
function initStarfield() {
    const starfield = document.getElementById('starfield');
    if (!starfield) return;
    
    const numStars = 150;
    
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        // Random size
        const size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        // Random animation delay
        star.style.animationDelay = Math.random() * 3 + 's';
        
        // Random opacity
        star.style.opacity = Math.random() * 0.5 + 0.3;
        
        starfield.appendChild(star);
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 SAT-BIOPSIE Presentation Loading...');
    
    initStarfield();
    initEarth();
    initScrollAnimations();
    setupImagePlaceholders();
    initSmoothScroll();
    initNavScroll();
    initParallax();
    animateStats();
    initScrollIndicator();
    initLoadingAnimation();
    initCustomCursor();
    initSectionBackgrounds();
    
    console.log('✅ SAT-BIOPSIE Presentation Loaded Successfully');
    console.log('🎨 Using local images from /images folder');
    console.log('✨ Custom fonts: Playfair Display, Inter');
    console.log('⭐ Animated starfield active');
});