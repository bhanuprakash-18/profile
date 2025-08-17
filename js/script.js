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
    projectsDataPath: './data/projects.json',
    blogsDataPath: './data/blogs.json'
};

// ==============================================
// DOM Elements
// ==============================================
let elements = {};

// Initialize DOM elements after DOM is loaded
function initializeElements() {
    elements = {
        navbar: document.getElementById('navbar'),
        navMenu: document.getElementById('nav-menu'),
        hamburger: document.getElementById('hamburger'),
        navLinks: document.querySelectorAll('.nav-link'),
        projectsGrid: document.getElementById('projects-grid'),
        blogsGrid: document.getElementById('blogs-grid'),
        contactForm: document.getElementById('contact-form'),
        sectionsToAnimate: document.querySelectorAll('.fade-in')
    };
}

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
 * Navigate to project detail page
 * @param {number} projectId - ID of the project to view
 */
function navigateToProjectDetail(projectId) {
    // Store the project ID in session storage for the detail page
    sessionStorage.setItem('selectedProjectId', projectId);
    
    // Navigate to the project detail page
    window.location.href = './project-detail.html';
}

// Make the function available globally
window.navigateToProjectDetail = navigateToProjectDetail;

/**
 * Load and display projects from JSON file
 */
async function loadProjects() {
    console.log('Loading projects...');
    console.log('Projects grid element:', elements.projectsGrid);
    
    try {
        showProjectsLoading();
        
        const response = await fetch(CONFIG.projectsDataPath);
        console.log('Fetch response:', response);
        console.log('Fetch URL:', CONFIG.projectsDataPath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Projects data:', data);
        
        if (data.projects && Array.isArray(data.projects)) {
            console.log('Found projects:', data.projects.length);
            displayProjects(data.projects);
        } else {
            throw new Error('Invalid projects data structure');
        }
        
    } catch (error) {
        console.error('Error loading projects:', error);
        console.log('Will show error state and sample project');
        showProjectsError();
    }
}

/**
 * Display projects in the grid
 * @param {Array} projects - Array of project objects
 */
function displayProjects(projects) {
    console.log('Displaying projects:', projects.length);
    if (!elements.projectsGrid) {
        console.error('Projects grid element not found!');
        return;
    }
    
    elements.projectsGrid.innerHTML = '';
    
    // Store all projects globally for expand/contract functionality
    window.allProjects = projects;
    
    // Initially show only top 3 projects
    const initialProjects = projects.slice(0, 3);
    
    initialProjects.forEach((project, index) => {
        console.log('Creating card for project:', project.title);
        const projectCard = createProjectCard(project, index);
        elements.projectsGrid.appendChild(projectCard);
    });
    
    // Add "View More Projects" button if there are more than 3 projects
    if (projects.length > 3) {
        const viewMoreContainer = document.createElement('div');
        viewMoreContainer.className = 'view-more-container';
        viewMoreContainer.innerHTML = `
            <button class="btn-view-more-projects" onclick="toggleProjectsView()">
                View More Projects (${projects.length - 3} more)
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                </svg>
            </button>
        `;
        elements.projectsGrid.appendChild(viewMoreContainer);
    }
    
    // Add animation class to new cards with staggered effect
    const newCards = elements.projectsGrid.querySelectorAll('.project-card');
    console.log('Created cards:', newCards.length);
    newCards.forEach((card, index) => {
        card.classList.add('fade-in');
        // Staggered animation with a more dynamic delay
        setTimeout(() => {
            card.classList.add('visible');
            // Add a subtle bounce effect
            card.style.animation = `cardSlideIn 0.6s ease-out ${index * 0.1}s both`;
        }, index * 100);
    });
    
    console.log('Projects displayed successfully!');
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
    
    // Create short description (first 120 characters)
    const shortDescription = project.description.length > 120 
        ? project.description.substring(0, 120) + '...' 
        : project.description;
    
    // Show only first 4 technologies
    const displayTechnologies = project.technologies.slice(0, 4);
    const hasMoreTech = project.technologies.length > 4;
    
    card.innerHTML = `
        <div class="project-image">
            <img src="${project.image || './assets/images/project-placeholder.jpg'}" 
                 alt="${project.title}" 
                 loading="lazy"
                 onerror="this.src='./assets/images/project-placeholder.jpg'">
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${shortDescription}</p>
            <div class="project-tech">
                ${displayTechnologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                ${hasMoreTech ? `<span class="tech-tag more-tech">+${project.technologies.length - 4} more</span>` : ''}
            </div>
            <div class="project-actions">
                <button class="btn-view-details" data-project-id="${project.id}" aria-label="View details for ${project.title}">
                    View More Details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    // Add click event listener to the button
    const viewDetailsBtn = card.querySelector('.btn-view-details');
    viewDetailsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Add loading state
        viewDetailsBtn.classList.add('loading');
        viewDetailsBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            Loading...
        `;
        
        // Add a slight delay for better UX
        setTimeout(() => {
            navigateToProjectDetail(project.id);
        }, 300);
    });
    
    // Add hover effect for the entire card
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
    
    return card;
}

