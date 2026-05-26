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
    packaging: { standard: 25000, premium: 35000, luxury: 50000 },
    branding: { standard: 15000, premium: 25000, luxury: 40000 },
    web: 150000
};

// 0.0 AUTHENTICATION GATE (Simulated)
const isLoginPage = window.location.pathname.includes('login.html');
const isLoggedIn = localStorage.getItem('akanni_node_auth') === 'true';

if (!isLoggedIn && !isLoginPage) {
    window.location.href = 'login.html';
}

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
    startCountdown();
    loadBriefs();

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

            if (service === 'packaging') {
                tierGroup.style.opacity = '1';
                tierGroup.style.pointerEvents = 'auto';
                total = RATES.packaging[tier] * qty;
            } else if (service === 'branding') {
                tierGroup.style.opacity = '1';
                tierGroup.style.pointerEvents = 'auto';
                total = RATES.branding[tier] * qty;
            } else if (service === 'web') {
                tierGroup.style.opacity = '0.3';
                tierGroup.style.pointerEvents = 'none';
                total = RATES.web;
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
    playClick();
    menu.classList.toggle('active');
}

// 0.3 INVOICE GENERATOR
function generateInvoice() {
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
    document.getElementById('ai-chat-box').classList.toggle('visible');
}

function handleImageUpload(input) {
    const messages = document.getElementById('chat-messages');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgDiv = document.createElement('div');
            imgDiv.style.margin = "10px 0";
            imgDiv.innerHTML = `
                <div style="color:var(--accent); font-size: 0.7rem; margin-bottom:5px;">Reference Sent:</div>
                <img src="${e.target.result}" style="width:100%; border-radius:10px; border:1px solid rgba(255,255,255,0.1);">
            `;
            messages.appendChild(imgDiv);
            
            // Notification Simulation
            setTimeout(() => {
                const notify = document.createElement('div');
                notify.style.cssText = "background: rgba(0,210,255,0.1); padding: 8px; border-radius: 5px; font-size: 0.7rem; color: var(--accent); margin-top:10px;";
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

    const userDiv = document.createElement('div');
    userDiv.className = "user-msg";
    userDiv.innerText = input.value;
    messages.appendChild(userDiv);

    const userText = input.value.toLowerCase();
    input.value = "";

    const aiDiv = document.createElement('div');
    aiDiv.className = "ai-msg thinking";
    aiDiv.innerText = "Node is computing...";
    messages.appendChild(aiDiv);
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
        aiDiv.classList.remove('thinking');
        
        // Enhanced Conversational Logic
        if(userText.includes("how are you") || userText.includes("how far") || userText.includes("sup")) {
            aiDiv.innerText = "CreativityByAkanni: I am operating at peak efficiency. My creative nodes are fully charged. How are you today?";
        } else if(userText.includes("hello") || userText.includes("hi")) {
            aiDiv.innerText = "CreativityByAkanni: Hello. Terminal active. I am the digital representative of Akanni Studio. What are we building today?";
        } else if(userText.includes("fine") || userText.includes("good") || userText.includes("great")) {
            aiDiv.innerText = "CreativityByAkanni: Glad to hear that. A positive mindset is the first step to a Bespoke Identity.";
        }
        // Business Enquiry Notification Trigger
        else if(userText.includes("enquiry") || userText.includes("create") || userText.includes("order") || userText.includes("price") || userText.includes("cost")) {
            aiDiv.innerText = "CreativityByAkanni: Analyzing request... Business enquiry detected. Dispatched high-priority alert to Abdulmalik.";
            
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
            aiDiv.innerText = "CreativityByAkanni: Input archived. I have logged this to the central studio node.";
        }
        messages.scrollTop = messages.scrollHeight;
    }, 1500);
}