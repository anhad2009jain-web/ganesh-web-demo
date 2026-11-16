// Edit all studio contact details here. Every contact link reuses this config.
const STUDIO_CONFIG = {
  name: "Ganesh Digital Studio",
  whatsappNumber: "919419131283",
  phoneDisplay: "+91 94191 31283",
  phoneLink: "+919419131283",
  address: "692-A, Near Dudhadhari Mandir, Last Morh, Gandhi Nagar, Jammu, J&K, India",
  email: "[EMAIL]",
  instagramUrl: "[INSTAGRAM_URL]",
};

document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const whatsappBase = `https://wa.me/${STUDIO_CONFIG.whatsappNumber}`;
const whatsappMessages = {
  booking: `Hello ${STUDIO_CONFIG.name}, I'd like to discuss my upcoming event and check your availability.`,
  general: `Hello ${STUDIO_CONFIG.name}, I'd like to know more about your photography services.`,
  floating: "Hi, I'd like to know more about your photography services.",
};

// Centralized contact details and map links.
document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  const message = whatsappMessages[link.dataset.whatsapp] || whatsappMessages.general;
  link.href = `${whatsappBase}?text=${encodeURIComponent(message)}`;
});
document.querySelectorAll("[data-phone]").forEach((link) => {
  link.href = `tel:${STUDIO_CONFIG.phoneLink}`;
});
document.querySelectorAll('[data-config="phoneDisplay"]').forEach((element) => {
  element.textContent = STUDIO_CONFIG.phoneDisplay;
});
document.querySelectorAll('[data-config="address"]').forEach((element) => {
  element.textContent = STUDIO_CONFIG.address;
});
const mapQuery = encodeURIComponent(STUDIO_CONFIG.address);
document.querySelector("[data-map]").src = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
document.querySelector("[data-directions]").href = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
document.querySelector("[data-instagram]").href = STUDIO_CONFIG.instagramUrl === "[INSTAGRAM_URL]"
  ? "https://www.instagram.com/"
  : STUDIO_CONFIG.instagramUrl;
document.querySelector("#current-year").textContent = new Date().getFullYear();

// Fixed navigation and mobile menu.
const header = document.querySelector("#site-header");
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector("#primary-navigation");
const heroContent = document.querySelector(".hero-content");
let scrollFramePending = false;
function updateScrollEffects() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
  if (!reducedMotion.matches && window.scrollY <= window.innerHeight) {
    heroContent.style.setProperty("--hero-offset", `${window.scrollY * 0.06}px`);
  }
  scrollFramePending = false;
}
window.addEventListener("scroll", () => {
  if (!scrollFramePending) {
    scrollFramePending = true;
    requestAnimationFrame(updateScrollEffects);
  }
}, { passive: true });
updateScrollEffects();

function setMenu(open) {
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  navPanel.classList.toggle("is-open", open);
  document.body.classList.toggle("nav-open", open && window.innerWidth < 1024);
}
navToggle.addEventListener("click", () => setMenu(navToggle.getAttribute("aria-expanded") !== "true"));
navPanel.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    navToggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (navToggle.getAttribute("aria-expanded") === "true" && !header.contains(event.target)) setMenu(false);
});
window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) setMenu(false);
});

// Full-screen hero slider with manual controls and pause on hover/focus.
const hero = document.querySelector(".hero");
const slides = [...document.querySelectorAll(".hero-slide")];
const slideButtons = [...document.querySelectorAll(".slider-dot")];
let activeSlide = 0;
let heroTimer;
function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("is-active", i === activeSlide));
  slideButtons.forEach((button, i) => {
    button.classList.toggle("is-active", i === activeSlide);
    button.setAttribute("aria-pressed", String(i === activeSlide));
  });
}
function startHeroSlider() {
  window.clearInterval(heroTimer);
  if (!reducedMotion.matches) heroTimer = window.setInterval(() => showSlide(activeSlide + 1), 6000);
}
slideButtons.forEach((button) => button.addEventListener("click", () => {
  showSlide(Number(button.dataset.slide));
  startHeroSlider();
}));
hero.addEventListener("mouseenter", () => window.clearInterval(heroTimer));
hero.addEventListener("mouseleave", startHeroSlider);
hero.addEventListener("focusin", () => window.clearInterval(heroTimer));
hero.addEventListener("focusout", startHeroSlider);
startHeroSlider();

// Gentle reveal animations. Content remains visible when JS or observers are unavailable.
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px" });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

// Count-up trust metrics when the strip enters view.
const counters = document.querySelectorAll("[data-counter]");
function animateCounter(element) {
  const target = Number(element.dataset.counter);
  if (reducedMotion.matches) {
    element.textContent = target.toLocaleString("en-IN");
    return;
  }
  const start = performance.now();
  const duration = 1300;
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased).toLocaleString("en-IN");
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach((counter) => counterObserver.observe(counter));
}

