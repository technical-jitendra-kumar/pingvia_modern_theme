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


// ======================> counter section stats logic ========================
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const speed = 200; // Counter ki speed

    const startCounter = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                const count = +entry.target.innerText;
                const increment = target / speed;

                const updateCount = () => {
                    const currentCount = +entry.target.innerText;
                    if (currentCount < target) {
                        entry.target.innerText = Math.ceil(currentCount + increment);
                        setTimeout(updateCount, 1);
                    } else {
                        entry.target.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(entry.target); // Ek hi baar animate hoga
            }
        });
    };

    const observer = new IntersectionObserver(startCounter, { threshold: 0.5 });
    stats.forEach(stat => observer.observe(stat));
}

document.addEventListener('DOMContentLoaded', initStatsCounter);
// =============> nav scroll effect =================>
// window.addEventListener('scroll', () => {
//     const header = document.querySelector('.header');
//     if (window.scrollY > 50) {
//         header.classList.add('scrolled');
//     } else {
//         header.classList.remove('scrolled');
//     }
// });

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

// ============== testimonial card slider logic ======================

function initTestimonialSlider() {
    const track = document.querySelector('.testimonials-track');
    const dots = document.querySelectorAll('.t-dot');
    let currentSlide = 0;
    let slideInterval;

    if (!track || dots.length === 0) return;

    // Slide function
    function goToSlide(index) {
        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');
        
        // Desktop par 2 cards hain isliye 100% move karne par agle 2 cards aayenge
        const movePercent = index * 100;
        track.style.transform = `translateX(-${movePercent}%)`;
        currentSlide = index;
    }

    // Auto-slide start function
    function startAutoSlide() {
        slideInterval = setInterval(() => {
            let nextSlide = (currentSlide + 1) % dots.length;
            goToSlide(nextSlide);
        }, 3000); // 3 seconds timer
    }

    // Manual Click logic
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            // Click karne par purana timer clear karke naya start karenge
            clearInterval(slideInterval);
            startAutoSlide();
        });
    });

    // Pehli baar start karne ke liye
    startAutoSlide();

    // Mouse hover par pause karna (Optional but professional)
    track.addEventListener('mouseenter', () => clearInterval(slideInterval));
    track.addEventListener('mouseleave', () => startAutoSlide());
}

document.addEventListener('DOMContentLoaded', initTestimonialSlider);

// ======================= frequently asked questions accordion logic =======================
// FAQ Accordion Logic
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Pehle se khule hue kisi bhi FAQ ko band karein
        faqItems.forEach(otherItem => otherItem.classList.remove('active'));
        
        // Agar current item pehle se active nahi tha, toh usey open karein
        if (!isActive) {
            item.classList.add('active');
        }
    });
});
/* =====================================
   CHATBOT LOGIC
===================================== */
// function initChatbot() {
//     const toggle = qs("#chatbot-toggle");
//     const windowEl = qs("#chatbot-window");
//     const close = qs("#chatbot-close");
//     const form = qs("#chatbot-form");
//     const input = qs("#chatbot-input");
//     const messages = qs("#chatbot-messages");

//     if (!toggle || !windowEl) return;

//     toggle.addEventListener("click", () => {
//         const isVisible = windowEl.style.display === "flex";
//         windowEl.style.display = isVisible ? "none" : "flex";
//     });

//     close?.addEventListener("click", () => {
//         windowEl.style.display = "none";
//     });

//     form?.addEventListener("submit", (e) => {
//         e.preventDefault();
//         const text = input.value.trim();
//         if (!text) return;

//         // User Message
//         const uMsg = document.createElement("div");
//         uMsg.className = "user-message";
//         uMsg.textContent = text;
//         messages.appendChild(uMsg);
//         input.value = "";

//         // Bot typing effect simulation
//         setTimeout(() => {
//             const bMsg = document.createElement("div");
//             bMsg.className = "bot-message";
//             bMsg.textContent = "Thank you! An expert will get back to you shortly.";
//             messages.appendChild(bMsg);
//             messages.scrollTop = messages.scrollHeight;
//         }, 600);
//     });
// }

