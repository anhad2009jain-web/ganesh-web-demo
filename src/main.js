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

// CMS-driven, filterable portfolio.
const filterButtons = [...document.querySelectorAll(".filter")];
const galleryGrid = document.querySelector(".masonry-gallery");
const galleryNote = document.querySelector(".gallery-note");
let galleryItems = [];
let activeGalleryFilter = "all";
function applyGalleryFilter(category) {
  activeGalleryFilter = category;
  filterButtons.forEach((item) => {
    const selected = item.dataset.filter === category;
    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  galleryItems.forEach((item) => {
    const visible = category === "all" || item.dataset.category === category;
    item.classList.toggle("is-filtered", !visible);
    item.setAttribute("aria-hidden", String(!visible));
    item.tabIndex = visible ? 0 : -1;
  });
}
filterButtons.forEach((button) => button.addEventListener("click", () => applyGalleryFilter(button.dataset.filter)));

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
  if (!visibleItems.length) return;
  const nextIndex = (activeGalleryItem + direction + visibleItems.length) % visibleItems.length;
  renderLightbox(visibleItems[nextIndex]);
}
galleryGrid.addEventListener("click", (event) => {
  const item = event.target.closest(".gallery-item");
  if (item) openLightbox(item);
});
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

function renderPortfolio(items) {
  galleryGrid.replaceChildren();
  galleryItems = items.map((item, index) => {
    const button = document.createElement("button");
    const layoutClass = index === 2 ? " wide" : ([0, 3, 5, 7].includes(index) ? " tall" : "");
    button.className = `gallery-item${layoutClass} reveal is-visible`;
    button.type = "button";
    button.dataset.category = item.category.trim().toLowerCase();
    button.dataset.full = cmsAssetUrl(item.image);
    button.dataset.caption = `${item.category.trim()} · ${item.title.trim()}`;

    const image = document.createElement("img");
    image.src = cmsAssetUrl(item.image);
    image.alt = item.title.trim();
    image.loading = "lazy";
    const caption = document.createElement("span");
    const category = document.createElement("small");
    category.textContent = item.category.trim();
    caption.append(category, document.createTextNode(item.title.trim()));
    button.append(image, caption);
    galleryGrid.append(button);
    return button;
  });
  galleryNote.hidden = items.length > 0;
  galleryNote.textContent = items.length ? "" : "No featured portfolio images yet. Please check back soon.";
  applyGalleryFilter(activeGalleryFilter);
}

// Customer Reviews CMS integration and testimonial carousel.
const testimonialCarousel = document.querySelector(".testimonial-carousel");
const testimonialSection = document.querySelector("#testimonials");
const previousReviewButton = document.querySelector("#testimonial-prev");
const nextReviewButton = document.querySelector("#testimonial-next");
let testimonials = [];
let reviewDots = [];
let activeReview = 0;
let reviewTimer;

function showReviewMessage(message) {
  window.clearInterval(reviewTimer);
  testimonials = [];
  reviewDots = [];
  const status = document.createElement("p");
  status.className = "testimonial-status";
  status.id = "review-status";
  status.setAttribute("role", "status");
  status.textContent = message;
  testimonialCarousel.replaceChildren(status);
  previousReviewButton.disabled = true;
  nextReviewButton.disabled = true;
}

function showReview(index) {
  if (!testimonials.length) return;
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
  if (testimonials.length > 1 && !reducedMotion.matches) {
    reviewTimer = window.setInterval(() => showReview(activeReview + 1), 7000);
  }
}

function createStars() {
  const stars = document.createElement("div");
  stars.className = "stars";
  stars.setAttribute("aria-label", "5 out of 5 stars");
  for (let i = 0; i < 5; i += 1) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#icon-star");
    svg.append(use);
    stars.append(svg);
  }
  return stars;
}

