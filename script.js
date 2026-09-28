window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (!loader) return;
    if (sessionStorage.getItem('loaderShown')) {
        loader.classList.add('hidden');
        return;
    }
    sessionStorage.setItem('loaderShown', '1');
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
        { text: 'const stey = {', tokens: [{t:'const',c:'code-keyword'},{t:' stey = {'}] },
        { text: "  mood: 'cafféiné',", tokens: [{t:'  '},{t:'mood',c:'code-prop'},{t:': '},{t:"'cafféiné'",c:'code-string'},{t:','}], pause: 150 },
        { text: '  dispo: true,', tokens: [{t:'  '},{t:'dispo',c:'code-prop'},{t:': '},{t:'true',c:'code-bool'},{t:','}] },
        { text: "  délai: 'rapide',", tokens: [{t:'  '},{t:'délai',c:'code-prop'},{t:': '},{t:"'rapide'",c:'code-string'},{t:','}] },
        { text: "  prix: 'honnête',", tokens: [{t:'  '},{t:'prix',c:'code-prop'},{t:': '},{t:"'honnête'",c:'code-string'},{t:','}], pause: 100 },
        { text: '  café: Infinity,', tokens: [{t:'  '},{t:'café',c:'code-prop'},{t:': '},{t:'Infinity',c:'code-var'},{t:','}] },
        { text: '};', tokens: [{t:'};'}], pause: 250 },
        { text: '', tokens: [] },
        { text: '// si vous lisez ça, vous êtes au bon endroit', tokens: [{t:'// si vous lisez ça, vous êtes au bon endroit',c:'code-comment'}], pause: 100 },
        { text: 'export default stey;', tokens: [{t:'export default',c:'code-keyword'},{t:' stey;'}] }
    ];

    let lineIdx = 0, tokenIdx = 0, charIdx = 0;
    let currentLine = null;
    let currentSpan = null;
    const cursorEl = document.createElement('span');
    cursorEl.className = 'code-cursor';
    cursorEl.textContent = '|';

    function newLine() {
        currentLine = document.createElement('span');
        currentLine.className = 'code-line';
        container.appendChild(currentLine);
        tokenIdx = 0;
        charIdx = 0;
        currentSpan = null;
    }

    function typeChar() {
        if (lineIdx >= lines.length) {
            cursorEl.remove();
            return;
        }
        const line = lines[lineIdx];
        if (!line.tokens.length) {
            newLine();
            currentLine.innerHTML = '&nbsp;';
            lineIdx++;
            currentLine.appendChild(cursorEl);
            setTimeout(typeChar, 150);
            return;
        }
        if (!currentLine) newLine();

        const token = line.tokens[tokenIdx];
        if (!currentSpan) {
            currentSpan = document.createElement('span');
            if (token.c) currentSpan.className = token.c;
            currentLine.appendChild(currentSpan);
        }

        cursorEl.remove();
        currentSpan.textContent += token.t[charIdx];
        charIdx++;

        currentLine.appendChild(cursorEl);

        if (charIdx >= token.t.length) {
            tokenIdx++;
            charIdx = 0;
            currentSpan = null;
            if (tokenIdx >= line.tokens.length) {
                lineIdx++;
                currentLine = null;
                const pause = line.pause || 60;
                setTimeout(typeChar, pause + Math.random() * 40);
                return;
            }
        }
        const speed = 18 + Math.random() * 18;
        setTimeout(typeChar, speed);
    }

    setTimeout(typeChar, 2200);
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
        const duration = 1800;
        const start = performance.now();

        function update(now) {
            const t = Math.min((now - start) / duration, 1);
            const overshoot = t < 0.7
                ? (t / 0.7) * (target * 1.15)
                : target + (target * 0.15) * (1 - ((t - 0.7) / 0.3));
            const bounced = t < 0.85
                ? overshoot
                : target + (overshoot - target) * Math.cos(((t - 0.85) / 0.15) * Math.PI) * 0.3;
            el.textContent = Math.round(t >= 1 ? target : bounced);
            if (t < 1) requestAnimationFrame(update);
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
                    setTimeout(() => card.classList.add('tilt-ready'), i * 150 + 700);
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

if (!('ontouchstart' in window)) {
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const normX = (x / rect.width - 0.5) * 2;
            const normY = (y / rect.height - 0.5) * 2;
            card.style.transform = `perspective(800px) rotateX(${-normY * 4}deg) rotateY(${normX * 4}deg) translateY(-6px) scale(1.02)`;
            card.style.background = `radial-gradient(circle 250px at ${x}px ${y}px, rgba(244,114,182,.08), var(--glass))`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.background = '';
        });
    });
}

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

