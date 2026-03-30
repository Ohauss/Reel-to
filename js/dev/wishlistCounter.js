import { w as wishlistStore } from "./wishlistStore.min.js";
function updateWishlistCounter() {
  const counters = document.querySelectorAll("[data-wishlist-count]");
  counters.forEach((counter) => {
    counter.textContent = wishlistStore.count();
  });
}
document.addEventListener("wishlist:update", updateWishlistCounter);
document.addEventListener("DOMContentLoaded", updateWishlistCounter);
