(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /**
   * Initializes one hero switcher region.
   * Required structure:
   * - Wrapper with class .kb-hero-switch
   * - Two or more child elements with class .kb-switch-image
   */
  function initHeroSwitch(wrapper) {
    var slides = Array.prototype.slice.call(
      wrapper.querySelectorAll(".kb-switch-image")
    );
    if (slides.length < 2) return;

    var intervalMs = 3200;
    var slideMs = 800;
    var index = 0;
    var timerId = null;

    wrapper.style.setProperty("--kb-slide-duration", slideMs + "ms");

    var dotsContainer = wrapper.querySelector(".kb-switch-dots");
    if (!dotsContainer) {
      dotsContainer = document.createElement("div");
      dotsContainer.className = "kb-switch-dots";
      wrapper.appendChild(dotsContainer);
    }

    var dots = slides.map(function (_, slideIndex) {
      var dot = document.createElement("button");
      dot.className = "kb-switch-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to slide " + (slideIndex + 1));
      dot.addEventListener("click", function () {
        goTo(slideIndex);
        restartTimer();
      });
      dotsContainer.appendChild(dot);
      return dot;
    });

    function updateDots() {
      dots.forEach(function (dot, i) {
        var isActive = i === index;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
    }

    function applyVisibility() {
      slides.forEach(function (slide, i) {
        slide.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
    }

    function goTo(nextIndex) {
      if (nextIndex === index) return;

      var prevIndex = index;

      slides[prevIndex].classList.remove("is-prev");
      slides[nextIndex].classList.remove("is-prev");

      // Force layout so the browser applies the transition consistently.
      // eslint-disable-next-line no-unused-expressions
      slides[nextIndex].offsetWidth;

      slides[prevIndex].classList.remove("is-active");
      slides[prevIndex].classList.add("is-prev");
      slides[nextIndex].classList.add("is-active");

      index = nextIndex;
      applyVisibility();
      updateDots();

      window.setTimeout(function () {
        slides[prevIndex].classList.remove("is-prev");
      }, slideMs + 40);
    }

    function tick() {
      var nextIndex = index + 1 >= slides.length ? 0 : index + 1;
      goTo(nextIndex);
    }

    function restartTimer() {
      if (prefersReducedMotion) return;
      if (timerId) window.clearInterval(timerId);
      timerId = window.setInterval(tick, intervalMs);
    }

    slides.forEach(function (slide, i) {
      slide.classList.remove("is-active", "is-prev");
      if (i === 0) slide.classList.add("is-active");
    });
    applyVisibility();
    updateDots();
    restartTimer();
  }

  function boot() {
    var wrappers = document.querySelectorAll(".kb-hero-switch");
    wrappers.forEach(initHeroSwitch);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