function customerInitials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function createReviewArticle(review, index) {
  const article = document.createElement("article");
  article.className = `testimonial${index === 0 ? " is-active" : ""}`;
  article.dataset.testimonial = String(index);
  article.hidden = index !== 0;

  const quote = document.createElement("blockquote");
  quote.textContent = `“${review.review.trim()}”`;

  const reviewer = document.createElement("div");
  reviewer.className = "reviewer";
  const initials = document.createElement("span");
  initials.textContent = customerInitials(review.name);
  const reviewerDetails = document.createElement("div");
  const customerName = document.createElement("strong");
  customerName.textContent = review.name.trim();
  const eventLocation = document.createElement("small");
  eventLocation.textContent = [review.event, review.location]
    .filter((value) => typeof value === "string" && value.trim())
    .map((value) => value.trim())
    .join(" · ");
  reviewerDetails.append(customerName, eventLocation);
  reviewer.append(initials, reviewerDetails);
  article.append(createStars(), quote, reviewer);
  return article;
}

function renderReviews(reviews) {
  window.clearInterval(reviewTimer);
  activeReview = 0;
  testimonialCarousel.replaceChildren();
  testimonials = reviews.map((review, index) => createReviewArticle(review, index));

  const dotsContainer = document.createElement("div");
  dotsContainer.className = "carousel-dots";
  dotsContainer.setAttribute("role", "group");
  dotsContainer.setAttribute("aria-label", "Choose testimonial");
  reviewDots = reviews.map((review, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.dataset.review = String(index);
    dot.setAttribute("aria-label", `Show review ${index + 1}`);
    dot.setAttribute("aria-pressed", String(index === 0));
    dot.classList.toggle("is-active", index === 0);
    dotsContainer.append(dot);
    return dot;
  });

  testimonialCarousel.append(...testimonials, dotsContainer);
  previousReviewButton.disabled = reviews.length < 2;
  nextReviewButton.disabled = reviews.length < 2;
  startReviews();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!response.ok) throw new Error(`CMS request failed with HTTP ${response.status}`);
  return response.json();
}

const CMS_API_ROOT = "https://api.github.com/repos/anhad2009jain-web/ganesh-web-demo/contents/content";
const CMS_RAW_ROOT = "https://raw.githubusercontent.com/anhad2009jain-web/ganesh-web-demo/main";

function cmsAssetUrl(path) {
  if (typeof path !== "string" || !path.trim()) return "";
  if (/^(https?:|data:)/.test(path)) return path;
  return new URL(path.replace(/^\/+/, ""), document.baseURI).href;
}

async function fetchCmsCollection(collection, validate) {
  const cacheBuster = Date.now();
  const listing = await fetchJson(`${CMS_API_ROOT}/${collection}?ref=main&_=${cacheBuster}`);
  if (!Array.isArray(listing)) throw new Error(`The ${collection} directory response was not a file list`);
  const jsonFiles = listing.filter((file) => file.type === "file" && file.name.toLowerCase().endsWith(".json") && file.download_url);
  const results = await Promise.allSettled(jsonFiles.map(async (file) => {
    const fileUrl = new URL(file.download_url);
    fileUrl.searchParams.set("v", file.sha || cacheBuster);
    const item = await fetchJson(fileUrl);
    validate(item, file.name);
    return item;
  }));
  results.forEach((result, index) => {
    if (result.status === "rejected") console.warn(`Could not load ${collection}/${jsonFiles[index].name}:`, result.reason);
  });
  return {
    items: results.filter((result) => result.status === "fulfilled").map((result) => result.value),
    total: jsonFiles.length,
  };
}

function requireText(item, fields, filename) {
  if (!item || fields.some((field) => typeof item[field] !== "string" || !item[field].trim())) {
    throw new Error(`Invalid CMS data in ${filename}`);
  }
}

async function loadReviews() {
  try {
    const { items: reviews, total } = await fetchCmsCollection("reviews", (review, filename) => {
      requireText(review, ["name", "review"], filename);
    });
    const featuredReviews = reviews.filter((review) => review.featured === true);
    if (!featuredReviews.length) {
      showReviewMessage(total > 0 && reviews.length === 0
        ? "We couldn’t load customer reviews right now. Please try again later."
        : "No featured customer reviews yet. Please check back soon.");
      return;
    }
    renderReviews(featuredReviews);
  } catch (error) {
    console.error("Could not load customer reviews:", error);
    showReviewMessage("We couldn’t load customer reviews right now. Please try again later.");
  }
}

