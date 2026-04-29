gsap.registerPlugin();

// ==========================
// HERO ANIMATION
// ==========================
gsap.from(".hero-left", {
  x: -100,
  opacity: 0,
  duration: 1,
});

gsap.from(".hero-right", {
  x: 100,
  opacity: 0,
  duration: 1,
});

// ==========================
// TYPING EFFECT
// ==========================
const roles = ["WordPress Developer", "UI/UX Designer"];

let index = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const element = document.getElementById("typing-text");
  if (!element) return;

  let fullText = roles[index];

  element.textContent = isDeleting
    ? fullText.substring(0, charIndex--)
    : fullText.substring(0, charIndex++);

  let speed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === fullText.length) {
    speed = 1200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    index = (index + 1) % roles.length;
    speed = 500;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();

// ==========================
// NAVIGATION
// ==========================
const links = document.querySelectorAll(".menu a");
const sections = document.querySelectorAll(".section");

let current = document.querySelector(".section.active");
let isAnimating = false;

// ==========================
// SHOW SECTION
// ==========================
function showSection(target) {
  if (!target || target === current || isAnimating) return;

  isAnimating = true;

  const allSections = Array.from(sections);
  const currentIndex = allSections.indexOf(current);
  const targetIndex = allSections.indexOf(target);

  let direction = targetIndex > currentIndex ? 1 : -1;

  target.classList.add("active");

  gsap.set(target, {
    x: 100 * direction + "%",
    zIndex: 2,
  });

  gsap.set(current, {
    zIndex: 1,
  });

  gsap.to(current, {
    x: -100 * direction + "%",
    duration: 0.6,
    ease: "power2.inOut",
  });

  gsap.to(target, {
    x: "0%",
    duration: 0.6,
    ease: "power2.inOut",
    onComplete: () => {
      current.classList.remove("active");
      gsap.set(current, { x: "0%" });

      current = target;
      isAnimating = false;

      // MENU ACTIVE UPDATE
      links.forEach((l) => l.classList.remove("active"));

      const activeLink = document.querySelector(
        `.menu a[data-target="${target.id}"]`
      );

      if (activeLink) activeLink.classList.add("active");
    },
  });
}

// ==========================
// MENU CLICK
// ==========================
links.forEach((link) => {
  link.addEventListener("click", function () {
    const targetId = this.dataset.target;
    const target = document.getElementById(targetId);

    if (!target) return;

    showSection(target);
  });
});

// ==========================
// BUTTON FIX (View Projects + Contact Me)
// ==========================
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;

  showSection(target);
}

// ==========================
// SCROLL CONTROL
// ==========================
let isScrolling = false;

window.addEventListener("wheel", (e) => {
  if (isScrolling || isAnimating) return;

  const section = current;

  const scrollTop = section.scrollTop;
  const scrollHeight = section.scrollHeight;
  const clientHeight = section.clientHeight;

  const atBottom = scrollTop + clientHeight >= scrollHeight - 2;
  const atTop = scrollTop <= 2;

  const arr = Array.from(sections);
  let index = arr.indexOf(current);

  if (e.deltaY > 0) {
    if (!atBottom) return;

    isScrolling = true;

    if (index < arr.length - 1) {
      showSection(arr[index + 1]);
    }
  } else {
    if (!atTop) return;

    isScrolling = true;

    if (index > 0) {
      showSection(arr[index - 1]);
    }
  }

  setTimeout(() => {
    isScrolling = false;
  }, 700);
});

// ==========================
// PAGE LOAD
// ==========================
window.addEventListener("DOMContentLoaded", () => {
  sections.forEach((sec) => sec.classList.remove("active"));

  const home = document.getElementById("home");

  if (home) {
    home.classList.add("active");
    current = home;

    links.forEach((l) => l.classList.remove("active"));
    const homeLink = document.querySelector('[data-target="home"]');
    if (homeLink) homeLink.classList.add("active");

    gsap.from(home, {
      opacity: 0,
      y: 30,
      duration: 0.8,
    });
  }
});
