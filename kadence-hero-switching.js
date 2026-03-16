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

    var intervalMs = 3000;
    var fadeMs = 700;
    var index = 0;
    var timerId = null;

    wrapper.style.setProperty("--kb-switch-fade", fadeMs + "ms");

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
        setActive(slideIndex);
        restartTimer();
      });
      dotsContainer.appendChild(dot);
      return dot;
    });

    function setActive(nextIndex) {
      index = nextIndex;

      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
        slide.setAttribute("aria-hidden", i === index ? "false" : "true");
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
        dot.setAttribute("aria-current", i === index ? "true" : "false");
      });
    }

    function tick() {
      var nextIndex = index + 1 >= slides.length ? 0 : index + 1;
      setActive(nextIndex);
    }

    function restartTimer() {
      if (prefersReducedMotion) return;
      if (timerId) window.clearInterval(timerId);
      timerId = window.setInterval(tick, intervalMs);
    }

    setActive(0);
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