function applySiteSettings(site) {
  STUDIO_CONFIG.name = typeof site.studioName === "string" && site.studioName.trim() ? site.studioName.trim() : STUDIO_CONFIG.name;
  STUDIO_CONFIG.phoneDisplay = typeof site.phone === "string" && site.phone.trim() ? site.phone.trim() : STUDIO_CONFIG.phoneDisplay;
  STUDIO_CONFIG.phoneLink = STUDIO_CONFIG.phoneDisplay.startsWith("+") ? STUDIO_CONFIG.phoneDisplay.replace(/[^+\d]/g, "") : `+${STUDIO_CONFIG.phoneDisplay.replace(/\D/g, "")}`;
  STUDIO_CONFIG.whatsappNumber = typeof site.whatsapp === "string" && site.whatsapp.trim() ? site.whatsapp.replace(/\D/g, "") : STUDIO_CONFIG.whatsappNumber;
  STUDIO_CONFIG.address = typeof site.address === "string" && site.address.trim() ? site.address.trim() : STUDIO_CONFIG.address;
  STUDIO_CONFIG.instagramUrl = typeof site.instagram === "string" && site.instagram.trim() ? site.instagram.trim() : STUDIO_CONFIG.instagramUrl;

  document.querySelectorAll(".brand-copy strong").forEach((element) => { element.textContent = STUDIO_CONFIG.name; });
  document.title = `${STUDIO_CONFIG.name} | Photography & Films in Jammu`;
  if (typeof site.heroTitle === "string" && site.heroTitle.trim()) {
    const words = site.heroTitle.trim().split(/\s+/);
    const emphasis = words.splice(-2).join(" ");
    const heading = document.querySelector(".hero h1");
    const em = document.createElement("em");
    em.textContent = emphasis;
    heading.replaceChildren(document.createTextNode(`${words.join(" ")} `), em);
  }
  if (typeof site.heroDescription === "string" && site.heroDescription.trim()) {
    document.querySelector(".hero-intro").textContent = site.heroDescription.trim();
  }
  if (Number.isFinite(site.experience)) {
    const counter = document.querySelector('[data-counter="20"]');
    counter.dataset.counter = String(site.experience);
    counter.textContent = String(site.experience);
  }
  if (Number.isFinite(site.eventsCovered)) {
    const counter = document.querySelector('[data-counter="1000"]');
    counter.dataset.counter = String(site.eventsCovered);
    counter.textContent = site.eventsCovered.toLocaleString("en-IN");
  }

  const updatedWhatsappBase = `https://wa.me/${STUDIO_CONFIG.whatsappNumber}`;
  const messages = {
    booking: `Hello ${STUDIO_CONFIG.name}, I'd like to discuss my upcoming event and check your availability.`,
    general: `Hello ${STUDIO_CONFIG.name}, I'd like to know more about your photography services.`,
    floating: "Hi, I'd like to know more about your photography services.",
  };
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = `${updatedWhatsappBase}?text=${encodeURIComponent(messages[link.dataset.whatsapp] || messages.general)}`;
  });
  document.querySelectorAll("[data-phone]").forEach((link) => { link.href = `tel:${STUDIO_CONFIG.phoneLink}`; });
  document.querySelectorAll('[data-config="phoneDisplay"]').forEach((element) => { element.textContent = STUDIO_CONFIG.phoneDisplay; });
  document.querySelectorAll('[data-config="address"]').forEach((element) => { element.textContent = STUDIO_CONFIG.address; });
  const updatedMapQuery = encodeURIComponent(STUDIO_CONFIG.address);
  document.querySelector("[data-map]").src = `https://www.google.com/maps?q=${updatedMapQuery}&output=embed`;
  document.querySelector("[data-directions]").href = `https://www.google.com/maps/dir/?api=1&destination=${updatedMapQuery}`;
  document.querySelector("[data-instagram]").href = STUDIO_CONFIG.instagramUrl === "[INSTAGRAM_URL]" ? "https://www.instagram.com/" : STUDIO_CONFIG.instagramUrl;
}

async function loadSiteSettings() {
  try {
    const site = await fetchJson(`${CMS_RAW_ROOT}/content/site.json?_=${Date.now()}`);
    if (!site || typeof site !== "object" || Array.isArray(site)) throw new Error("Invalid studio settings");
    applySiteSettings(site);
  } catch (error) {
    console.error("Could not load studio settings:", error);
  }
}

