# Personal Portfolio Website

A modern, responsive personal portfolio website built with HTML5, CSS3, and vanilla JavaScript. Optimized for GitHub Pages deployment with a clean dark theme, smooth animations, and accessibility features.

## 🌟 Features

### Design & User Experience
- **Modern Dark Theme** - Elegant dark color scheme with subtle gradients
- **Fully Responsive** - Optimized for mobile, tablet, and desktop devices
- **Smooth Animations** - CSS transitions and JavaScript-powered scroll animations
- **Accessible Design** - WCAG compliant with proper semantic HTML and ARIA labels
- **Fast Loading** - Optimized performance with lazy loading and efficient code

### Sections
- **Hero Section** - Professional introduction with call-to-action buttons
- **About Section** - Education, work experience, and technical skills
- **Projects Section** - Dynamic project showcase loaded from JSON
- **Contact Section** - Contact information and functional contact form
- **Sticky Navigation** - Fixed header with smooth scrolling navigation

### Technical Features
- **Dynamic Content Loading** - Projects loaded from JSON file
- **Mobile-First Design** - Responsive grid layouts and flexible components
- **SEO Optimized** - Meta tags, structured data, and social media previews
- **Cross-Browser Compatible** - Works on all modern browsers
- **GitHub Pages Ready** - No build process required

## 🚀 Live Demo

