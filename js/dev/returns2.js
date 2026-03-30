let currentActiveLink = null;
document.addEventListener("DOMContentLoaded", function() {
  const firstLink = document.querySelector(".nav-link");
  if (firstLink) {
    const sectionClass = firstLink.getAttribute("data-fls-scrollto").slice(1);
    updateActiveLink(sectionClass);
  }
});
document.addEventListener("watcherCallback", function(e) {
  const entry = e.detail.entry;
  const targetElement = entry.target;
  if (targetElement.classList.contains("legal-page__section")) {
    const sectionClass = Array.from(targetElement.classList).find(
      (cls) => cls.startsWith("section-")
    );
    if (entry.isIntersecting && entry.boundingClientRect.top < window.innerHeight / 2) {
      updateActiveLink(sectionClass);
    }
  }
});
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function() {
    const sectionClass = this.getAttribute("data-fls-scrollto").slice(1);
    updateActiveLink(sectionClass);
  });
});
function updateActiveLink(sectionClass) {
  if (currentActiveLink === sectionClass) return;
  const allLinks = document.querySelectorAll(".nav-link");
  const activeLink = document.querySelector(
    `[data-fls-scrollto=".${sectionClass}"]`
  );
  if (activeLink) {
    allLinks.forEach((link) => link.classList.remove("_active"));
    activeLink.classList.add("_active");
    currentActiveLink = sectionClass;
  }
}
window.addEventListener(
  "scroll",
  () => {
    const scrollPosition = window.innerHeight + window.pageYOffset;
    const pageHeight = document.documentElement.scrollHeight;
    if (scrollPosition >= pageHeight - 300) {
      updateActiveLink("section-7");
    }
  },
  { passive: true }
);
