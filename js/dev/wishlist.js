import "./stepper.min.js";
import "./search.min.js";
/* empty css              */
/* empty css          */
import { w as wishlistStore } from "./wishlistStore.min.js";
import { c as cartStore } from "./cartStore.min.js";
import "./common.min.js";
/* empty css                  */
import "./cartCounter.min.js";
import "./wishlistCounter.min.js";
function renderWishlist() {
  const table = document.querySelector(".cart-content__table");
  if (!table) return;
  if (!wishlistStore.items.length) {
    table.innerHTML = `<div class="cart-content__empty">Wishlist is empty</div>`;
    return;
  }
  table.innerHTML = wishlistStore.items.map(
    (item) => `
<div class="cart-content__row" data-id="${item.id}">
  <div class="cart-content__container">
    <div class="cart-content__inner grid">

      <div class="cart-content__cell cart-content__cell--1">
        <picture>
          <img
            class="cart-content__image"
            src="${item.image}"
            alt="${item.title}"
            width="200"
            height="200"
            loading="lazy"
          />
        </picture>
      </div>

      <div class="cart-content__cell cart-content__cell--2 cart-content-wishlist__cell--2 ">
        <h3 class="cart-content__subtitle">${item.title}</h3>
         <button
          type="button"
          class="button button--primary button-add-cart button-add-cart__wishlist--mobile"
          data-wishlist-to-cart='${JSON.stringify(item)}'
          aria-label="Add ${item.title} to cart"
        >
          Add to cart
        </button>
      </div>

      <div class="cart-content__cell cart-content__cell--3 cart-content-wishlist__cell--3">
        <div class="cart-content__th cart-content__th--mobile">Price</div>
        <div class="cart-content__price">${item.price} $</div>
      </div>

      <div class="cart-content__cell cart-content__cell--4 cart-content-wishlist__cell--4">
        <button
          type="button"
          class="button button--primary button-add-cart"
          data-wishlist-to-cart='${JSON.stringify(item)}'
          aria-label="Add ${item.title} to cart"
        >
          Add to cart
        </button>
      </div>

      <div class="cart-content__cell cart-content__cell--5 cart-content-wishlist__cell--5">
        <button
          class="cart-content__remove-button"
          data-remove-wishlist="${item.id}"
          aria-label="Remove ${item.title} from wishlist"
        >
          Remove
        </button>
      </div>

    </div>
  </div>
</div>
  `
  ).join("");
}
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-wishlist-to-cart]");
  if (!btn) return;
  const product = JSON.parse(btn.dataset.wishlistToCart);
  cartStore.add(product);
});
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-remove-wishlist]");
  if (!btn) return;
  wishlistStore.remove(btn.dataset.removeWishlist);
});
document.addEventListener("wishlist:update", renderWishlist);
renderWishlist();
