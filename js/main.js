/**
 * Refine Visuals — Main JavaScript v2
 *
 * 1. Render portfolio cards from PROJECTS array
 * 2. Open / close project detail modal
 * 3. Intersection Observer — reveal-on-scroll with stagger
 * 4. Navbar scroll effect + logo shrink
 * 5. Mobile burger menu toggle
 * 6. Smooth scroll for anchor links
 * 7. Hero decoration parallax
 * 8. Scroll progress bar
 * 9. Custom cursor on portfolio cards
 */

(function () {
  "use strict";

  /* ----------------------------------------------------------
     1. Portfolio Rendering
     ---------------------------------------------------------- */
  var grid = document.getElementById("portfolio-grid");
  var modalOverlay = document.getElementById("modal-overlay");
  var modalClose = document.getElementById("modal-close");
  var modalContent = document.getElementById("modal-content");

  var staggerClasses = ["stagger-1", "stagger-2", "stagger-3", "stagger-4", "stagger-5", "stagger-6"];

  function createCard(project, index) {
    var card = document.createElement("article");
    var stagger = staggerClasses[index % staggerClasses.length];
    card.className = "collage-card reveal " + stagger;
    card.setAttribute("data-id", project.id);
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", "View project: " + project.title);

    var mosaicHTML = '<div class="collage-card__mosaic">';
    project.images.forEach(function (src) {
      mosaicHTML += '<img src="' + src + '" alt="' + project.title + '" loading="lazy" />';
    });
    mosaicHTML += '</div>';

    card.innerHTML =
      mosaicHTML +
      '<div class="collage-card__overlay">' +
        '<span class="collage-card__category">' + project.category + '</span>' +
        '<h3 class="collage-card__title">' + project.title + '</h3>' +
        '<span class="collage-card__year">' + project.year + '</span>' +
      '</div>';

    card.addEventListener("click", function () { openModal(project); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(project);
      }
    });

    return card;
  }

  function renderPortfolio() {
    if (!grid) return;
    grid.innerHTML = "";
    PROJECTS.forEach(function (project, i) {
      grid.appendChild(createCard(project, i));
    });
    observeReveals();
  }

  /* ----------------------------------------------------------
     2. Modal
     ---------------------------------------------------------- */
  function openModal(project) {
    if (!modalOverlay || !modalContent) return;

    var imagesHTML = project.images.map(function (src) {
      return '<img src="' + src + '" alt="' + project.title + '" loading="lazy" />';
    }).join("");

    modalContent.innerHTML =
      '<div class="modal__header">' +
        '<p class="modal__category">' + project.category + '</p>' +
        '<h2 class="modal__title">' + project.title + '</h2>' +
        '<p class="modal__year">' + project.year + '</p>' +
      '</div>' +
      '<p class="modal__description">' + project.description + '</p>' +
      '<div class="modal__images">' + imagesHTML + '</div>';

    modalOverlay.classList.add("is-open");
    modalOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("is-open");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* ----------------------------------------------------------
     3. Reveal on Scroll (Intersection Observer)
     ---------------------------------------------------------- */
  var revealObserver = null;

  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    if (revealObserver) revealObserver.disconnect();

    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );

    document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ----------------------------------------------------------
     4. Navbar Scroll Effect
     ---------------------------------------------------------- */
  var nav = document.querySelector(".nav");

  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add("nav--scrolled");
    } else {
      nav.classList.remove("nav--scrolled");
    }
  }

  window.addEventListener("scroll", handleNavScroll, { passive: true });

  /* ----------------------------------------------------------
     5. Mobile Burger Menu
     ---------------------------------------------------------- */
  var burger = document.querySelector(".nav__burger");
  var mobileMenu = document.querySelector(".mobile-menu");

  function toggleMobileMenu() {
    if (!burger || !mobileMenu) return;
    var isOpen = mobileMenu.classList.contains("is-open");
    burger.classList.toggle("is-active");
    mobileMenu.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", !isOpen);
    document.body.style.overflow = mobileMenu.classList.contains("is-open") ? "hidden" : "";
  }

  if (burger) burger.addEventListener("click", toggleMobileMenu);

  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (mobileMenu.classList.contains("is-open")) toggleMobileMenu();
      });
    });
  }

  /* ----------------------------------------------------------
     6. Smooth Scroll for Anchor Links
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = nav ? nav.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });

  /* ----------------------------------------------------------
     7. Hero Decoration Parallax
     ---------------------------------------------------------- */
  var heroDecoration = document.querySelector(".hero__decoration");
  var heroSection = document.querySelector(".hero");

  function handleParallax() {
    if (!heroDecoration || !heroSection) return;
    var heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    var scrollY = window.scrollY;
    if (scrollY < heroBottom) {
      heroDecoration.style.transform = "translateY(" + (scrollY * 0.25) + "px)";
    }
  }

  window.addEventListener("scroll", handleParallax, { passive: true });

  /* ----------------------------------------------------------
     7b. About Image Parallax
     ---------------------------------------------------------- */
  var aboutImg = document.querySelector(".about__visual-frame img");

  function handleAboutParallax() {
    if (!aboutImg) return;
    var rect = aboutImg.getBoundingClientRect();
    var scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    if (scrollPercent > 0 && scrollPercent < 1) {
      aboutImg.style.transform = "translateY(" + ((scrollPercent - 0.5) * -30) + "px)";
    }
  }

  window.addEventListener("scroll", handleAboutParallax, { passive: true });

  /* ----------------------------------------------------------
     7c. Section Background Parallax
     ---------------------------------------------------------- */
  var parallaxBgs = document.querySelectorAll("[data-parallax-bg]");

  function handleBgParallax() {
    parallaxBgs.forEach(function (bg) {
      var section = bg.closest(".section--bg");
      if (!section) return;
      var rect = section.getBoundingClientRect();
      var winH = window.innerHeight;
      if (rect.bottom < 0 || rect.top > winH) return;
      var progress = (winH - rect.top) / (winH + rect.height);
      var yOffset = (progress - 0.5) * 80;
      bg.style.transform = "translateY(" + yOffset + "px) scale(1.05)";
    });
  }

  window.addEventListener("scroll", handleBgParallax, { passive: true });

  /* ----------------------------------------------------------
     8. Scroll Progress Bar
     ---------------------------------------------------------- */
  var progressBar = document.getElementById("scroll-progress");

  function handleScrollProgress() {
    if (!progressBar) return;
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    var progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + "%";
  }

  window.addEventListener("scroll", handleScrollProgress, { passive: true });

  /* ----------------------------------------------------------
     9. Custom Cursor on Portfolio Cards
     ---------------------------------------------------------- */
  var cursorEl = document.getElementById("cursor-view");
  var isOverCard = false;

  function initCustomCursor() {
    if (!cursorEl) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    document.addEventListener("mousemove", function (e) {
      cursorEl.style.left = e.clientX + "px";
      cursorEl.style.top = e.clientY + "px";

      if (!isOverCard) return;
    });

    grid.addEventListener("mouseover", function (e) {
      var card = e.target.closest(".collage-card");
      if (card) {
        isOverCard = true;
        cursorEl.classList.add("is-active");
      }
    });

    grid.addEventListener("mouseout", function (e) {
      var card = e.target.closest(".collage-card");
      if (!card && !e.relatedTarget) {
        isOverCard = false;
        cursorEl.classList.remove("is-active");
      }
      var related = e.relatedTarget;
      if (related && !related.closest(".collage-card")) {
        isOverCard = false;
        cursorEl.classList.remove("is-active");
      }
    });

    grid.addEventListener("mouseleave", function () {
      isOverCard = false;
      cursorEl.classList.remove("is-active");
    });
  }

  /* ----------------------------------------------------------
     10. Legal Modals (Privacy & Terms)
     ---------------------------------------------------------- */
  document.querySelectorAll('.footer__legal-btn[data-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modal = document.getElementById(btn.getAttribute('data-modal'));
      if (modal) {
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  document.querySelectorAll('.legal-modal__close, .legal-modal__backdrop').forEach(function (el) {
    el.addEventListener('click', function () {
      var modal = el.closest('.legal-modal');
      if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.legal-modal[aria-hidden="false"]').forEach(function (modal) {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    }
  });

  /* ----------------------------------------------------------
     Init
     ---------------------------------------------------------- */
  renderPortfolio();
  observeReveals();
  handleNavScroll();
  handleScrollProgress();
  initCustomCursor();
})();
