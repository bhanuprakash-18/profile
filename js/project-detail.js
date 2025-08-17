/**
 * Project Detail Page JavaScript
 * Handles dynamic loading and display of project details
 */

// ==============================================
// Configuration
// ==============================================
const CONFIG = {
    projectsDataPath: './data/projects.json',
    defaultProjectImage: './assets/images/project-placeholder.jpg'
};

// ==============================================
// DOM Elements
// ==============================================
let elements = {};

function initializeElements() {
    elements = {
        pageTitle: document.getElementById('page-title'),
        projectBanner: document.getElementById('project-banner'),
        projectTitle: document.getElementById('project-title'),
        projectStatus: document.getElementById('project-status'),
        projectTimeline: document.getElementById('project-timeline'),
        projectDescription: document.getElementById('project-description'),
        projectProblem: document.getElementById('project-problem'),
        projectHighlights: document.getElementById('project-highlights'),
        projectTechnologies: document.getElementById('project-technologies'),
        projectLinks: document.getElementById('project-links'),
        projectInfo: document.getElementById('project-info'),
        codeSection: document.getElementById('code-section'),
        projectCode: document.getElementById('project-code')
    };
}

// ==============================================
// Main Functions
// ==============================================

/**
 * Initialize the project detail page
 */
async function initializeProjectDetailPage() {
    console.log('Initializing project detail page...');
    
    try {
        // Initialize DOM elements
        initializeElements();
        
        // Get project ID from session storage
        const projectId = sessionStorage.getItem('selectedProjectId');
        
        if (!projectId) {
            showError('No project selected. Redirecting to portfolio...');
            setTimeout(() => {
                window.location.href = './index.html';
            }, 2000);
            return;
        }
        
        // Load and display project details
        await loadProjectDetails(parseInt(projectId));
        
    } catch (error) {
        console.error('Error initializing project detail page:', error);
        showError('Error loading project details. Please try again.');
    }
}

/**
 * Load project details from JSON and display
 * @param {number} projectId - ID of the project to load
 */
async function loadProjectDetails(projectId) {
    try {
        showLoading();
        
        const response = await fetch(CONFIG.projectsDataPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const project = data.projects.find(p => p.id === projectId);
        
        if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
        }
        
        displayProjectDetails(project);
        hideLoading();
        
    } catch (error) {
        console.error('Error loading project details:', error);
        showError('Failed to load project details. Please try again.');
    }
}

/**
 * Display project details on the page
 * @param {Object} project - Project data object
 */
function displayProjectDetails(project) {
    // Update page title
    elements.pageTitle.textContent = `${project.title} - Bhanu Prakash Reddy Chennampalli`;
    
    // Update project banner
    elements.projectBanner.src = project.image || CONFIG.defaultProjectImage;
    elements.projectBanner.alt = `${project.title} banner`;
    
    // Update project title
    elements.projectTitle.textContent = project.title;
    
    // Update project status
    displayProjectStatus(project.status, project.featured);
    
    // Update project timeline
    displayProjectTimeline(project.startDate, project.endDate);
    
    // Update project description
    elements.projectDescription.innerHTML = formatDescription(project);
    
    // Update problem & approach section
    displayProblemAndApproach(project);
    
    // Update highlights
    displayHighlights(project.highlights);
    
    // Update technologies
    displayTechnologies(project.technologies);
    
    // Update project links
    displayProjectLinks(project);
    
    // Update project info
    displayProjectInfo(project);
    
    // Update code examples (if available)
    displayCodeExamples(project);
}

/**
 * Display project status badge
 * @param {string} status - Project status
 * @param {boolean} featured - Whether project is featured
 */
function displayProjectStatus(status, featured) {
    const statusClass = `status-${status}`;
    const featuredBadge = featured ? '<span class="status-badge featured">Featured</span>' : '';
    
    elements.projectStatus.innerHTML = `
        <span class="status-badge ${statusClass}">${capitalizeFirst(status)}</span>
        ${featuredBadge}
    `;
}

