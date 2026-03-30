import "./stepper.min.js";
import "./search.min.js";
import { s as slideUp, a as slideDown } from "./common.min.js";
import "./cartStore.min.js";
/* empty css                  */
import "./cartCounter.min.js";
import "./wishlistCounter.min.js";
import "./wishlistStore.min.js";
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".faq__item");
  const speed = 300;
  items.forEach((item) => {
    const button = item.querySelector(".faq__caption");
    const body = item.querySelector(".faq__body");
    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      items.forEach((other) => {
        if (other === item) return;
        const btn = other.querySelector(".faq__caption");
        const panel = other.querySelector(".faq__body");
        if (btn.getAttribute("aria-expanded") === "true") {
          btn.setAttribute("aria-expanded", "false");
          slideUp(panel, speed);
          setTimeout(() => {
            panel.hidden = true;
          }, speed);
        }
      });
      button.setAttribute("aria-expanded", String(!isOpen));
      if (isOpen) {
        slideUp(body, speed);
        setTimeout(() => {
          body.hidden = true;
        }, speed);
      } else {
        body.hidden = false;
        slideDown(body, speed);
      }
    });
  });
});
