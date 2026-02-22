// 1) Scroll reveal (IntersectionObserver)
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add("is-visible");
  });
}, { threshold: 0.12 });

revealEls.forEach((el) => io.observe(el));

// 2) Scroll progress bar
const progress = document.getElementById("scrollProgress");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progress.style.width = `${scrolled}%`;
});

// 3) Mobile menu toggle
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");

hamburger.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", open ? "true" : "false");
});

// close menu when clicking a link
nav.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

// 4) Projects carousel (Prev/Next + dots + keyboard + auto)
const slides = Array.from(document.querySelectorAll(".slide"));
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsWrap = document.getElementById("dots");

let idx = 0;

function renderSlides() {
  slides.forEach((s, i) => s.classList.toggle("is-active", i === idx));
  dotsWrap.querySelectorAll(".dot-btn").forEach((d, i) => d.classList.toggle("is-active", i === idx));
}

function go(n) {
  idx = (n + slides.length) % slides.length;
  renderSlides();
}

function buildDots() {
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.className = "dot-btn" + (i === idx ? " is-active" : "");
    b.setAttribute("aria-label", `Go to project ${i + 1}`);
    b.addEventListener("click", () => go(i));
    dotsWrap.appendChild(b);
  });
}

prevBtn.addEventListener("click", () => go(idx - 1));
nextBtn.addEventListener("click", () => go(idx + 1));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") go(idx - 1);
  if (e.key === "ArrowRight") go(idx + 1);
});

buildDots();
renderSlides();

// optional: auto-play (pause on hover)
let auto = setInterval(() => go(idx + 1), 6500);

const carousel = document.querySelector(".carousel");
carousel.addEventListener("mouseenter", () => clearInterval(auto));
carousel.addEventListener("mouseleave", () => auto = setInterval(() => go(idx + 1), 6500));

// 5) Gallery modal (click image to open)
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalClose = document.getElementById("modalClose");
const modalBackdrop = document.getElementById("modalBackdrop");

function openModal(src) {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  modalImg.src = src;
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  modalImg.src = "";
}

document.querySelectorAll(".gallery-item").forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.dataset.full));
});

modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});