/**
 * Show loading state for projects
 */
function showProjectsLoading() {
    console.log('Showing projects loading state...');
    if (!elements.projectsGrid) {
        console.error('Projects grid element not found!');
        return;
    }
    
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
    console.log('Showing projects error state...');
    if (!elements.projectsGrid) {
        console.error('Projects grid element not found!');
        return;
    }
    
    elements.projectsGrid.innerHTML = `
        <div class="projects-error">
            <p>Sorry, there was an error loading the projects.</p>
            <button onclick="loadProjects()" class="btn btn-primary">Try Again</button>
        </div>
    `;
    
    // Add a sample project as fallback
    const sampleProject = {
        id: 1,
        title: "Sample Project",
        description: "This is a sample project to demonstrate the project card functionality. Click 'View More Details' to see the project detail page.",
        technologies: ["JavaScript", "HTML", "CSS", "Sample Tech"],
        image: "./assets/images/project-placeholder.jpg"
    };
    
    const sampleCard = createProjectCard(sampleProject, 0);
    elements.projectsGrid.appendChild(sampleCard);
}

/**
 * Test function to create a sample project card
 */
function testProjectCard() {
    console.log('Creating test project card...');
    
    const testProject = {
        id: 999,
        title: "Test Project",
        description: "This is a test project to verify the View More Details button is working correctly. This description is intentionally long to test the truncation functionality.",
        technologies: ["JavaScript", "HTML", "CSS", "Testing", "Debug"]
    };
    
    if (elements.projectsGrid) {
        elements.projectsGrid.innerHTML = '';
        const testCard = createProjectCard(testProject, 0);
        elements.projectsGrid.appendChild(testCard);
        console.log('Test project card created!');
    } else {
        console.error('Projects grid not found!');
    }
}

