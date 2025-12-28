/* =====================================
   HELPERS & CORE
===================================== */
const qs = (selector) => document.querySelector(selector);
const qsa = (selectors) => document.querySelectorAll(selectors);

// Ensure the script runs after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initModal();
    initChatbot();
    initTestimonialSlider();
    console.log("%cPingvia Solutions JS Initialized ✔", "color: #0ea5e9; font-size: 1.1rem; font-weight: bold;");
});

/* =====================================
   NAVIGATION (Sticky, Mobile, Active Links)
===================================== */
function initNavigation() {
    const header = qs(".header");
    const hamburger = qs("#menu-toggle");
    const nav = qs(".nav");
    const sections = qsa("section[id]");
    const navLinks = qsa(".nav-link");

    // Sticky Header
    window.addEventListener("scroll", () => {
        header.classList.toggle("header-scrolled", window.scrollY > 50);
        
        // Active Link Highlight
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href").includes(current));
        });
    });

    // Mobile Menu Toggle
    hamburger?.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        nav.classList.toggle("active"); // Ensure your CSS handles .nav.active for mobile
    });
}

/* =====================================
   MODAL LOGIC
===================================== */
function initModal() {
    const modal = qs("#contact-modal");
    const demoButtons = qsa(".open-demo");
    const closeBtn = qs(".modal-close");

    demoButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            modal.style.display = "flex";
            document.body.style.overflow = "hidden"; // Prevent background scroll
        });
    });

    const closeModal = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    };

    closeBtn?.addEventListener("click", closeModal);
    window.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
}

/* =====================================
   MODERN TESTIMONIAL SLIDER (Fixed Gap/Overlap)
===================================== */
function initTestimonialSlider() {
    const track = qs('.testimonials-track');
    const dots = qsa('.dot');
    
    if (!track || dots.length === 0) return;

    let currentIndex = 0;
    const totalSlides = dots.length;

    const updateSlider = (index) => {
        // We use percentage based on 100% width of the container
        track.style.transform = `translateX(-${index * 100}%)`;
        
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        currentIndex = index;
    };

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => updateSlider(i));
    });

    // Smoother Auto-slide
    let sliderInterval = setInterval(() => {
        let nextIndex = (currentIndex + 1) % totalSlides;
        updateSlider(nextIndex);
    }, 5000);

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(sliderInterval));
    track.addEventListener('mouseleave', () => {
        sliderInterval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % totalSlides;
            updateSlider(nextIndex);
        }, 5000);
    });
}

/* =====================================
   CHATBOT LOGIC
===================================== */
function initChatbot() {
    const toggle = qs("#chatbot-toggle");
    const windowEl = qs("#chatbot-window");
    const close = qs("#chatbot-close");
    const form = qs("#chatbot-form");
    const input = qs("#chatbot-input");
    const messages = qs("#chatbot-messages");

    if (!toggle || !windowEl) return;

    toggle.addEventListener("click", () => {
        const isVisible = windowEl.style.display === "flex";
        windowEl.style.display = isVisible ? "none" : "flex";
    });

    close?.addEventListener("click", () => {
        windowEl.style.display = "none";
    });

    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        // User Message
        const uMsg = document.createElement("div");
        uMsg.className = "user-message";
        uMsg.textContent = text;
        messages.appendChild(uMsg);
        input.value = "";

        // Bot typing effect simulation
        setTimeout(() => {
            const bMsg = document.createElement("div");
            bMsg.className = "bot-message";
            bMsg.textContent = "Thank you! An expert will get back to you shortly.";
            messages.appendChild(bMsg);
            messages.scrollTop = messages.scrollHeight;
        }, 600);
    });
}

// Modal Elements
const demoModal = document.getElementById('demo-modal');
const openModalBtns = document.querySelectorAll('.open-demo'); // Sabhi "Book Demo" buttons par ye class honi chahiye
const closeModalBtn = document.getElementById('close-modal');

// Open Modal
openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        demoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    });
});

// Close Modal
const hideModal = () => {
    demoModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
};

closeModalBtn?.addEventListener('click', hideModal);

// Close on outside click
window.addEventListener('click', (e) => {
    if (e.target === demoModal) hideModal();
});