/**
 * Display project timeline
 * @param {string} startDate - Project start date
 * @param {string} endDate - Project end date
 */
function displayProjectTimeline(startDate, endDate) {
    const start = new Date(startDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
    });
    const end = new Date(endDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
    });
    
    elements.projectTimeline.innerHTML = `
        <div class="timeline-info">
            <span class="timeline-label">Timeline:</span>
            <span class="timeline-dates">${start} - ${end}</span>
        </div>
    `;
}

/**
 * Format project description with better readability
 * @param {Object} project - Project object with description data
 * @returns {string} Formatted HTML description
 */
function formatDescription(project) {
    // Use detailed description if available, otherwise fall back to regular description
    const description = project.detailedDescription || project.description;
    
    // Split description into paragraphs if it's long
    if (description.length > 300) {
        const sentences = description.split('. ');
        const midPoint = Math.ceil(sentences.length / 2);
        const firstPart = sentences.slice(0, midPoint).join('. ') + '.';
        const secondPart = sentences.slice(midPoint).join('. ');
        
        return `
            <p>${firstPart}</p>
            ${secondPart ? `<p>${secondPart}</p>` : ''}
        `;
    }
    
    return `<p>${description}</p>`;
}

/**
 * Display problem and approach section
 * @param {Object} project - Project data object
 */
function displayProblemAndApproach(project) {
    let problemContent = '';
    
    // Use custom problem statement and approach if available
    if (project.problemStatement && project.approach) {
        problemContent = `
            <div class="approach-section">
                <h4>Challenge</h4>
                <p>${project.problemStatement}</p>
            </div>
            <div class="approach-section">
                <h4>Approach</h4>
                <p>${project.approach}</p>
            </div>
        `;
    } else {
        // Fall back to generic content based on technologies
        if (project.technologies.includes('Machine Learning') || project.technologies.includes('Deep Learning')) {
            problemContent = `
                <div class="approach-section">
                    <h4>Challenge</h4>
                    <p>This project tackled complex machine learning challenges requiring advanced algorithmic solutions and data processing techniques.</p>
                </div>
                <div class="approach-section">
                    <h4>Approach</h4>
                    <p>Applied state-of-the-art machine learning methodologies, implemented robust data pipelines, and conducted comprehensive model evaluation to achieve optimal performance.</p>
                </div>
            `;
        } else if (project.technologies.includes('Flask') || project.technologies.includes('Web Development')) {
            problemContent = `
                <div class="approach-section">
                    <h4>Challenge</h4>
                    <p>Developed a scalable web application solution to address specific business requirements and improve operational efficiency.</p>
                </div>
                <div class="approach-section">
                    <h4>Approach</h4>
                    <p>Engineered a robust full-stack solution with RESTful APIs, implemented efficient data processing pipelines, and ensured seamless user experience.</p>
                </div>
            `;
        } else {
            problemContent = `
                <div class="approach-section">
                    <h4>Challenge</h4>
                    <p>This project addressed complex technical challenges requiring innovative solutions and careful system design.</p>
                </div>
                <div class="approach-section">
                    <h4>Approach</h4>
                    <p>Implemented cutting-edge technologies and methodologies to deliver a comprehensive solution that meets all project requirements.</p>
                </div>
            `;
        }
    }
    
    elements.projectProblem.innerHTML = problemContent;
}

/**
 * Display project highlights
 * @param {Array} highlights - Array of highlight strings
 */
function displayHighlights(highlights) {
    if (!highlights || highlights.length === 0) {
        elements.projectHighlights.innerHTML = '<li>Comprehensive project implementation with attention to detail</li>';
        return;
    }
    
    elements.projectHighlights.innerHTML = highlights
        .map(highlight => `<li>${highlight}</li>`)
        .join('');
}

/**
 * Display project technologies as badges
 * @param {Array} technologies - Array of technology strings
 */
function displayTechnologies(technologies) {
    elements.projectTechnologies.innerHTML = technologies
        .map(tech => `<span class="tech-badge">${tech}</span>`)
        .join('');
}

/**
 * Display project links
 * @param {Object} project - Project data object
 */
