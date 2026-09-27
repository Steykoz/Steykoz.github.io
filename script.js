window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (!loader) return;
    const lines = document.querySelectorAll('.terminal-line');
    const totalDelay = (lines.length - 1) * 150 + 100 + 300;
    setTimeout(() => {
        loader.classList.add('glitch-out');
        setTimeout(() => loader.classList.add('hidden'), 500);
    }, totalDelay);
});

const header = document.getElementById('header');
const scrollProgress = document.getElementById('scroll-progress');
const backToTop = document.getElementById('back-to-top');
const mobileCta = document.getElementById('mobile-cta');
const contactSection = document.getElementById('contact');
const heroLeft = document.querySelector('.hero-left');
const heroVisual = document.querySelector('.hero-visual');
const heroHeight = window.innerHeight;

let ticking = false;
window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        if (header && scrollProgress) {
            header.classList.toggle('scrolled', scrollY > 50);
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress.style.width = (scrollY / docHeight) * 100 + '%';
        }

        if (heroLeft && scrollY < heroHeight) {
            heroLeft.style.transform = `translateY(${scrollY * 0.1}px)`;
            heroVisual.style.transform = `translateY(${scrollY * 0.15}px)`;
        }

        if (backToTop) {
            backToTop.classList.toggle('visible', scrollY > 500);
            if (mobileCta) {
                const contactTop = contactSection ? contactSection.getBoundingClientRect().top : Infinity;
                mobileCta.classList.toggle('visible', scrollY > 400 && contactTop > heroHeight * 0.5);
            }
        }

        ticking = false;
    });
}, { passive: true });

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

const words = ['sites web', 'bots Discord', 'scripts FiveM', 'automatisations', 'landing pages'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed');

function type() {
    if (!typedEl) return;
    const currentWord = words[wordIndex];

    if (isDeleting) {
        typedEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400;
    }

    setTimeout(type, speed);
}
if (typedEl) setTimeout(type, 1000);

(function() {
    const container = document.getElementById('hero-code-body');
    if (!container) return;
    const lines = [
        '<span class="code-keyword">const</span> <span class="code-var">stey</span> = {',
        '  <span class="code-prop">mood</span>: <span class="code-string">\'cafféiné\'</span>,',
        '  <span class="code-prop">dispo</span>: <span class="code-bool">true</span>,',
        '  <span class="code-prop">délai</span>: <span class="code-string">\'rapide\'</span>,',
        '  <span class="code-prop">prix</span>: <span class="code-string">\'honnête\'</span>,',
        '  <span class="code-prop">café</span>: <span class="code-var">Infinity</span>,',
        '};',
        '',
        '<span class="code-comment">// si vous lisez ça, vous êtes au bon endroit</span>',
        '<span class="code-keyword">export default</span> stey;'
    ];
    let lineIdx = 0;
    function typeLine() {
        if (lineIdx >= lines.length) return;
        const span = document.createElement('span');
        span.className = 'code-line code-line-typing';
        span.innerHTML = lines[lineIdx] || '&nbsp;';
        container.appendChild(span);
        lineIdx++;
        setTimeout(typeLine, 120 + Math.random() * 80);
    }
    setTimeout(typeLine, 2000);
})();

(function() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;
    let animRunning = true;

    function resize() {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const colors = ['rgba(139,92,246,', 'rgba(244,114,182,', 'rgba(251,146,60,', 'rgba(255,255,255,'];
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            r: Math.random() * 2.5 + 0.5,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    function animate() {
        if (!animRunning) return;
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color + '0.4)';
            ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = dx * dx + dy * dy;
                if (dist < 14400) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(244,114,182,' + (1 - Math.sqrt(dist) / 120) * 0.12 + ')';
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    const canvasObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animRunning) { animRunning = true; animate(); }
            } else {
                animRunning = false;
            }
        });
    }, { threshold: 0 });
    canvasObserver.observe(canvas);

    animate();
})();

function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add('animated'), delay);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

const pricingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.pricing-features li');
            items.forEach((li, i) => {
                li.style.opacity = '0';
                li.style.transform = 'translateX(-10px)';
                li.style.transition = `all .3s ${i * 0.08}s`;
                setTimeout(() => {
                    li.style.opacity = '1';
                    li.style.transform = 'translateX(0)';
                }, 50);
            });
            pricingObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });
document.querySelectorAll('.pricing-card').forEach(card => pricingObserver.observe(card));

const compareBtn = document.getElementById('compare-btn');
const compareContent = document.getElementById('compare-content');
if (compareBtn && compareContent) {
    compareBtn.addEventListener('click', () => {
        compareBtn.classList.toggle('active');
        compareContent.classList.toggle('open');
    });
}

(function() {
    const slider = document.getElementById('services-slider');
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => { isDown = false; slider.style.cursor = 'grab'; });
    slider.addEventListener('mouseup', () => { isDown = false; slider.style.cursor = 'grab'; });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
    });

    const cards = document.querySelectorAll('.srv-card');
    const srvObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                cards.forEach((card, i) => {
                    setTimeout(() => card.classList.add('visible'), i * 150);
                });
                srvObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    srvObserver.observe(slider);
})();

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href === '#' || href === '#top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const normX = x / rect.width - 0.5;
        const normY = y / rect.height - 0.5;
        card.style.transform = `translateY(-4px) perspective(600px) rotateX(${-normY * 4}deg) rotateY(${normX * 4}deg)`;
        card.style.background = `radial-gradient(circle 200px at ${x}px ${y}px, rgba(244,114,182,.06), var(--glass))`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.background = '';
    });
});

(function() {
    const bubbleContainer = document.createElement('div');
    bubbleContainer.className = 'bg-bubbles';
    document.body.appendChild(bubbleContainer);

    for (let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bg-bubble';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.width = (Math.random() * 60 + 20) + 'px';
        bubble.style.height = bubble.style.width;
        bubble.style.animationDuration = (Math.random() * 15 + 15) + 's';
        bubble.style.animationDelay = -(Math.random() * 20) + 's';
        bubble.style.opacity = (Math.random() * 0.06 + 0.02);
        bubbleContainer.appendChild(bubble);
    }
})();

(function() {
    const container = document.getElementById('floating-logos');
    if (!container) return;
    function makeLogo(id) {
        return `<svg viewBox="0 0 160 50" width="90" height="30"><defs><linearGradient id="fg${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#d946ef"/><stop offset="40%" stop-color="#8B5CF6"/><stop offset="70%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#fb923c"/></linearGradient></defs><path d="M28 38 C20 38 13 35 13 30 C13 25 18 23 25 22 C32 21 37 19 37 14 C37 9 32 6 25 6 C19 6 15 9 14 12 C13 14 11 12 11 10 C12 5 18 1 26 1 C35 1 42 5 42 12 C42 19 36 22 28 23 C21 24 17 26 17 30 C17 34 21 36 27 36 C32 36 35 34 36 32" fill="url(#fg${id})"/><path d="M48 10 L48 36 C48 40 50 41 53 40 L53 38 C51 39 50 38 50 36 L50 10 Z" fill="url(#fg${id})"/><rect x="44" y="16" width="14" height="3" rx="1" fill="url(#fg${id})"/><path d="M62 26 L76 26 C76 20 73 16 68 16 C63 16 60 20 60 26 C60 32 63 37 69 37 C73 37 75 35 76 33 L74 32 C73 34 71 35 69 35 C65 35 62 32 62 28 Z M62 24 C62 21 64 18 68 18 C72 18 74 21 74 24 Z" fill="url(#fg${id})"/><path d="M82 16 L91 34 L85 16 L83 16 Z" fill="url(#fg${id})"/><path d="M100 16 L91 34 C88 40 85 44 80 46 L82 44 C86 42 88 39 91 34 L98 16 Z" fill="url(#fg${id})"/><circle cx="108" cy="36" r="3" fill="#fb923c"/></svg>`;
    }

    for (let i = 0; i < 12; i++) {
        const el = document.createElement('div');
        el.className = 'floating-logo';
        el.innerHTML = makeLogo(i);
        el.style.left = Math.random() * 90 + '%';
        el.style.top = Math.random() * 90 + '%';
        el.style.setProperty('--dur', (15 + Math.random() * 20) + 's');
        el.style.setProperty('--delay', -(Math.random() * 15) + 's');
        el.style.transform = `scale(${0.8 + Math.random() * 1.5}) rotate(${Math.random() * 30 - 15}deg)`;
        container.appendChild(el);
    }
})();

