// Google Analytics for the WEBSITE, one file for every page in docs/.
// The app never loads this: it is not in src/, and it does nothing unless
// the page came over http(s) from the real site (not localhost, not a file).
(function () {
  var ID = 'G-RX1LXWKFZD';
  if (!/^https?:$/.test(location.protocol) || /^(localhost|127\.)/.test(location.hostname)) return;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', ID);

  // What a page view cannot say: did anybody press the button? The
  // download is a link to GitHub, so without this it leaves no trace.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    var where = location.pathname.split('/').pop() || 'index.html';
    if (/Dota-Translator-Setup\.exe$/.test(href)) gtag('event', 'download_click', { page: where, label: a.textContent.trim().slice(0, 40) });
    else if (/ko-fi.com/.test(href)) gtag('event', 'donate_click', { page: where });
    else if (/aistudio\.google\.com/.test(href)) gtag('event', 'aistudio_click', { page: where });
    else if (/github\.com\/sc0rebreaker/.test(href)) gtag('event', 'github_click', { page: where });
    else if (href === 'key.html' || href === 'download.html' || href === 'install.html') gtag('event', 'guide_click', { page: where, to: href });
  });
  // The slider in the hero: once per visit, the first time it is moved by hand.
  var slider = document.querySelector('input[type=range]');
  if (slider) slider.addEventListener('pointerdown', function () { gtag('event', 'slider_used'); }, { once: true });
  // The hero's language tabs: which of Russian, Spanish and Chinese people look at.
  var tabs = document.querySelectorAll('.seg button[data-lang]');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', function () { gtag('event', 'language_tab', { lang: this.getAttribute('data-lang') }); });
  }
})();
