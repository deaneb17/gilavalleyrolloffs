// script.js (safe whether or not the contact form exists)

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Start with smooth scroll OFF to prevent animated jump to #hash on load
document.documentElement.classList.remove("smooth-scroll");

window.addEventListener("load", () => {
  // If page was loaded with a hash (e.g. #contact), remove it so it can't auto-scroll
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  // Force top
  window.scrollTo(0, 0);

  // Turn smooth scrolling back on for normal clicking
  document.documentElement.classList.add("smooth-scroll");
});

(() => {
  // Footer year (always safe)
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Optional EmailJS contact form support
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");

  // If there's no form on the page, do nothing else (prevents console errors)
  if (!form) return;

  // === EmailJS config (fill these in if you want the form enabled) ===
  const PUBLIC_KEY = "YOUR_PUBLIC_KEY";
  const SERVICE_ID = "YOUR_SERVICE_ID";
  const TEMPLATE_ID = "YOUR_TEMPLATE_ID";

  // Helper: set status text safely
  function setStatus(msg, ok = true) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    // Light theme friendly colors
    statusEl.style.color = ok ? "rgba(43,43,43,0.80)" : "rgba(180,30,30,0.95)";
  }

  // Only proceed if EmailJS is loaded and config is set
  const emailjsLoaded = typeof window.emailjs !== "undefined";
  const configSet =
    PUBLIC_KEY !== "YOUR_PUBLIC_KEY" &&
    SERVICE_ID !== "YOUR_SERVICE_ID" &&
    TEMPLATE_ID !== "YOUR_TEMPLATE_ID";

  if (!emailjsLoaded) {
    setStatus("Form unavailable (EmailJS not loaded). Please call or email us.", false);
    return;
  }

  if (!configSet) {
    // Don't scare users in production; but this helps you during setup
    setStatus("Contact form not configured yet. Please call or email us.", false);
    return;
  }

  // Init EmailJS
  window.emailjs.init(PUBLIC_KEY);

  // Hook up form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setStatus("Sending…");

    window.emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form)
      .then(() => {
        setStatus("Sent! We’ll reach out shortly.");
        form.reset();
      })
      .catch(() => {
        setStatus("Something went wrong. Please try again or call/text us.", false);
      });
  });
})();
