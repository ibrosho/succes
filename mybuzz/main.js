// 0.0 SOUND ENGINE (High-Fidelity Audio Cues)
const playClick = () => {
    const audio = new Audio('https://www.soundjay.com/buttons/button-50.mp3'); // Subtle mechanical click
    audio.volume = 0.1;
    audio.play().catch(() => {}); // Prevent browser block errors
};

const playNotify = () => {
    const audio = new Audio('https://www.soundjay.com/communication/beep-07.mp3');
    audio.volume = 0.05;
    audio.play().catch(() => {});
};

// PRICING CONFIGURATION (Single source of truth)
const RATES = {
    packaging: { standard: 120000, premium: 160000, luxury: 190000 },
    branding: { standard: 5000, premium: 85000, luxury: 50000 },
    paper_bags: { standard: 85000, premium: 98000, luxury: 120000 },
    web: { standard: 5000000, premium: 7500000, luxury: 10000000 }
};

const PROJECT_DATA = {
    'royal-bag': {
        title: 'Royal Bag Identity',
        category: 'PACKAGING NODE',
        image: 'royal-bag.png',
        challenge: 'The client required a packaging solution that balanced eco-friendly materials with high-end luxury aesthetics for a boutique fashion house.',
        solution: 'We deployed a custom-weighted nylon structure with matte finishes and minimalist typography, emphasizing the brand’s premium positioning.'
    }
};

// 0.0 AUTHENTICATION GATE (Simulated)
const isLoginPage = window.location.pathname.includes('login.html');
function logout() {
    const modal = document.getElementById('logout-modal');
    if (modal) {
        modal.classList.add('active');
        // Turn the status dot red when initiating termination
        const dot = document.querySelector('.status-dot');
        if (dot) dot.classList.add('disconnected');
    }
}

function cancelLogout() {
    const modal = document.getElementById('logout-modal');
    if (modal) {
        modal.classList.remove('active');
        // Return to stable green state
        const dot = document.querySelector('.status-dot');
        if (dot) dot.classList.remove('disconnected');
    }
}

function confirmLogout() {
    localStorage.removeItem('akanni_node_auth');
    window.location.href = 'login.html';
}

// 0.1 INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // System Diagnostic Sequence
    const loader = document.getElementById('preloader');
    const log = document.getElementById('loader-log');
    const messages = ["[OK] Mesh Engine Active", "[OK] Encryption Secure", "[OK] Assets Verified"];
    
    if(log) {
        messages.forEach((msg, i) => {
            setTimeout(() => {
                const entry = document.createElement('div');
                entry.innerText = msg;
                log.appendChild(entry);
            }, i * 300);
        });
    }

    setTimeout(() => { if (loader) loader.classList.add('hidden'); }, 1500);

    // Folder Icon Logic
    const folder = document.getElementById('folder-status');
    const vaultCard = folder?.closest('.stat-card');
    if (vaultCard) {
        vaultCard.addEventListener('mouseenter', () => folder.innerText = '📂');
        vaultCard.addEventListener('mouseleave', () => folder.innerText = '📁');
    }
    
    startScramble();
    
    // 0.2 CASE STUDY INJECTION
    const csTitle = document.getElementById('cs-title');
    if (csTitle) {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');
        const data = PROJECT_DATA[projectId] || PROJECT_DATA['royal-bag'];
        csTitle.innerText = data.title;
        document.getElementById('cs-category').innerText = data.category;
        document.getElementById('cs-image').src = data.image;
        document.getElementById('cs-challenge').innerText = data.challenge;
        document.getElementById('cs-solution').innerText = data.solution;
    }
    startCountdown();
    if (document.getElementById('briefs-list')) loadBriefs();

    // 0.3 PRICING CALCULATOR ENGINE
    const serviceSel = document.getElementById('calc-service');
    const tierSel = document.getElementById('calc-tier');
    const qtyInput = document.getElementById('calc-qty');
    
    if (serviceSel) {
        const updateCalculator = () => {
            const service = serviceSel.value;
            const tier = tierSel.value;
            const qty = qtyInput.value;
            document.getElementById('qty-val').innerText = qty * 100;

            let total = 0;
            const tierGroup = document.getElementById('calc-tier-group');

            if (service === 'web') {
                tierGroup.style.opacity = '0.3';
                tierGroup.style.pointerEvents = 'none';
                total = RATES.web;
            } else {
                tierGroup.style.opacity = '1';
                tierGroup.style.pointerEvents = 'auto';
                if (RATES[service]) {
                    total = RATES[service][tier] * qty;
                }
            }

            document.getElementById('calc-total').innerText = '₦' + total.toLocaleString();
            const hiddenTotal = document.getElementById('hidden-total');
            if(hiddenTotal) hiddenTotal.value = total; // Store raw number or formatted string
        };

        [serviceSel, tierSel, qtyInput].forEach(el => el.addEventListener('input', updateCalculator));
        updateCalculator();
    }

    // AUTO-GREETING: Opens chat after 5 seconds
    setTimeout(() => {
        const chatBox = document.getElementById('ai-chat-box');
        if (chatBox && !chatBox.classList.contains('visible')) {
            toggleChat();
        }
    }, 5000);
});