function displayProjectLinks(project) {
    let linksHtml = '';
    
    if (project.githubUrl) {
        linksHtml += `
            <a href="${project.githubUrl}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="action-link github-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View Source Code
            </a>
        `;
    }
    
    if (project.liveUrl) {
        linksHtml += `
            <a href="${project.liveUrl}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="action-link demo-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z"/>
                </svg>
                Live Demo
            </a>
        `;
    }
    
    if (!linksHtml) {
        linksHtml = '<p class="no-links">Source code and demo links are not publicly available for this project.</p>';
    }
    
    elements.projectLinks.innerHTML = linksHtml;
}

/**
 * Display project meta information
 * @param {Object} project - Project data object
 */
function displayProjectInfo(project) {
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 30)); // months
    
    elements.projectInfo.innerHTML = `
        <div class="info-item">
            <span class="info-label">Project ID:</span>
            <span class="info-value">#${project.id.toString().padStart(3, '0')}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Duration:</span>
            <span class="info-value">${duration} month${duration !== 1 ? 's' : ''}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Status:</span>
            <span class="info-value">${capitalizeFirst(project.status)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Technologies:</span>
            <span class="info-value">${project.technologies.length} tools</span>
        </div>
    `;
}

/**
 * Display code examples if available
 * @param {Object} project - Project data object
 */
function displayCodeExamples(project) {
    if (project.codeExamples && project.codeExamples.length > 0) {
        elements.codeSection.style.display = 'block';
        
        const codeExamplesHtml = project.codeExamples.map(example => `
            <div class="code-example">
                <div class="code-header">
                    <h4>${example.title}</h4>
                    <span class="code-language">${example.language}</span>
                </div>
                <p class="code-description">${example.description}</p>
                <div class="code-block">
                    <pre><code class="language-${example.language}">${example.snippet}</code></pre>
                    <button class="copy-code-btn" onclick="copyCodeToClipboard(this)" aria-label="Copy code">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
        
        elements.projectCode.innerHTML = codeExamplesHtml;
    } else if (project.githubUrl) {
        elements.codeSection.style.display = 'block';
        elements.projectCode.innerHTML = `
            <div class="code-placeholder">
                <div class="code-info">
                    <h4>Source Code Available</h4>
                    <p>Detailed implementation and code examples are available in the project repository.</p>
                    <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="code-link">
                        View on GitHub →
                    </a>
                </div>
            </div>
        `;
    } else {
        elements.codeSection.style.display = 'none';
    }
}

/**
 * Copy code to clipboard
 * @param {HTMLElement} button - The copy button element
 */
function copyCodeToClipboard(button) {
    const codeBlock = button.parentElement.querySelector('code');
    const text = codeBlock.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        // Show success feedback
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
        `;
        button.style.color = '#10b981';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code: ', err);
    });
}

// Make copy function available globally
window.copyCodeToClipboard = copyCodeToClipboard;

// ==============================================
// Utility Functions
// ==============================================

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Show loading state
 */
function showLoading() {
    document.body.classList.add('loading');
    
    // Create loading overlay if it doesn't exist
    if (!document.querySelector('.loading-overlay')) {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading project details...</p>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
    }
}

/**
 * Hide loading state
 */
function hideLoading() {
    document.body.classList.remove('loading');
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    hideLoading();
    
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-container';
    errorContainer.innerHTML = `
        <div class="error-message">
            <h2>Oops! Something went wrong</h2>
            <p>${message}</p>
            <a href="./index.html" class="btn btn-primary">← Back to Portfolio</a>
        </div>
    `;
    
    document.querySelector('.project-detail-main').innerHTML = '';
    document.querySelector('.project-detail-main').appendChild(errorContainer);
}

// ==============================================
// Initialize on DOM Ready
// ==============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProjectDetailPage);
} else {
    initializeProjectDetailPage();
}

// Handle browser back button
window.addEventListener('popstate', () => {
    // Clear session storage when navigating back
    sessionStorage.removeItem('selectedProjectId');
});
