(function () {
  var filters = document.querySelector('.video-filters');
  if (!filters) return;

  var buttons = Array.from(filters.querySelectorAll('[data-video-filter]'));
  var cards = Array.from(document.querySelectorAll('[data-video-category]'));

  function selectCategory(category) {
    if (!buttons.some(function (button) { return button.dataset.videoFilter === category; })) {
      category = 'all';
    }
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.videoFilter === category));
    });
    cards.forEach(function (card) {
      card.hidden = category !== 'all' && card.dataset.videoCategory !== category;
    });
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var category = button.dataset.videoFilter;
      selectCategory(category);
      history.replaceState(null, '', location.pathname + location.search +
        (category === 'all' ? '' : '#' + category));
    });
  });
  window.addEventListener('hashchange', function () { selectCategory(location.hash.slice(1)); });
  selectCategory(location.hash.slice(1));
  filters.hidden = false;

  var dialog = document.querySelector('.video-player');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  var title = dialog.querySelector('h2');
  var embed = dialog.querySelector('.video-player__embed');
  var opener;

  document.querySelectorAll('[data-video-id]').forEach(function (link) {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', function (event) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      title.textContent = link.dataset.videoTitle;
      var iframe = document.createElement('iframe');
      iframe.title = link.dataset.videoTitle;
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + link.dataset.videoId + '?autoplay=1&rel=0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      embed.replaceChildren(iframe);
      document.documentElement.classList.add('video-player-open');
      dialog.showModal();
    });
  });

  dialog.querySelector('.video-player__close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) {
    if (event.target !== dialog) return;
    var bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', function () {
    embed.replaceChildren();
    document.documentElement.classList.remove('video-player-open');
    if (opener) opener.focus();
  });
})();
