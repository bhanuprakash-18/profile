/**
 * Blog Detail Page JavaScript
 * Features: Dynamic blog loading, related blogs, navigation
 */

// ==============================================
// Global Variables and Configuration
// ==============================================
const CONFIG = {
    blogsDataPath: './data/blogs.json'
};

let currentBlog = null;
let allBlogs = [];

// ==============================================
// Utility Functions
// ==============================================

/**
 * Get URL parameters
 * @param {string} param - Parameter name
 * @returns {string|null} Parameter value
 */
function getURLParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Format date string
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Estimate reading time based on content length
 * @param {string} content - Blog content
 * @returns {string} Reading time estimate
 */
function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
}

/**
 * Convert markdown-like content to HTML
 * @param {string} content - Content with markdown syntax
 * @returns {string} HTML content
 */
function convertMarkdownToHTML(content) {
    return content
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Code blocks
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
        // Inline code
        .replace(/`(.*?)`/g, '<code>$1</code>')
        // Line breaks
        .replace(/\n\n/g, '</p><p>')
        // Lists
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
        // Links (basic)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

// ==============================================
// Blog Loading Functions
// ==============================================

/**
 * Load blog data from JSON file
 */
async function loadBlogData() {
    try {
        console.log('Loading blog data...');
        const response = await fetch(CONFIG.blogsDataPath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allBlogs = await response.json();
        console.log('Blog data loaded successfully:', allBlogs.length, 'blogs');
        
        return allBlogs;
    } catch (error) {
        console.error('Error loading blog data:', error);
        showErrorMessage('Failed to load blog data. Please try again later.');
        return [];
    }
}

/**
 * Find blog by ID
 * @param {string} blogId - Blog ID to find
 * @returns {Object|null} Blog object or null if not found
 */
function findBlogById(blogId) {
    return allBlogs.find(blog => blog.id === blogId) || null;
}

/**
 * Display blog content
 * @param {Object} blog - Blog object
 */
function displayBlogContent(blog) {
    const blogContent = document.getElementById('blog-content');
    
    if (!blog) {
        blogContent.innerHTML = `
            <div class="error-message">
                <h1>Blog Not Found</h1>
                <p>The blog post you're looking for doesn't exist.</p>
                <button onclick="goBack()" class="back-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m12 19-7-7 7-7"/>
                        <path d="M19 12H5"/>
                    </svg>
                    Back to Blogs
                </button>
            </div>
        `;
        return;
    }

    // Update page title
    document.title = `${blog.title} - Bhanuprakash Portfolio`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = blog.shortDescription;
    }

    // Convert content to HTML
    const htmlContent = convertMarkdownToHTML(blog.fullContent);
    
    // Display blog content
    blogContent.innerHTML = `
        <header class="blog-header">
            <div class="blog-meta">
                <span class="blog-category">${blog.category}</span>
                <span class="blog-date">${formatDate(blog.publishDate)}</span>
                <span class="blog-read-time">${blog.readTime}</span>
            </div>
            <h1 class="blog-title">${blog.title}</h1>
            <p class="blog-description">${blog.shortDescription}</p>
            <div class="blog-author">
                <span>By ${blog.author}</span>
            </div>
        </header>

        <div class="blog-image">
            <img src="${blog.image || './assets/images/blog-placeholder.jpg'}" 
                 alt="${blog.title}" 
                 onerror="this.src='./assets/images/blog-placeholder.jpg'">
        </div>

        <div class="blog-keywords">
            <h3>Topics Covered:</h3>
            <div class="keywords-list">
                ${blog.keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
            </div>
        </div>

        <div class="blog-content">
            <p>${htmlContent}</p>
        </div>

        <footer class="blog-footer">
            <div class="blog-tags">
                <h4>Tags:</h4>
                ${blog.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
            </div>
            <div class="blog-share">
                <h4>Share this blog:</h4>
                <div class="share-buttons">
                    <button onclick="shareOnTwitter('${blog.title}', '${blog.shortDescription}')" class="share-btn twitter" aria-label="Share on Twitter">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                    </button>
                    <button onclick="shareOnLinkedIn('${blog.title}', '${blog.shortDescription}')" class="share-btn linkedin" aria-label="Share on LinkedIn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </button>
                    <button onclick="copyBlogLink()" class="share-btn copy" aria-label="Copy link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                    </button>
                </div>
            </div>
        </footer>
    `;

    // Add animation to content
    setTimeout(() => {
        blogContent.classList.add('visible');
    }, 100);
}

/**
 * Display related blogs
 * @param {Object} currentBlog - Current blog object
 */
function displayRelatedBlogs(currentBlog) {
    const relatedBlogsGrid = document.getElementById('related-blogs-grid');
    
    // Find related blogs based on category and keywords
    const relatedBlogs = allBlogs
        .filter(blog => blog.id !== currentBlog.id)
        .filter(blog => 
            blog.category === currentBlog.category || 
            blog.keywords.some(keyword => currentBlog.keywords.includes(keyword))
        )
        .slice(0, 3);

    if (relatedBlogs.length === 0) {
        document.getElementById('related-blogs').style.display = 'none';
        return;
    }

    relatedBlogsGrid.innerHTML = relatedBlogs.map((blog, index) => `
        <div class="related-blog-card" style="animation-delay: ${index * 0.1}s">
            <div class="blog-card-image">
                <img src="${blog.image || './assets/images/blog-placeholder.jpg'}" 
                     alt="${blog.title}" 
                     loading="lazy"
                     onerror="this.src='./assets/images/blog-placeholder.jpg'">
            </div>
            <div class="blog-card-content">
                <div class="blog-card-meta">
                    <span class="blog-card-category">${blog.category}</span>
                    <span class="blog-card-date">${formatDate(blog.publishDate)}</span>
                </div>
                <h3 class="blog-card-title">${blog.title}</h3>
                <p class="blog-card-description">${blog.shortDescription.substring(0, 120)}...</p>
                <div class="blog-card-actions">
                    <button class="btn-read-blog" onclick="navigateToBlogDetail('${blog.id}')" aria-label="Read blog: ${blog.title}">
                        Read More
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m9 18 6-6-6-6"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ==============================================
// Navigation Functions
// ==============================================

/**
 * Navigate to blog detail page
 * @param {string} blogId - Blog ID
 */
function navigateToBlogDetail(blogId) {
    window.location.href = `blog-detail.html?id=${blogId}`;
}

/**
 * Go back to previous page or blogs section
 */
function goBack() {
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
        window.history.back();
    } else {
        window.location.href = 'index.html#blogs';
    }
}

// ==============================================
// Share Functions
// ==============================================

/**
 * Share on Twitter
 * @param {string} title - Blog title
 * @param {string} description - Blog description
 */
function shareOnTwitter(title, description) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${title} - ${description}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

/**
 * Share on LinkedIn
 * @param {string} title - Blog title
 * @param {string} description - Blog description
 */
function shareOnLinkedIn(title, description) {
    const url = encodeURIComponent(window.location.href);
    const title_encoded = encodeURIComponent(title);
    const summary = encodeURIComponent(description);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title_encoded}&summary=${summary}`, '_blank');
}

/**
 * Copy blog link to clipboard
 */
function copyBlogLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        // Show temporary feedback
        const copyBtn = document.querySelector('.share-btn.copy');
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20,6 9,17 4,12"/>
            </svg>
        `;
        copyBtn.style.background = 'var(--color-primary)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy link:', err);
    });
}

// ==============================================
// Error Handling
// ==============================================

/**
 * Show error message
 * @param {string} message - Error message
 */
function showErrorMessage(message) {
    const blogContent = document.getElementById('blog-content');
    blogContent.innerHTML = `
        <div class="error-message">
            <h1>Error</h1>
            <p>${message}</p>
            <button onclick="location.reload()" class="retry-btn">Try Again</button>
        </div>
    `;
}

/**
 * Hide loading screen
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 300);
    }
}

// ==============================================
// Initialization
// ==============================================

/**
 * Initialize blog detail page
 */
async function initializeBlogDetail() {
    console.log('Initializing blog detail page...');
    
    try {
        // Get blog ID from URL
        const blogId = getURLParameter('id');
        if (!blogId) {
            throw new Error('No blog ID provided');
        }

        // Load blog data
        await loadBlogData();
        
        // Find and display the blog
        currentBlog = findBlogById(blogId);
        displayBlogContent(currentBlog);
        
        if (currentBlog) {
            displayRelatedBlogs(currentBlog);
        }
        
        // Hide loading screen
        hideLoadingScreen();
        
        console.log('Blog detail page initialized successfully');
        
    } catch (error) {
        console.error('Error initializing blog detail page:', error);
        showErrorMessage('Failed to load blog content. Please try again.');
        hideLoadingScreen();
    }
}

// ==============================================
// Event Listeners
// ==============================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBlogDetail);
} else {
    initializeBlogDetail();
}

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const blogId = getURLParameter('id');
    if (blogId && currentBlog && currentBlog.id !== blogId) {
        location.reload();
    }
});