function createIcon(name, className = "icon") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", className);
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `#icon-${name}`);
  svg.append(use);
  return svg;
}

function serviceIconName(title) {
  const value = title.toLowerCase();
  if (value.includes("pre-wedding") || value.includes("engagement")) return "heart";
  if (value.includes("baby") || value.includes("kids")) return "baby";
  if (value.includes("fashion") || value.includes("portfolio")) return "fashion";
  if (value.includes("anniversary")) return "anniversary";
  if (value.includes("convocation")) return "cap";
  if (value.includes("concert")) return "music";
  if (value.includes("conference") || value.includes("corporate")) return "briefcase";
  return "rings";
}

function showCollectionMessage(container, message) {
  const status = document.createElement("p");
  status.className = "cms-status";
  status.setAttribute("role", "status");
  status.textContent = message;
  container.replaceChildren(status);
}

async function loadServices() {
  const grid = document.querySelector(".services-grid");
  try {
    const { items } = await fetchCmsCollection("services", (item, filename) => requireText(item, ["title", "description"], filename));
    const services = items.filter((item) => item.featured === true);
    if (!services.length) {
      showCollectionMessage(grid, "No services are currently featured.");
      return;
    }
    const cards = services.map((service) => {
      const card = document.createElement("article");
      card.className = "service-card reveal is-visible";
      const title = document.createElement("h3");
      title.textContent = service.title.trim();
      const description = document.createElement("p");
      description.textContent = service.description.trim();
      const link = document.createElement("a");
      link.href = "#booking";
      link.setAttribute("aria-label", `Book ${service.title.trim()}`);
      link.append(document.createTextNode("Enquire "), createIcon("arrow"));
      card.append(createIcon(serviceIconName(service.title)), title, description, link);
      return card;
    });
    grid.replaceChildren(...cards);
  } catch (error) {
    console.error("Could not load services:", error);
    showCollectionMessage(grid, "We couldn’t load services right now. Please try again later.");
  }
}

async function loadProducts() {
  const grid = document.querySelector(".products-grid");
  try {
    const { items } = await fetchCmsCollection("products", (item, filename) => requireText(item, ["title", "description", "image"], filename));
    const products = items.filter((item) => item.featured === true);
    if (!products.length) {
      showCollectionMessage(grid, "No products are currently featured.");
      return;
    }
    const cards = products.map((product) => {
      const card = document.createElement("article");
      card.className = "product-card reveal is-visible";
      const image = document.createElement("img");
      image.src = cmsAssetUrl(product.image);
      image.alt = product.title.trim();
      image.loading = "lazy";
      const details = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = product.title.trim();
      const description = document.createElement("p");
      description.textContent = product.description.trim();
      details.append(title, description);
      card.append(image, details);
      return card;
    });
    grid.replaceChildren(...cards);
  } catch (error) {
    console.error("Could not load products:", error);
    showCollectionMessage(grid, "We couldn’t load products right now. Please try again later.");
  }
}

async function loadPortfolio() {
  try {
    const { items } = await fetchCmsCollection("portfolio", (item, filename) => requireText(item, ["title", "category", "image"], filename));
    renderPortfolio(items.filter((item) => item.featured === true));
  } catch (error) {
    console.error("Could not load portfolio:", error);
    galleryGrid.replaceChildren();
    galleryNote.hidden = false;
    galleryNote.textContent = "We couldn’t load the portfolio right now. Please try again later.";
  }
}

previousReviewButton.addEventListener("click", () => { showReview(activeReview - 1); startReviews(); });
nextReviewButton.addEventListener("click", () => { showReview(activeReview + 1); startReviews(); });
testimonialCarousel.addEventListener("click", (event) => {
  const dot = event.target.closest("[data-review]");
  if (!dot) return;
  showReview(Number(dot.dataset.review));
  startReviews();
});
testimonialSection.addEventListener("mouseenter", () => window.clearInterval(reviewTimer));
testimonialSection.addEventListener("mouseleave", startReviews);
testimonialSection.addEventListener("focusin", () => window.clearInterval(reviewTimer));
testimonialSection.addEventListener("focusout", startReviews);
loadSiteSettings();
loadServices();
loadProducts();
loadPortfolio();
loadReviews();

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
