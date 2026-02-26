/**
 * CHALYMAN - Interactive Website
 * Juggler & Street Performer
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initCursor();
    initScrollProgress();
    initNavigation();
    initScrollAnimations();
    initCounterAnimation();
    initFormHandling();
    initGalleryReel();
    initParallaxEffect();
    initCardHover();
});

/**
 * Custom Cursor
 */
function initCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
        dot.style.display = 'none';
        ring.style.display = 'none';
        return;
    }

    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        dotX = e.clientX;
        dotY = e.clientY;
        dot.style.left = dotX + 'px';
        dot.style.top = dotY + 'px';
    }, { passive: true });

    // Ring follows with a lerp lag for elegance
    function animateRing() {
        ringX += (dotX - ringX) * 0.12;
        ringY += (dotY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Expand on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .show-card, .testimonial-card, .video-placeholder');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('cursor-hover');
            ring.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('cursor-hover');
            ring.classList.remove('cursor-hover');
        });
    });
}

/**
 * Scroll Progress Bar
 */
function initScrollProgress() {
    const bar = document.getElementById('scrollProgressBar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = progress + '%';
    }, { passive: true });
}



/**
 * Navigation
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    // Scroll effect for navbar
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for fade-in animation
    const animateElements = document.querySelectorAll(
        '.about-content, .about-visual, .show-card, .contact-info, .contact-form-wrapper, .testimonial-card, .showreel-label, .showreel-video'
    );
    
    animateElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

/**
 * Counter Animation
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                        // Add '+' for larger numbers
                        if (target >= 100) {
                            counter.textContent = target + '+';
                        }
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

/**
 * Form Handling — FormSubmit.co AJAX
 */
function initFormHandling() {
    const form = document.getElementById('bookingForm');
    const formSuccess = document.getElementById('formSuccess');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const submitBtn  = form.querySelector('.form-submit');
        const origHTML   = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Sending...';

        const data = new FormData(form);
        data.append('_subject', 'New Booking Inquiry — CHALYMAN');
        data.append('_captcha', 'false');

        try {
            const res = await fetch('https://formsubmit.co/ajax/freddyamador@gmail.com', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: data
            });
            if (!res.ok) throw new Error();
            form.style.display = 'none';
            formSuccess.classList.add('active');
            setTimeout(() => {
                form.reset();
                form.style.display = 'flex';
                formSuccess.classList.remove('active');
                submitBtn.disabled = false;
                submitBtn.innerHTML = origHTML;
            }, 5000);
        } catch {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origHTML;
            alert('Something went wrong. Please try again.');
        }
    });
}

/**
 * Parallax Effect for Floating Elements
 */
function initParallaxEffect() {
    const balls = document.querySelectorAll('.ball');
    const rings = document.querySelectorAll('.juggling-ring');
    
    // Check for touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;
    
    let ticking = false;
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax(mouseX, mouseY);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    function updateParallax(x, y) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = (x - centerX) / centerX;
        const moveY = (y - centerY) / centerY;
        
        // Use CSS `translate` property (separate from `transform`) so it doesn't
        // conflict with the @keyframes float / ringFloat CSS animations which use `transform`
        balls.forEach((ball, index) => {
            const speed = (index + 1) * 10;
            ball.style.translate = `${moveX * speed}px ${moveY * speed}px`;
        });
        
        rings.forEach((ring, index) => {
            const speed = (index + 1) * 15;
            ring.style.translate = `${moveX * speed}px ${moveY * speed}px`;
        });
    }
}

/**
 * Card Hover Effects
 */
function initCardHover() {
    const cards = document.querySelectorAll('.show-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cards.forEach(c => {
                if (c !== card) {
                    c.style.opacity = '0.6';
                    c.style.transform = 'scale(0.98)';
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            cards.forEach(c => {
                c.style.opacity = '1';
                c.style.transform = '';
            });
        });
    });
}

/**
 * Marquee Speed Control based on scroll
 */
let marqueeSpeed = 20;
const marqueeTrack = document.querySelector('.marquee-track');

if (marqueeTrack) {
    window.addEventListener('scroll', () => {
        const scrollSpeed = Math.abs(window.scrollY - (window.lastScrollY || 0));
        window.lastScrollY = window.scrollY;
        
        // Speed up marquee when scrolling fast
        if (scrollSpeed > 50) {
            marqueeTrack.style.animationDuration = '10s';
        } else {
            marqueeTrack.style.animationDuration = '20s';
        }
    }, { passive: true });
}

/**
 * Magnetic Button Effect
 */
const magneticBtns = document.querySelectorAll('.btn, .form-submit');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

/**
 * Hero Title Character Animation on Load
 */
window.addEventListener('load', () => {
    const chars = document.querySelectorAll('.char');
    chars.forEach((char, index) => {
        char.style.animationDelay = `${0.4 + index * 0.05}s`;
    });
});

/**
 * Gallery Drag-to-Scroll
 */
function initGalleryReel() {
    const reel = document.getElementById('galleryReel');
    if (!reel) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let isDown = false, startX, scrollLeft;
    reel.addEventListener('mousedown', e => {
        isDown = true;
        reel.classList.add('grabbing');
        startX     = e.pageX - reel.offsetLeft;
        scrollLeft = reel.scrollLeft;
    });
    reel.addEventListener('mouseleave', () => { isDown = false; reel.classList.remove('grabbing'); });
    reel.addEventListener('mouseup',    () => { isDown = false; reel.classList.remove('grabbing'); });
    reel.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - reel.offsetLeft;
        reel.scrollLeft = scrollLeft - (x - startX) * 1.2;
    });
}

/**
 * Reduce motion preference
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.ball, .juggling-ring, .marquee-track, .star-burst').forEach(el => {
        el.style.animation = 'none';
    });
}