// 0.2 PROJECT COUNTDOWN LOGIC
function startCountdown() {
    const timerDisplay = document.getElementById('countdown-timer');
    if (!timerDisplay) return;

    // Set target: 14 days from now for this specific project
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timerDisplay.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) { clearInterval(timerInterval); timerDisplay.innerText = "DEPLOYED"; }
    };

    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

// 0. DYNAMIC SCROLL SPEED FOR MARQUEE
let lastScrollTop = 0;
let marqueeBaseSpeed = 20;
const root = document.querySelector(':root');

window.addEventListener('scroll', () => {
    let st = window.pageYOffset || document.documentElement.scrollTop;
    let velocity = Math.abs(st - lastScrollTop);
    
    // SCROLL PROGRESS BAR
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (st / scrollHeight) * 100;
    if(scrollProgress) scrollProgress.style.width = scrolled + "%";

    // Increase speed based on velocity (lower number = faster in CSS duration)
    let newSpeed = Math.max(2, marqueeBaseSpeed - (velocity / 5));
    root.style.setProperty('--marquee-speed', `${newSpeed}s`);

    // Smoothly return to base speed after a delay
    clearTimeout(window.scrollFinished);
    window.scrollFinished = setTimeout(() => {
        root.style.setProperty('--marquee-speed', '20s');
    }, 150);

    lastScrollTop = st <= 0 ? 0 : st;
});

// 0.1 THEME TOGGLE
function toggleTheme() {
    document.body.classList.toggle('theme-alt');
    // Sync toggle icons if needed
    const icons = document.querySelectorAll('.theme-toggle');
    icons.forEach(i => i.innerText = document.body.classList.contains('theme-alt') ? '☀️' : '🌓');
}

// 0.2 MENU TOGGLE
function toggleMenu() {
    const menu = document.getElementById('full-menu');
    if (menu) {
        playClick();
        menu.classList.toggle('active');
    }
}

// 0.3 INVOICE GENERATOR
function generateInvoice() {
    const total = document.getElementById('calc-total').innerText;
    if (total === "₦0" || total === "₦0.00") {
        const messages = document.getElementById('chat-messages');
        const aiDiv = document.createElement('div');
        aiDiv.className = "ai-msg";
        aiDiv.innerText = "CreativityByAkanni: Please configure the module variables before generating an invoice protocol.";
        messages.appendChild(aiDiv);
        return;
    }
    window.print();
}

// 0.4 DYNAMIC LIGHTBOX ENGINE
function openLightbox(event, src) {
    event.preventDefault();
    const lb = document.getElementById('studio-lightbox');
    const img = document.getElementById('lightbox-img');
    if (lb && img) {
        img.src = src;
        lb.classList.add('active');
        playClick(); // High-fidelity interaction sound
    }
}

function closeLightbox() {
    const lb = document.getElementById('studio-lightbox');
    if (lb) lb.classList.remove('active');
}

// 0.5 PROJECT BRIEF ENGINE
function handleBriefUpload(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const briefRef = {
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            date: new Date().toLocaleDateString()
        };

        // Save reference to local storage
        let briefs = JSON.parse(localStorage.getItem('akanni_project_briefs')) || [];
        briefs.push(briefRef);
        localStorage.setItem('akanni_project_briefs', JSON.stringify(briefs));

        playClick();
        displayBrief(briefRef);
        
        // Notify AI
        const messages = document.getElementById('chat-messages');
        const aiDiv = document.createElement('div');
        aiDiv.className = "ai-msg";
        aiDiv.innerText = `CreativityByAkanni: Protocol updated. Brief "${file.name}" has been indexed in the local node.`;
        messages.appendChild(aiDiv);
    }
}

