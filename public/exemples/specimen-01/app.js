/* ATELIER NORD — animations
   Trois comportements seulement : le rideau d'ouverture, la montée du titre
   mot par mot, et les apparitions au défilement. Le reste est en CSS. */
(function () {
  var doux = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Le titre du héros est découpé en mots pour qu'ils montent en cascade
  // (référence : noartmusic). On le fait en JS pour garder le HTML lisible
  // et pour que le texte reste sélectionnable et accessible tel quel.
  var titre = document.getElementById('titre-hero');
  if (titre && !doux) {
    var mots = titre.textContent.trim().split(/\s+/);
    titre.textContent = '';
    mots.forEach(function (mot, i) {
      var enveloppe = document.createElement('span');
      enveloppe.className = 'mot';
      var interne = document.createElement('span');
      interne.textContent = mot;
      interne.style.transitionDelay = (0.05 * i) + 's';
      enveloppe.appendChild(interne);
      titre.appendChild(enveloppe);
      if (i < mots.length - 1) titre.appendChild(document.createTextNode(' '));
    });
  }

  function entrer() {
    var rideau = document.getElementById('rideau');
    if (rideau) rideau.classList.add('parti');
    // Petit décalage : le titre monte pendant que le rideau se lève.
    setTimeout(function () { document.body.classList.add('pret'); }, doux ? 0 : 320);
  }

  // On laisse l'écran d'ouverture respirer, mais jamais au point d'agacer.
  var attente = doux ? 200 : 2300;
  if (document.readyState === 'complete') setTimeout(entrer, attente);
  else window.addEventListener('load', function () { setTimeout(entrer, attente); });
  // Filet de sécurité : si « load » ne se déclenche jamais (image bloquée,
  // réseau lent), le rideau se lève quand même.
  setTimeout(entrer, attente + 2600);

  // Jauge de monde : nomme l'univers courant et montre l'avancée du voyage.
  // C'est le seul repère qui dit au visiteur qu'il traverse quelque chose.
  var jNom = document.querySelector('.jauge-nom');
  var jBarre = document.querySelector('.jauge-barre i');
  var jNum = document.querySelector('.jauge-num');
  var sections = [].slice.call(document.querySelectorAll('[data-monde]'));
  var dernier = -1;
  if (jNom && sections.length) {
    addEventListener('scroll', function () {
      var y = scrollY + innerHeight * 0.5;
      var k = 0;
      for (var n = 0; n < sections.length; n++) {
        if (y >= sections[n].offsetTop) k = n;
      }
      if (k !== dernier) {
        dernier = k;
        jNom.classList.add('change');
        setTimeout(function () {
          jNom.textContent = sections[k].dataset.nom || '';
          jNom.classList.remove('change');
        }, 260);
        jNum.textContent = ('0' + (k + 1)).slice(-2);
      }
      var total = document.body.scrollHeight - innerHeight;
      jBarre.style.transform = 'scaleX(' + Math.min(scrollY / Math.max(total, 1), 1) + ')';
    }, { passive: true });
  }

  // Apparitions au défilement.
  var cibles = document.querySelectorAll('.rv');
  if (doux || !('IntersectionObserver' in window)) {
    cibles.forEach(function (el) { el.classList.add('vu'); });
  } else {
    var io = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('vu'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });
    cibles.forEach(function (el, i) {
      el.style.transitionDelay = (0.07 * (i % 4)) + 's';
      io.observe(el);
    });
  }
})();
