function createScrollAnimation(item, stage) {
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

    // --- PART 2: Proximity Scale (The Interaction) ---
    const radius = 250;
    const maxScale = 1.25; // Adjusted from 2.5 to be less chaotic
    const mainstage = document.getElementsByClassName(stage)[0];

    mainstage.addEventListener("mousemove", (e) => {
        Array.from(items).forEach((card) => {
            const r = card.getBoundingClientRect();
            const centerX = r.left + r.width / 2;
            const centerY = r.top + r.height / 2;
            
            // Calculate distance from mouse to center of card
            const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
            
            // Map distance to a scale value (1 to maxScale)
            // If distance is 0, p = 1. If distance >= radius, p = 0.
            const proximity = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0, radius, 1, 0, distance));

            gsap.to(card, {
                scale: 1 + (maxScale - 1) * proximity,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto" // Prevents conflict with ScrollTrigger if they overlap
            });
        });
    });

    // Reset scales when mouse leaves the container
    mainstage.addEventListener("mouseleave", () => {
        gsap.to(items, { scale: 1, duration: 0.5 });
    });
}