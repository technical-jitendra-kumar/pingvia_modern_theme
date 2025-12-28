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

// =============request demo modal logic form submite success msg==================

// 1. Elements Selection
const demoModal = document.getElementById('demo-modal');
const demoForm = document.getElementById('demo-form');
const formContainer = document.getElementById('form-container');
const successState = document.getElementById('success-state');
const openModalBtns = document.querySelectorAll('.open-demo');
const closeModalBtn = document.getElementById('close-modal');
const btnDone = document.getElementById('btn-done');

// 2. Open Modal Logic
openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        demoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Stop scroll
    });
});

// 3. Form Submit Logic (Main Logic)
demoForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Yahan hum form hide karke success message dikhayenge
    formContainer.style.display = 'none';
    successState.style.display = 'block';
});

// 4. Close Modal Logic
const hideModal = () => {
    demoModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Resume scroll
    
    // Reset modal state for next time
    setTimeout(() => {
        formContainer.style.display = 'block';
        successState.style.display = 'none';
        demoForm.reset();
    }, 500);
};

closeModalBtn?.addEventListener('click', hideModal);
btnDone?.addEventListener('click', hideModal);

// Close on background click
window.addEventListener('click', (e) => {
    if (e.target === demoModal) hideModal();
});

// ========> demo model data send to google sheets logic <======

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyB1soHEIQ-7k8vkZ7MRwKgOW3pmUpcHYIBDm2kSTlfEEAPGOmo0aqYWsDlQmyHMtoYGw/exec'; 

// const demoForm = document.getElementById('demo-form');

demoForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";

    // Data ko URL parameters mein badalna
    const formData = new FormData(demoForm);
    const params = new URLSearchParams(formData).toString();
    const finalUrl = SCRIPT_URL + "?" + params;

    // GET request bhej rahe hain kyunki ye zyada reliable hai Sheets ke liye
    fetch(finalUrl)
    .then(res => res.json())
    .then(data => {
        if(data.result === "success") {
            document.getElementById('form-container').style.display = 'none';
            document.getElementById('success-state').style.display = 'block';
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(err => {
        console.error(err);
        alert("Network Error! Check your internet or Script URL.");
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = "Request Demo";
    });
});


// ======> contact us page form success message logic <======

// Contact Page Form Logic
const contactForm = document.getElementById('contact-form-main');
const contactSuccess = document.getElementById('contact-success');

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Form ko hide karein aur Success message dikhayein
    contactForm.style.display = 'none';
    contactSuccess.style.display = 'block';

    // Auto-scroll to top of the card so user sees the message
    contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ======================== contact us form data send to google sheets logic ========================
const CONTACT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyB1soHEIQ-7k8vkZ7MRwKgOW3pmUpcHYIBDm2kSTlfEEAPGOmo0aqYWsDlQmyHMtoYGw/exec';

document.getElementById('contact-form-main')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button');
    
    btn.disabled = true;
    btn.innerText = "Sending...";

    const params = new URLSearchParams(new FormData(form)).toString();
    
    fetch(CONTACT_SCRIPT_URL + "?" + params)
    .then(res => res.json())
    .then(data => {
        if(data.result === "success") {
            form.style.display = 'none';
            document.getElementById('contact-success').style.display = 'block';
        }
    })
    .catch(err => alert("Error sending message!"))
    .finally(() => {
        btn.disabled = false;
        btn.innerText = "Send Message";
    });
});