// Filterable portfolio.
const filterButtons = [...document.querySelectorAll(".filter")];
const galleryItems = [...document.querySelectorAll(".gallery-item")];
filterButtons.forEach((button) => button.addEventListener("click", () => {
  const category = button.dataset.filter;
  filterButtons.forEach((item) => {
    const selected = item === button;
    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  galleryItems.forEach((item) => {
    const visible = category === "all" || item.dataset.category === category;
    item.classList.toggle("is-filtered", !visible);
    item.setAttribute("aria-hidden", String(!visible));
    item.tabIndex = visible ? 0 : -1;
  });
}));

// Accessible lightbox with keyboard, backdrop, and previous/next controls.
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
let activeGalleryItem = 0;
let lightboxTrigger;
function visibleGalleryItems() {
  return galleryItems.filter((item) => !item.classList.contains("is-filtered"));
}
function renderLightbox(item) {
  const visibleItems = visibleGalleryItems();
  activeGalleryItem = visibleItems.indexOf(item);
  lightboxImage.src = item.dataset.full;
  lightboxImage.alt = item.querySelector("img").alt;
  lightboxCaption.textContent = item.dataset.caption;
}
function openLightbox(item) {
  lightboxTrigger = item;
  renderLightbox(item);
  lightbox.showModal();
}
function moveLightbox(direction) {
  const visibleItems = visibleGalleryItems();
  const nextIndex = (activeGalleryItem + direction + visibleItems.length) % visibleItems.length;
  renderLightbox(visibleItems[nextIndex]);
}
galleryItems.forEach((item) => item.addEventListener("click", () => openLightbox(item)));
document.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
document.querySelector(".lightbox-prev").addEventListener("click", () => moveLightbox(-1));
document.querySelector(".lightbox-next").addEventListener("click", () => moveLightbox(1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});
lightbox.addEventListener("close", () => lightboxTrigger?.focus());

// Testimonial carousel.
const testimonials = [...document.querySelectorAll(".testimonial")];
const reviewDots = [...document.querySelectorAll("[data-review]")];
let activeReview = 0;
let reviewTimer;
function showReview(index) {
  activeReview = (index + testimonials.length) % testimonials.length;
  testimonials.forEach((review, i) => {
    review.hidden = i !== activeReview;
    review.classList.toggle("is-active", i === activeReview);
  });
  reviewDots.forEach((dot, i) => {
    dot.classList.toggle("is-active", i === activeReview);
    dot.setAttribute("aria-pressed", String(i === activeReview));
  });
}
function startReviews() {
  window.clearInterval(reviewTimer);
  if (!reducedMotion.matches) reviewTimer = window.setInterval(() => showReview(activeReview + 1), 7000);
}
document.querySelector("#testimonial-prev").addEventListener("click", () => { showReview(activeReview - 1); startReviews(); });
document.querySelector("#testimonial-next").addEventListener("click", () => { showReview(activeReview + 1); startReviews(); });
reviewDots.forEach((dot) => dot.addEventListener("click", () => { showReview(Number(dot.dataset.review)); startReviews(); }));
const testimonialSection = document.querySelector("#testimonials");
testimonialSection.addEventListener("mouseenter", () => window.clearInterval(reviewTimer));
testimonialSection.addEventListener("mouseleave", startReviews);
testimonialSection.addEventListener("focusin", () => window.clearInterval(reviewTimer));
testimonialSection.addEventListener("focusout", startReviews);
startReviews();

// Required-field validation and WhatsApp appointment handoff.
const bookingForm = document.querySelector("#booking-form");
const successMessage = document.querySelector("#form-success");
const requiredFields = [...bookingForm.querySelectorAll("[required]")];
const dateInput = document.querySelector("#event-date");
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
dateInput.min = localToday;

function validateField(field) {
  const error = document.querySelector(`#${field.id}-error`);
  let message = "";
  if (!field.value.trim()) message = "Please complete this required field.";
  if (field === dateInput && field.value && field.value < localToday) message = "Please choose today or a future date.";
  field.classList.toggle("is-invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  if (message) field.setAttribute("aria-describedby", error.id);
  else field.removeAttribute("aria-describedby");
  error.textContent = message;
  return !message;
}
requiredFields.forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.classList.contains("is-invalid")) validateField(field);
    successMessage.hidden = true;
  });
  field.addEventListener("change", () => {
    if (field.classList.contains("is-invalid")) validateField(field);
  });
});
bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  successMessage.hidden = true;
  const validity = requiredFields.map(validateField);
  if (validity.includes(false)) {
    requiredFields[validity.indexOf(false)].focus();
    return;
  }
  const data = new FormData(bookingForm);
  const name = data.get("name").trim();
  const eventType = data.get("eventType");
  const eventDate = data.get("eventDate");
  const location = data.get("eventLocation").trim();
  const message = data.get("message").trim();
  const formattedDate = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${eventDate}T12:00:00`));
  const whatsappText = `Hello ${STUDIO_CONFIG.name}, I'm ${name}. I'd like to book ${eventType} on ${formattedDate} at ${location}.${message ? ` ${message}` : ""}`;
  const whatsappUrl = `${whatsappBase}?text=${encodeURIComponent(whatsappText)}`;
  const whatsappWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  if (!whatsappWindow) {
    // Popup blockers can still be bypassed through this direct, user-initiated navigation.
    window.location.href = whatsappUrl;
  }
  successMessage.hidden = false;
  successMessage.focus({ preventScroll: true });
});