(function() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    function addGlowDiv(card, cls) {
        if (card.querySelector('.' + cls)) return card.querySelector('.' + cls);
        const glow = document.createElement('div');
        glow.className = cls;
        card.insertBefore(glow, card.firstChild);
        return glow;
    }

    function handleTilt(card, e, intensity, glowCls, glowColor) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;
        card.style.transform = `perspective(800px) rotateX(${-normY * intensity}deg) rotateY(${normX * intensity}deg) translateY(-6px) scale(1.02)`;
        const glow = addGlowDiv(card, glowCls);
        glow.style.background = `radial-gradient(circle 250px at ${x}px ${y}px, ${glowColor}, transparent)`;
    }

    function resetTilt(card) {
        card.style.transform = '';
    }

    document.querySelectorAll('.srv-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            if (!card.classList.contains('tilt-ready')) return;
            handleTilt(card, e, 5, 'srv-glow', 'rgba(139,92,246,.12)');
        });
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('tilt-ready')) return;
            card.style.transform = 'translateY(0) rotate(0deg)';
        });
    });

    document.querySelectorAll('.project-card-big').forEach(card => {
        const img = card.querySelector('.project-img');
        card.addEventListener('mousemove', e => {
            handleTilt(card, e, 4, 'card-glow', 'rgba(244,114,182,.1)');
            if (img) {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                img.style.transform = `scale(1.08) translate(${-x * 20}px, ${-y * 15}px)`;
            }
        });
        card.addEventListener('mouseleave', () => {
            resetTilt(card);
            if (img) img.style.transform = '';
        });
    });

    const heroCode = document.querySelector('.hero-code');
    if (heroCode) {
        heroCode.addEventListener('mousemove', e => {
            const rect = heroCode.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const normX = (x / rect.width - 0.5) * 2;
            const normY = (y / rect.height - 0.5) * 2;
            heroCode.style.animation = 'none';
            heroCode.style.transform = `perspective(800px) rotateX(${-normY * 6}deg) rotateY(${normX * 6}deg) scale(1.03)`;
            heroCode.style.boxShadow = `0 25px 70px rgba(0,0,0,.25), 0 0 40px rgba(139,92,246,.15)`;
            heroCode.style.borderColor = 'rgba(139,92,246,.2)';
        });
        heroCode.addEventListener('mouseleave', () => {
            heroCode.style.transform = '';
            heroCode.style.boxShadow = '';
            heroCode.style.borderColor = '';
            heroCode.style.animation = '';
        });
    }

    document.querySelectorAll('.testimonial-card').forEach(card => {
        card.addEventListener('mousemove', e => handleTilt(card, e, 3, 'card-glow', 'rgba(139,92,246,.08)'));
        card.addEventListener('mouseleave', () => resetTilt(card));
    });
})();

