/**
 * Portfolio Website JavaScript
 * Features: Smooth scrolling, navbar interactions, animations, dynamic project loading
 */

// ==============================================
// Global Variables and Configuration
// ==============================================
const CONFIG = {
    animationDuration: 300,
    scrollOffset: 80,
    debounceDelay: 100,
    projectsDataPath: './data/projects.json'
};

// ==============================================
// DOM Elements
// ==============================================
const elements = {
    navbar: document.getElementById('navbar'),
    navMenu: document.getElementById('nav-menu'),
    hamburger: document.getElementById('hamburger'),
    navLinks: document.querySelectorAll('.nav-link'),
    projectsGrid: document.getElementById('projects-grid'),
    contactForm: document.getElementById('contact-form'),
    sectionsToAnimate: document.querySelectorAll('.fade-in')
};

// ==============================================
// Utility Functions
// ==============================================

/**
 * Debounce function to limit the rate of function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately
 * @returns {Function} Debounced function
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Smooth scroll to element with offset
 * @param {string} targetId - ID of the target element
 */
function smoothScrollTo(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    const targetPosition = targetElement.offsetTop - CONFIG.scrollOffset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/**
 * Get current scroll position
 * @returns {number} Current scroll position
 */
function getCurrentScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ==============================================
// Navigation Functions
// ==============================================

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    // Mobile menu toggle
    if (elements.hamburger && elements.navMenu) {
        elements.hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Smooth scrolling for navigation links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });

    // Update navbar on scroll
    window.addEventListener('scroll', debounce(updateNavbarOnScroll, CONFIG.debounceDelay));
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', handleDocumentClick);

    // Update active nav link based on scroll position
    window.addEventListener('scroll', debounce(updateActiveNavLink, CONFIG.debounceDelay));
}

/**
 * Toggle mobile menu visibility
 */
function toggleMobileMenu() {
    elements.hamburger.classList.toggle('active');
    elements.navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = elements.navMenu.classList.contains('active') ? 'hidden' : '';
}

/**
 * Handle navigation link clicks
 * @param {Event} event - Click event
 */
function handleNavLinkClick(event) {
    event.preventDefault();
    
    const href = event.target.getAttribute('href');
    if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        smoothScrollTo(targetId);
        
        // Close mobile menu if open
        if (elements.navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
        
        // Update active link
        updateActiveNavLink();
    }
}

/**
 * Update navbar appearance on scroll
 */
function updateNavbarOnScroll() {
    const scrollPosition = getCurrentScrollPosition();
    
    if (scrollPosition > 50) {
        elements.navbar.classList.add('scrolled');
    } else {
        elements.navbar.classList.remove('scrolled');
    }
}

/**
 * Update active navigation link based on current section
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = getCurrentScrollPosition();
    
    let activeSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - CONFIG.scrollOffset - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            activeSection = section.getAttribute('id');
        }
    });
    
    // Update active nav link
    elements.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSection}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Handle clicks outside mobile menu
 * @param {Event} event - Click event
 */
function handleDocumentClick(event) {
    const isClickInsideNav = elements.navbar.contains(event.target);
    
    if (!isClickInsideNav && elements.navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
}

// ==============================================
// Animation Functions
// ==============================================

/**
 * Initialize scroll animations
 */
function initializeScrollAnimations() {
    // Initial check for elements in viewport
    checkElementsInViewport();
    
    // Check on scroll
    window.addEventListener('scroll', debounce(checkElementsInViewport, CONFIG.debounceDelay));
}

/**
 * Check which elements are in viewport and animate them
 */
function checkElementsInViewport() {
    elements.sectionsToAnimate.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('visible');
        }
    });
}

/**
 * Add entrance animations to elements
 */
function addEntranceAnimations() {
    const elementsToAnimate = [
        { selector: '.hero-text', animation: 'slideInFromLeft', delay: 200 },
        { selector: '.hero-image', animation: 'slideInFromRight', delay: 400 },
        { selector: '.about-card', animation: 'slideInFromBottom', delay: 100 },
        { selector: '.project-card', animation: 'slideInFromBottom', delay: 150 },
        { selector: '.contact-item', animation: 'slideInFromLeft', delay: 100 }
    ];

    elementsToAnimate.forEach(({ selector, animation, delay }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.style.animationDelay = `${delay + (index * 100)}ms`;
            element.classList.add(animation);
        });
    });
}

// ==============================================
// Projects Functions
// ==============================================