// Make test function available globally
window.testProjectCard = testProjectCard;

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
async function handleContactFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!validateContactForm(formValues)) {
        return;
    }
    
    // Show loading state
    showFormLoading(true);
    
    try {
        // Submit to Formspree
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            showFormSuccess();
            form.reset();
            
            // Announce success to screen readers
            if (window.announceToScreenReader) {
                window.announceToScreenReader('Message sent successfully');
            }
        } else {
            const data = await response.json();
            if (data.errors) {
                // Handle validation errors from Formspree
                data.errors.forEach(error => {
                    if (error.field) {
                        showFieldError(error.field, error.message);
                    }
                });
            } else {
                throw new Error('Failed to send message');
            }
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showFormError('There was an error sending your message. Please try again or contact me directly via email.');
        
        // Announce error to screen readers
        if (window.announceToScreenReader) {
            window.announceToScreenReader('Error sending message. Please try again.');
        }
    } finally {
        showFormLoading(false);
    }
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
    
    // Remove any existing messages
    const existingMessages = formContainer.querySelectorAll('.form-success, .form-error');
    existingMessages.forEach(msg => msg.remove());
    
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <div class="success-icon">✓</div>
        <h3>Message Sent Successfully!</h3>
        <p>Thank you for reaching out. I'll get back to you soon.</p>
    `;
    
    formContainer.appendChild(successMessage);
    
    // Remove success message after 8 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 8000);
}

/**
 * Show form error message
 * @param {string} message - Error message to display
 */
function showFormError(message) {
    const formContainer = elements.contactForm.parentElement;
    
    // Remove any existing messages
    const existingMessages = formContainer.querySelectorAll('.form-success, .form-error');
    existingMessages.forEach(msg => msg.remove());
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'form-error';
    errorMessage.innerHTML = `
        <div class="error-icon">⚠</div>
        <h3>Message Not Sent</h3>
        <p>${message}</p>
        <p>You can also reach me directly at: <a href="mailto:bhanupr1@uni-bremen.de" class="contact-link">bhanupr1@uni-bremen.de</a></p>
    `;
    
    formContainer.appendChild(errorMessage);
    
    // Remove error message after 10 seconds
    setTimeout(() => {
        errorMessage.remove();
    }, 10000);
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
        // Initialize DOM elements first
        initializeElements();
        
        // Core functionality
        initializeNavigation();
        initializeScrollAnimations();
        initializeContactForm();
        
        // Load dynamic content
        loadProjects();
        loadBlogs();
        
        // Initialize enhanced button effects
        setTimeout(() => {
            initializeEnhancedButtons();
        }, 500);
        
        // Failsafe: Check if projects loaded after 3 seconds
        setTimeout(() => {
            if (elements.projectsGrid && elements.projectsGrid.children.length === 0) {
                console.log('Projects not loaded, trying fallback...');
                testProjectCard();
            }
            // Re-initialize enhanced buttons for any dynamically added content
            initializeEnhancedButtons();
        }, 3000);
        
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
// Projects View Toggle Functions
// ==============================================

/**
 * Toggle between showing 3 projects and all projects
 */
function toggleProjectsView() {
    const viewMoreBtn = document.querySelector('.btn-view-more-projects');
    const currentCards = elements.projectsGrid.querySelectorAll('.project-card');
    const isExpanded = currentCards.length > 3;
    
    if (isExpanded) {
        // Contract: Show only first 3 projects
        contractProjectsView();
    } else {
        // Expand: Show all projects
        expandProjectsView();
    }
}

/**
 * Expand to show all projects
 */
function expandProjectsView() {
    if (!window.allProjects) return;
    
    const viewMoreBtn = document.querySelector('.btn-view-more-projects');
    const viewMoreContainer = document.querySelector('.view-more-container');
    
    // Add loading state to button
    viewMoreBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        Loading...
    `;
    viewMoreBtn.disabled = true;
    
    setTimeout(() => {
        // Remove the view more container temporarily
        if (viewMoreContainer) {
            viewMoreContainer.remove();
        }
        
        // Add remaining projects (starting from index 3)
        const remainingProjects = window.allProjects.slice(3);
        remainingProjects.forEach((project, index) => {
            const projectCard = createProjectCard(project, index + 3);
            projectCard.style.opacity = '0';
            projectCard.style.transform = 'translateY(30px)';
            elements.projectsGrid.appendChild(projectCard);
            
            // Animate in the new cards
            setTimeout(() => {
                projectCard.style.transition = 'all 0.6s ease-out';
                projectCard.style.opacity = '1';
                projectCard.style.transform = 'translateY(0)';
                projectCard.classList.add('visible');
            }, index * 100);
        });
        
        // Add "Show Less" button
        setTimeout(() => {
            const showLessContainer = document.createElement('div');
            showLessContainer.className = 'view-more-container';
            showLessContainer.innerHTML = `
                <button class="btn-view-more-projects" onclick="toggleProjectsView()">
                    Show Less Projects
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m18 15-6-6-6 6"/>
                    </svg>
                </button>
            `;
            elements.projectsGrid.appendChild(showLessContainer);
            
            // Re-initialize enhanced buttons for new button
            setTimeout(() => {
                initializeEnhancedButtons();
            }, 100);
        }, remainingProjects.length * 100 + 200);
        
    }, 500);
}

/**
 * Contract to show only first 3 projects
 */
function contractProjectsView() {
    if (!window.allProjects) return;
    
    const allCards = elements.projectsGrid.querySelectorAll('.project-card');
    const viewMoreContainer = document.querySelector('.view-more-container');
    
    // Animate out cards beyond the first 3
    const cardsToRemove = Array.from(allCards).slice(3);
    
    cardsToRemove.forEach((card, index) => {
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease-in';
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                card.remove();
            }, 400);
        }, index * 50);
    });
    
    // Remove current button
    if (viewMoreContainer) {
        setTimeout(() => {
            viewMoreContainer.remove();
            
            // Add "View More Projects" button back
            const newViewMoreContainer = document.createElement('div');
            newViewMoreContainer.className = 'view-more-container';
            newViewMoreContainer.innerHTML = `
                <button class="btn-view-more-projects" onclick="toggleProjectsView()">
                    View More Projects (${window.allProjects.length - 3} more)
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                    </svg>
                </button>
            `;
            elements.projectsGrid.appendChild(newViewMoreContainer);
            
            // Re-initialize enhanced buttons for new button
            setTimeout(() => {
                initializeEnhancedButtons();
            }, 100);
        }, cardsToRemove.length * 50 + 200);
    }
}

