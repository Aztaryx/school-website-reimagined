// ===== NAVBAR SCROLL BEHAVIOR =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    // Sticky navbar style
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link based on scroll position
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
    });
});

// ===== SCROLL REVEAL ANIMATIONS =====
const revealElements = document.querySelectorAll('.card, .option-tile, .help-card, .section-header');

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, Number(delay));
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 70;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ===== WIP OVERLAY =====
// Appears on all sub-pages that include a #wipOverlay element.
// The password is checked against a hardcoded value.
// Once correct, the bypass is stored in sessionStorage so it
// persists for the whole browser session without re-prompting.
//
// Usage in any sub-page HTML:
//   Include the #wipOverlay block (see any sub-page for reference).
//   Link wip.css for styles. This function runs automatically on DOMContentLoaded.

function initWIP() {
    const overlay  = document.getElementById('wipOverlay');
    if (!overlay) return; // Not a WIP page — skip silently

    const PASS       = 'oracle';
    const BYPASS_KEY = 'wip_bypass';
    const form       = document.getElementById('wipForm');
    const input      = document.getElementById('wipInput');
    const errorEl    = document.getElementById('wipError');
    const box        = document.getElementById('wipBox');

    // Session already unlocked — hide overlay immediately
    if (sessionStorage.getItem(BYPASS_KEY) === '1') {
        overlay.classList.add('wip-hidden');
        return;
    }

    // Show overlay and lock scroll
    overlay.classList.remove('wip-hidden');
    document.body.style.overflow = 'hidden';

    // Focus the input after the entrance animation
    setTimeout(() => input && input.focus(), 520);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (input.value.trim() === PASS) {
            // Correct — store bypass, animate out, unlock scroll
            sessionStorage.setItem(BYPASS_KEY, '1');
            overlay.classList.add('wip-exit');
            document.body.style.overflow = '';
            setTimeout(() => overlay.classList.add('wip-hidden'), 520);
        } else {
            // Wrong — show error and shake the box
            errorEl.textContent = 'Incorrect password. Try again.';
            input.value = '';
            input.focus();

            // Trigger shake (remove first to allow re-triggering)
            box.classList.remove('wip-shake');
            void box.offsetWidth; // Force reflow
            box.classList.add('wip-shake');

            // Clear the shake class after animation completes
            box.addEventListener('animationend', () => {
                box.classList.remove('wip-shake');
            }, { once: true });

            // Clear error message after a moment
            setTimeout(() => { errorEl.textContent = ''; }, 2800);
        }
    });

    // Allow pressing Enter anywhere on the overlay to focus the input
    overlay.addEventListener('keydown', (e) => {
        if (document.activeElement !== input && e.key !== 'Tab') {
            input.focus();
        }
    });
}

document.addEventListener('DOMContentLoaded', initWIP);