(function() {
    const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let index = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === code[index]) {
            index++;
            if (index === code.length) {
                document.body.classList.add('konami-active');
                const msg = document.createElement('div');
                msg.className = 'konami-popup';
                msg.innerHTML = '<p>GG ! Tu connais le Konami Code.</p><p style="font-size:.85rem;margin-top:8px;color:var(--text2)">Bonus : -10% sur ta prochaine commande. Dis "konami" dans ton message.</p>';
                msg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:99999;background:var(--bg2);border:2px solid var(--pink);border-radius:20px;padding:40px;text-align:center;font-family:var(--font-head);font-size:1.2rem;box-shadow:0 20px 60px rgba(244,114,182,.3);animation:fadeIn .5s forwards;';
                document.body.appendChild(msg);
                setTimeout(() => msg.remove(), 5000);
                index = 0;

                for (let i = 0; i < 50; i++) {
                    setTimeout(() => {
                        const spark = document.createElement('div');
                        const sz = (Math.random() * 8 + 4) + 'px';
                        spark.style.cssText = `position:fixed;pointer-events:none;z-index:9998;border-radius:50%;left:${Math.random() * window.innerWidth}px;top:${Math.random() * window.innerHeight}px;width:${sz};height:${sz};background:${['#8B5CF6','#f472b6','#fb923c','#d946ef','#34d399'][Math.floor(Math.random() * 5)]};opacity:1;transition:opacity .5s,transform .5s;`;
                        document.body.appendChild(spark);
                        requestAnimationFrame(() => { spark.style.opacity = '0'; spark.style.transform = 'scale(0) translateY(-20px)'; });
                        setTimeout(() => spark.remove(), 600);
                    }, i * 30);
                }
            }
        } else {
            index = 0;
        }
    });
})();

document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
    });
});

document.querySelectorAll('[data-select]').forEach(btn => {
    btn.addEventListener('click', () => {
        const val = btn.dataset.select;
        setTimeout(() => {
            const select = document.querySelector('select[name="type"]');
            if (select) select.value = val;
        }, 800);
    });
});

const contactForm = document.getElementById('contact-form');
if (contactForm) contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.textContent = 'Envoi en cours...';
    btn.disabled = true;

    const formData = new FormData(e.target);
    formData.append('access_key', '2ad3c1ee-d9fb-4fee-afea-1a256d6f2ec3');
    formData.append('subject', 'Nouveau message portfolio — ' + (formData.get('name') || 'Anonyme'));
    formData.append('from_name', 'Portfolio Stey');

    function showToast(message, success) {
        const toast = document.getElementById('form-toast');
        toast.textContent = message;
        toast.style.borderColor = success ? 'rgba(52,211,153,.3)' : 'rgba(239,68,68,.3)';
        toast.style.background = success ? 'rgba(52,211,153,.15)' : 'rgba(239,68,68,.15)';
        toast.style.color = success ? 'var(--green)' : '#ef4444';
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 4000);
    }

    try {
        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (data.success) {
            btn.textContent = 'Message envoyé !';
            btn.style.background = 'var(--green)';
            e.target.reset();
            showToast('Message envoyé avec succes !', true);
        } else {
            btn.textContent = 'Erreur, réessaie';
            btn.style.background = '#ef4444';
            showToast('Erreur lors de l\'envoi. Réessaie.', false);
        }
    } catch {
        btn.textContent = 'Erreur réseau';
        btn.style.background = '#ef4444';
        showToast('Erreur réseau. Vérifie ta connexion.', false);
    }

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
    }, 3000);
});
