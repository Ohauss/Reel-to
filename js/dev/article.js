import { c as cartStore } from "./cartStore.min.js";
import { w as wishlistStore } from "./wishlistStore.min.js";
function initCatalog() {
  const waitForElements = () => {
    const list = document.querySelector(".catalog__list");
    const items = document.querySelectorAll(".catalog__products-item");
    if (!list || items.length === 0) {
      setTimeout(waitForElements, 200);
      return;
    }
    initializeCatalog(list, items);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForElements);
  } else {
    waitForElements();
  }
}
function initializeCatalog(list, queriedItems) {
  const items = Array.from(queriedItems);
  const minInput = document.querySelector(".catalog-filter__price-input--min");
  const maxInput = document.querySelector(".catalog-filter__price-input--max");
  const sortButtons = document.querySelectorAll(".custom-select__choose");
  const resetBtn = document.querySelector(".catalog__reset");
  const paginationWrapper = document.querySelector("[data-fls-pagination]");
  const counterDiv = document.querySelector(".catalog__shows");
  const filteredContainer = document.querySelector(".catalog__filtered");
  const filteredContainerMobile = document.querySelector(
    ".catalog__filtered--mobile"
  );
  const mobileCount = document.querySelector(".catalog__mobile-count");
  if (!list || items.length === 0) return;
  const MAX_PRICE = parseFloat(maxInput == null ? void 0 : maxInput.getAttribute("max")) || 1e3;
  let currentSortType = "popularity";
  let currentPage = 1;
  const itemsPerPage = 6;
  let filteredItems = [...items];
  const normalize = (s) => (s || "").toLowerCase().trim();
  const CHECKBOX_SELECTOR = [
    'input[name="category[]"]',
    'input[name="brands[]"]',
    'input[name="directionality[]"]',
    'input[name="connectors[]"]',
    'input[name="form-factor[]"]',
    'input[name="features[]"]',
    'input[name="material[]"]',
    'input[name="genre[]"]',
    'input[name="format[]"]'
  ].join(", ");
  const getParams = () => {
    const p = new URLSearchParams(window.location.search);
    return {
      category: normalize(p.get("category")),
      subcategory: normalize(p.get("subcategory")),
      collections: normalize(p.get("collections") || p.get("collection")),
      brand: normalize(p.get("brand")),
      features: normalize(p.get("features")),
      material: normalize(p.get("material")),
      driveType: normalize(p.get("driveType")),
      speed: normalize(p.get("speed")),
      powerType: normalize(p.get("powerType")),
      q: normalize(p.get("q"))
      // 👈 пошуковий запит
    };
  };
  let urlParams = getParams();
  if (urlParams.category) {
    const checkbox = document.querySelector(
      `input[name="category[]"][value="${urlParams.category}"]`
    );
    if (checkbox) checkbox.checked = true;
  }
  const syncWishlist = () => {
    document.querySelectorAll("[data-wishlist-btn]").forEach((btn) => {
      const product = btn.closest(".product");
      if (!product) return;
      btn.classList.toggle(
        "is-favorite",
        wishlistStore.has(product.dataset.productId)
      );
    });
  };
  document.addEventListener("wishlist:update", syncWishlist);
  const createBadge = (text, onClose) => {
    const el = document.createElement("div");
    el.className = "catalog-filter-badge";
    el.innerHTML = `${text}<button class="catalog-filter-badge__close --icon-close"></button>`;
    el.querySelector("button").addEventListener("click", onClose);
    return el;
  };
  const updateBadges = () => {
    const badges = [];
    if (urlParams.q) {
      badges.push({
        text: ` "${urlParams.q}"`,
        onClose: () => {
          window.location.href = "/catalog-main.html";
        }
      });
    }
    document.querySelectorAll(CHECKBOX_SELECTOR).forEach((cb) => {
      var _a, _b;
      if (!cb.checked) return;
      const text = ((_b = (_a = cb.closest("label")) == null ? void 0 : _a.querySelector(".checkbox__text")) == null ? void 0 : _b.innerText.trim()) || cb.value;
      badges.push({
        text,
        onClose: () => {
          cb.checked = false;
          applyFilters();
        }
      });
    });
    const min = parseFloat(minInput == null ? void 0 : minInput.value) || 0;
    const max = parseFloat(maxInput == null ? void 0 : maxInput.value) || MAX_PRICE;
    if (min > 0 || max < MAX_PRICE) {
      badges.push({
        text: `${min}$ - ${max}$`,
        onClose: () => {
          if (minInput) minInput.value = "0";
          if (maxInput) maxInput.value = String(MAX_PRICE);
          const pricerange = document.getElementById("pricerange");
          if (pricerange == null ? void 0 : pricerange.noUiSlider) pricerange.noUiSlider.set([0, MAX_PRICE]);
          document.querySelectorAll(".prices__input").forEach((r) => r.checked = false);
          applyFilters();
        }
      });
    }
    const urlBadgeEntries = [
      { value: urlParams.subcategory },
      { value: urlParams.collections },
      { value: urlParams.brand },
      { value: urlParams.features },
      { value: urlParams.material },
      { value: urlParams.driveType },
      { value: urlParams.speed },
      { value: urlParams.powerType }
    ];
    urlBadgeEntries.filter(({ value }) => value).forEach(({ value }) => {
      badges.push({
        text: value,
        onClose: () => {
          window.location.href = "/catalog-main.html";
        }
      });
    });
    [filteredContainer, filteredContainerMobile].forEach((container) => {
      if (!container) return;
      container.innerHTML = "";
      badges.forEach(
        ({ text, onClose }) => container.appendChild(createBadge(text, onClose))
      );
    });
    if (mobileCount) {
      mobileCount.textContent = badges.length;
      mobileCount.style.display = badges.length ? "" : "none";
    }
  };
  const renderPagination = () => {
    if (!paginationWrapper) return;
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    paginationWrapper.innerHTML = "";
    const prevLi = document.createElement("li");
    prevLi.className = "pagination__item";
    const prevBtn = document.createElement("button");
    prevBtn.className = "pagination__btn pagination__prev";
    prevBtn.textContent = "Prev";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage();
      }
    });
    prevLi.appendChild(prevBtn);
    paginationWrapper.appendChild(prevLi);
    const getPageNumbers = () => {
      const pages = [];
      const delta = 2;
      const left = currentPage - delta;
      const right = currentPage + delta;
      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || i >= left && i <= right)
          pages.push(i);
      }
      const withEllipsis = [];
      let prev = null;
      for (const page of pages) {
        if (prev !== null && page - prev > 1) withEllipsis.push("...");
        withEllipsis.push(page);
        prev = page;
      }
      return withEllipsis;
    };
    getPageNumbers().forEach((page) => {
      const li = document.createElement("li");
      li.className = "pagination__item";
      if (page === "...") {
        const ellipsis = document.createElement("span");
        ellipsis.className = "pagination__ellipsis";
        ellipsis.textContent = "...";
        li.appendChild(ellipsis);
      } else {
        const btn = document.createElement("button");
        btn.className = "pagination__btn";
        if (page === currentPage) btn.classList.add("pagination__btn--active");
        btn.textContent = page;
        btn.addEventListener("click", () => {
          currentPage = page;
          renderPage();
        });
        li.appendChild(btn);
      }
      paginationWrapper.appendChild(li);
    });
    const nextLi = document.createElement("li");
    nextLi.className = "pagination__item";
    const nextBtn = document.createElement("button");
    nextBtn.className = "pagination__btn pagination__next";
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderPage();
      }
    });
    nextLi.appendChild(nextBtn);
    paginationWrapper.appendChild(nextLi);
  };
  const renderPage = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    list.innerHTML = "";
    filteredItems.slice(start, end).forEach((el) => list.appendChild(el));
    syncWishlist();
    renderPagination();
  };
  const updateCounter = () => {
    if (counterDiv)
      counterDiv.textContent = `Showing ${filteredItems.length} products`;
  };
  const applyFilters = () => {
    const selectedCategory = Array.from(
      document.querySelectorAll('input[name="category[]"]:checked')
    ).map((cb) => cb.value.toLowerCase());
    const selectedBrands = Array.from(
      document.querySelectorAll('input[name="brands[]"]:checked')
    ).map((cb) => cb.value.toLowerCase());
    const selectedDirectionality = Array.from(
      document.querySelectorAll('input[name="directionality[]"]:checked')
    ).map((cb) => cb.value.toLowerCase());
    const selectedConnectors = Array.from(
      document.querySelectorAll('input[name="connectors[]"]:checked')
    ).map((cb) => cb.value.toLowerCase());
    const selectedFormFactor = Array.from(
      document.querySelectorAll('input[name="form-factor[]"]:checked')
    ).map((cb) => cb.value.toLowerCase());
    const selectedFeatures = Array.from(
      document.querySelectorAll('input[name="features[]"]:checked')
    ).map((cb) => cb.value.toLowerCase());
    const selectedMaterial = Array.from(
      document.querySelectorAll('input[name="material[]"]:checked')
    ).map((cb) => cb.value.toLowerCase());
    const selectedGenre = Array.from(
      document.querySelectorAll('input[name="genre[]"]:checked')
    ).map((cb) => cb.value.toLowerCase());
    const selectedFormat = Array.from(
      document.querySelectorAll('input[name="format[]"]:checked')
    ).map((cb) => cb.value.toLowerCase());
    const min = parseFloat(minInput == null ? void 0 : minInput.value) || 0;
    const max = parseFloat(maxInput == null ? void 0 : maxInput.value) || MAX_PRICE;
    filteredItems = items.filter((item) => {
      const price = parseFloat(item.dataset.price || 0);
      const itemCategory = normalize(item.dataset.category);
      const itemSubcategory = normalize(item.dataset.subcategory);
      const itemBrand = normalize(item.dataset.brand);
      const itemDirectionality = normalize(item.dataset.directionality);
      const itemConnector = normalize(item.dataset.connector);
      const itemFormFactor = normalize(item.dataset.formFactor);
      const itemMaterial = normalize(item.dataset.material);
      const itemDriveType = normalize(item.dataset.driveType);
      const itemSpeed = normalize(item.dataset.speed);
      const itemPowerType = normalize(item.dataset.powerType);
      const itemGenre = normalize(item.dataset.genre);
      const itemFormat = normalize(item.dataset.format);
      const itemFeatures = (item.dataset.features || "").split(",").map((f) => normalize(f)).filter(Boolean);
      const itemCollections = (item.dataset.collections || "").split(",").map((c) => normalize(c)).filter(Boolean);
      const matchesCategory = selectedCategory.length === 0 || selectedCategory.includes(itemCategory);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(itemBrand);
      const matchesDirectionality = selectedDirectionality.length === 0 || selectedDirectionality.includes(itemDirectionality);
      const matchesConnector = selectedConnectors.length === 0 || selectedConnectors.includes(itemConnector);
      const matchesFormFactor = selectedFormFactor.length === 0 || selectedFormFactor.includes(itemFormFactor);
      const matchesFeatures = selectedFeatures.length === 0 || selectedFeatures.some((f) => itemFeatures.includes(f));
      const matchesMaterial = selectedMaterial.length === 0 || selectedMaterial.includes(itemMaterial);
      const matchesGenre = selectedGenre.length === 0 || selectedGenre.includes(itemGenre);
      const matchesFormat = selectedFormat.length === 0 || selectedFormat.includes(itemFormat);
      const matchesSubcategory = !urlParams.subcategory || itemSubcategory === urlParams.subcategory;
      const matchesCollection = !urlParams.collections || itemCollections.some((c) => c.includes(urlParams.collections));
      const matchesUrlBrand = !urlParams.brand || itemBrand === urlParams.brand;
      const matchesUrlFeatures = !urlParams.features || itemFeatures.includes(urlParams.features);
      const matchesUrlMaterial = !urlParams.material || itemMaterial === urlParams.material;
      const matchesDriveType = !urlParams.driveType || itemDriveType === urlParams.driveType;
      const matchesSpeed = !urlParams.speed || itemSpeed === urlParams.speed;
      const matchesPowerType = !urlParams.powerType || itemPowerType === urlParams.powerType;
      const matchesPrice = price >= min && price <= max;
      const matchesQuery = !urlParams.q || (() => {
        const q = urlParams.q;
        const searchable = [
          item.dataset.productTitle,
          item.dataset.brand,
          item.dataset.category,
          item.dataset.subcategory,
          item.dataset.features,
          item.dataset.genre,
          item.dataset.collections
        ].filter(Boolean).join(" ").toLowerCase();
        return searchable.includes(q);
      })();
      return matchesCategory && matchesBrand && matchesDirectionality && matchesConnector && matchesFormFactor && matchesFeatures && matchesMaterial && matchesGenre && matchesFormat && matchesSubcategory && matchesCollection && matchesUrlBrand && matchesUrlFeatures && matchesUrlMaterial && matchesDriveType && matchesSpeed && matchesPowerType && matchesPrice && matchesQuery;
    });
    filteredItems.sort((a, b) => {
      const priceA = parseFloat(a.dataset.price || 0);
      const priceB = parseFloat(b.dataset.price || 0);
      const ratingA = parseFloat(a.dataset.rating || 0);
      const ratingB = parseFloat(b.dataset.rating || 0);
      const popA = parseFloat(a.dataset.popularity || 0);
      const popB = parseFloat(b.dataset.popularity || 0);
      switch (currentSortType) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "rating":
          return ratingB - ratingA;
        case "popularity":
          return popB - popA;
        default:
          return 0;
      }
    });
    currentPage = 1;
    renderPage();
    updateCounter();
    updateBadges();
  };
  document.querySelectorAll(CHECKBOX_SELECTOR).forEach((cb) => {
    cb.addEventListener("change", applyFilters);
  });
  document.addEventListener("priceChange", applyFilters);
  minInput == null ? void 0 : minInput.addEventListener("input", applyFilters);
  maxInput == null ? void 0 : maxInput.addEventListener("input", applyFilters);
  sortButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      currentSortType = e.currentTarget.dataset.sort;
      applyFilters();
    });
  });
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      document.querySelectorAll(CHECKBOX_SELECTOR).forEach((cb) => cb.checked = false);
      if (minInput) minInput.value = "0";
      if (maxInput) maxInput.value = String(MAX_PRICE);
      const pricerange = document.getElementById("pricerange");
      if (pricerange == null ? void 0 : pricerange.noUiSlider) pricerange.noUiSlider.set([0, MAX_PRICE]);
      document.querySelectorAll(".prices__input").forEach((r) => r.checked = false);
      currentSortType = "popularity";
      window.location.href = "/catalog-main.html";
    });
  }
  document.addEventListener("click", (e) => {
    const fav = e.target.closest("[data-wishlist-btn]");
    if (fav) {
      const product = fav.closest(".product");
      if (!product) return;
      const data = {
        id: product.dataset.productId,
        title: product.dataset.productTitle,
        price: Number(product.dataset.productPrice),
        image: product.dataset.productImage
      };
      wishlistStore.toggle(data);
      fav.classList.toggle("is-favorite", wishlistStore.has(data.id));
    }
    const cart = e.target.closest("[data-addtocart]");
    if (cart) {
      const product = cart.closest(".product");
      if (!product) return;
      cartStore.add(
        {
          id: product.dataset.productId,
          title: product.dataset.productTitle,
          price: Number(product.dataset.productPrice),
          image: product.dataset.productImage
        },
        1
      );
    }
  });
  applyFilters();
}
document.addEventListener("DOMContentLoaded", initCatalog);