// main.js - Chatbot Frontend Logic
/* ==========================================================================
   CHATBOT FULL LOGIC (TOGGLE + GEMINI FETCH)
   ========================================================================== */
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotForm = document.getElementById('chatbot-form');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotMessages = document.querySelector('.chatbot-messages');
const chatbotClose = document.getElementById('chatbot-close');

// 1. Open/Close Logic
if (chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.style.display = (chatbotWindow.style.display === 'flex') ? 'none' : 'flex';
    });
}

if (chatbotClose && chatbotWindow) {
    chatbotClose.addEventListener('click', () => {
        chatbotWindow.style.display = 'none';
    });
}

// 2. Message Sending & Gemini API Call
if (chatbotForm) {
    chatbotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = chatbotInput.value.trim();
        
        if (!userMessage) return;

        appendMessage('user', userMessage);
        chatbotInput.value = '';

        const typingMsg = appendMessage('bot', 'Thinking...');

        try {
            // Updated Fetch: window.location.origin use karne se path issue nahi hota
            const response = await fetch(`${window.location.origin}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.reply || "Server Error");
            }

            const data = await response.json();
            typingMsg.remove();

            if (data && data.reply) {
                appendMessage('bot', data.reply);
                // Lead detection logic (Step 4 ke liye ready rakhein)
                checkIfLead(userMessage);
            } else {
                appendMessage('bot', "Kshama karein, main abhi samajh nahi pa raha hoon.");
            }

        } catch (error) {
            console.error("Chatbot Error:", error);
            typingMsg.remove();
            // Local machine ya backend error par ye dikhega
            appendMessage('bot', "Connection issue. Agar aap local check kar rahe hain toh Vercel par deploy karein.");
        }
    });
}
window.initChatbot = function() { console.log("Chatbot ready!"); };

// 3. Helper Functions
function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    msgDiv.style.cssText = `
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 10px;
        max-width: 80%;
        font-size: 14px;
        line-height: 1.4;
    `;
    
    if(sender === 'user') {
        msgDiv.style.backgroundColor = "#0ea5e9";
        msgDiv.style.color = "white";
        msgDiv.style.alignSelf = "flex-end";
        msgDiv.style.marginLeft = "auto";
    } else {
        msgDiv.style.backgroundColor = "#f1f5f9";
        msgDiv.style.color = "#1e293b";
    }

    msgDiv.innerText = text;
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return msgDiv;
}

// Naya lead detection function
function checkIfLead(text) {
    const phoneRegex = /[6-9][0-9]{9}/;
    if (phoneRegex.test(text)) {
        console.log("Potential Lead Detected:", text);
        // Yahan EmailJS trigger karenge baad mein
    }
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



// Function for Hero Slider
function initHeroBgSlider() {
    const slides = document.querySelectorAll('.bg-slide');
    if (slides.length === 0) return;
    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

// Function for CTA Slider
function initCtaBgSlider() {
    const ctaSlides = document.querySelectorAll('.cta-slide');
    if (ctaSlides.length === 0) return;
    let currentCtaSlide = 0;
    setInterval(() => {
        ctaSlides[currentCtaSlide].classList.remove('active');
        currentCtaSlide = (currentCtaSlide + 1) % ctaSlides.length;
        ctaSlides[currentCtaSlide].classList.add('active');
    }, 6000);
}

// Ek hi baar DOMContentLoaded call karein
document.addEventListener('DOMContentLoaded', () => {
    initHeroBgSlider();
    initCtaBgSlider();
    console.log("Sliders initialized successfully!"); // Debugging ke liye
});


// ============> mockup panel images change ==================

function initPanelSlider() {
    const slides = document.querySelectorAll('.p-slide');
    const dots = document.querySelectorAll('.dot');
    let current = 0;

    if (slides.length === 0) return;

    setInterval(() => {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');

        current = (current + 1) % slides.length;

        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }, 4000); // Har 4 second mein screenshot badlega
}

// Call in DOMContentLoaded
document.addEventListener('DOMContentLoaded', initPanelSlider);