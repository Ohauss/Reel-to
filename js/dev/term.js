import "./stepper.min.js";
import "./search.min.js";
import "./legal.min.js";
import "./common.min.js";
import "./cartStore.min.js";
/* empty css                  */
import "./cartCounter.min.js";
import "./wishlistCounter.min.js";
import "./wishlistStore.min.js";
document.addEventListener("watcherCallback", function(e) {
  const entry = e.detail.entry;
  const targetElement = entry.target;
  if (targetElement.classList.contains("legal-page__section")) {
    const sectionClass = Array.from(targetElement.classList).find(
      (cls) => cls.startsWith("section-")
    );
    if (entry.isIntersecting) {
      updateActiveLink(sectionClass);
    }
  }
});
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function() {
    this.getAttribute("data-fls-scrollto").slice(1);
    const allLinks = document.querySelectorAll(".nav-link");
    allLinks.forEach((l) => l.classList.remove("_active"));
    this.classList.add("_active");
  });
});
function updateActiveLink(sectionClass) {
  const allLinks = document.querySelectorAll(".nav-link");
  const activeLink = document.querySelector(
    `[data-fls-scrollto=".${sectionClass}"]`
  );
  if (activeLink) {
    allLinks.forEach((link) => link.classList.remove("_active"));
    activeLink.classList.add("_active");
  }
}
window.addEventListener(
  "scroll",
  () => {
    const scrollPosition = window.innerHeight + window.pageYOffset;
    const pageHeight = document.documentElement.scrollHeight;
    if (scrollPosition >= pageHeight - 500) {
      const lastSection = "section-4";
      updateActiveLink(lastSection);
    }
  },
  { passive: true }
);
