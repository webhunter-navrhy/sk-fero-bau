(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  document.documentElement.classList.add('js');

  // navigácia
  const nav = $('#nav'), burger = $('#burger'), hero = $('#top');
  const solid = () => nav.classList.toggle('solid', scrollY > hero.offsetHeight - 80);
  addEventListener('scroll', solid, { passive: true }); solid();
  burger.addEventListener('click', () => {
    const o = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });
  $$('#menu a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); document.body.style.overflow = '';
  }));

  // nadpis v hero po slovách
  const h = $('#heroh');
  let i = 0;
  const split = el => [...el.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const f = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(t => {
        if (!t) return;
        if (/^\s+$/.test(t)) { f.append(' '); return; }
        const w = document.createElement('span'); w.className = 'w';
        const s = document.createElement('span'); s.textContent = t; s.style.animationDelay = (.15 + i++ * .09) + 's';
        w.append(s); f.append(w);
      });
      n.replaceWith(f);
    } else if (n.nodeType === 1) split(n);
  });
  split(h);

  // odhalenie pri scrolle
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv').forEach((el, k) => { el.style.transitionDelay = (k % 4) * .06 + 's'; io.observe(el); });
  $$('.gi, .intro__fig, .step__fig').forEach(el => { el.classList.add('reveal-img'); io.observe(el); });
  setTimeout(() => $$('.hero .rv').forEach(el => el.classList.add('in')), 450);

  // etapy: rez stavbou sa skladá podľa kroku
  const rez = $('#rez'), kota = $('#kota'), steps = $$('.step'), dots = $$('#dots li');
  const set = n => {
    rez.dataset.s = n;
    steps.forEach((s, k) => s.classList.toggle('on', k === n - 1));
    dots.forEach((d, k) => d.classList.toggle('on', k < n));
    const k = steps[n - 1].dataset.k;
    kota.textContent = k === 'hotovo' ? 'hotovo · kľúč' : k + ' m';
  };
  set(1);
  const mob = matchMedia('(max-width: 900px)');
  let so;
  const watch = () => {
    so && so.disconnect();
    so = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) set(steps.indexOf(e.target) + 1);
    }), { rootMargin: mob.matches ? '-60% 0px -30% 0px' : '-45% 0px -45% 0px' });
    steps.forEach(s => so.observe(s));
  };
  watch(); mob.addEventListener('change', watch);

  // služby: fotka pri kurzore
  const pv = $('#pv'), pvi = $('img', pv);
  let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
  const loop = () => {
    x += (tx - x) * .18; y += (ty - y) * .18;
    pv.style.left = x + 'px'; pv.style.top = y + 'px';
    raf = Math.abs(tx - x) + Math.abs(ty - y) > .5 ? requestAnimationFrame(loop) : 0;
  };
  if (matchMedia('(hover: hover)').matches) $$('.svc__i').forEach(li => {
    li.addEventListener('mouseenter', e => {
      pvi.src = li.dataset.img; x = tx = e.clientX + 170; y = ty = e.clientY; pv.classList.add('on');
    });
    li.addEventListener('mousemove', e => { tx = e.clientX + 170; ty = e.clientY; if (!raf) raf = requestAnimationFrame(loop); });
    li.addEventListener('mouseleave', () => pv.classList.remove('on'));
  });

  // dopyt: stavebný denník sa vypĺňa
  const form = $('#form'), ok = $('#ok');
  const d = new Date();
  $('#dn-d').textContent = d.toLocaleDateString('sk-SK');
  const upd = () => {
    const typ = $$('input[name="typ"]:checked', form).map(i => i.value);
    const kedy = $('input[name="kedy"]:checked', form);
    $('#dn-typ').textContent = typ.length ? typ.join(', ') : 'zatiaľ nevybrané';
    $('#dn-miesto').textContent = form.miesto.value.trim() || '—';
    $('#dn-kedy').textContent = kedy ? kedy.value : '—';
  };
  form.addEventListener('input', upd); form.addEventListener('change', upd);
  const file = $('.file input', form);
  file.addEventListener('change', () => {
    $('.file span', form).textContent = file.files.length ? `Priložené: ${file.files.length} ${file.files.length === 1 ? 'súbor' : file.files.length < 5 ? 'súbory' : 'súborov'}` : '+ Priložiť fotku, náčrt alebo projekt';
  });
  form.addEventListener('submit', e => { e.preventDefault(); ok.hidden = false; ok.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); });
})();
