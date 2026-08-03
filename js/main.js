document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
    }
  }

  /* ---------- Take a Seat interactive table ---------- */
  var seatTable = document.querySelector(".seat-table");
  if (seatTable) {
    var seats = seatTable.querySelectorAll(".seat");
    var messageEl = document.querySelector(".seat-message");
    var resetBtn = document.querySelector(".seat-reset");
    var welcomeMessages = [
      "There's room for you here.",
      "Glad you pulled up a chair.",
      "You belong at this table.",
      "Healing starts with a seat like this one.",
      "You're welcome here, just as you are.",
      "This seat was waiting for you."
    ];

    function takeSeat(seat, announce) {
      seats.forEach(function (s) { s.classList.remove("taken"); });
      seat.classList.add("taken");
      var idx = Array.prototype.indexOf.call(seats, seat);
      if (messageEl) {
        messageEl.textContent = welcomeMessages[idx % welcomeMessages.length];
        messageEl.classList.add("show");
      }
      if (resetBtn) resetBtn.classList.add("show");
      if (announce) {
        try { localStorage.setItem("healingTableSeat", String(idx)); } catch (e) {}
      }
    }

    seats.forEach(function (seat) {
      seat.addEventListener("click", function () { takeSeat(seat, true); });
      seat.setAttribute("tabindex", "0");
      seat.setAttribute("role", "button");
      seat.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          takeSeat(seat, true);
        }
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        seats.forEach(function (s) { s.classList.remove("taken"); });
        if (messageEl) { messageEl.classList.remove("show"); }
        resetBtn.classList.remove("show");
        try { localStorage.removeItem("healingTableSeat"); } catch (e) {}
      });
    }

    try {
      var saved = localStorage.getItem("healingTableSeat");
      if (saved !== null && seats[saved]) {
        takeSeat(seats[saved], false);
      }
    } catch (e) {}
  }

  /* ---------- Rotating quote carousel ---------- */
  var carousel = document.querySelector(".quote-carousel");
  if (carousel) {
    var slides = carousel.querySelectorAll(".quote-slide");
    var dotsWrap = carousel.querySelector(".quote-dots");
    var current = 0;
    var timer;

    function goTo(index) {
      slides[current].classList.remove("active");
      if (dotsWrap) dotsWrap.children[current].classList.remove("active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("active");
      if (dotsWrap) dotsWrap.children[current].classList.add("active");
    }

    function startAutoplay() {
      timer = setInterval(function () { goTo(current + 1); }, 6000);
    }
    function stopAutoplay() {
      clearInterval(timer);
    }

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.className = "quote-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Show quote " + (i + 1));
        dot.addEventListener("click", function () {
          stopAutoplay();
          goTo(i);
          startAutoplay();
        });
        dotsWrap.appendChild(dot);
      });
    }

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    startAutoplay();
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
});