/**
 * Load and display projects from JSON file
 */
async function loadProjects() {
    try {
        showProjectsLoading();
        
        const response = await fetch(CONFIG.projectsDataPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.projects && Array.isArray(data.projects)) {
            displayProjects(data.projects);
        } else {
            throw new Error('Invalid projects data structure');
        }
        
    } catch (error) {
        console.error('Error loading projects:', error);
        showProjectsError();
    }
}

/**
 * Display projects in the grid
 * @param {Array} projects - Array of project objects
 */
function displayProjects(projects) {
    if (!elements.projectsGrid) return;
    
    elements.projectsGrid.innerHTML = '';
    
    projects.forEach((project, index) => {
        const projectCard = createProjectCard(project, index);
        elements.projectsGrid.appendChild(projectCard);
    });
    
    // Add animation class to new cards
    const newCards = elements.projectsGrid.querySelectorAll('.project-card');
    newCards.forEach((card, index) => {
        card.classList.add('fade-in');
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 150);
    });
}

/**
 * Create a project card element
 * @param {Object} project - Project data object
 * @param {number} index - Project index for animation delay
 * @returns {HTMLElement} Project card element
 */
function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animationDelay = `${index * 150}ms`;
    
    card.innerHTML = `
        <div class="project-image">
            <img src="${project.image || './assets/images/project-placeholder.jpg'}" 
                 alt="${project.title}" 
                 loading="lazy"
                 onerror="this.src='./assets/images/project-placeholder.jpg'">
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                ${project.liveUrl ? `
                    <a href="${project.liveUrl}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="project-link link-primary"
                       aria-label="View ${project.title} live demo">
                        Live Demo
                    </a>
                ` : ''}
                ${project.githubUrl ? `
                    <a href="${project.githubUrl}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="project-link link-secondary"
                       aria-label="View ${project.title} source code">
                        Source Code
                    </a>
                ` : ''}
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Show loading state for projects
 */
function showProjectsLoading() {
    if (!elements.projectsGrid) return;
    
    elements.projectsGrid.innerHTML = `
        <div class="projects-loading">
            <div class="loading-spinner"></div>
            <p>Loading projects...</p>
        </div>
    `;
}

/**
 * Show error state for projects
 */
function showProjectsError() {
    if (!elements.projectsGrid) return;
    
    elements.projectsGrid.innerHTML = `
        <div class="projects-error">
            <p>Sorry, there was an error loading the projects.</p>
            <button onclick="loadProjects()" class="btn btn-primary">Try Again</button>
        </div>
    `;
}

// ==============================================
// Contact Form Functions
// ==============================================

/**
 * Initialize contact form functionality
 */
function initializeContactForm() {
    if (elements.contactForm) {
        elements.contactForm.addEventListener('submit', handleContactFormSubmit);
        
        // Add real-time validation
        const formInputs = elements.contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', validateFormField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

/**
 * Handle contact form submission
 * @param {Event} event - Form submit event
 */
function handleContactFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!validateContactForm(formValues)) {
        return;
    }
    
    // Show loading state
    showFormLoading(true);
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        showFormLoading(false);
        showFormSuccess();
        event.target.reset();
    }, 2000);
}

/**
 * Validate contact form
 * @param {Object} formValues - Form field values
 * @returns {boolean} True if form is valid
 */
function validateContactForm(formValues) {
    let isValid = true;
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
    requiredFields.forEach(field => {
        if (!formValues[field] || formValues[field].trim() === '') {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Validate email format
    if (formValues.email && !isValidEmail(formValues.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Validate individual form field
 * @param {Event} event - Blur event
 */
function validateFormField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Clear previous errors
    clearFieldError(event);
    
    // Validate required fields
    if (field.hasAttribute('required') && !value) {
        showFieldError(field.name, 'This field is required');
        return;
    }
    
    // Validate email
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field.name, 'Please enter a valid email address');
        return;
    }
}

/**
 * Clear field error
 * @param {Event} event - Input event
 */
function clearFieldError(event) {
    const field = event.target;
    const errorElement = document.querySelector(`[data-error-for="${field.name}"]`);
    
    if (errorElement) {
        errorElement.remove();
    }
    
    field.classList.remove('error');
}

/**
 * Show field error
 * @param {string} fieldName - Field name
 * @param {string} message - Error message
 */
function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return;
    
    // Remove existing error
    const existingError = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (existingError) {
        existingError.remove();
    }
    
    // Add error class
    field.classList.add('error');
    
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.setAttribute('data-error-for', fieldName);
    errorElement.textContent = message;
    
    // Insert error element
    field.parentElement.appendChild(errorElement);
}

/**
 * Show form loading state
 * @param {boolean} isLoading - Loading state
 */
function showFormLoading(isLoading) {
    const submitButton = elements.contactForm.querySelector('button[type="submit"]');
    if (!submitButton) return;
    
    if (isLoading) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        submitButton.classList.add('loading');
    } else {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
        submitButton.classList.remove('loading');
    }
}

/**
 * Show form success message
 */
function showFormSuccess() {
    const formContainer = elements.contactForm.parentElement;
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <div class="success-icon">✓</div>
        <h3>Message Sent Successfully!</h3>
        <p>Thank you for reaching out. I'll get back to you soon.</p>
    `;
    
    formContainer.appendChild(successMessage);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ==============================================
