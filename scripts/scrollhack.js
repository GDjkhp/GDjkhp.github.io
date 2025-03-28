// Create advanced scroll animation for items
function createScrollAnimation(item) {
    const items = document.getElementsByClassName(item);
    gsap.registerPlugin(ScrollTrigger);
    Array.from(items).forEach((item, index) => {
        // Alternate start positions (left and right)
        const startX = index % 2 === 0 ? window.innerWidth : -window.innerWidth;
        
        // Rotation direction alternates
        const rotationStart = index % 2 === 0 ? 15 : -15;
        
        // Create scroll-triggered animation
        ScrollTrigger.create({
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            onEnter: () => {
                // Animation when entering view
                gsap.fromTo(
                    item,
                    {
                        x: startX,
                        rotation: rotationStart,
                        opacity: 0,
                        scale: 0.8
                    },
                    {
                        x: 0,
                        rotation: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        ease: 'power2.out'
                    }
                );
            },
            onLeave: () => {
                // Exit transition when scrolling down
                gsap.to(item, {
                    x: startX,
                    rotation: rotationStart,
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.8,
                    ease: 'power2.in'
                });
            },
            onEnterBack: () => {
                // Re-enter when scrolling back up
                gsap.fromTo(
                    item,
                    {
                        x: startX,
                        rotation: rotationStart,
                        opacity: 0,
                        scale: 0.8
                    },
                    {
                        x: 0,
                        rotation: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        ease: 'power2.out'
                    }
                );
            },
            onLeaveBack: () => {
                // Exit transition when scrolling back up
                gsap.to(item, {
                    x: startX,
                    rotation: rotationStart,
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.8,
                    ease: 'power2.in'
                });
            },
            markers: false
        });
    });
}