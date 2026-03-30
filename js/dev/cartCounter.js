import { c as cartStore } from "./cartStore.min.js";
function updateCartCounter() {
  const counters = document.querySelectorAll("[data-cart-count]");
  counters.forEach((counter) => {
    counter.textContent = cartStore.count();
  });
}
document.addEventListener("cart:update", updateCartCounter);
document.addEventListener("DOMContentLoaded", updateCartCounter);
