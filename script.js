/* ==========================================================
   Portfolio — Michel Déric KAMANI DJOMDJUI
   ========================================================== */

/* ----------------------------------------------------------
   CONFIGURATION — À COMPLÉTER AVEC TES COORDONNÉES
   Tout lien laissé vide ("") est automatiquement masqué
   sur toutes les pages (aucun lien cassé).
   ---------------------------------------------------------- */
const CONFIG = {
  email: "michelkamani202@gmail.com",
  phone: "+237 686 928 685",
  whatsapp: "",      // numéro international, chiffres seulement : "2376XXXXXXXX"
  linkedin: "https://www.linkedin.com/in/michel-kamani-48b1b336a",
  github: "https://github.com/michelkamani202-alt",
  tiktok: "",        // ex : "https://www.tiktok.com/@ton-pseudo"
  cv: "",            // ex : "cv-michel-kamani.pdf" (fichier à placer à côté d'index.html)
  formEndpoint: ""   // optionnel : URL Formspree (https://formspree.io/f/xxxx) pour un envoi direct
};

(function () {
  "use strict";

  const ico = (n) => '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-' + n + '"/></svg>';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Liens de contact pilotés par CONFIG ---------- */
  function applyConfig() {
    $$("[data-link]").forEach((el) => {
      const key = el.dataset.link;
      const value = String(CONFIG[key] || "").trim();
      if (!value) { el.hidden = true; return; }

      let href = value;
      if (key === "email") href = "mailto:" + value;
      if (key === "phone") href = "tel:" + value.replace(/[^\d+]/g, "");
      if (key === "whatsapp") href = "https://wa.me/" + value.replace(/\D/g, "");

      el.setAttribute("href", href);
      if (/^https?:/i.test(href)) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
      $$("[data-text]", el).forEach((t) => { t.textContent = value; });
      el.hidden = false;
    });

    // Masque les blocs dont tous les liens sont vides
    $$("[data-hide-if-empty]").forEach((group) => {
      group.hidden = !$("[data-link]:not([hidden])", group);
    });
  }

  /* ---------- 2. Année dynamique du pied de page ---------- */
  function setYear() {
    $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- 3. Thème clair / sombre ---------- */
  function initTheme() {
    const btn = $("#theme-toggle");
    if (!btn) return;
    const root = document.documentElement;

    const refresh = () => {
      const dark = root.getAttribute("data-theme") === "dark";
      btn.innerHTML = dark ? ico('sun') : ico('moon');
      btn.setAttribute("aria-label", dark ? "Activer le thème clair" : "Activer le thème sombre");
      btn.setAttribute("title", dark ? "Thème clair" : "Thème sombre");
    };
    refresh();

    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* stockage indisponible */ }
      refresh();
    });
  }

  /* ---------- 4. Menu mobile ---------- */
  function initNav() {
    const toggle = $(".nav-toggle");
    const menu = $("#nav-links");
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      toggle.innerHTML = open ? ico('xmark') : ico('bars');
    };

    toggle.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    document.addEventListener("click", (e) => {
      // composedPath() est figé au moment du clic : fiable même si l'icône du bouton vient d'être remplacée
      const path = e.composedPath();
      if (menu.classList.contains("open") && !path.includes(menu) && !path.includes(toggle)) setOpen(false);
    });
    window.addEventListener("resize", () => { if (window.innerWidth > 820) setOpen(false); });
  }

  /* ---------- 5. Effet machine à écrire (accueil) ---------- */
  function initTyped() {
    const target = $("#typed");
    if (!target || reduceMotion) return;

    const roles = [
      "Étudiant en cybersécurité",
      "Passionné de sécurité réseau",
      "Développeur Python & Web",
      "En route vers CCNA & Security+"
    ];
    let r = 0, i = 0, deleting = false;

    function tick() {
      const word = roles[r];
      target.textContent = word.slice(0, i);
      let delay = deleting ? 35 : 75;

      if (!deleting && i === word.length) { deleting = true; delay = 1600; }
      else if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
      i += deleting ? -1 : 1;
      setTimeout(tick, delay);
    }
    tick();
  }

  /* ---------- 6. Apparition au défilement ---------- */
  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("visible")); return; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  }

  /* ---------- 7. Bouton retour en haut ---------- */
  function initToTop() {
    const btn = document.createElement("button");
    btn.className = "to-top";
    btn.type = "button";
    btn.setAttribute("aria-label", "Retour en haut de la page");
    btn.innerHTML = ico('arrow-up');
    document.body.appendChild(btn);

    const onScroll = () => btn.classList.toggle("show", window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  }

  /* ---------- 8. Projets : filtres et détails ---------- */
  function initProjects() {
    const grid = $("#projects-grid");
    if (!grid) return;

    const cards = $$(".project", grid);
    const buttons = $$(".filter-btn");
    const empty = $("#no-result");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const f = btn.dataset.filter;
        buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        let shown = 0;
        cards.forEach((card) => {
          const match = f === "all" || card.dataset.category.split(" ").includes(f);
          card.classList.toggle("is-hidden", !match);
          if (match) shown++;
        });
        if (empty) empty.hidden = shown !== 0;
      });
    });

    cards.forEach((card) => {
      const toggle = $(".toggle", card);
      const more = $(".more", card);
      if (!toggle || !more) return;
      toggle.addEventListener("click", () => {
        const open = !more.classList.contains("open");
        more.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
        $("span", toggle).textContent = open ? "Masquer les détails" : "Voir les détails";
      });
    });
  }

  /* ---------- 9. Formulaire de contact ---------- */
  function initContactForm() {
    const form = $("#contact-form");
    if (!form) return;

    const status = $(".form-status", form);
    const submitBtn = $("button[type=submit]", form);
    const say = (msg, ok) => { status.textContent = msg; status.className = "form-status " + (ok ? "ok" : "err"); };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.className = "form-status";
      status.textContent = "";

      if (form.elements["website"].value) return; // anti-spam (champ piège)
      if (!form.checkValidity()) { form.reportValidity(); return; }

      const data = {
        nom: form.elements["fullname"].value.trim(),
        email: form.elements["email"].value.trim(),
        objet: form.elements["subject"].value.trim(),
        message: form.elements["message"].value.trim()
      };

      // Option A : envoi direct via un service de formulaire (Formspree)
      if (CONFIG.formEndpoint) {
        submitBtn.disabled = true;
        try {
          const res = await fetch(CONFIG.formEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(data)
          });
          if (!res.ok) throw new Error("HTTP " + res.status);
          say("Merci ! Votre message a bien été envoyé. Je vous réponds dès que possible.", true);
          form.reset();
        } catch (err) {
          say("L'envoi a échoué. Merci de réessayer ou de me contacter directement.", false);
        } finally {
          submitBtn.disabled = false;
        }
        return;
      }

      // Option B : ouverture de la messagerie de l'utilisateur
      if (CONFIG.email) {
        const body = "Nom : " + data.nom + "\nE-mail : " + data.email + "\n\n" + data.message;
        window.location.href = "mailto:" + CONFIG.email +
          "?subject=" + encodeURIComponent(data.objet) +
          "&body=" + encodeURIComponent(body);
        say("Votre messagerie va s'ouvrir pour finaliser l'envoi. Si rien ne s'ouvre, écrivez-moi directement à " + CONFIG.email + ".", true);
        return;
      }

      say("Le formulaire n'est pas encore disponible. Merci d'utiliser les autres moyens de contact.", false);
    });
  }

  /* ---------- Initialisation ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    setYear();
    initTheme();
    initNav();
    initTyped();
    initReveal();
    initToTop();
    initProjects();
    initContactForm();
  });
})();
