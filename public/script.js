// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

mobileMenuBtn.addEventListener('click', function() {
    mobileMenuBtn.classList.toggle('active');
    mobileNav.classList.toggle('active');
});

// Mobile Dropdown Toggle
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const dropdownMenu = this.parentNode.querySelector('.mobile-dropdown-menu');
        const chevron = this.querySelector('.fa-chevron-down');
        
        dropdownMenu.classList.toggle('active');
        chevron.style.transform = dropdownMenu.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
    });
});

// Close mobile menu when clicking on links
const mobileNavLinks = document.querySelectorAll('.mobile-nav-item a:not(.dropdown-toggle)');

mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.backgroundColor = 'transparent';
        header.style.backdropFilter = 'none';
        header.style.boxShadow = 'none';
    }
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animatedElements = document.querySelectorAll('.service-card, .stat-card, .feature-item');

animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Scroll to section function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Open tracking modal
function openTrackingModal() {
    document.getElementById('trackingModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close tracking modal
function closeTrackingModal() {
    document.getElementById('trackingModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('trackingResult').style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('trackingModal');
    if (event.target === modal) {
        closeTrackingModal();
    }
});

// Track package function
function trackPackage(event) {
    event.preventDefault();
    const trackingNumber = document.getElementById('trackingNumber').value;
    const resultDiv = document.getElementById('trackingResult');
    
    if (trackingNumber) {
        resultDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="display: inline-block; width: 2rem; height: 2rem; border: 3px solid #ea002a; border-top: 3px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 1rem; color: #6b7280;">Recherche en cours...</p>
            </div>
        `;
        resultDiv.style.display = 'block';
        
        // Simulate API call
        setTimeout(() => {
            resultDiv.innerHTML = `
                <div style="border-left: 4px solid #10b981; padding-left: 1rem;">
                    <h4 style="color: #001b72; margin-bottom: 0.5rem;">Colis trouvé!</h4>
                    <p style="color: #6b7280; margin-bottom: 1rem;"><strong>Numéro:</strong> ${trackingNumber}</p>
                    <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <p style="color: #15803d; font-weight: 600; margin: 0;">✅ En transit vers Port-au-Prince</p>
                    </div>
                    <div style="font-size: 0.875rem; color: #6b7280;">
                        <p><strong>Expédié:</strong> 15 Jan 2024</p>
                        <p><strong>Arrivée estimée:</strong> 18 Jan 2024</p>
                        <p><strong>Localisation:</strong> Centre de tri Miami</p>
                    </div>
                </div>
            `;
        }, 2000);
    }
}

// Submit contact form
function submitContactForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('.contact-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message envoyé!';
        submitBtn.style.background = '#10b981';
        
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    }, 2000);
}

// Add CSS for spinner animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);