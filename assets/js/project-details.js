/**
 * Renders project.html?id=<id> from window.PROJECTS (assets/js/projects-data.js).
 */
(function() {
  "use strict";

  const projects = window.PROJECTS || [];
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const index = projects.findIndex(p => p.id === id);
  const project = projects[index];

  // ---------- Screen viewer: full-size app screenshots shown inside a phone ----------
  let viewer = null;
  function openScreens(screens, index, opener) {
    if (!viewer) viewer = buildViewer();
    viewer.open(screens, index, opener);
  }

  function buildViewer() {
    const root = el('div', 'screen-viewer');
    root.hidden = true;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'sv-title');

    const backdrop = el('div', 'sv-backdrop');
    const button = (cls, label, iconName) => {
      const b = el('button', cls);
      b.type = 'button';
      b.setAttribute('aria-label', label);
      b.append(icon(iconName));
      return b;
    };
    const close = button('sv-close', 'Close', 'x-lg');
    const prev = button('sv-nav sv-prev', 'Previous screenshot', 'chevron-left');
    const next = button('sv-nav sv-next', 'Next screenshot', 'chevron-right');

    // phone: body with side buttons, screen with the screenshot, and a camera hole
    const phone = el('div', 'sv-phone');
    const sideButtons = el('span', 'sv-side-buttons');
    sideButtons.setAttribute('aria-hidden', 'true');
    const screen = el('div', 'sv-screen');
    const img = el('img');
    screen.append(img);
    const camera = el('span', 'sv-camera');
    camera.setAttribute('aria-hidden', 'true');
    phone.append(sideButtons, screen, camera);

    const info = el('div', 'sv-info');
    const count = el('span', 'sv-count');
    const title = el('h3');
    title.id = 'sv-title';
    const desc = el('p');
    const dots = el('div', 'sv-dots');
    info.append(count, title, desc, dots);

    const stage = el('div', 'sv-stage');
    stage.append(phone, info);
    root.append(backdrop, stage, prev, next, close);
    document.body.append(root);

    let list = [];
    let current = 0;
    let opener = null;

    function restart(node, cls) {
      node.classList.remove('sv-anim-next', 'sv-anim-prev', 'sv-anim-fade');
      void node.offsetWidth;   // restart the CSS animation
      node.classList.add(cls);
    }

    function show(n, dir) {
      current = (n + list.length) % list.length;
      const s = list[current];
      img.src = s.src;
      img.alt = s.alt || s.title;
      count.textContent = (current + 1) + ' / ' + list.length;
      title.textContent = s.title;
      desc.textContent = s.description || '';
      [...dots.children].forEach((d, k) => d.setAttribute('aria-current', String(k === current)));
      if (dir) { restart(img, dir > 0 ? 'sv-anim-next' : 'sv-anim-prev'); restart(info, 'sv-anim-fade'); }
      // load the neighbours now so switching is instant
      [1, -1].forEach(d => { const p = new Image(); p.src = list[(current + d + list.length) % list.length].src; });
    }

    function shut() {
      if (root.hidden) return;
      root.hidden = true;
      document.body.classList.remove('sv-open');
      if (opener) opener.focus();
    }

    prev.addEventListener('click', () => show(current - 1, -1));
    next.addEventListener('click', () => show(current + 1, 1));
    close.addEventListener('click', shut);
    root.addEventListener('click', e => {
      if (e.target === root || e.target === backdrop || e.target === stage) shut();
    });

    document.addEventListener('keydown', e => {
      if (root.hidden) return;
      if (e.key === 'Escape') shut();
      else if (e.key === 'ArrowRight' && list.length > 1) show(current + 1, 1);
      else if (e.key === 'ArrowLeft' && list.length > 1) show(current - 1, -1);
      else if (e.key === 'Tab') {
        // keep keyboard focus inside the viewer
        const focusables = [close, ...(list.length > 1 ? [prev, next, ...dots.children] : [])];
        const i = focusables.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); focusables[focusables.length - 1].focus(); }
        else if (!e.shiftKey && i === focusables.length - 1) { e.preventDefault(); focusables[0].focus(); }
      }
    });

    // swipe left/right on touch screens
    let touchX = null;
    stage.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (touchX === null || list.length < 2) return;
      const dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 45) show(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });

    return {
      open(screens, index, from) {
        list = screens;
        opener = from;
        dots.replaceChildren(...list.map((s, k) => {
          const d = el('button');
          d.type = 'button';
          d.setAttribute('aria-label', 'Show ' + s.title);
          d.addEventListener('click', () => { if (k !== current) show(k, k > current ? 1 : -1); });
          return d;
        }));
        prev.hidden = next.hidden = dots.hidden = list.length < 2;
        root.hidden = false;
        document.body.classList.add('sv-open');
        restart(stage, 'sv-anim-fade');
        show(index, 0);
        close.focus();
      }
    };
  }

  // Small helper: create an element with a class and optional text (text is never parsed as HTML)
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function icon(name) {
    const i = el('i', 'bi bi-' + name);
    i.setAttribute('aria-hidden', 'true');
    return i;
  }

  const titleEl = document.querySelector('#project-title');
  const clientEl = document.querySelector('#project-client');
  const crumbEl = document.querySelector('#project-crumb');
  const iconEl = document.querySelector('#project-icon');
  const mainEl = document.querySelector('#project-main');
  const infoEl = document.querySelector('#project-info');
  const pagerEl = document.querySelector('#project-pager');

  if (!project) {
    document.title = 'Project not found | Tareq Dabaan';
    titleEl.textContent = 'Project not found';
    crumbEl.textContent = 'Not found';
    clientEl.textContent = "This project doesn't exist or the link is incorrect.";
    iconEl.remove();
    const back = el('a', 'btn-download-cv', 'Back to all projects');
    back.href = 'index.html#projects';
    mainEl.className = 'col-12 text-center';
    mainEl.replaceChildren(back);
    infoEl.closest('.col-lg-4').remove();
    pagerEl.remove();
    return;
  }

  // Page title section
  document.title = project.title + ' | Tareq Dabaan';
  titleEl.textContent = project.title;
  crumbEl.textContent = project.title;
  clientEl.textContent = project.eyebrow || project.client || '';
  iconEl.replaceChildren(icon(project.icon));

  // Main column: overview, highlights, contributions
  const main = [];

  main.push(el('h2', null, 'Overview'));
  project.overview.forEach(text => main.push(el('p', 'project-overview', text)));

  if (project.highlights && project.highlights.length) {
    const grid = el('div', 'project-highlights');
    project.highlights.forEach(h => {
      const item = el('div', 'highlight');
      item.append(el('span', 'highlight-value', h.value), el('span', 'highlight-label', h.label));
      grid.append(item);
    });
    main.push(grid);
  }

  const videos = project.videos || (project.video ? [project.video] : []);
  if (videos.length > 1) main.push(el('h2', 'project-videos-title', 'See it in action'));

  videos.forEach(v => {
    const isBrowser = v.frame === 'browser';
    const block = el('div', 'project-video' + (isBrowser ? ' is-browser' : ''));

    const frame = el('div', isBrowser ? 'browser-frame' : 'phone-frame');
    if (isBrowser) {
      const bar = el('div', 'browser-bar');
      bar.setAttribute('aria-hidden', 'true');
      bar.append(el('span'), el('span'), el('span'));
      frame.append(bar);
    }
    const video = el('video');
    video.src = v.src;
    if (v.poster) video.poster = v.poster;
    if (v.width && v.height) video.style.aspectRatio = v.width + ' / ' + v.height;
    video.controls = true;
    video.muted = !v.sound;      // silent recordings play muted; ones with speech keep their sound
    video.playsInline = true;    // play in place on iPhone instead of going fullscreen
    video.preload = 'metadata';  // don't download the whole file until the visitor presses play
    video.setAttribute('aria-label', 'Demo video: ' + (v.title || project.title));
    frame.append(video);

    const text = el('div', 'project-video-text');
    const label = el('span', 'project-video-label');
    label.append(icon(v.sound ? 'volume-up' : 'play-circle'), document.createTextNode(' ' + (v.title || 'Feature demo')));
    text.append(label);
    if (videos.length === 1) text.append(el('h2', null, 'See it in action'));
    if (v.caption) text.append(el('p', null, v.caption));

    // App screenshots: small thumbnails; clicking one opens them full size inside a phone (screen viewer below)
    if (v.screens && v.screens.length) {
      text.append(el('span', 'app-screens-label', 'App screens'));
      const grid = el('div', 'app-screens');
      v.screens.forEach((s, i) => {
        const a = el('a', 'app-screen');
        a.href = s.src;   // without JavaScript the link simply opens the image
        a.setAttribute('aria-label', 'View full size: ' + s.title);
        a.addEventListener('click', e => { e.preventDefault(); openScreens(v.screens, i, a); });
        const frame = el('span', 'app-screen-frame');
        const img = el('img');
        img.src = s.thumb || s.src;
        img.alt = s.alt || s.title;
        img.loading = 'lazy';
        frame.append(img);
        a.append(frame, el('span', 'app-screen-title', s.title));
        grid.append(a);
      });
      text.append(grid);
    }

    // Wide desktop recordings sit under their description; phone recordings sit beside it
    if (isBrowser) block.append(text, frame); else block.append(frame, text);
    main.push(block);
  });

  main.push(el('h2', null, 'What I did'));
  const list = el('ul', 'contribution-list');
  project.contributions.forEach(text => {
    const li = el('li');
    li.append(icon('check2-circle'), el('span', null, text));
    list.append(li);
  });
  main.push(list);

  mainEl.replaceChildren(...main);

  // Side column: project info card
  const info = [el('h3', null, 'Project info')];
  const facts = el('ul', 'project-facts');
  [
    ['Client', project.client],
    ['My role', project.role],
    ['Company', project.company],
    ['Period', project.period],
    ['Type', project.type]
  ].forEach(([label, value]) => {
    if (!value) return;
    const li = el('li');
    li.append(el('strong', null, label), el('span', null, value));
    facts.append(li);
  });
  info.push(facts);

  info.push(el('h4', null, 'Tech stack'));
  const tags = el('ul', 'tag-list');
  project.tech.forEach(t => tags.append(el('li', null, t)));
  info.push(tags);

  if (project.link) {
    const a = el('a', 'btn-download-cv project-external', project.link.label + ' ');
    a.href = project.link.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.append(icon('box-arrow-up-right'));
    info.push(a);
  }

  infoEl.replaceChildren(...info);

  // Previous / next navigation (wraps around)
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  function pagerLink(p, direction) {
    const a = el('a', 'pager-link pager-' + direction);
    a.href = 'project.html?id=' + encodeURIComponent(p.id);
    const label = el('span', 'pager-label');
    if (direction === 'prev') {
      label.append(icon('arrow-left'), document.createTextNode(' Previous'));
    } else {
      label.append(document.createTextNode('Next '), icon('arrow-right'));
    }
    a.append(label, el('span', 'pager-title', p.title));
    return a;
  }

  const all = el('a', 'pager-all');
  all.href = 'index.html#projects';
  all.append(icon('grid'), el('span', null, 'All projects'));

  pagerEl.replaceChildren(pagerLink(prev, 'prev'), all, pagerLink(next, 'next'));
})();
