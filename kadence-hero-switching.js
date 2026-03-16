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
    if (wrapper.dataset.kbSwitchInit === "1") return;
    wrapper.dataset.kbSwitchInit = "1";

    var slides = Array.prototype.slice.call(
      wrapper.querySelectorAll(".kb-switch-image")
    );
    if (slides.length < 2) return;

    var captions = Array.prototype.slice.call(
      wrapper.querySelectorAll(".kb-slide-caption")
    );

    var intervalMs = 3600;
    var slideMs = 850;
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

    var arrowsContainer = wrapper.querySelector(".kb-switch-arrows");
    if (!arrowsContainer) {
      arrowsContainer = document.createElement("div");
      arrowsContainer.className = "kb-switch-arrows";
      wrapper.appendChild(arrowsContainer);
    }

    var prevButton = document.createElement("button");
    prevButton.type = "button";
    prevButton.className = "kb-switch-arrow kb-switch-arrow-prev";
    prevButton.setAttribute("aria-label", "Previous slide");
    prevButton.textContent = "‹";
    prevButton.addEventListener("click", function () {
      var nextIndex = index - 1 < 0 ? slides.length - 1 : index - 1;
      goTo(nextIndex);
      restartTimer();
    });

    var nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "kb-switch-arrow kb-switch-arrow-next";
    nextButton.setAttribute("aria-label", "Next slide");
    nextButton.textContent = "›";
    nextButton.addEventListener("click", function () {
      var nextIndex = index + 1 >= slides.length ? 0 : index + 1;
      goTo(nextIndex);
      restartTimer();
    });

    arrowsContainer.appendChild(prevButton);
    arrowsContainer.appendChild(nextButton);

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

    function updateCaptions() {
      if (captions.length !== slides.length) return;
      captions.forEach(function (caption, i) {
        var isActive = i === index;
        caption.classList.toggle("is-active", isActive);
        caption.setAttribute("aria-hidden", isActive ? "false" : "true");
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
      updateCaptions();
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
    updateCaptions();
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
