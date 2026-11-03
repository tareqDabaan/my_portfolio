/**
 * Video previews on the home page project cards + pop-up video player.
 * For each project card whose project (assets/js/projects-data.js) has videos, adds a preview at the
 * top of the card. Clicking it plays the video(s) in a pop-up on the same page; the rest of the card
 * still opens the project details page. Videos only download when a visitor presses play.
 */
(function() {
  "use strict";

  const projects = window.PROJECTS || [];
  const videosOf = p => p.videos || (p.video ? [p.video] : []);

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
  function shot(v) {
    const isBrowser = v.frame === 'browser';
    const wrap = el('div', isBrowser ? 'thumb-browser' : 'thumb-phone');
    if (isBrowser) {
      const bar = el('div', 'thumb-bar');
      bar.append(el('span'), el('span'), el('span'));
      wrap.append(bar);
    }
    const img = el('img');
    img.src = v.poster || '';
    img.alt = '';
    img.loading = 'lazy';
    wrap.append(img);
    return wrap;
  }

  // ---------- Card previews ----------
  document.querySelectorAll('.projects .project-card').forEach(card => {
    const link = card.querySelector('a.project-link[href*="project.html?id="]');
    if (!link) return;
    const id = new URL(link.getAttribute('href'), window.location.href).searchParams.get('id');
    const project = projects.find(p => p.id === id);
    if (!project) return;
    const videos = videosOf(project);
    if (!videos.length) return;

    const media = el('button', 'card-media' + (videos.length > 1 ? ' is-multi' : ''));
    media.type = 'button';
    media.setAttribute('aria-label', videos.length > 1
      ? 'Play ' + videos.length + ' demo videos: ' + project.title
      : 'Play demo video: ' + project.title + (videos[0].duration ? ' (' + videos[0].duration + ')' : ''));

    // multi-video: the desktop (browser) recording sits behind, the phone recording in front
    const ordered = videos.length > 1
      ? [...videos].sort((a, b) => (a.frame === 'browser' ? -1 : 0) - (b.frame === 'browser' ? -1 : 0))
      : videos;
    ordered.slice(0, 2).forEach(v => media.append(shot(v)));

    const play = el('span', 'media-play');
    play.append(icon('play-fill'));
    media.append(play);

    const tag = el('span', 'media-tag');
    if (videos.some(v => v.sound)) tag.append(icon('volume-up-fill'), document.createTextNode(' '));
    tag.append(document.createTextNode(videos.length > 1 ? videos.length + ' videos' : (videos[0].duration || 'Video')));
    media.append(tag);

    media.addEventListener('click', () => open(project, 0, media));

    // the preview replaces the card's icon
    const iconBox = card.querySelector('.project-icon');
    if (iconBox) iconBox.remove();
    card.classList.add('has-media');
    card.prepend(media);
  });

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

  const tabs = el('div', 'video-modal-tabs');
  tabs.setAttribute('role', 'tablist');

  const player = el('video', 'video-modal-player');
  player.controls = true;
  player.playsInline = true;
  player.preload = 'none';

  const caption = el('div', 'video-modal-caption');
  const capLabel = el('span', 'video-modal-label');
  const capTitle = el('h3');
  capTitle.id = 'video-modal-title';
  const capLink = el('a', 'video-modal-link');
  caption.append(capLabel, capTitle, capLink);

  box.append(close, tabs, player, caption);
  modal.append(backdrop, box);
  document.body.append(modal);

  let current = null;
  let opener = null;

  function show(index) {
    const videos = videosOf(current);
    const v = videos[index];
    box.classList.toggle('is-portrait', v.frame !== 'browser');
    player.style.aspectRatio = (v.width && v.height) ? v.width + ' / ' + v.height : '';
    player.poster = v.poster || '';
    player.muted = !v.sound;
    player.src = v.src;
    capLabel.textContent = v.title ? current.title : (current.eyebrow || current.client || '');
    capTitle.textContent = v.title || current.title;
    [...tabs.children].forEach((t, i) => t.setAttribute('aria-selected', String(i === index)));
    const started = player.play();
    if (started && started.catch) started.catch(() => {});   // if autoplay is blocked, the visitor can press play
  }

  function open(project, index, from) {
    current = project;
    opener = from;
    const videos = videosOf(project);
    tabs.replaceChildren();
    tabs.hidden = videos.length < 2;
    videos.forEach((v, i) => {
      const t = el('button', 'video-tab');
      t.type = 'button';
      t.setAttribute('role', 'tab');
      t.append(icon(v.frame === 'browser' ? 'window' : 'phone'), document.createTextNode(' ' + (v.title || 'Demo ' + (i + 1))));
      t.addEventListener('click', () => show(i));
      tabs.append(t);
    });
    capLink.replaceChildren(document.createTextNode('View project details '), icon('arrow-right'));
    capLink.href = 'project.html?id=' + encodeURIComponent(project.id);
    modal.hidden = false;
    document.body.classList.add('video-modal-open');
    show(index);
    close.focus();
  }

  function shut() {
    if (modal.hidden) return;
    player.pause();
    player.removeAttribute('src');   // stop downloading
    player.load();
    modal.hidden = true;
    document.body.classList.remove('video-modal-open');
    if (opener) opener.focus();
  }

  close.addEventListener('click', shut);
  backdrop.addEventListener('click', shut);
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') shut();
    // keep keyboard focus inside the pop-up while it's open
    if (e.key === 'Tab') {
      const focusables = [close, ...(tabs.hidden ? [] : tabs.children), player, capLink];
      const i = focusables.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); focusables[focusables.length - 1].focus(); }
      else if (!e.shiftKey && i === focusables.length - 1) { e.preventDefault(); focusables[0].focus(); }
    }
  });
})();
