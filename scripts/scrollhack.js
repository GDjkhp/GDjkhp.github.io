function createScrollAnimation(item) {
    ScrollTrigger.refresh();
    const items = document.getElementsByClassName(item);
    gsap.registerPlugin(ScrollTrigger);
    Array.from(items).forEach((item, index) => {
        // Starting position (either left or right of screen)
        pos = index % 2 === 0; // Math.random() > 0.5; 
        const startX = pos ? window.innerWidth : -window.innerWidth;
        const rotationStart = pos ? 15 : -15; // Rotation direction alternates
        
        // Create scroll-triggered animation
        ScrollTrigger.create({
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            // Animation when entering view
            onEnter: () => {
                gsap.fromTo(
                    item,
                    {
                        x: -startX,
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
            // Exit transition when scrolling down
            onLeave: () => {
                gsap.to(item, {
                    x: startX,
                    rotation: rotationStart,
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.8,
                    ease: 'power2.in'
                });
            },
            // Re-enter when scrolling back up
            onEnterBack: () => {
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
            // Exit transition when scrolling back up
            onLeaveBack: () => {
                gsap.to(item, {
                    x: -startX,
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