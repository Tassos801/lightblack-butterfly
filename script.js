/**
 * LightBlack - LoveFrom Style
 * Ultimate butterfly animation - final polish
 */

document.addEventListener('DOMContentLoaded', () => {
    const infoBtn = document.getElementById('infoBtn');
    const body = document.body;
    const butterfly = document.getElementById('butterflyContainer');
    const logo = document.querySelector('.logo');

    // ============================================
    // Butterfly State Machine
    // ============================================
    const State = {
        FLYING: 'flying',
        GLIDING: 'gliding',
        HOVERING: 'hovering',
        APPROACHING: 'approaching',
        LANDING: 'landing',
        SITTING: 'sitting',
        TAKING_OFF: 'taking_off'
    };

    let state = State.FLYING;
    let x = window.innerWidth * 0.3;
    let y = window.innerHeight * 0.4;
    let vx = 1;
    let vy = 0;
    let angle = 0;
    let time = 0;
    let stateTimer = 0;
    let frameCount = 0;
    let landingSpot = null;
    let hoverCenter = { x: 0, y: 0 };

    // Smooth values for interpolation
    let displayX = x;
    let displayY = y;
    let displayAngle = 0;

    // Wing animation control
    let wingSpeed = 1;

    const getLogoRect = () => {
        if (!logo) return null;
        const rect = logo.getBoundingClientRect();
        return {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2
        };
    };

    // Easing functions
    const ease = {
        out: t => 1 - Math.pow(1 - t, 3),
        inOut: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    };

    // Smooth interpolation
    const lerp = (a, b, t) => a + (b - a) * t;

    // Choose landing spot on specific letter
    const chooseLandingSpot = () => {
        const rect = getLogoRect();
        if (!rect) return null;

        const spots = [
            { x: 0.05, name: 'L' },
            { x: 0.12, name: 'i' },
            { x: 0.20, name: 'g' },
            { x: 0.30, name: 'h' },
            { x: 0.40, name: 't' },
            { x: 0.52, name: 'B' },
            { x: 0.62, name: 'l' },
            { x: 0.70, name: 'a' },
            { x: 0.78, name: 'c' },
            { x: 0.88, name: 'k' },
            { x: 0.96, name: ',' }
        ];

        const spot = spots[Math.floor(Math.random() * spots.length)];
        return {
            x: rect.left + rect.width * spot.x,
            y: rect.top - 5,
            name: spot.name
        };
    };

    // Get flight target - natural distribution
    const getFlightTarget = () => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const rect = getLogoRect();

        if (rect && Math.random() < 0.6) {
            const area = Math.random();

            if (area < 0.25) {
                // Through the letters
                return {
                    x: rect.left + Math.random() * rect.width,
                    y: rect.centerY + (Math.random() - 0.5) * 20
                };
            } else if (area < 0.45) {
                // Above letters, varying height
                return {
                    x: rect.left + Math.random() * rect.width,
                    y: rect.top - 20 - Math.random() * 80
                };
            } else if (area < 0.55) {
                // Below letters
                return {
                    x: rect.left + Math.random() * rect.width,
                    y: rect.bottom + 20 + Math.random() * 60
                };
            } else if (area < 0.75) {
                // Left side
                return {
                    x: rect.left - 30 - Math.random() * 120,
                    y: rect.centerY + (Math.random() - 0.5) * 150
                };
            } else {
                // Right side
                return {
                    x: rect.right + 30 + Math.random() * 120,
                    y: rect.centerY + (Math.random() - 0.5) * 150
                };
            }
        }

        // Random screen position
        return {
            x: 100 + Math.random() * (vw - 200),
            y: 80 + Math.random() * (vh - 160)
        };
    };

    // Set wing animation speed via CSS variable
    const setWingSpeed = (speed) => {
        wingSpeed = speed;
        const duration = 0.18 / speed;
        butterfly.style.setProperty('--wing-duration', duration + 's');
    };

    // ============================================
    // State Behaviors
    // ============================================

    const fly = () => {
        time += 0.015;

        // Natural altitude wave
        const altitudeWave = Math.sin(time * 0.8) * 15;

        // Organic wobble
        const wobbleX = Math.sin(time * 2.1) * 8 + Math.sin(time * 3.7) * 3;
        const wobbleY = Math.cos(time * 1.7) * 5 + Math.sin(time * 2.9) * 2;

        // Occasionally pick new direction
        if (Math.random() < 0.015) {
            const target = getFlightTarget();
            const dx = target.x - x;
            const dy = target.y - y;
            angle = Math.atan2(dy, dx);
        }

        // Variable speed based on "energy"
        const energy = 0.7 + Math.sin(time * 0.3) * 0.3;
        const speed = 2 * energy;

        // Move
        vx = lerp(vx, Math.cos(angle) * speed, 0.03);
        vy = lerp(vy, Math.sin(angle) * speed, 0.03);

        x += vx;
        y += vy + altitudeWave * 0.1;

        // Boundary softness
        const margin = 60;
        if (x < margin) { x = margin; vx = Math.abs(vx); angle = Math.atan2(vy, vx); }
        if (x > window.innerWidth - margin) { x = window.innerWidth - margin; vx = -Math.abs(vx); angle = Math.atan2(vy, vx); }
        if (y < margin) { y = margin; vy = Math.abs(vy); }
        if (y > window.innerHeight - margin) { y = window.innerHeight - margin; vy = -Math.abs(vy); }

        // Smooth display position
        displayX = lerp(displayX, x + wobbleX, 0.15);
        displayY = lerp(displayY, y + wobbleY + altitudeWave, 0.15);

        // Angel follows velocity direction with tilt
        const velocityAngle = Math.atan2(vy, vx);
        const tilt = Math.sin(time * 3) * 12;
        displayAngle = lerp(displayAngle, velocityAngle * (180 / Math.PI) + 90 + tilt, 0.1);

        // Wing speed varies with movement
        setWingSpeed(0.8 + energy * 0.4);

        // Apply
        butterfly.style.left = (displayX - 25) + 'px';
        butterfly.style.top = (displayY - 23) + 'px';
        butterfly.style.transform = 'rotate(' + displayAngle + 'deg)';

        // State transitions - no hovering, always keep moving
        if (Math.random() < 0.002 && Math.abs(vx) + Math.abs(vy) > 1.5) {
            state = State.GLIDING;
            stateTimer = 0;
        } else if (frameCount > 600 + Math.random() * 400) {
            state = State.APPROACHING;
            landingSpot = chooseLandingSpot();
            frameCount = 0;
        }
    };

    const glide = () => {
        time += 0.02;
        stateTimer += 0.016;

        // Slow drift
        vx *= 0.995;
        vy *= 0.995;
        vy += 0.015; // Gentle sink

        x += vx;
        y += vy;

        // Slow wing flapping
        setWingSpeed(0.4);

        const gentleWobble = Math.sin(time * 1.5) * 4;
        displayX = lerp(displayX, x + gentleWobble, 0.1);
        displayY = lerp(displayY, y, 0.1);
        displayAngle = lerp(displayAngle, Math.atan2(vy, vx) * (180 / Math.PI) + 90, 0.05);

        butterfly.style.left = (displayX - 25) + 'px';
        butterfly.style.top = (displayY - 23) + 'px';
        butterfly.style.transform = 'rotate(' + displayAngle + 'deg)';

        if (stateTimer > 1.5 + Math.random()) {
            state = State.FLYING;
            setWingSpeed(1);
        }
    };

    const hover = () => {
        time += 0.025;
        stateTimer += 0.016;

        // Gentle figure-8 hover pattern
        const hoverX = hoverCenter.x + Math.sin(time * 1.2) * 20;
        const hoverY = hoverCenter.y + Math.sin(time * 2.4) * 10;

        x = lerp(x, hoverX, 0.05);
        y = lerp(y, hoverY, 0.05);

        displayX = lerp(displayX, x, 0.15);
        displayY = lerp(displayY, y, 0.15);
        displayAngle = lerp(displayAngle, Math.sin(time * 1.5) * 15, 0.1);

        setWingSpeed(0.9);

        butterfly.style.left = (displayX - 25) + 'px';
        butterfly.style.top = (displayY - 23) + 'px';
        butterfly.style.transform = 'rotate(' + displayAngle + 'deg)';

        if (stateTimer > 2 + Math.random() * 2) {
            state = State.FLYING;
            const target = getFlightTarget();
            angle = Math.atan2(target.y - y, target.x - x);
        }
    };

    const approach = () => {
        if (!landingSpot) { state = State.FLYING; return; }

        time += 0.02;

        const dx = landingSpot.x - x;
        const dy = (landingSpot.y - 40) - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Gentle curved approach
        const approachAngle = Math.atan2(dy, dx);
        angle = lerp(angle, approachAngle, 0.05);

        const approachSpeed = Math.min(1.5, dist * 0.015);
        x += Math.cos(angle) * approachSpeed;
        y += Math.sin(angle) * approachSpeed;

        // Slow down wings as approaching
        setWingSpeed(0.6 + (dist / 200) * 0.4);

        const hoverWobble = Math.sin(time * 4) * 3;
        displayX = lerp(displayX, x + hoverWobble, 0.12);
        displayY = lerp(displayY, y, 0.12);
        displayAngle = lerp(displayAngle, angle * (180 / Math.PI) + 90, 0.08);

        butterfly.style.left = (displayX - 25) + 'px';
        butterfly.style.top = (displayY - 23) + 'px';
        butterfly.style.transform = 'rotate(' + displayAngle + 'deg)';

        if (dist < 15) {
            state = State.LANDING;
            stateTimer = 0;
        }
    };

    const land = () => {
        stateTimer += 0.025;
        const t = ease.out(Math.min(stateTimer, 1));

        // Settle down onto letter
        x = lerp(x, landingSpot.x, 0.1);
        y = lerp(y, landingSpot.y, 0.08);

        displayX = lerp(displayX, x, 0.15);
        displayY = lerp(displayY, y, 0.15);
        displayAngle = lerp(displayAngle, 0, 0.1);

        // Slow wings to stop
        setWingSpeed(Math.max(0.2, 1 - t));

        const scale = 1 - t * 0.08;
        butterfly.style.left = (displayX - 25) + 'px';
        butterfly.style.top = (displayY - 23) + 'px';
        butterfly.style.transform = 'rotate(' + displayAngle + 'deg) scale(' + scale + ')';

        if (stateTimer >= 1) {
            state = State.SITTING;
            stateTimer = 0;
            butterfly.classList.add('wings-folded');
        }
    };

    const sit = () => {
        stateTimer += 0.016;
        time += 0.01;

        // Tiny breathing motion
        const breathe = Math.sin(time * 2) * 0.5;
        displayY = landingSpot.y + breathe;

        // Occasional wing twitch
        if (Math.random() < 0.003) {
            butterfly.classList.remove('wings-folded');
            setTimeout(() => butterfly.classList.add('wings-folded'), 200);
        }

        butterfly.style.left = (landingSpot.x - 25) + 'px';
        butterfly.style.top = (displayY - 23) + 'px';
        butterfly.style.transform = 'rotate(0deg) scale(0.92)';

        // Sit for 3-5 seconds
        if (stateTimer > 3 + Math.random() * 2) {
            state = State.TAKING_OFF;
            stateTimer = 0;
            butterfly.classList.remove('wings-folded');
            setWingSpeed(1.2);
        }
    };

    const takeOff = () => {
        stateTimer += 0.02;
        time += 0.04;

        const t = ease.inOut(Math.min(stateTimer / 0.8, 1));

        // Quick lift with spiral
        const liftY = landingSpot.y - t * 100;
        const spiralX = Math.sin(t * Math.PI * 3) * 20 * (1 - t);

        x = landingSpot.x + spiralX;
        y = liftY;

        displayX = lerp(displayX, x, 0.2);
        displayY = lerp(displayY, y, 0.2);

        const takeoffAngle = -90 + spiralX * 2;
        displayAngle = lerp(displayAngle, takeoffAngle, 0.15);

        setWingSpeed(1.3);

        const scale = 0.92 + t * 0.08;
        butterfly.style.left = (displayX - 25) + 'px';
        butterfly.style.top = (displayY - 23) + 'px';
        butterfly.style.transform = 'rotate(' + displayAngle + 'deg) scale(' + scale + ')';

        if (stateTimer >= 0.8) {
            state = State.FLYING;
            landingSpot = null;
            vx = (Math.random() - 0.5) * 3;
            vy = -1.5;
            angle = Math.atan2(vy, vx);
            setWingSpeed(1);
        }
    };

    // ============================================
    // Main Loop
    // ============================================

    const animate = () => {
        if (body.classList.contains('panel-open')) {
            requestAnimationFrame(animate);
            return;
        }

        frameCount++;

        switch (state) {
            case State.FLYING: fly(); break;
            case State.GLIDING: glide(); break;
            case State.HOVERING: hover(); break;
            case State.APPROACHING: approach(); break;
            case State.LANDING: land(); break;
            case State.SITTING: sit(); break;
            case State.TAKING_OFF: takeOff(); break;
        }

        requestAnimationFrame(animate);
    };

    // Initialize
    setTimeout(() => {
        butterfly.style.opacity = '1';
        setWingSpeed(1);
        animate();
    }, 1200);

    // ============================================
    // Interactions
    // ============================================

    infoBtn.addEventListener('click', () => body.classList.toggle('panel-open'));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && body.classList.contains('panel-open')) {
            body.classList.remove('panel-open');
        }
    });

    document.getElementById('infoPanel').addEventListener('click', (e) => {
        if (e.target.id === 'infoPanel') body.classList.remove('panel-open');
    });

    // Elegant logo hover
    if (logo) {
        logo.style.transition = 'letter-spacing 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
        logo.addEventListener('mouseenter', () => {
            logo.style.letterSpacing = '0.06em';
            logo.style.opacity = '0.85';
        });
        logo.addEventListener('mouseleave', () => {
            logo.style.letterSpacing = '0.02em';
            logo.style.opacity = '1';
        });
    }

    // ============================================
    // Scroll-Based Animations
    // ============================================
    const mainContent = document.getElementById('mainContent');
    const scrollIndicator = document.getElementById('scrollIndicator');
    const caseStudies = document.querySelectorAll('.case-study');

    // Hero fade on scroll
    const handleScroll = () => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;

        // Calculate fade progress (0 to 1 over 40% of viewport for faster fade)
        const fadeProgress = Math.min(scrollY / (vh * 0.4), 1);

        // Apply fade to hero content
        if (mainContent) {
            const opacity = Math.max(0, 1 - fadeProgress * 1.5);
            mainContent.style.opacity = opacity;
            mainContent.style.transform = 'translateY(' + (-scrollY * 0.5) + 'px)';

            // Hide completely when faded
            if (opacity <= 0.05) {
                mainContent.classList.add('scrolled');
                mainContent.style.visibility = 'hidden';
            } else {
                mainContent.classList.remove('scrolled');
                mainContent.style.visibility = 'visible';
            }
        }

        // Hide scroll indicator when scrolled
        if (scrollIndicator) {
            if (scrollY > 50) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        }
    };

    // Intersection Observer for case studies
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0.1
    };

    const caseStudyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    caseStudies.forEach(study => {
        caseStudyObserver.observe(study);
    });

    // Initialize scroll handler
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
});