// Performance and Accessibility Functions
// ==============================================

/**
 * Initialize performance optimizations
 */
function initializePerformanceOptimizations() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Preload critical resources
    preloadCriticalResources();
}

/**
 * Preload critical resources
 */
function preloadCriticalResources() {
    const criticalResources = [
        './assets/images/profile.jpg',
        './data/projects.json'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.json') ? 'fetch' : 'image';
        document.head.appendChild(link);
    });
}

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
    // Skip to main content link
    addSkipToMainContentLink();
    
    // Keyboard navigation
    initializeKeyboardNavigation();
    
    // Focus management
    initializeFocusManagement();
    
    // Announce dynamic content changes
    createAriaLiveRegion();
}

/**
 * Add skip to main content link
 */
function addSkipToMainContentLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Initialize keyboard navigation
 */
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
        // Escape key closes mobile menu
        if (event.key === 'Escape' && elements.navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
}

/**
 * Initialize focus management
 */
function initializeFocusManagement() {
    // Trap focus in mobile menu when open
    elements.navMenu.addEventListener('keydown', (event) => {
        if (!elements.navMenu.classList.contains('active')) return;
        
        if (event.key === 'Tab') {
            const focusableElements = elements.navMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

/**
 * Create ARIA live region for announcements
 */
function createAriaLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    `;
    
    document.body.appendChild(liveRegion);
    
    // Global function to announce messages
    window.announceToScreenReader = (message) => {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    };
}

// ==============================================
// Theme and Preferences
// ==============================================

/**
 * Initialize theme and user preferences
 */
function initializeThemeAndPreferences() {
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-normal', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');
    }
    
    // Respect user's color scheme preference
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        // Add light theme support if needed in the future
        console.log('User prefers light theme');
    }
}

// ==============================================
// Error Handling and Logging
// ==============================================

/**
 * Initialize error handling
 */
function initializeErrorHandling() {
    window.addEventListener('error', (event) => {
        console.error('JavaScript error:', event.error);
        // In production, you might want to send this to an error reporting service
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        // In production, you might want to send this to an error reporting service
    });
}

// ==============================================
// Main Initialization
// ==============================================

/**
 * Initialize all website functionality
 */
function initializeWebsite() {
    console.log('Initializing portfolio website...');
    
    try {
        // Core functionality
        initializeNavigation();
        initializeScrollAnimations();
        initializeContactForm();
        
        // Load dynamic content
        loadProjects();
        
        // Performance and accessibility
        initializePerformanceOptimizations();
        initializeAccessibility();
        
        // Theme and preferences
        initializeThemeAndPreferences();
        
        // Error handling
        initializeErrorHandling();
        
        // Add entrance animations
        addEntranceAnimations();
        
        console.log('Portfolio website initialized successfully!');
        
        // Announce to screen readers
        if (window.announceToScreenReader) {
            window.announceToScreenReader('Portfolio website loaded successfully');
        }
        
    } catch (error) {
        console.error('Error initializing website:', error);
    }
}

// ==============================================
// Event Listeners
// ==============================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
    initializeWebsite();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Refresh dynamic content if needed
        console.log('Page became visible');
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('Connection restored');
    if (window.announceToScreenReader) {
        window.announceToScreenReader('Connection restored');
    }
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
    if (window.announceToScreenReader) {
        window.announceToScreenReader('Connection lost');
    }
});

// ==============================================
// Export functions for external use
// ==============================================

// Make key functions available globally for debugging or external scripts
window.portfolioAPI = {
    smoothScrollTo,
    loadProjects,
    toggleMobileMenu,
    updateActiveNavLink
};
