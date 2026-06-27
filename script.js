const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

const frameCount = 300;
const currentFrame = index => (
    `bg/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

const images = [];
let loadedCount = 0;

// Adjust canvas resolution for high-DPI displays to fix blurriness
const setCanvasDimensions = () => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.scale(dpr, dpr);
    
    // Maximize rendering quality for scaled images
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
};

setCanvasDimensions();

function drawCenterCrop(image) {
    if (!image.complete || image.naturalWidth === 0) return; // Only draw if fully loaded

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const canvasRatio = canvasWidth / canvasHeight;
    const imgRatio = image.naturalWidth / image.naturalHeight;
    let renderWidth, renderHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
        renderWidth = canvasWidth;
        renderHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - renderHeight) / 2;
    } else {
        renderWidth = canvasHeight * imgRatio;
        renderHeight = canvasHeight;
        offsetX = (canvasWidth - renderWidth) / 2;
        offsetY = 0;
    }

    // Round coordinates to prevent subpixel rendering blurriness
    renderWidth = Math.round(renderWidth);
    renderHeight = Math.round(renderHeight);
    offsetX = Math.round(offsetX);
    offsetY = Math.round(offsetY);

    // Clear before drawing to prevent artifact accumulation
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.drawImage(image, offsetX, offsetY, renderWidth, renderHeight);
}

// Preload all images and draw the first one as soon as it loads
for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
        loadedCount++;
        if (i === 1) {
            drawCenterCrop(img);
        }
    };
    images.push(img);
}

// Elements for scroll UI updates
const navLinks = document.querySelectorAll('.nav-links a');
const homeSection = document.getElementById('home');
const scrollIndicator = document.querySelector('.scroll-indicator');

// Handle UI updates based on scroll
const updateUIOnScroll = (scrollFraction) => {
    // We have 4 sections, so we split 0-1 into 4 chunks (0.25 each)
    let sectionIndex = Math.floor(scrollFraction / 0.25);
    if (sectionIndex > 3) sectionIndex = 3;
    if (sectionIndex < 0) sectionIndex = 0;

    // 1) Update Floating Navbar
    navLinks.forEach((link, idx) => {
        if (idx === sectionIndex) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });



    // 3) Fade out Home Content when scrolling down
    // After 10% scroll, start fading out the home content
    if (scrollFraction > 0.1) {
        homeSection.classList.add('fade-out');
        scrollIndicator.style.opacity = '0';
    } else {
        homeSection.classList.remove('fade-out');
        scrollIndicator.style.opacity = '0.7';
    }
};

// Draw the current frame based on scroll
const updateCanvasOnScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    
    // Prevent divide by zero if maxScrollTop is 0
    const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
    
    // Update the UI
    updateUIOnScroll(scrollFraction);

    // Determine which frame to show (1 to 300)
    let frameIndex = Math.floor(scrollFraction * frameCount) + 1;
    
    // Clamp values to prevent out of bounds (fixes black screen at the end)
    if (frameIndex > frameCount) frameIndex = frameCount;
    if (frameIndex < 1) frameIndex = 1;
    
    // Draw the image if it's already preloaded
    const targetImage = images[frameIndex - 1];
    if (targetImage && targetImage.complete) {
        drawCenterCrop(targetImage);
    }
};

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateCanvasOnScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// MOBILE MENU LOGIC
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobile-menu");
    
    if (hamburger && mobileMenu) {
        // Toggle menu on hamburger click
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle("active");
            hamburger.classList.toggle("active");
        });
        
        // Close menu when a link is clicked
        const links = mobileMenu.querySelectorAll(".mobile-nav-links a");
        links.forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
                hamburger.classList.remove("active");
            });
        });
        
        // Close menu when clicking outside the links
        mobileMenu.addEventListener("click", (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove("active");
                hamburger.classList.remove("active");
            }
        });
    }
});

window.addEventListener('resize', () => {
    setCanvasDimensions();
    updateCanvasOnScroll();
});

// Initial UI call
updateUIOnScroll(0);
