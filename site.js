/* ASIC — site.js */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    /* --- Nav scroll class --- */
    var nav = document.getElementById("site-nav");
    if (nav) {
      function onScroll() {
        nav.classList.toggle("is-scrolled", window.scrollY > 8);
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    /* --- Mobile hamburger --- */
    var hamburger = document.querySelector(".nav-hamburger");
    var navLinks = document.querySelector(".nav-links");
    if (hamburger && navLinks) {
      function openMenu() {
        hamburger.setAttribute("aria-expanded", "true");
        navLinks.classList.add("is-open");
        nav.classList.add("menu-open");
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      }
      function closeMenu() {
        hamburger.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("is-open");
        nav.classList.remove("menu-open");
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }

      hamburger.addEventListener("click", function () {
        navLinks.classList.contains("is-open") ? closeMenu() : openMenu();
      });

      /* Close mobile menu on link click */
      navLinks.querySelectorAll(".nav-link").forEach(function (link) {
        link.addEventListener("click", closeMenu);
      });

      /* Close on Escape */
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && navLinks.classList.contains("is-open")) closeMenu();
      });
    }

    /* --- Active nav link (matches current page filename) --- */
    var page = window.location.pathname.split("/").pop() || "index.html";
    if (!page) page = "index.html";
    document.querySelectorAll(".nav-link").forEach(function (link) {
      var href = (link.getAttribute("href") || "").split("/").pop();
      if (href === page || (page === "" && href === "index.html")) {
        link.classList.add("is-active");
      }
    });

    /* --- Contact form submit --- */
    var form = document.getElementById("contact-form");
    var sent = document.getElementById("contact-sent");
    if (form && sent) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        form.style.display = "none";
        sent.style.display = "flex";
      });
    }

    /* --- Registration form submit --- */
    var regForm = document.getElementById("register-form");
    var regSent = document.getElementById("register-sent");
    if (regForm && regSent) {
      regForm.addEventListener("submit", function (e) {
        e.preventDefault();
        regForm.style.display = "none";
        regSent.style.display = "flex";
      });
    }

    /* --- Shark Tank background slideshow --- */
    var sharkSlides = document.querySelectorAll(".shark-bg-slide");
    if (sharkSlides.length > 1) {
      var sharkCurrent = 0;
      setInterval(function () {
        sharkSlides[sharkCurrent].classList.remove("active");
        sharkCurrent = (sharkCurrent + 1) % sharkSlides.length;
        sharkSlides[sharkCurrent].classList.add("active");
      }, 2000);
    }

    /* --- Bio read more --- */
    document.querySelectorAll('.bio-read-more').forEach(function (btn) {
      var body = btn.previousElementSibling;
      if (!body || !body.classList.contains('bio-body')) return;
      if (body.scrollHeight <= body.clientHeight + 4) {
        btn.style.display = 'none';
        return;
      }
      btn.addEventListener('click', function () {
        var expanded = body.classList.toggle('is-expanded');
        btn.classList.toggle('is-expanded', expanded);
        btn.setAttribute('aria-expanded', String(expanded));
        btn.innerHTML = expanded
          ? 'Read less <span class="arr">→</span>'
          : 'Read more <span class="arr">→</span>';
      });
    });

    /* --- Staggered reveal on scroll --- */
    if ("IntersectionObserver" in window) {
      /* General reveal — excludes what-items (handled separately below) */
      var revealEls = document.querySelectorAll("[data-reveal]:not(.what-item)");
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
      );
      revealEls.forEach(function (el) { io.observe(el); });

      /* Sequential reveal for what-list items */
      var whatList = document.querySelector(".what-list");
      if (whatList) {
        var listIo = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                var items = entry.target.querySelectorAll(".what-item[data-reveal]");
                items.forEach(function (item, i) {
                  setTimeout(function () { item.classList.add("revealed"); }, i * 120);
                });
                listIo.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
        );
        listIo.observe(whatList);
      }
    } else {
      /* Fallback: reveal immediately */
      document.querySelectorAll("[data-reveal]").forEach(function (el) {
        el.classList.add("revealed");
      });
    }

    /* --- Team member modal --- */
    var overlay    = document.getElementById("member-overlay");
    var modalClose = document.getElementById("member-modal-close");
    var modalName  = document.getElementById("modal-name");
    var modalRole  = document.getElementById("modal-role");
    var modalBio   = document.getElementById("modal-bio");
    var modalPhoto = document.getElementById("modal-photo");
    var modalPhotoPlaceholder = document.getElementById("modal-photo-placeholder");

    function openModal(card) {
      var name  = card.getAttribute("data-member-name") || "";
      var role  = card.getAttribute("data-member-role") || "";
      var photo = card.getAttribute("data-member-photo") || "";
      var bio   = card.getAttribute("data-member-bio") || "";

      modalName.textContent = name;
      modalRole.textContent = role;
      modalBio.textContent  = bio;

      if (photo) {
        modalPhoto.src = photo;
        modalPhoto.alt = name;
        modalPhoto.style.display = "block";
        modalPhotoPlaceholder.style.display = "none";
      } else {
        modalPhoto.style.display = "none";
        modalPhotoPlaceholder.style.display = "block";
      }

      overlay.setAttribute("aria-hidden", "false");
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    if (overlay) {
      document.querySelectorAll(".team-learn-more").forEach(function (btn) {
        btn.addEventListener("click", function () {
          openModal(btn.closest(".team-card"));
        });
      });

      if (modalClose) modalClose.addEventListener("click", closeModal);

      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeModal();
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeModal();
      });
    }
  });
})();