// ==============================================
// Blog Functions
// ==============================================

/**
 * Load blogs from JSON file
 */
async function loadBlogs() {
    try {
        console.log('Loading blogs...');
        showBlogsLoading();
        
        const response = await fetch(CONFIG.blogsDataPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blogs = await response.json();
        console.log('Blogs loaded successfully:', blogs.length, 'blogs found');
        
        // Store all blogs globally for potential future use
        window.allBlogs = blogs;
        
        displayBlogs(blogs);
        
    } catch (error) {
        console.error('Error loading blogs:', error);
        showBlogError();
    }
}

/**
 * Display blogs in the grid
 * @param {Array} blogs - Array of blog objects
 */
function displayBlogs(blogs) {
    if (!elements.blogsGrid) {
        console.warn('Blogs grid element not found');
        return;
    }

    // Clear any existing content
    elements.blogsGrid.innerHTML = '';
    
    if (!blogs || blogs.length === 0) {
        elements.blogsGrid.innerHTML = `
            <div class="no-blogs-message">
                <h3>No blogs available</h3>
                <p>Check back later for new blog posts!</p>
            </div>
        `;
        return;
    }

    // Show only top 3 featured or latest blogs on home page
    const initialBlogs = blogs.slice(0, 3);
    
    initialBlogs.forEach((blog, index) => {
        console.log('Creating card for blog:', blog.title);
        const blogCard = createBlogCard(blog, index);
        elements.blogsGrid.appendChild(blogCard);
    });
    
    // Add "View More Blogs" button if there are more than 3 blogs
    if (blogs.length > 3) {
        const viewMoreContainer = document.createElement('div');
        viewMoreContainer.className = 'view-more-container';
        viewMoreContainer.innerHTML = `
            <button class="btn-view-more-projects" onclick="toggleBlogsView()">
                View More Blogs (${blogs.length - 3} more)
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                </svg>
            </button>
        `;
        elements.blogsGrid.appendChild(viewMoreContainer);
    }
    
    // Add animation class to new cards with staggered effect
    const newCards = elements.blogsGrid.querySelectorAll('.blog-card');
    console.log('Created blog cards:', newCards.length);
    newCards.forEach((card, index) => {
        card.classList.add('fade-in');
        // Staggered animation with a more dynamic delay
        setTimeout(() => {
            card.classList.add('visible');
            // Add a subtle entrance effect
            card.style.animation = `cardSlideIn 0.6s ease-out ${index * 0.1}s both`;
        }, index * 100);
    });
    
    console.log('Blogs displayed successfully!');
}

/**
 * Create a blog card element
 * @param {Object} blog - Blog data object
 * @param {number} index - Blog index for animation delay
 * @returns {HTMLElement} Blog card element
 */
function createBlogCard(blog, index) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.style.animationDelay = `${index * 150}ms`;
    
    // Create short description (first 150 characters)
    const shortDescription = blog.shortDescription.length > 150 
        ? blog.shortDescription.substring(0, 150) + '...' 
        : blog.shortDescription;
    
    // Show only first 4 keywords
    const displayKeywords = blog.keywords.slice(0, 4);
    const hasMoreKeywords = blog.keywords.length > 4;
    
    // Format date
    const publishDate = new Date(blog.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    card.innerHTML = `
        <div class="blog-card-image">
            <img src="${blog.image || './assets/images/blog-placeholder.jpg'}" 
                 alt="${blog.title}" 
                 loading="lazy"
                 onerror="this.src='./assets/images/blog-placeholder.jpg'">
        </div>
        <div class="blog-card-content">
            <div class="blog-card-meta">
                <span class="blog-card-category">${blog.category}</span>
                <span class="blog-card-date">${publishDate}</span>
                <span class="blog-card-read-time">${blog.readTime}</span>
            </div>
            <h3 class="blog-card-title">${blog.title}</h3>
            <p class="blog-card-description">${shortDescription}</p>
            <div class="blog-keywords">
                ${displayKeywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
                ${hasMoreKeywords ? `<span class="keyword-tag more-keywords">+${blog.keywords.length - 4} more</span>` : ''}
            </div>
            <div class="blog-card-actions">
                <button class="btn-read-blog" data-blog-id="${blog.id}" aria-label="Read blog: ${blog.title}">
                    Read More
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    // Add click event listener to the button
    const readBlogBtn = card.querySelector('.btn-read-blog');
    readBlogBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Add loading state
        readBlogBtn.classList.add('loading');
        readBlogBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            Loading...
        `;
        
        // Add a slight delay for better UX
        setTimeout(() => {
            navigateToBlogDetail(blog.id);
        }, 300);
    });
    
    // Add hover effect for the entire card
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
    
    return card;
}