function loadBriefs() {
    const briefs = JSON.parse(localStorage.getItem('akanni_project_briefs')) || [];
    briefs.forEach(brief => displayBrief(brief));
}

function displayBrief(brief) {
    const list = document.getElementById('briefs-list');
    if (!list) return;
    
    const item = document.createElement('div');
    item.className = "vault-item reveal active";
    item.innerHTML = `
        <span>${brief.name} <small style="color:#555">(${brief.size})</small></span>
        <span style="font-size: 0.7rem; color: var(--accent);">${brief.date}</span>
    `;
    list.appendChild(item);
}

// 1. FLUID INTERACTIVE MESH
let meshX = 50;
let meshY = 50;
let targetMeshX = 50;
let targetMeshY = 50;

window.addEventListener('mousemove', (e) => {
    targetMeshX = (e.clientX / window.innerWidth) * 100;
    targetMeshY = (e.clientY / window.innerHeight) * 100;
});

function animateMesh() {
    // The 0.05 factor controls the "fluidity" - lower is smoother/slower
    meshX += (targetMeshX - meshX) * 0.05;
    meshY += (targetMeshY - meshY) * 0.05;
    root.style.setProperty('--mouse-x', `${meshX}%`);
    root.style.setProperty('--mouse-y', `${meshY}%`);
    requestAnimationFrame(animateMesh);
}
animateMesh();

