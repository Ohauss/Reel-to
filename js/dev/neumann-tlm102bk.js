const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./swiper.min.js","./utils.min.js","./index.min2.js","./pagination.min.js"])))=>i.map(i=>d[i]);
import "./stepper.min.js";
/* empty css             */
import "./article.min.js";
import { Swiper } from "./swiper.min.js";
import { P as Pagination, K as Keyboard } from "./pagination.min.js";
import { _ as __vitePreload } from "./scrollbar.min.js";
import { w as wishlistStore } from "./wishlistStore.min.js";
import { c as cartStore } from "./cartStore.min.js";
import "./common.min.js";
import "./utils.min.js";
import "./cartCounter.min.js";
import "./wishlistCounter.min.js";
class Rating {
  constructor(root) {
    this.root = root;
    this.total = Number(root.dataset.total);
    if (!this.total) return;
    this.rows = root.querySelectorAll(".rating__row");
    this.init();
  }
  init() {
    this.rows.forEach((row) => {
      const value = Number(row.dataset.value);
      const percent = Math.min(value / this.total * 100, 100);
      const fill = row.querySelector(".rating__fill");
      requestAnimationFrame(() => {
        fill.style.width = `${percent}%`;
      });
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-rating]").forEach((el) => {
    new Rating(el);
  });
});
function initProductHeroSlider() {
  const sliderEl = document.querySelector(".product-hero__slider");
  if (!sliderEl) return;
  new Swiper(sliderEl, {
    modules: [Pagination, Keyboard],
    slidesPerView: 1,
    spaceBetween: 24,
    pagination: {
      el: ".product-hero__pag",
      clickable: true
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true
    }
  });
}
class LocalPopup {
  constructor(root) {
    this.root = root;
    this.activePopup = null;
    this.onEsc = this.onEsc.bind(this);
    this.onClick = this.onClick.bind(this);
    this.init();
  }
  init() {
    this.root.addEventListener("click", this.onClick);
  }
  onClick(e) {
    const openBtn = e.target.closest("[data-local-popup-open]");
    if (openBtn) {
      e.preventDefault();
      const name = openBtn.dataset.localPopupOpen;
      this.open(name);
      return;
    }
    const closeBtn = e.target.closest("[data-local-popup-close]");
    if (closeBtn) {
      e.preventDefault();
      this.close();
    }
  }
  open(name) {
    this.close();
    const popup = this.root.querySelector(`[data-local-popup="${name}"]`);
    if (!popup) return;
    popup.classList.add("is-active");
    document.addEventListener("keydown", this.onEsc);
    this.activePopup = popup;
  }
  close() {
    if (!this.activePopup) return;
    this.activePopup.classList.remove("is-active");
    document.removeEventListener("keydown", this.onEsc);
    this.activePopup = null;
  }
  onEsc(e) {
    if (e.key === "Escape") {
      this.close();
    }
  }
}
function initProductHero() {
  initProductHeroSlider();
  const section = document.querySelector(".product-hero");
  if (!section) return;
  const infoRight = section.querySelector(".product-hero__info-right");
  if (infoRight) new LocalPopup(infoRight);
  const favBtn = section.querySelector("[data-wishlist-btn]");
  const cartBtn = section.querySelector("[data-addtocart]");
  const stepperInput = section.querySelector(".stepper__input");
  const getProductData = () => ({
    id: section.dataset.productId,
    title: section.dataset.productTitle,
    price: Number(section.dataset.productPrice),
    image: section.dataset.productImage
  });
  const productData = getProductData();
  if (favBtn) {
    favBtn.classList.toggle("is-favorite", wishlistStore.has(productData.id));
    favBtn.addEventListener("click", (e) => {
      e.preventDefault();
      wishlistStore.toggle(productData);
      favBtn.classList.toggle("is-favorite", wishlistStore.has(productData.id));
    });
  }
  if (cartBtn) {
    cartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const qty = parseInt((stepperInput == null ? void 0 : stepperInput.value) || 1);
      cartStore.add(productData, qty);
    });
  }
  const stepper = section.querySelector("[data-fls-stepper]");
  if (stepper && stepperInput) {
    const minusBtn = stepper.querySelector(".stepper__minus");
    const plusBtn = stepper.querySelector(".stepper__plus");
    minusBtn == null ? void 0 : minusBtn.addEventListener("click", () => {
      const val = parseInt(stepperInput.value) || 1;
      if (val > 1) stepperInput.value = val - 1;
    });
    plusBtn == null ? void 0 : plusBtn.addEventListener("click", () => {
      const val = parseInt(stepperInput.value) || 1;
      if (val < 99) stepperInput.value = val + 1;
    });
    stepperInput.addEventListener("change", () => {
      let val = parseInt(stepperInput.value);
      if (isNaN(val) || val < 1) stepperInput.value = 1;
      if (val > 99) stepperInput.value = 99;
    });
  }
  document.addEventListener("wishlist:update", () => {
    if (favBtn) {
      favBtn.classList.toggle("is-favorite", wishlistStore.has(productData.id));
    }
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProductHero);
} else {
  initProductHero();
}
function initProductTestimonialsSlider() {
  const sliderEl = document.querySelector(".product-testimonials__slider");
  if (!sliderEl) return;
  new Swiper(sliderEl, {
    modules: [Pagination, Keyboard],
    slidesPerView: 1,
    spaceBetween: 24,
    pagination: {
      el: ".product-hero__pagination",
      clickable: true
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true
    }
  });
}
function initProductTestimonials() {
  initProductTestimonialsSlider();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProductTestimonials);
} else {
  initProductTestimonials();
}
function initCatalog() {
  const list = document.querySelector(".product-testimonials__items");
  const items = Array.from(document.querySelectorAll(".product-testimonial"));
  if (!list || items.length === 0) return;
  let currentPage = 1;
  const itemsPerPage = 1;
  const paginationBtns = document.querySelectorAll(
    "[data-fls-pagination] .pagination__btn"
  );
  const prevBtn = document.querySelector(
    "[data-fls-pagination] .pagination__prev"
  );
  const nextBtn = document.querySelector(
    "[data-fls-pagination] .pagination__next"
  );
  const renderPage = () => {
    const listTop = list.getBoundingClientRect().top + window.scrollY;
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const pageItems = items.slice(startIdx, endIdx);
    list.innerHTML = "";
    pageItems.forEach((item) => list.appendChild(item));
    window.scrollTo({ top: listTop, behavior: "auto" });
    updatePagination();
  };
  const updatePagination = () => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    paginationBtns.forEach((btn) => {
      const pageNum = parseInt(btn.textContent);
      btn.classList.toggle("pagination__btn--active", pageNum === currentPage);
    });
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
  };
  const handlePaginationClick = (e) => {
    const btn = e.currentTarget;
    const totalPages = Math.ceil(items.length / itemsPerPage);
    if (btn.classList.contains("pagination__prev")) {
      if (currentPage > 1) currentPage--;
    } else if (btn.classList.contains("pagination__next")) {
      if (currentPage < totalPages) currentPage++;
    } else {
      const pageNum = parseInt(btn.textContent);
      if (!isNaN(pageNum)) currentPage = pageNum;
    }
    renderPage();
  };
  paginationBtns.forEach(
    (btn) => btn.addEventListener("click", handlePaginationClick)
  );
  if (prevBtn) prevBtn.addEventListener("click", handlePaginationClick);
  if (nextBtn) nextBtn.addEventListener("click", handlePaginationClick);
  renderPage();
}
document.addEventListener("DOMContentLoaded", initCatalog);
let swiper;
async function initSwiper() {
  if (swiper) {
    swiper.destroy(true, true);
    swiper = null;
  }
  const [{ default: SwiperModule }, { Navigation, Scrollbar }] = await Promise.all([__vitePreload(() => import("./swiper.min.js"), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url), __vitePreload(() => import("./index.min2.js"), true ? __vite__mapDeps([2,1,3]) : void 0, import.meta.url)]);
  swiper = new SwiperModule(".product-similar__slider", {
    modules: [Navigation, Scrollbar],
    slidesPerView: 4,
    spaceBetween: 24,
    speed: 400,
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
      1025: { slidesPerView: 3, spaceBetween: 20 },
      1281: { slidesPerView: 4, spaceBetween: 24 }
    }
  });
}
function syncWishlistBtns() {
  document.querySelectorAll(".product-similar [data-wishlist-btn]").forEach((btn) => {
    const productEl = btn.closest(".product");
    if (!productEl) return;
    const id = productEl.dataset.productId;
    btn.classList.toggle("is-favorite", wishlistStore.has(id));
  });
}
function createProductHTML(product) {
  const price = product.price ?? "0";
  const oldPrice = product.oldPrice ?? null;
  const isFav = wishlistStore.has(String(product.id)) ? "is-favorite" : "";
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
          ${product.image ? `<img src="${product.image}" alt="${product.title}" class="product__image" width="320" height="320" loading="lazy" />` : ""}

          <div class="product__badges">
            ${oldPrice ? `<div class="product__percent">Sale</div>` : ""}
            ${product.isNew && !oldPrice ? `<div class="product__badge product__badge--new">New</div>` : ""}
          </div>

          <button
            type="button"
            class="--icon-fav button__fav product__fav ${isFav}"
            aria-label="Add to favorite"
            data-wishlist-btn
          ></button>
        </div>

        <div class="product__bottom">
          <p class="product__brand">${product.brand ?? ""}</p>
          <h3 class="product__title">
            <a href="${product.link ?? "#"}" class="product__link">${product.title ?? ""}</a>
          </h3>
          <div class="product__rating-stars">★ ${product.rating ?? 0}</div>
          <div class="product__prices">
            <span class="product__price-current">${price} $</span>
            ${oldPrice ? `<span class="product__price-old">${oldPrice} $</span>` : ""}
          </div>
          <button type="button" class="button button--primary product__btn" data-addtocart>
            Add to cart
          </button>
        </div>
      </article>
    </div>
  `;
}
async function loadProducts() {
  const container = document.getElementById("slider-container");
  const section = document.querySelector(".product-similar");
  if (!container || !section) return;
  try {
    const res = await fetch(
      new URL("" + new URL("../components/sections/catalog-main/catalog-main.json", import.meta.url).href, import.meta.url)
    );
    const data = await res.json();
    let products = Array.isArray(data) ? data : data.products ?? [];
    const categoryFilter = section.dataset.category || null;
    if (categoryFilter) {
      products = products.filter((p) => p.category === categoryFilter);
    }
    container.innerHTML = products.map(createProductHTML).join("");
    await initSwiper();
    section.addEventListener("click", (e) => {
      const productEl = e.target.closest(".product");
      if (!productEl) return;
      const productData = {
        id: productEl.dataset.productId,
        title: productEl.dataset.productTitle,
        price: Number(productEl.dataset.productPrice),
        image: productEl.dataset.productImage
      };
      if (e.target.closest("[data-addtocart]")) {
        cartStore.add(productData, 1);
      }
      const favBtn = e.target.closest("[data-wishlist-btn]");
      if (favBtn) {
        wishlistStore.toggle(productData);
        favBtn.classList.toggle(
          "is-favorite",
          wishlistStore.has(productData.id)
        );
      }
    });
    document.addEventListener("wishlist:update", syncWishlistBtns);
  } catch (e) {
    console.error("Помилка завантаження схожих товарів:", e);
  }
}
function init() {
  const section = document.querySelector(".product-similar");
  if (!section) return;
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        loadProducts();
      }
    },
    { rootMargin: "200px" }
  );
  observer.observe(section);
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
