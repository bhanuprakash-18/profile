/**
 * Image Loading Diagnostics
 * This script helps diagnose image loading issues
 */

class ImageDiagnostics {
    constructor() {
        this.results = {
            techParticles: [],
            icons: [],
            profile: null,
            summary: {}
        };
    }

    // Check if a file exists by attempting to load it
    async checkImageExists(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ exists: true, width: img.width, height: img.height });
            img.onerror = () => resolve({ exists: false, error: 'Failed to load' });
            img.src = src;
        });
    }

    // Get detailed information about an image element
    getImageInfo(imgElement) {
        return {
            src: imgElement.src,
            alt: imgElement.alt,
            complete: imgElement.complete,
            naturalWidth: imgElement.naturalWidth,
            naturalHeight: imgElement.naturalHeight,
            displayWidth: imgElement.offsetWidth,
            displayHeight: imgElement.offsetHeight,
            visible: imgElement.offsetParent !== null,
            computedStyle: window.getComputedStyle(imgElement)
        };
    }

    // Diagnose all tech particle images
    async diagnoseTechParticles() {
        const particles = document.querySelectorAll('.tech-particle');
        console.log(`🔍 Diagnosing ${particles.length} tech particle images...`);

        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            const info = this.getImageInfo(particle);
            const existsCheck = await this.checkImageExists(particle.src);
            
            const result = {
                index: i,
                element: particle,
                info: info,
                existsCheck: existsCheck,
                loaded: info.complete && info.naturalWidth > 0,
                visible: info.visible,
                issues: []
            };

            // Check for common issues
            if (!existsCheck.exists) {
                result.issues.push('File does not exist or cannot be loaded');
            }
            if (!result.loaded && particle.complete) {
                result.issues.push('Image completed loading but has no dimensions');
            }
            if (!result.visible) {
                result.issues.push('Image is not visible (display: none or hidden)');
            }
            if (particle.src.includes(' ')) {
                result.issues.push('URL contains spaces which may cause issues');
            }

            this.results.techParticles.push(result);
        }
    }

    // Diagnose icon images
    async diagnoseIcons() {
        const icons = document.querySelectorAll('img[src*="/icons/"]');
        console.log(`🔍 Diagnosing ${icons.length} icon images...`);

        for (const icon of icons) {
            const info = this.getImageInfo(icon);
            const existsCheck = await this.checkImageExists(icon.src);
            
            const result = {
                element: icon,
                info: info,
                existsCheck: existsCheck,
                loaded: info.complete && info.naturalWidth > 0,
                issues: []
            };

            if (!existsCheck.exists) {
                result.issues.push('Icon file does not exist');
            }

            this.results.icons.push(result);
        }
    }

    // Diagnose profile image
    async diagnoseProfile() {
        const profileImg = document.querySelector('.profile-img');
        if (profileImg) {
            const info = this.getImageInfo(profileImg);
            const existsCheck = await this.checkImageExists(profileImg.src);
            
            this.results.profile = {
                element: profileImg,
                info: info,
                existsCheck: existsCheck,
                loaded: info.complete && info.naturalWidth > 0,
                issues: []
            };

            if (!existsCheck.exists) {
                this.results.profile.issues.push('Profile image does not exist');
            }
        }
    }

    // Generate summary report
    generateSummary() {
        const techParticleIssues = this.results.techParticles.filter(p => p.issues.length > 0);
        const iconIssues = this.results.icons.filter(i => i.issues.length > 0);
        const profileIssues = this.results.profile?.issues.length > 0 ? 1 : 0;

        this.results.summary = {
            totalImages: this.results.techParticles.length + this.results.icons.length + (this.results.profile ? 1 : 0),
            techParticles: {
                total: this.results.techParticles.length,
                loaded: this.results.techParticles.filter(p => p.loaded).length,
                issues: techParticleIssues.length
            },
            icons: {
                total: this.results.icons.length,
                loaded: this.results.icons.filter(i => i.loaded).length,
                issues: iconIssues.length
            },
            profile: {
                total: this.results.profile ? 1 : 0,
                loaded: this.results.profile?.loaded ? 1 : 0,
                issues: profileIssues
            }
        };
    }

    // Print detailed report
    printReport() {
        console.group('📊 Image Loading Diagnostic Report');
        
        console.log('📈 Summary:', this.results.summary);
        
        // Tech particles report
        if (this.results.techParticles.length > 0) {
            console.group('🎨 Tech Particles');
            this.results.techParticles.forEach(particle => {
                if (particle.issues.length > 0) {
                    console.group(`❌ Particle ${particle.index} (Issues: ${particle.issues.length})`);
                    console.log('Source:', particle.info.src);
                    console.log('Issues:', particle.issues);
                    console.log('Loaded:', particle.loaded);
                    console.log('Visible:', particle.visible);
                    console.groupEnd();
                }
            });
            console.groupEnd();
        }
        
        // Icons report
        if (this.results.icons.length > 0) {
            console.group('🎯 Icons');
            this.results.icons.forEach((icon, index) => {
                if (icon.issues.length > 0) {
                    console.group(`❌ Icon ${index} (Issues: ${icon.issues.length})`);
                    console.log('Source:', icon.info.src);
                    console.log('Issues:', icon.issues);
                    console.groupEnd();
                }
            });
            console.groupEnd();
        }
        
        // Profile report
        if (this.results.profile) {
            console.group('👤 Profile Image');
            if (this.results.profile.issues.length > 0) {
                console.log('❌ Issues:', this.results.profile.issues);
            } else {
                console.log('✅ Profile image loaded successfully');
            }
            console.groupEnd();
        }
        
        console.groupEnd();
    }

    // Run full diagnostic
    async runFullDiagnostic() {
        console.log('🚀 Starting image loading diagnostics...');
        
        await this.diagnoseTechParticles();
        await this.diagnoseIcons();
        await this.diagnoseProfile();
        this.generateSummary();
        this.printReport();
        
        return this.results;
    }
}

// Auto-run diagnostics when script is loaded
if (typeof window !== 'undefined') {
    window.ImageDiagnostics = ImageDiagnostics;
    
    // Run diagnostics after page load
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(async () => {
            const diagnostics = new ImageDiagnostics();
            await diagnostics.runFullDiagnostic();
            
            // Make results available globally for debugging
            window.imageDiagnosticsResults = diagnostics.results;
        }, 1000);
    });
}
