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
