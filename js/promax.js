/* StashrNode UI/UX ProMax — Scroll reveals, parallax, particles, cursor glow */
(function () {
  'use strict';

  /* ── IntersectionObserver scroll reveals ── */
  function initReveals() {
    var els = document.querySelectorAll('[data-sr]');
    if (!els.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('sr-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el, i) {
      var type = el.getAttribute('data-sr') || 'up';
      var cls = type === 'left' ? 'sr-left' : type === 'right' ? 'sr-right' : type === 'scale' ? 'sr-scale' : 'sr-hidden';
      el.classList.add(cls);
      el.style.setProperty('--i', i % 8);
      obs.observe(el);
    });
  }

  /* ── Navbar glass on scroll ── */
  function initNavScroll() {
    var nav = document.querySelector('nav.sticky');
    if (!nav) return;
    var last = 0;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y > 60) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
      last = y;
    }, { passive: true });
  }

  /* ── Floating particles in hero ── */
  function initParticles() {
    var hero = document.querySelector('[data-hero]') || document.body;
    var count = 20;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      var size = Math.random() * 4 + 2;
      var x = Math.random() * 100;
      var dur = Math.random() * 12 + 8;
      var delay = Math.random() * 10;
      p.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + x + '%;bottom:-10px;background:rgba(0,184,255,' + (Math.random() * 0.4 + 0.1) + ');animation-duration:' + dur + 's;animation-delay:' + delay + 's;';
      hero.appendChild(p);
    }
  }

  /* ── Glow orbs in background ── */
  function initGlowOrbs() {
    var target = document.querySelector('[data-hero]') || document.body;
    target.style.position = target.style.position || 'relative';
    var orbs = [
      { size: 400, x: '10%', y: '20%', color: '0,184,255', dur: '10s' },
      { size: 300, x: '80%', y: '60%', color: '32,240,255', dur: '12s' },
      { size: 350, x: '50%', y: '80%', color: '82,112,253', dur: '14s' },
    ];
    orbs.forEach(function (o, i) {
      var el = document.createElement('div');
      el.className = 'glow-orb';
      el.style.cssText = 'width:' + o.size + 'px;height:' + o.size + 'px;left:' + o.x + ';top:' + o.y + ';background:rgba(' + o.color + ',0.15);animation-duration:' + o.dur + ';animation-delay:' + (i * 2) + 's;';
      target.appendChild(el);
    });
  }

  /* ── Cursor glow ── */
  function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    var g = document.createElement('div');
    g.className = 'cursor-glow';
    document.body.appendChild(g);
    var mx = 0, my = 0, gx = 0, gy = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      g.classList.add('active');
    });
    document.addEventListener('mouseleave', function () {
      g.classList.remove('active');
    });
    function tick() {
      gx += (mx - gx) * 0.08;
      gy += (my - gy) * 0.08;
      g.style.left = gx + 'px';
      g.style.top = gy + 'px';
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ── Magnetic buttons ── */
  function initMagnetic() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('a[href="#plans"] button, .mag-btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.15) + 'px,' + (y * 0.15) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ── Smooth anchor scroll ── */
  function initSmoothAnchor() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ── Parallax on scroll ── */
  function initParallax() {
    var els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      els.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
        var r = el.getBoundingClientRect();
        if (r.bottom > -200 && r.top < window.innerHeight + 200) {
          el.style.transform = 'translateY(' + (y * speed * -0.1) + 'px)';
        }
      });
    }, { passive: true });
  }

  /* ── Billing cycle switcher (Monthly/Annually) ──
     Works with Alpine when alive (delegates to it) and falls back to plain
     DOM updates when Alpine never initialized the page on this static host. */
  function initBillingFallback() {
    var monthlyBtn = document.querySelector('[x-ref="monthlyBtn"]');
    var annuallyBtn = document.querySelector('[x-ref="annuallyBtn"]');
    if (!monthlyBtn || !annuallyBtn) return;

    var annual = true; // static markup defaults to Annually
    var pill = null;
    var kids = annuallyBtn.parentNode ? annuallyBtn.parentNode.children : [];
    for (var i = 0; i < kids.length; i++) {
      if (kids[i].tagName === 'DIV' && kids[i].classList.contains('absolute')) { pill = kids[i]; break; }
    }

    function markBtn(btn, active) {
      btn.classList.toggle('text-[#022154]', active);
      btn.classList.toggle('font-bold', active);
      btn.classList.toggle('text-[#869BC4]', !active);
    }

    function placePill() {
      if (!pill) return;
      var btn = annual ? annuallyBtn : monthlyBtn;
      pill.style.left = btn.offsetLeft + 'px';
      pill.style.width = btn.offsetWidth + 'px';
      pill.style.background = 'linear-gradient(180deg, #20F0FF 0%, #00B8FF 47%)';
      pill.style.boxShadow = '0px 0px 18.77px rgba(0, 64, 157, 1)';
    }

    function pkOf(card) {
      var raw = card.getAttribute('x-data') || '';
      var m = raw.match(/pkPrice:\s*(\d+)/);
      return m ? parseInt(m[1], 10) : 0;
    }

    function pricesMatch(annualMode) {
      var card = document.querySelector('[x-data*="pkPrice"]');
      if (!card) return true;
      var pk = pkOf(card);
      if (!pk) return true;
      var base = Math.round((pk / 280) * 100) / 100;
      var want = annualMode ? (Math.round(base * 0.8 * 100) / 100).toFixed(2) : base.toFixed(2);
      var disp = card.querySelector('[x-text="displayPrice"]');
      return !disp || (disp.textContent || '').trim() === want;
    }

    function manualApply() {
      markBtn(monthlyBtn, !annual);
      markBtn(annuallyBtn, annual);
      placePill();

      document.querySelectorAll('[x-show*="Annually"]').forEach(function (el) {
        if (annual) { el.style.display = ''; el.removeAttribute('x-cloak'); }
        else el.style.display = 'none';
      });

      document.querySelectorAll('[x-data*="pkPrice"]').forEach(function (card) {
        var pk = pkOf(card);
        if (!pk) return;
        var base = Math.round((pk / 280) * 100) / 100;

        var line = card.querySelector('[x-text*="currentPrice.toFixed"]');
        if (line) line.textContent = '$' + base.toFixed(2);

        var disp = card.querySelector('[x-text="displayPrice"]');
        if (disp) disp.textContent = annual ? (Math.round(base * 0.8 * 100) / 100).toFixed(2) : base.toFixed(2);

        var pkr = card.querySelector('[x-text*="PKR"]');
        if (pkr) pkr.textContent = (annual ? Math.round(pk * 0.8) : pk) + ' PKR';

        var billed = card.querySelector('[x-text*="annualTotal"]');
        if (billed) billed.textContent = '$' + (Math.round(base * 0.8 * 1200) / 100).toFixed(2);
      });

      document.querySelectorAll('a[href*="cycle="]').forEach(function (a) {
        var href = a.getAttribute('href') || '';
        var next = annual ? 'annually' : 'monthly';
        if (href.indexOf('&cycle=') !== -1) {
          a.setAttribute('href', href.replace(/&cycle=(monthly|annually)/, '&cycle=' + next));
        } else if (href.indexOf('?cycle=') !== -1) {
          a.setAttribute('href', href.replace(/\?cycle=(monthly|annually)/, '?cycle=' + next));
        }
      });
    }

    function setCycle(val) {
      annual = val;
      var delegated = false;
      try {
        var root = document.querySelector('[x-data*="activeCycle"]');
        if (window.Alpine && typeof window.Alpine.$data === 'function' && root) {
          Alpine.$data(root).activeCycle = annual ? 'Annually' : 'Monthly';
          delegated = true;
        }
      } catch (e) { delegated = false; }
      if (delegated) {
        // Give Alpine a beat; if it never reactively updated prices, go manual.
        setTimeout(function () {
          if (!pricesMatch(annual)) manualApply();
        }, 90);
      } else {
        manualApply();
      }
    }

    manualApply();
    monthlyBtn.addEventListener('click', function () { setCycle(false); });
    annuallyBtn.addEventListener('click', function () { setCycle(true); });
  }

  /* ── Image & content protection (block save/copy/download) ── */
  function initImageProtection() {
    document.addEventListener('contextmenu', function (e) {
      var t = e.target;
      if (t && (t.tagName === 'IMG' || t.tagName === 'SVG' || (t.closest && t.closest('img, svg, picture, video')))) {
        e.preventDefault();
      }
    });
    document.addEventListener('dragstart', function (e) {
      if (e.target && e.target.tagName === 'IMG') e.preventDefault();
    });
    document.addEventListener('selectstart', function (e) {
      if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'SVG')) e.preventDefault();
    });
    document.addEventListener('copy', function (e) {
      if (e.target && e.target.tagName === 'IMG') e.preventDefault();
    });
    document.addEventListener('keydown', function (e) {
      var kd = e.ctrlKey || e.metaKey;
      var k = (e.key || '').toLowerCase();
      if (kd && ['s', 'u', 'p', 'c', 'a'].indexOf(k) !== -1) e.preventDefault();
      if (e.key === 'F12' || (kd && e.shiftKey && ['i', 'j', 'c'].indexOf(k) !== -1)) e.preventDefault();
      if (e.key === 'PrintScreen') e.preventDefault();
    });
  }

  /* ── FAQ open/close helper (keeps panel animation classes in sync) ── */
  function initFaq() {
    document.querySelectorAll('details[data-faq]').forEach(function (d) {
      var inner = d.querySelector('div');
      if (!inner) return;
      d.addEventListener('toggle', function () {
        if (d.open) inner.classList.add('faq-open');
        else inner.classList.remove('faq-open');
      });
    });
  }

  /* ── Buy Now / Order Now → Discord (checkout is handled through Discord) ── */
  function initBuyNowRedirect() {
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href], button') : null;
      if (!a) return;
      if (a.getAttribute('data-wh-track') === 'buy_now') {
        e.preventDefault();
        e.stopPropagation();
        window.open('https://dsc.gg/stashrnode', '_self');
        return;
      }
      var t = (a.textContent || '').trim().toLowerCase();
      if (t === 'buy now' || t === 'order now') {
        e.preventDefault();
        e.stopPropagation();
        window.open('https://dsc.gg/stashrnode', '_self');
      }
    }, true);
  }

  /* ── Init all ── */

  /* Vanilla accordion — "Everything you need" feature section.
     Works 100% without Alpine: closes all panels, opens the clicked one,
     swaps preview image, rotates chevron. */
  function initFeatureAccordion() {
    var acc = document.querySelector('[x-ref="accordion"]');
    if (!acc) return;
    var items = [];
    for (var i = 0; i < acc.children.length; i++) {
      var el = acc.children[i];
      if (el.nodeType === 1) items.push(el);
    }
    if (!items.length) return;

    var previews = [
      '/images2/panel-one-click-installer.svg',
      '/images2/panel-console.svg',
      '/images2/panel-task-automations.svg',
      '/images2/panel-mod-plugin-presets.svg',
      '/images2/panel-properties-manager.svg'
    ];
    var previewImg = document.getElementById('feature-preview');
    var openIdx = 0;
    var imgTimer = null;

    function closeAll() {
      items.forEach(function (item) {
        var panel = item.querySelector('[data-acc-panel]');
        var chevron = item.querySelector('[data-acc-chevron]');
        if (panel) panel.style.display = 'none';
        if (chevron) chevron.classList.remove('rotate-45');
      });
    }

    function swapPreview(n) {
      if (!previewImg || !previews[n] || imgTimer) return;
      var full = location.origin + previews[n];
      if (previewImg.src === full) {
        previewImg.style.opacity = '1';
        return;
      }
      previewImg.style.opacity = '0';
      var test = new Image();
      test.onload = function () {
        imgTimer = null;
        previewImg.src = previews[n];
        previewImg.style.opacity = '1';
      };
      test.onerror = function () {
        imgTimer = null;
        previewImg.style.opacity = '1';
      };
      test.src = previews[n];
      imgTimer = true;
    }

    function openItem(idx) {
      var item = items[idx];
      if (!item) return;
      var n = parseInt(idx, 10);
      var panel = item.querySelector('[data-acc-panel]');
      var chevron = item.querySelector('[data-acc-chevron]');
      if (panel) panel.style.display = '';
      if (chevron) chevron.classList.add('rotate-45');
      swapPreview(n);
      openIdx = idx;
    }

    function setOpen(idx) {
      if (openIdx === idx && items[idx]) {
        /* toggle off */
        var panel = items[idx].querySelector('[data-acc-panel]');
        var chevron = items[idx].querySelector('[data-acc-chevron]');
        if (panel) panel.style.display = 'none';
        if (chevron) chevron.classList.remove('rotate-45');
        openIdx = -1;
        return;
      }
      closeAll();
      openItem(idx);
    }

    /* wire click handlers */
    for (var i = 0; i < items.length; i++) {
      (function (idx) {
        var btn = items[idx].querySelector('button');
        if (btn) btn.addEventListener('click', function (e) {
          e.preventDefault();
          setOpen(idx);
        });
      })(i);
    }

    /* initial render: item 0 open */
    openItem(0);
  }

  function run() {
    initReveals();
    initNavScroll();
    initParticles();
    initGlowOrbs();
    initCursorGlow();
    initMagnetic();
    initSmoothAnchor();
    initParallax();
initBillingFallback();
    initImageProtection();
    initFaq();
    initFeatureAccordion();
    initBuyNowRedirect();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
