// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }
    
    // Close mobile menu when clicking a nav link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                
                // Reset hamburger icon
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => span.classList.remove('active'));
            }
        });
    });
    
    // Scroll Animation
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // If element is in viewport
            if (elementPosition < windowHeight - 50) {
                element.classList.add('visible');
            }
        });
    };
    
    // Run once on initial load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // SVG Micro-animations
    const featureSvgs = document.querySelectorAll('.feature-svg');
    
    featureSvgs.forEach(svg => {
        svg.addEventListener('mouseenter', () => {
            // Add pulse effect to SVG elements
            const svgElements = svg.querySelectorAll('circle, rect, path');
            svgElements.forEach((el, index) => {
                el.style.transition = 'all 0.3s ease';
                el.style.transitionDelay = `${index * 0.05}s`;
                
                // Different effects based on element type
                if (el.tagName === 'CIRCLE') {
                    el.style.transform = 'scale(1.1)';
                } else if (el.tagName === 'RECT') {
                    el.style.transform = 'translateY(-5px)';
                } else if (el.tagName === 'PATH') {
                    el.style.strokeWidth = parseInt(el.getAttribute('stroke-width')) + 2 + 'px';
                }
            });
        });
        
        svg.addEventListener('mouseleave', () => {
            // Reset animations
            const svgElements = svg.querySelectorAll('circle, rect, path');
            svgElements.forEach(el => {
                el.style.transform = '';
                el.style.strokeWidth = '';
            });
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.7rem 0';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        }
    });
    
    // Add CSS for active nav toggle
    const style = document.createElement('style');
    style.textContent = `
        .nav-toggle span.active:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        .nav-toggle span.active:nth-child(2) {
            opacity: 0;
        }
        .nav-toggle span.active:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    `;
    document.head.appendChild(style);
    
    // Testimonial Carousel Functionality
    const initTestimonialCarousel = () => {
        const carouselTrack = document.querySelector('.carousel-track');
        const testimonials = document.querySelectorAll('.testimonial');
        const dotsContainer = document.querySelector('.carousel-dots');
        const dots = document.querySelectorAll('.dot');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        
        if (!carouselTrack || testimonials.length === 0) return;
        
        let currentIndex = 0;
        const totalSlides = testimonials.length;
        
        // Function to update carousel position
        const updateCarousel = () => {
            carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update active dot
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };
        
        // Event listeners for prev/next buttons
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateCarousel();
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateCarousel();
            });
        }
        
        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
        
        // Auto-advance carousel every 5 seconds
        const autoAdvance = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }, 5000);
        
        // Pause auto-advance when user interacts with carousel
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(autoAdvance);
            });
            
            // Optional: restart auto-advance when mouse leaves
            carouselContainer.addEventListener('mouseleave', () => {
                clearInterval(autoAdvance); // Clear any existing interval
                const newAutoAdvance = setInterval(() => {
                    currentIndex = (currentIndex + 1) % totalSlides;
                    updateCarousel();
                }, 5000);
            });
        }
        
        // Initialize carousel
        updateCarousel();
        
        // Add swipe functionality for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
        
        const handleSwipe = () => {
            const swipeThreshold = 50; // Minimum distance for swipe
            const swipeDistance = touchEndX - touchStartX;
            
            if (swipeDistance > swipeThreshold) {
                // Swiped right, go to previous slide
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            } else if (swipeDistance < -swipeThreshold) {
                // Swiped left, go to next slide
                currentIndex = (currentIndex + 1) % totalSlides;
            }
            
            updateCarousel();
        };
    };
    
    // Initialize testimonial carousel
    initTestimonialCarousel();
});