/**
 * Navigate to blog detail page
 * @param {string} blogId - Blog ID
 */
function navigateToBlogDetail(blogId) {
    // Store the blog ID in sessionStorage for the detail page
    sessionStorage.setItem('selectedBlogId', blogId);
    // Navigate to blog detail page
    window.location.href = `blog-detail.html?id=${blogId}`;
}

/**
 * Show loading state for blogs
 */
function showBlogsLoading() {
    console.log('Showing blogs loading state...');
    if (elements.blogsGrid) {
        elements.blogsGrid.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner">
                    <div class="spinner"></div>
                </div>
                <p>Loading latest blogs...</p>
            </div>
        `;
    }
}

/**
 * Show error state for blogs
 */
function showBlogError() {
    console.log('Showing blog error state...');
    if (elements.blogsGrid) {
        elements.blogsGrid.innerHTML = `
            <div class="error-state">
                <h3>Unable to load blogs</h3>
                <p>Please check your connection and try again.</p>
                <button onclick="loadBlogs()" class="retry-btn">
                    Try Again
                </button>
            </div>
        `;
    }
}

/**
 * Toggle between showing 3 blogs and all blogs
 */
function toggleBlogsView() {
    const viewMoreBtn = document.querySelector('.btn-view-more-projects');
    const currentCards = elements.blogsGrid.querySelectorAll('.blog-card');
    const isExpanded = currentCards.length > 3;
    
    if (isExpanded) {
        // Contract: Show only first 3 blogs
        contractBlogsView();
    } else {
        // Expand: Show all blogs
        expandBlogsView();
    }
}

/**
 * Expand to show all blogs
 */
function expandBlogsView() {
    if (!window.allBlogs) return;
    
    const viewMoreBtn = document.querySelector('.btn-view-more-projects');
    const viewMoreContainer = document.querySelector('.view-more-container');
    
    // Add loading state to button
    viewMoreBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        Loading...
    `;
    viewMoreBtn.disabled = true;
    
    setTimeout(() => {
        // Remove the view more container temporarily
        if (viewMoreContainer) {
            viewMoreContainer.remove();
        }
        
        // Add remaining blogs (starting from index 3)
        const remainingBlogs = window.allBlogs.slice(3);
        remainingBlogs.forEach((blog, index) => {
            const blogCard = createBlogCard(blog, index + 3);
            blogCard.style.opacity = '0';
            blogCard.style.transform = 'translateY(30px)';
            elements.blogsGrid.appendChild(blogCard);
            
            // Animate in the new cards
            setTimeout(() => {
                blogCard.style.transition = 'all 0.6s ease-out';
                blogCard.style.opacity = '1';
                blogCard.style.transform = 'translateY(0)';
                blogCard.classList.add('visible');
            }, index * 100);
        });
        
        // Add "Show Less" button
        setTimeout(() => {
            const showLessContainer = document.createElement('div');
            showLessContainer.className = 'view-more-container';
            showLessContainer.innerHTML = `
                <button class="btn-view-more-projects" onclick="toggleBlogsView()">
                    Show Less Blogs
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m18 15-6-6-6 6"/>
                    </svg>
                </button>
            `;
            elements.blogsGrid.appendChild(showLessContainer);
            
            // Re-initialize enhanced buttons for new button
            setTimeout(() => {
                initializeEnhancedButtons();
            }, 100);
        }, remainingBlogs.length * 100 + 200);
        
    }, 500);
}

/**
 * Contract to show only first 3 blogs
 */
function contractBlogsView() {
    if (!window.allBlogs) return;
    
    const allCards = elements.blogsGrid.querySelectorAll('.blog-card');
    const viewMoreContainer = document.querySelector('.view-more-container');
    
    // Animate out cards beyond the first 3
    const cardsToRemove = Array.from(allCards).slice(3);
    
    cardsToRemove.forEach((card, index) => {
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease-in';
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                card.remove();
            }, 400);
        }, index * 50);
    });
    
    // Remove current button
    if (viewMoreContainer) {
        setTimeout(() => {
            viewMoreContainer.remove();
            
            // Add "View More Blogs" button back
            const newViewMoreContainer = document.createElement('div');
            newViewMoreContainer.className = 'view-more-container';
            newViewMoreContainer.innerHTML = `
                <button class="btn-view-more-projects" onclick="toggleBlogsView()">
                    View More Blogs (${window.allBlogs.length - 3} more)
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                    </svg>
                </button>
            `;
            elements.blogsGrid.appendChild(newViewMoreContainer);
            
            // Re-initialize enhanced buttons for new button
            setTimeout(() => {
                initializeEnhancedButtons();
            }, 100);
        }, cardsToRemove.length * 50 + 200);
    }
}

