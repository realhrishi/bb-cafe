document.addEventListener("DOMContentLoaded", () => {
    // 1. Scroll Animations for Cards (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.25 // Trigger when 25% of the card is visible
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('anim-active');
                // Optional: Stop observing once animated if we don't want it to trigger again
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.editorial-card');
    cards.forEach(card => {
        cardObserver.observe(card);
    });

    // 2. Subtle Mouse Parallax Effect on Layered Frames
    const layeredFrames = document.querySelectorAll('.layered-frame');
    
    layeredFrames.forEach(frame => {
        const image = frame.querySelector('.parallax-image');
        
        frame.addEventListener('mousemove', (e) => {
            if (!image) return;
            
            // Get frame dimensions and position
            const rect = frame.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            
            // Calculate center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate distance from center (-1 to 1)
            const moveX = (x - centerX) / centerX;
            const moveY = (y - centerY) / centerY;
            
            // Apply subtle transform (max 15px movement)
            image.style.transform = `translate(${moveX * 10}px, ${moveY * 10}px) scale(1.02)`;
        });
        
        // Reset transform when mouse leaves
        frame.addEventListener('mouseleave', () => {
            if (!image) return;
            image.style.transform = 'translate(0px, 0px) scale(1)';
            // Adding a small transition back to normal
            image.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        // Remove the transition while moving for instant response
        frame.addEventListener('mouseenter', () => {
            if (!image) return;
            image.style.transition = 'transform 0.1s linear';
        });
    });
});