// 2. TEXT SCRAMBLE EFFECT
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function startScramble() {
    const elements = document.querySelectorAll("[data-value]");
    elements.forEach(el => {
        let iteration = 0;
        const interval = setInterval(() => {
            el.innerText = el.dataset.value.split("")
                .map((letter, index) => {
                    if(index < iteration) return el.dataset.value[index];
                    return letters[Math.floor(Math.random() * 26)]
                })
                .join("");
            
            if(iteration >= el.dataset.value.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);
    });
}

// 3. 3D TILT EFFECT FOR PROJECTS
document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// 4. MAGNETIC BUTTONS
const magnets = document.querySelectorAll('.magnetic');
magnets.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0px, 0px)`;
    });
});

// 5. SCROLL REVEAL
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 6. FUNCTIONAL AI CHAT
function toggleChat() {
    const chatBox = document.getElementById('ai-chat-box');
    const launcher = document.querySelector('.ai-chat-launcher');
    
    chatBox.classList.toggle('visible');
    if (chatBox.classList.contains('visible')) {
        launcher.classList.remove('unread');
    }
}

function handleImageUpload(input) {
    const messages = document.getElementById('chat-messages');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgDiv = document.createElement('div');
            imgDiv.style.margin = "10px 0";
            imgDiv.innerHTML = `
                <div class="ai-msg-ref-header">Reference Sent:</div>
                <img src="${e.target.result}" class="ai-msg-img" alt="Uploaded Reference">
            `;
            messages.appendChild(imgDiv);
            
            // Notification Simulation
            setTimeout(() => {
                const notify = document.createElement('div');
                notify.className = "system-notification-box";
                notify.innerText = "SYSTEM: Reference received. Lead node (Akanni) has been notified.";
                messages.appendChild(notify);
                messages.scrollTop = messages.scrollHeight;
            }, 1000);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function sendMessage() {
    const input = document.querySelector('#ai-chat-box input[type="text"]');
    const messages = document.getElementById('chat-messages');
    
    if (input.value.trim() === "") return;

    const chatBox = document.getElementById('ai-chat-box');
    const launcher = document.querySelector('.ai-chat-launcher');
    let storedName = localStorage.getItem('akanni_user_name') || "";

    const userDiv = document.createElement('div');
    userDiv.className = "user-msg";
    userDiv.innerText = input.value;
    messages.appendChild(userDiv);

    const userText = input.value.toLowerCase();
    input.value = "";

    // Extract Name Memory
    if (userText.includes("my name is")) {
        const namePart = userText.split("my name is")[1].trim();
        storedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        localStorage.setItem('akanni_user_name', storedName);
    }

    const aiDiv = document.createElement('div');
    aiDiv.className = "ai-msg thinking";
    aiDiv.innerText = "Node is computing...";
    messages.appendChild(aiDiv);
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
        aiDiv.classList.remove('thinking');
        
        // Enhanced Conversational Logic
        if(userText.includes("where are you from") || userText.includes("location") || userText.includes("your base")) {
            aiDiv.innerText = "CreativityByAkanni: I am a digital intelligence hosted within the Akanni Creative Studio cloud. Our primary design node is based in Nigeria, serving brands globally.";
        } else if(userText.includes("paper bag") || userText.includes("nylon bag") || userText.includes("packaging")) {
            const p = RATES.packaging;
            aiDiv.innerText = greetingPrefix + `Ah, packaging! We offer three primary tiers for 100pcs: Standard (₦${p.standard.toLocaleString()}), Premium (₦${p.premium.toLocaleString()}), and Luxury (₦${p.luxury.toLocaleString()}). Which protocol shall we initialize?`;
            
            // Trigger business enquiry for this as well
            launcher.classList.add('shake');
            setTimeout(() => launcher.classList.remove('shake'), 1000);
            setTimeout(() => {
                const sysMsg = document.createElement('div');
                sysMsg.className = "ai-msg system";
                sysMsg.innerText = "NODE ALERT: Packaging enquiry detected. Encrypted packet dispatched to Abdulmalik.";
                messages.appendChild(sysMsg);
                messages.scrollTop = messages.scrollHeight;
                fetch('https://formspree.io/f/xpqnyyqw', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ alert: "PACKAGING ENQUIRY", client_message: userText, estimated_price: document.getElementById('calc-total')?.innerText || "N/A" }) });
            }, 1000);
        } else if(userText.includes("website") || userText.includes("web development") || userText.includes("site")) {
            aiDiv.innerText = greetingPrefix + "Web architecture is our forte. We build high-fidelity, conversion-focused websites. Do you require a Portfolio or E-commerce node?";
            // Trigger business enquiry for this as well
            launcher.classList.add('shake');
            setTimeout(() => launcher.classList.remove('shake'), 1000);
            setTimeout(() => {
                const sysMsg = document.createElement('div');
                sysMsg.className = "ai-msg system";
                sysMsg.innerText = "NODE ALERT: Web development enquiry detected. Encrypted packet dispatched to Abdulmalik.";
                messages.appendChild(sysMsg);
                messages.scrollTop = messages.scrollHeight;
                fetch('https://formspree.io/f/xpqnyyqw', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ alert: "WEB DEVELOPMENT ENQUIRY", client_message: userText, estimated_price: document.getElementById('calc-total')?.innerText || "N/A" }) });
            }, 1000);
        } else if(userText.includes("how are you") || userText.includes("how far") || userText.includes("sup")) {
            aiDiv.innerText = greetingPrefix + "I am operating at peak efficiency. My creative nodes are fully charged. How are you today?";
        } else if(userText.includes("hello") || userText.includes("hi")) {
            aiDiv.innerText = greetingPrefix + "Hello. Terminal active. I am the digital representative of Akanni Studio. What are we building today?";
        } else if(userText.includes("fine") || userText.includes("good") || userText.includes("great")) {
            aiDiv.innerText = greetingPrefix + "Glad to hear that. A positive mindset is the first step to a Bespoke Identity.";
        }
        // Business Enquiry Notification Trigger
        else if(userText.includes("enquiry") || userText.includes("create") || userText.includes("order") || userText.includes("price") || userText.includes("cost") || userText.includes("logo") || userText.includes("design")) {
            aiDiv.innerText = greetingPrefix + "Analyzing request... I've detected a project enquiry. Dispatched high-priority alert to Abdulmalik.";
            
            setTimeout(() => {
                const sysMsg = document.createElement('div');
                sysMsg.className = "ai-msg system";
                sysMsg.innerText = "NODE ALERT: Encrypted packet sent to Abdulmalik. He is now monitoring this terminal.";
                messages.appendChild(sysMsg);
                
                const finalAiMsg = document.createElement('div');
                finalAiMsg.className = "ai-msg";
                finalAiMsg.innerText = "CreativityByAkanni: While we wait for his response, shall I show you our branding tiers or our latest nylon packaging projects?";
                messages.appendChild(finalAiMsg);
                messages.scrollTop = messages.scrollHeight;
            }, 1000);
        } else {
            aiDiv.innerText = greetingPrefix + "Input archived. I have logged this request to the central studio node.";
        }
        messages.scrollTop = messages.scrollHeight;
    }, 1500);
}