(function() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    document.body.appendChild(cursor);
    document.body.appendChild(dot);

    let cx = -100, cy = -100;
    let lx = -100, ly = -100;

    document.addEventListener('mousemove', e => {
        cx = e.clientX;
        cy = e.clientY;
        dot.style.left = cx + 'px';
        dot.style.top = cy + 'px';
        if (!cursor.classList.contains('visible')) {
            cursor.classList.add('visible');
            dot.classList.add('visible');
            document.body.classList.add('cursor-ready');
            lx = cx; ly = cy;
        }
    });

    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));
    document.addEventListener('mouseleave', () => { cursor.classList.remove('visible'); dot.classList.remove('visible'); });
    document.addEventListener('mouseenter', () => { cursor.classList.add('visible'); dot.classList.add('visible'); });

    const hoverSel = 'a, button, [role="button"], .srv-card, .project-card-big, .pricing-card, .faq-item';
    document.addEventListener('mouseover', e => { if (e.target.closest(hoverSel)) cursor.classList.add('hover'); });
    document.addEventListener('mouseout', e => { if (e.target.closest(hoverSel)) cursor.classList.remove('hover'); });

    function tick() {
        lx += (cx - lx) * 0.15;
        ly += (cy - ly) * 0.15;
        cursor.style.left = lx + 'px';
        cursor.style.top = ly + 'px';
        requestAnimationFrame(tick);
    }
    tick();
})();

(function() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const btns = document.querySelectorAll('.btn-primary, .btn-ghost, .btn-nav, .btn-project, .btn-primary-card, .btn-outline-card');
    btns.forEach(btn => {
        if (btn.type === 'submit') return;
        btn.classList.add('magnetic');
        const glow = document.createElement('div');
        glow.className = 'btn-glow';
        btn.appendChild(glow);
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const dx = e.clientX - (rect.left + rect.width / 2);
            const dy = e.clientY - (rect.top + rect.height / 2);
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            btn.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
            glow.style.background = `radial-gradient(circle 80px at ${x}px ${y}px, rgba(255,255,255,.15), transparent)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
})();

(function() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;
    faqItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
    });
    const faqObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                faqItems.forEach((item, i) => {
                    setTimeout(() => {
                        item.style.transition = 'opacity .5s cubic-bezier(.4,0,.2,1), transform .5s cubic-bezier(.4,0,.2,1)';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, i * 80);
                });
                faqObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    faqObs.observe(faqItems[0].parentElement);
})();

(function() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    document.querySelectorAll('.srv-card, .project-card-big').forEach(card => {
        const tags = card.querySelectorAll('.srv-tags span, .project-tech span');
        if (!tags.length) return;
        card.addEventListener('mouseenter', () => {
            tags.forEach((tag, i) => {
                tag.style.animation = 'none';
                void tag.offsetWidth;
                tag.style.animation = `tagPop .35s ${i * 0.06}s cubic-bezier(.34,1.56,.64,1) both`;
            });
        });
        card.addEventListener('mouseleave', () => {
            tags.forEach(tag => { tag.style.animation = ''; });
        });
    });
})();

document.querySelectorAll('.faq-answer').forEach(answer => {
    const inner = document.createElement('div');
    inner.className = 'faq-answer-inner';
    inner.innerHTML = answer.innerHTML;
    answer.innerHTML = '';
    answer.appendChild(inner);
});
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
    });
});

(function() {
    const steps = document.querySelectorAll('.process-step');
    if (!steps.length) return;
    const stepObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('lit');
        });
    }, { threshold: 0.5 });
    steps.forEach(step => stepObs.observe(step));
})();

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

(function() {
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
        link.addEventListener('click', e => {
            e.preventDefault();
            document.body.classList.add('page-leaving');
            setTimeout(() => { window.location.href = href; }, 300);
        });
    });
})();

(function() {
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
        const line = document.createElement('div');
        line.className = 'input-line';
        input.parentElement.appendChild(line);
    });
})();

(function() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;
    const avatar = document.querySelector('.about-avatar-img');
    if (!avatar) return;
    const parent = avatar.parentElement;
    parent.addEventListener('mousemove', e => {
        const rect = parent.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        avatar.style.transform = `rotateX(${-y * 20}deg) rotateY(${x * 20}deg) scale(1.08)`;
        avatar.style.filter = `drop-shadow(${-x * 20}px ${-y * 20}px 40px rgba(139,92,246,.4))`;
    });
    parent.addEventListener('mouseleave', () => {
        avatar.style.transform = '';
        avatar.style.filter = '';
    });
})();
