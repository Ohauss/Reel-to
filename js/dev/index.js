const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./swiper.min.js","./utils.min.js","./index.min2.js","./pagination.min.js"])))=>i.map(i=>d[i]);
import "./stepper.min.js";
import "./search.min.js";
import "./loopscroll.min.js";
import "./article.min.js";
import { _ as __vitePreload } from "./scrollbar.min.js";
import { c as cartStore } from "./cartStore.min.js";
import { w as wishlistStore } from "./wishlistStore.min.js";
import "./common.min.js";
/* empty css                  */
import "./cartCounter.min.js";
import "./wishlistCounter.min.js";
let swiper;
const cache = /* @__PURE__ */ new Map();
async function initSwiper() {
  if (swiper) {
    swiper.destroy(true, true);
    swiper = null;
  }
  const [{ default: SwiperModule }, { Navigation, Scrollbar }] = await Promise.all([__vitePreload(() => import("./swiper.min.js"), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url), __vitePreload(() => import("./index.min2.js"), true ? __vite__mapDeps([2,1,3]) : void 0, import.meta.url)]);
  swiper = new SwiperModule(".products .swiper", {
    modules: [Navigation, Scrollbar],
    loop: true,
    observer: true,
    observeParents: true,
    slidesPerView: 4,
    spaceBetween: 24,
    navigation: {
      nextEl: ".products__slider-btn--next",
      prevEl: ".products__slider-btn--prev"
    },
    scrollbar: {
      el: ".swiper-scrollbar",
      draggable: true
    },
    breakpoints: {
      320: { slidesPerView: 2, spaceBetween: 10 },
      768: { slidesPerView: 3, spaceBetween: 20 },
      1281: { slidesPerView: 4, spaceBetween: 24 }
    }
  });
}
function syncWishlistBtns() {
  document.querySelectorAll("[data-wishlist-btn]").forEach((btn) => {
    const product = btn.closest(".product");
    if (!product) return;
    btn.classList.toggle(
      "is-favorite",
      wishlistStore.has(product.dataset.productId)
    );
  });
}
function renderSkeleton(container, count = 4) {
  const cards = Array.from(
    { length: count },
    () => `
    <div class="swiper-slide">
      <article class="product product--skeleton" aria-hidden="true">
        <div class="product__top"></div>
        <div class="product__bottom">
          <p class="product__brand">brand</p>
          <h3 class="product__title">product title placeholder</h3>
          <div class="product__rating-stars">★ 0</div>
          <div class="product__prices">
            <div class="product__price-current">0 $</div>
          </div>
          <button type="button" class="button button--primary product__btn" disabled>
            Add to cart
          </button>
        </div>
      </article>
    </div>
  `
  ).join("");
  container.innerHTML = cards;
}
function createProductHTML(product, index = 0) {
  const price = product.price ?? "0";
  const oldPrice = product.oldPrice ?? null;
  const isAboveFold = index < 4;
  return `
    <div class="swiper-slide">
      <article
        data-fls-article
        class="product"
        data-product-id="${product.id}"
        data-product-title="${product.title}"
        data-product-price="${product.price}"
        data-product-image="${product.image}"
      >
        <div class="product__top">
          <img
            src="${product.image}"
            alt="${product.title}"
            width="320"
            height="320"
            loading="${isAboveFold ? "eager" : "lazy"}"
            fetchpriority="${isAboveFold ? "high" : "auto"}"
            decoding="async"
            class="product__image"
          />

          ${oldPrice ? `
            <div class="product__badges">
              <div class="product__percent">Sale</div>
            </div>
          ` : ""}

          ${product.isNew && !oldPrice ? `
            <div class="product__badges">
              <div class="product__badge product__badge--new">New</div>
            </div>
          ` : ""}

          <button
            aria-label="add to favorite"
            type="button"
            class="--icon-fav button__fav product__fav"
            data-wishlist-btn
          ></button>
        </div>

        <div class="product__bottom">
          <p class="product__brand">${product.brand ?? ""}</p>
          <h3 class="product__title">
            <a href="${product.link ?? "#"}" class="product__link">${product.title}</a>
          </h3>
          <div class="product__rating-stars">★ ${product.rating ?? 0}</div>
          <div class="product__prices">
            <div class="product__price-current">${price} $</div>
            ${oldPrice ? `<div class="product__price-old">${oldPrice} $</div>` : ""}
          </div>
          <button
            type="button"
            class="button button--primary product__btn"
            data-addtocart
          >
            Add to cart
          </button>
        </div>
      </article>
    </div>
  `;
}
function filterProducts(slug, products) {
  if (cache.has(slug)) return cache.get(slug);
  let result;
  switch (slug) {
    case "bestsellers":
      result = products.filter((p) => p.isBestseller);
      break;
    case "novelties":
      result = products.filter((p) => p.isNew);
      break;
    case "sale":
      result = products.filter((p) => p.isOnSale);
      break;
    default:
      result = products.filter(
        (p) => Array.isArray(p.collections) && p.collections.includes(slug)
      );
  }
  cache.set(slug, result);
  return result;
}
function switchCategory(slug, products) {
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.slug === slug);
  });
  const sliderContainer = document.getElementById("slider-container");
  const filtered = filterProducts(slug, products);
  const fragment = document.createDocumentFragment();
  filtered.forEach((p, index) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = createProductHTML(p, index);
    fragment.appendChild(wrapper.firstElementChild);
  });
  sliderContainer.innerHTML = "";
  sliderContainer.appendChild(fragment);
  setTimeout(() => {
    initSwiper();
    syncWishlistBtns();
  }, 50);
}
async function loadProductsData() {
  const tabsContainer = document.getElementById("tabs-container");
  const sliderContainer = document.getElementById("slider-container");
  const section = document.querySelector(".products");
  if (!tabsContainer || !section || !sliderContainer) return;
  renderSkeleton(sliderContainer, 4);
  try {
    const res = await fetch(
      new URL("" + new URL("../components/sections/catalog-main/catalog-main.json", import.meta.url).href, import.meta.url)
    );
    const data = await res.json();
    const products = Array.isArray(data) ? data : data.products ?? [];
    const counts = {
      bestsellers: products.filter((p) => p.isBestseller).length,
      novelties: products.filter((p) => p.isNew).length,
      sale: products.filter((p) => p.isOnSale).length
    };
    tabsContainer.innerHTML = `
      <ul class="tabs-list">
        <li>
          <button type="button" class="tab-button active" data-slug="bestsellers">
            Best Sellers <span class="tab-count">${counts.bestsellers}</span>
          </button>
        </li>
        <li>
          <button type="button" class="tab-button" data-slug="novelties">
            New Arrivals <span class="tab-count">${counts.novelties}</span>
          </button>
        </li>
        <li>
          <button type="button" class="tab-button" data-slug="sale">
            Sale <span class="tab-count">${counts.sale}</span>
          </button>
        </li>
      </ul>
    `;
    section.addEventListener("click", (e) => {
      const tabBtn = e.target.closest(".tab-button");
      if (tabBtn) switchCategory(tabBtn.dataset.slug, products);
      const addBtn = e.target.closest("[data-addtocart]");
      if (addBtn) {
        const productEl = addBtn.closest(".product");
        if (productEl) {
          cartStore.add(
            {
              id: productEl.dataset.productId,
              title: productEl.dataset.productTitle,
              price: Number(productEl.dataset.productPrice),
              image: productEl.dataset.productImage
            },
            1
          );
        }
      }
      const favBtn = e.target.closest("[data-wishlist-btn]");
      if (favBtn) {
        const productEl = favBtn.closest(".product");
        if (productEl) {
          const favData = {
            id: productEl.dataset.productId,
            title: productEl.dataset.productTitle,
            price: Number(productEl.dataset.productPrice),
            image: productEl.dataset.productImage
          };
          wishlistStore.toggle(favData);
          favBtn.classList.toggle("is-favorite", wishlistStore.has(favData.id));
        }
      }
    });
    document.addEventListener("wishlist:update", syncWishlistBtns);
    switchCategory("bestsellers", products);
  } catch (err) {
    console.error("Помилка ініціалізації продуктів:", err);
    sliderContainer.innerHTML = "";
  }
}
function initProducts() {
  const section = document.querySelector(".products");
  if (!section) return;
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        loadProductsData();
      }
    },
    { rootMargin: "200px" }
  );
  observer.observe(section);
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProducts);
} else {
  initProducts();
}
document.addEventListener("DOMContentLoaded", function() {
  const formConfig = {
    subscribe: {
      successTitle: "Subscribed!",
      successMessage: "Thank you for subscribing to our newsletter.",
      successColor: "#2563eb"
    },
    contact: {
      successTitle: "Message sent!",
      successMessage: "We'll get back to you as soon as possible.",
      successColor: "#2563eb"
    },
    comment: {
      successTitle: "Comment posted!",
      successMessage: "Your comment has been successfully published.",
      successColor: "#2563eb"
    }
  };
  const forms = document.querySelectorAll(".subscribe__form");
  forms.forEach((form) => {
    const formType = form.dataset.formType || "subscribe";
    const config = formConfig[formType] || formConfig.subscribe;
    initForm(form, config);
  });
  function initForm(form, config) {
    const submitButton = form.querySelector('button[type="submit"]');
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      clearErrors(form);
      if (!validateForm(form)) {
        return;
      }
      submitForm(form, submitButton, config);
    });
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.addEventListener("blur", function() {
        if (emailInput.value.trim()) {
          clearFieldError(emailInput);
          if (!isValidEmail(emailInput.value)) {
            showError(emailInput, "Please enter a valid email address");
          }
        }
      });
    }
  }
  function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll("[required]");
    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        showError(field, "This field is required");
      } else if (field.type === "email" && !isValidEmail(field.value)) {
        isValid = false;
        showError(field, "Please enter a valid email address");
      }
    });
    return isValid;
  }
  function submitForm(form, button, config) {
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Sending...";
    setTimeout(() => {
      showSuccess(form, config);
      setTimeout(() => {
        form.reset();
        button.disabled = false;
        button.textContent = originalText;
        form.style.display = "";
        const successMsg = form.parentElement.querySelector(".success-message");
        if (successMsg) successMsg.remove();
      }, 5e3);
    }, 1e3);
  }
  function showSuccess(form, config) {
    form.style.display = "none";
    const successHTML = `
      <div class="success-message" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 30px 20px;
      ">
        <h3 style="
          font-weight: 700;
          font-size: 28px;
          line-height: 1.5;
          color: ${config.successColor};
          margin-bottom: 15px;
        ">${config.successTitle}</h3>
        <p style="
          font-size: 18px;
          line-height: 1.5;
          color: #1e212c;
        ">${config.successMessage}</p>
      </div>
    `;
    form.insertAdjacentHTML("afterend", successHTML);
  }
  function showError(field, message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      color: #ff4242;
      font-size: 12px;
      margin-top: 5px;
      animation: fadeIn 0.3s ease;
    `;
    field.classList.add("invalid");
    field.parentElement.appendChild(errorDiv);
  }
  function clearErrors(form) {
    form.querySelectorAll(".error-message").forEach((el) => el.remove());
    form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  }
  function clearFieldError(field) {
    const error = field.parentElement.querySelector(".error-message");
    if (error) error.remove();
    field.classList.remove("invalid");
  }
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  if (!document.getElementById("form-validation-styles")) {
    const style = document.createElement("style");
    style.id = "form-validation-styles";
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      input.invalid,
      .subscribe__input.invalid,
      .small-input.invalid {
        border: 2px solid #ff4242 !important;
        background-color: rgba(255, 66, 66, 0.05) !important;
      }
      input.invalid:focus,
      .subscribe__input.invalid:focus {
        border-color: #ff4242 !important;
        outline: none;
        box-shadow: 0 0 0 3px rgba(255, 66, 66, 0.1) !important;
      }
    `;
    document.head.appendChild(style);
  }
});