// Make blog functions available globally
window.toggleBlogsView = toggleBlogsView;
window.expandBlogsView = expandBlogsView;
window.contractBlogsView = contractBlogsView;
window.navigateToBlogDetail = navigateToBlogDetail;

/**
 * Enhanced Button Interactions
 * Adds ripple effects, magnetic hover, and particle animations
 */

/**
 * Create ripple effect on button click
 * @param {HTMLElement} button - Button element
 * @param {Event} event - Click event
 */
function createRippleEffect(button, event) {
    const ripple = document.createElement('div');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        background-color: rgba(255, 255, 255, 0.6);
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 10;
    `;
    
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

/**
 * Add magnetic hover effect to button
 * @param {HTMLElement} button - Button element
 */
function addMagneticEffect(button) {
    let isHovering = false;
    
    button.addEventListener('mouseenter', () => {
        isHovering = true;
    });
    
    button.addEventListener('mouseleave', () => {
        isHovering = false;
        button.style.transform = '';
    });
    
    button.addEventListener('mousemove', (e) => {
        if (!isHovering) return;
        
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.1;
        const deltaY = (e.clientY - centerY) * 0.1;
        
        button.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
    });
}

/**
 * Create floating particles around element
 * @param {HTMLElement} element - Element to add particles to
 */
function createFloatingParticles(element) {
    const particleCount = 8;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.8), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            animation: floatParticle ${3 + Math.random() * 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        
        element.appendChild(particle);
        particles.push(particle);
        
        // Random initial position around the button
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 50 + Math.random() * 30;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        particle.style.left = `calc(50% + ${x}px)`;
        particle.style.top = `calc(50% + ${y}px)`;
    }
    
    return particles;
}

/**
 * Initialize enhanced button effects
 */
function initializeEnhancedButtons() {
    // Add ripple effect to all buttons
    document.addEventListener('click', (e) => {
        if (e.target.matches('.btn-view-details, .btn-view-more-projects') || 
            e.target.closest('.btn-view-details, .btn-view-more-projects')) {
            const button = e.target.closest('.btn-view-details, .btn-view-more-projects') || e.target;
            createRippleEffect(button, e);
        }
    });
    
    // Add magnetic effects to existing buttons
    const enhancedButtons = document.querySelectorAll('.btn-view-details, .btn-view-more-projects');
    enhancedButtons.forEach(button => {
        addMagneticEffect(button);
        
        // Add relative positioning for particles
        button.style.position = 'relative';
        
        // Create particles on hover
        let particles = [];
        button.addEventListener('mouseenter', () => {
            if (particles.length === 0) {
                particles = createFloatingParticles(button);
            }
        });
        
        button.addEventListener('mouseleave', () => {
            // Remove particles after delay
            setTimeout(() => {
                particles.forEach(particle => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                });
                particles = [];
            }, 1000);
        });
    });
}

// Add CSS for particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes floatParticle {
        0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.6;
        }
        25% {
            transform: translateY(-20px) scale(1.2);
            opacity: 1;
        }
        50% {
            transform: translateY(-40px) scale(0.8);
            opacity: 0.8;
        }
        75% {
            transform: translateY(-20px) scale(1.1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(particleStyle);

// Initialize enhanced button effects
initializeEnhancedButtons();
