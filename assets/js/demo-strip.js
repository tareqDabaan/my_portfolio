/**
 * "Watch the demos" strip on the home page + pop-up video player.
 * Builds one thumbnail per project video in window.PROJECTS (assets/js/projects-data.js).
 * Videos only download when a visitor presses play.
 */
(function() {
  "use strict";

  const container = document.querySelector('#demo-strip');
  const projects = window.PROJECTS || [];
  if (!container) return;

  // Collect every video, in project order
  const demos = [];
  projects.forEach(p => {
    (p.videos || (p.video ? [p.video] : [])).forEach(v => demos.push({ project: p, video: v }));
  });
  if (!demos.length) { container.remove(); return; }

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
  const headingFor = d => d.video.title || d.project.title;
  const labelFor = d => d.video.title ? d.project.title : (d.project.eyebrow || d.project.client || '');
  const projectUrl = d => 'project.html?id=' + encodeURIComponent(d.project.id);

  // ---------- Strip ----------
  const title = el('h3', 'projects-group-title', 'Watch the demos');
  title.setAttribute('data-aos', 'fade-up');
  const grid = el('div', 'demo-grid');

  demos.forEach((d, index) => {
    const v = d.video;
    const isBrowser = v.frame === 'browser';
    const item = el('div', 'demo-item');
    item.setAttribute('data-aos', 'fade-up');
    item.setAttribute('data-aos-delay', String(100 * (index % 3 + 1)));

    const tile = el('button', 'demo-tile');
    tile.type = 'button';
    tile.setAttribute('aria-label', 'Play video: ' + headingFor(d) + (v.duration ? ' (' + v.duration + ')' : ''));
    tile.dataset.index = String(index);

    const thumb = el('div', 'demo-thumb');
    const shot = el('div', isBrowser ? 'thumb-browser' : 'thumb-phone');
    if (isBrowser) {
      const bar = el('div', 'thumb-bar');
      bar.append(el('span'), el('span'), el('span'));
      shot.append(bar);
    }
    const img = el('img');
    img.src = v.poster || '';
    img.alt = '';
    img.loading = 'lazy';
    shot.append(img);

    const play = el('span', 'demo-play');
    play.append(icon('play-fill'));

    const meta = el('span', 'demo-duration');
    if (v.sound) meta.append(icon('volume-up-fill'), document.createTextNode(' '));
    if (v.duration) meta.append(document.createTextNode(v.duration));

    thumb.append(shot, play);
    if (v.duration || v.sound) thumb.append(meta);
    tile.append(thumb);

    const info = el('div', 'demo-info');
    info.append(el('span', 'demo-project', labelFor(d)), el('h4', null, headingFor(d)));
    const link = el('a', 'demo-link', 'View project ');
    link.href = projectUrl(d);
    link.append(icon('arrow-right'));
    info.append(link);

    item.append(tile, info);
    grid.append(item);
  });

  container.replaceChildren(title, grid);

  // ---------- Pop-up player ----------
  const modal = el('div', 'video-modal');
  modal.hidden = true;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'video-modal-title');

  const backdrop = el('div', 'video-modal-backdrop');
  const box = el('div', 'video-modal-box');
  const close = el('button', 'video-modal-close');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close video');
  close.append(icon('x-lg'));

  const player = el('video', 'video-modal-player');
  player.controls = true;
  player.playsInline = true;
  player.preload = 'none';

  const caption = el('div', 'video-modal-caption');
  const capLabel = el('span', 'demo-project');
  const capTitle = el('h3');
  capTitle.id = 'video-modal-title';
  const capLink = el('a', 'demo-link');
  caption.append(capLabel, capTitle, capLink);

  box.append(close, player, caption);
  modal.append(backdrop, box);
  document.body.append(modal);

  let lastTile = null;

  function open(index, tile) {
    const d = demos[index];
    const v = d.video;
    lastTile = tile;
    box.classList.toggle('is-portrait', v.frame !== 'browser');
    player.style.aspectRatio = (v.width && v.height) ? v.width + ' / ' + v.height : '';
    player.poster = v.poster || '';
    player.muted = !v.sound;
    player.src = v.src;
    capLabel.textContent = labelFor(d);
    capTitle.textContent = headingFor(d);
    capLink.replaceChildren(document.createTextNode('View project details '), icon('arrow-right'));
    capLink.href = projectUrl(d);

    modal.hidden = false;
    document.body.classList.add('video-modal-open');
    close.focus();
    const started = player.play();
    if (started && started.catch) started.catch(() => {});   // if the browser blocks autoplay, the visitor can press play
  }

  function shut() {
    if (modal.hidden) return;
    player.pause();
    player.removeAttribute('src');   // stop downloading
    player.load();
    modal.hidden = true;
    document.body.classList.remove('video-modal-open');
    if (lastTile) lastTile.focus();
  }

  grid.addEventListener('click', e => {
    const tile = e.target.closest('.demo-tile');
    if (tile) open(Number(tile.dataset.index), tile);
  });
  close.addEventListener('click', shut);
  backdrop.addEventListener('click', shut);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') shut();
    // keep keyboard focus inside the pop-up while it's open
    if (e.key === 'Tab' && !modal.hidden) {
      const focusables = [close, player, capLink];
      const i = focusables.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); focusables[focusables.length - 1].focus(); }
      else if (!e.shiftKey && i === focusables.length - 1) { e.preventDefault(); focusables[0].focus(); }
    }
  });
})();
