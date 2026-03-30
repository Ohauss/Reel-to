import "./stepper.min.js";
import "./search.min.js";
/* empty css              */
/* empty css          */
import { c as cartStore } from "./cartStore.min.js";
import "./common.min.js";
/* empty css                  */
import "./cartCounter.min.js";
import "./wishlistCounter.min.js";
import "./wishlistStore.min.js";
function renderCartPage() {
  const table = document.querySelector(".cart-content__table");
  document.querySelector(".cart-content__summary span");
  if (!table) return;
  if (!cartStore.items.length) {
    table.innerHTML = `
  <div class="cart-content__empty">
    Cart is empty
  </div>`;
    return;
  }
  const rows = cartStore.items.map(
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

      <div class="cart-content__cell cart-content__cell--2">
        <h3 class="cart-content__subtitle">${item.title}</h3>
        <div class="cart-content__quantity--mobile"></div>
      </div>

      <div class="cart-content__cell cart-content__cell--3">
        <div class="cart-content__th cart-content__th--mobile">Price</div>
        <div class="cart-content__price">${item.price}$</div>
      </div>

      <div class="cart-content__cell cart-content__cell--4">
        <div  class="cart-content__quantity">
          <div
            data-fls-stepper
            class="stepper cart-content__stepper"
            role="group"
            aria-label="Quantity selector"
          >
            <button
            class="stepper__minus"
            type="button"
            aria-label="Decrease quantity">
             <img
              class="icon"
              src="./assets/img/minus.svg"
              alt="icon minus"
             />
            </button>

            <input
              type="number"
              name="stepper"
              class="input-reset stepper__input"
              value="${item.qty}"
              min="1"
              max="99"
              inputmode="numeric"
              aria-label="Quantity"
            />

              <button
                type="button"
                class="stepper__plus"
                aria-label="Increase quantity"
              >
               <img
                 class="icon"
                 src="./assets/img/plus.svg"
                 alt="icon plus"
                />
              </button>
                 <span class="visually-hidden" aria-live="polite"></span>
          </div>
        </div>
      </div>

      <div class="cart-content__cell cart-content__cell--5">
        <div class="cart-content__th cart-content__th--mobile">Total</div>

        <div class="cart-content__total">
        ${(item.qty * item.price).toFixed(2)}$
        </div>

        <button
          class="cart-content__remove-button"
          data-remove="${item.id}"
        >
          Remove
        </button>
      </div>

    </div>
  </div>
</div>
`
  ).join("");
  table.innerHTML = rows + `
<div class="cart-content__bottom">
  <a href="order.html" class="button button--primary cart-content__button">
    Proceed to checkout
  </a>

  <div class="cart-content__summary">
    total:<span>${cartStore.total().toFixed(2)}$</span>
  </div>
</div>
`;
  document.dispatchEvent(new CustomEvent("stepper:init"));
}
document.addEventListener("cart:update", renderCartPage);
document.addEventListener("click", (e) => {
  const remove = e.target.closest("[data-remove]");
  if (!remove) return;
  cartStore.remove(remove.dataset.remove);
});
renderCartPage();