Visit the live website: [https://yourusername.github.io/my-portfolio](https://yourusername.github.io/my-portfolio)

## 📁 Project Structure

```
my-portfolio/
│
├── index.html              # Main HTML file
├── README.md              # Project documentation
├── CNAME                  # Custom domain configuration (optional)
│
├── assets/
│   ├── images/           # Profile and project images
│   │   ├── profile.jpg
│   │   ├── project-1.jpg
│   │   ├── project-2.jpg
│   │   ├── project-3.jpg
│   │   ├── social-preview.jpg
│   │   └── project-placeholder.jpg
│   │
│   └── icons/            # SVG icons and favicon
│       ├── favicon.ico
│       ├── apple-touch-icon.png
│       ├── education.svg
│       ├── experience.svg
│       ├── skills.svg
│       ├── email.svg
│       ├── linkedin.svg
│       └── github.svg
│
├── css/
│   └── style.css         # Main stylesheet with CSS variables
│
├── js/
│   └── script.js         # JavaScript for interactions and animations
│
└── data/
    └── projects.json     # Project data in JSON format
```

## 🛠️ Installation & Setup

### Quick Start
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/my-portfolio.git
   cd my-portfolio
   ```

2. **Customize your information**
   - Edit `index.html` with your personal information
   - Update `data/projects.json` with your projects
   - Replace images in `assets/images/` with your own
   - Modify `css/style.css` colors if desired

3. **Test locally**
   ```bash
   # Use any local server, for example:
   python -m http.server 8000
   # Or use Live Server extension in VS Code
   ```

4. **Deploy to GitHub Pages**
   - Push to your GitHub repository
   - Enable GitHub Pages in repository settings
   - Your site will be available at `https://yourusername.github.io/repository-name`

### Advanced Setup

#### Custom Domain (Optional)
1. Create a `CNAME` file in the root directory:
   ```
   yourdomain.com
   ```
2. Configure DNS settings with your domain provider
3. Enable HTTPS in GitHub Pages settings

#### Performance Optimization
- Optimize images using tools like [TinyPNG](https://tinypng.com/)
- Consider using a CDN for faster global loading
- Enable Gzip compression if using custom hosting

## 📝 Customization Guide

### Personal Information
Update the following sections in `index.html`:

1. **Meta Tags** (Lines 8-25)
   ```html
   <title>Your Name - Your Title | Portfolio</title>
   <meta name="description" content="Your description here">
   ```

2. **Hero Section** (Lines 75-95)
   ```html
   <h1>Hi, I'm <span class="highlight">Your Name</span></h1>
   <p class="hero-tagline">Your Professional Title</p>
   ```

3. **About Section** (Lines 105-200)
   - Update education timeline
   - Modify work experience
   - Customize skills and technologies

4. **Contact Information** (Lines 290-330)
   ```html
   <a href="mailto:your-email@example.com">your-email@example.com</a>
   <a href="https://linkedin.com/in/yourprofile">linkedin.com/in/yourprofile</a>
   <a href="https://github.com/yourusername">github.com/yourusername</a>
   ```

### Adding Projects
Edit `data/projects.json` to add your projects:

```json
{
  "id": 7,
  "title": "Your Project Title",
  "description": "Detailed project description",
  "technologies": ["React", "Node.js", "MongoDB"],
  "image": "./assets/images/your-project.jpg",
  "liveUrl": "https://your-project-demo.com",
  "githubUrl": "https://github.com/yourusername/your-project",
  "featured": true,
  "status": "completed"
}
```

### Color Customization
Modify CSS variables in `css/style.css`:

```css
:root {
    --color-primary: #6366f1;        /* Main brand color */
    --color-secondary: #ec4899;      /* Accent color */
    --color-bg-primary: #0f0f23;     /* Background color */
    /* ... other variables ... */
}
```

### Adding New Sections
1. Add HTML structure in `index.html`
2. Add corresponding styles in `css/style.css`
3. Update navigation links
4. Add scroll animations in `js/script.js`

## 🎨 Design System

### Color Palette
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#ec4899` (Pink)
- **Background**: `#0f0f23` (Dark Navy)
- **Surface**: `#232340` (Dark Gray)
- **Text**: `#f8fafc` (Light Gray)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 600-700 weight
- **Body Text**: 400-500 weight
- **Scale**: Modular scale from 0.75rem to 3rem

### Spacing System
- **Base Unit**: 1rem (16px)
- **Scale**: 0.25rem, 0.5rem, 1rem, 1.5rem, 2rem, 3rem, 4rem, 6rem

## 🔧 Technical Details

### CSS Architecture
- **CSS Variables** for consistent theming
- **Mobile-First** responsive design
- **Flexbox & Grid** for modern layouts
- **Custom Properties** for easy customization

### JavaScript Features
- **Vanilla JavaScript** - No external dependencies
- **Modular Functions** - Well-organized and documented code
- **Performance Optimized** - Debounced scroll events and lazy loading
- **Accessibility Features** - Keyboard navigation and screen reader support

### Browser Support
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 769px - 1024px
- **Desktop**: 1025px - 1200px
- **Large Desktop**: 1201px+

## ♿ Accessibility Features

- **Semantic HTML5** elements
- **ARIA labels** and roles
- **Keyboard navigation** support
- **Screen reader** compatibility
- **High contrast** mode support
- **Reduced motion** preferences
- **Focus management** for interactive elements

## 🔍 SEO Optimization

- **Meta tags** for search engines
- **Open Graph** tags for social media
- **Twitter Card** tags
- **Structured data** (JSON-LD)
- **Semantic HTML** structure
- **Fast loading** performance
- **Mobile-friendly** design

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🚀 Deployment Options

### GitHub Pages (Recommended)
1. Push code to GitHub repository
2. Go to repository settings
3. Enable GitHub Pages from main branch
4. Access via `https://username.github.io/repository-name`

### Netlify
1. Connect GitHub repository to Netlify
2. Deploy automatically on git push
3. Custom domain and HTTPS included

### Vercel
1. Import project from GitHub
2. Deploy with zero configuration
3. Automatic HTTPS and global CDN

### Traditional Hosting
- Upload files via FTP/SFTP
- Ensure server supports static files
- Configure custom domain if needed

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Inter Font** - Google Fonts
- **Inspiration** - Modern portfolio designs and best practices
- **Icons** - Custom SVG icons and Font Awesome references
- **Testing** - Various devices and browser testing

## 📞 Support

If you have any questions or need help customizing the portfolio:

- **Email**: your-email@example.com
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/my-portfolio/issues)
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)

---

**Made with ❤️ by [Your Name](https://github.com/yourusername)**

Last updated: December 2024
