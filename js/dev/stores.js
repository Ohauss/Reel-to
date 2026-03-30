import "./stepper.min.js";
import "./search.min.js";
/* empty css             */
/* empty css              */
import "./common.min.js";
import "./cartStore.min.js";
/* empty css                  */
import "./cartCounter.min.js";
import "./wishlistCounter.min.js";
import "./wishlistStore.min.js";
function setScriptSrc(script, src) {
  script.src = src;
}
const bootstrap = (bootstrapParams) => {
  var bootstrapPromise;
  var script;
  var bootstrapParamsKey;
  var PRODUCT_NAME = "The Google Maps JavaScript API";
  var GOOGLE = "google";
  var IMPORT_API_NAME = "importLibrary";
  var PENDING_BOOTSTRAP_KEY = "__ib__";
  var doc = document;
  var global_ = window;
  var google_ = global_[GOOGLE] || (global_[GOOGLE] = {});
  var namespace = google_.maps || (google_.maps = {});
  var libraries = /* @__PURE__ */ new Set();
  var searchParams = new URLSearchParams();
  var triggerBootstrap = () => bootstrapPromise || (bootstrapPromise = new Promise(async (resolve, reject) => {
    var _a;
    await (script = doc.createElement("script"));
    searchParams.set("libraries", [...libraries] + "");
    for (bootstrapParamsKey in bootstrapParams) {
      searchParams.set(bootstrapParamsKey.replace(/[A-Z]/g, (g) => "_" + g[0].toLowerCase()), bootstrapParams[bootstrapParamsKey]);
    }
    searchParams.set("callback", GOOGLE + ".maps." + PENDING_BOOTSTRAP_KEY);
    setScriptSrc(script, "https://maps.googleapis.com/maps/api/js?" + searchParams);
    namespace[PENDING_BOOTSTRAP_KEY] = resolve;
    script.onerror = () => bootstrapPromise = reject(Error(PRODUCT_NAME + " could not load."));
    script.nonce = ((_a = doc.querySelector("script[nonce]")) == null ? void 0 : _a.nonce) || "";
    doc.head.append(script);
  }));
  namespace[IMPORT_API_NAME] ? console.warn(PRODUCT_NAME + " only loads once. Ignoring:", bootstrapParams) : namespace[IMPORT_API_NAME] = (libraryName, ...args) => libraries.add(libraryName) && triggerBootstrap().then(() => namespace[IMPORT_API_NAME](libraryName, ...args));
};
const MSG_REPEATED_SET_OPTIONS = (options) => `The setOptions() function should only be called once. The options passed to the additional call (${JSON.stringify(options)}) will be ignored.`;
const MSG_IMPORT_LIBRARY_EXISTS = (options) => `The google.maps.importLibrary() function is already defined, and @googlemaps/js-api-loader will use the existing function instead of overwriting it. The options passed to setOptions (${JSON.stringify(options)}) will be ignored.`;
const logDevWarning = () => {
};
const logDevNotice = () => {
};
let setOptionsWasCalled_ = false;
function setOptions(options) {
  if (setOptionsWasCalled_) {
    logDevWarning(MSG_REPEATED_SET_OPTIONS(options));
    return;
  }
  installImportLibrary_(options);
  setOptionsWasCalled_ = true;
}
async function importLibrary(libraryName) {
  var _a, _b;
  if (!((_b = (_a = window == null ? void 0 : window.google) == null ? void 0 : _a.maps) == null ? void 0 : _b.importLibrary)) {
    throw new Error("google.maps.importLibrary is not installed.");
  }
  return await google.maps.importLibrary(libraryName);
}
function installImportLibrary_(options) {
  var _a, _b;
  const importLibraryExists = Boolean((_b = (_a = window.google) == null ? void 0 : _a.maps) == null ? void 0 : _b.importLibrary);
  if (importLibraryExists) {
    logDevNotice(MSG_IMPORT_LIBRARY_EXISTS(options));
  }
  if (!importLibraryExists) {
    bootstrap(options);
  }
}
async function mapInit() {
  const SELECTORS = {
    section: "[data-fls-map]",
    marker: "[data-fls-map-marker]",
    map: "[data-fls-map-body]"
  };
  const $sections = document.querySelectorAll(SELECTORS.section);
  if (!$sections.length) return;
  setOptions({
    apiKey: "",
    version: "weekly"
  });
  try {
    const { Map } = await importLibrary("maps");
    const { AdvancedMarkerElement } = await importLibrary("marker");
    const { LatLngBounds } = await importLibrary("core");
    $sections.forEach(($section) => {
      const $maps = $section.querySelectorAll(SELECTORS.map);
      $maps.forEach(($map) => {
        const mapLat = parseFloat($map.dataset.flsMapLat) || 0;
        const mapLng = parseFloat($map.dataset.flsMapLng) || 0;
        const mapOptions = {
          center: { lat: mapLat, lng: mapLng },
          zoom: parseFloat($map.dataset.flsMapZoom) || 12,
          // styles: MAP_STYLES,
          mapId: "DEMO_MAP_ID",
          disableDefaultUI: true
        };
        const map = new Map($map, mapOptions);
        const bounds = new LatLngBounds();
        const $markers = $section.querySelectorAll(SELECTORS.marker);
        $markers.forEach(($marker) => {
          const lat = parseFloat($marker.dataset.flsMapLat);
          const lng = parseFloat($marker.dataset.flsMapLng);
          const title = $marker.dataset.flsMapTitle || "";
          if (!isNaN(lat) && !isNaN(lng)) {
            const position = { lat, lng };
            new AdvancedMarkerElement({
              map,
              position,
              title
            });
            bounds.extend(position);
          }
        });
        if ($markers.length > 1) {
          map.fitBounds(bounds);
        }
        window.flsMap = map;
      });
    });
  } catch (e) {
    console.error("Помилка завантаження Google Maps:", e);
  }
}
if (document.querySelector("[data-fls-map]")) {
  window.addEventListener("load", mapInit);
}
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".shops-search");
  const items = document.querySelectorAll(".shops-content__item");
  const openCheckbox = document.querySelector("[data-store-open]");
  const nearbyCheckbox = document.querySelector("[data-store-nearby]");
  const tabs = document.querySelectorAll("[data-store-tab]");
  const panels = document.querySelectorAll("[data-store-panel]");
  const controls = document.querySelector(".shops-content__form");
  const checkboxBlock = document.querySelector(".checkbox-block");
  function switchTab(target) {
    tabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.storeTab === target);
    });
    if (window.innerWidth <= 768) {
      panels.forEach((panel) => {
        panel.classList.toggle(
          "is-active",
          panel.dataset.storePanel === target
        );
      });
    }
    if (controls) controls.style.display = target === "map" ? "none" : "";
    if (checkboxBlock)
      checkboxBlock.style.display = target === "map" ? "none" : "";
    if (target === "map" && window.flsMap && window.google) {
      setTimeout(() => {
        window.google.maps.event.trigger(window.flsMap, "resize");
        window.flsMap.panTo(window.flsMap.getCenter());
      }, 200);
    }
  }
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.storeTab));
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 768) {
      const hasActive = [...panels].some(
        (p) => p.classList.contains("is-active")
      );
      if (!hasActive) switchTab("list");
    } else {
      panels.forEach((panel) => panel.classList.remove("is-active"));
      if (controls) controls.style.display = "";
      if (checkboxBlock) checkboxBlock.style.display = "";
    }
  });
  switchTab("list");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      items.forEach((item) => {
        const text = item.innerText.toLowerCase();
        item.style.display = text.includes(query) ? "" : "none";
      });
    });
  }
  if (openCheckbox) {
    openCheckbox.addEventListener("change", () => {
      items.forEach((item) => {
        const schedule = item.querySelector(".shops-content__schedule").innerText.trim();
        const open = isOpenNow(schedule);
        item.style.display = openCheckbox.checked && !open ? "none" : "";
      });
    });
  }
  if (nearbyCheckbox) {
    nearbyCheckbox.addEventListener("change", () => {
      if (nearbyCheckbox.checked) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;
          items.forEach((item) => {
            const btn = item.querySelector("[data-fls-button]");
            const lat = parseFloat(btn.dataset.flsMapLat);
            const lng = parseFloat(btn.dataset.flsMapLng);
            const dist = getDistance(userLat, userLng, lat, lng);
            item.style.display = dist < 5 ? "" : "none";
          });
        });
      } else {
        items.forEach((item) => item.style.display = "");
      }
    });
  }
  document.querySelectorAll("[data-fls-button]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const lat = parseFloat(btn.dataset.flsMapLat);
      const lng = parseFloat(btn.dataset.flsMapLng);
      if (window.flsMap && !Number.isNaN(lat) && !Number.isNaN(lng)) {
        switchTab("map");
        setTimeout(() => {
          window.flsMap.panTo({ lat, lng });
          window.flsMap.setZoom(15);
        }, 250);
      }
    });
  });
});
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function getLondonDate() {
  const now = /* @__PURE__ */ new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit"
  }).formatToParts(now);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return {
    hour: parseInt(map.hour, 10),
    minute: parseInt(map.minute, 10)
  };
}
function parseSchedule(text) {
  const m = text.match(
    /^([\w,-\s]+):\s*(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})$/
  );
  if (!m) return null;
  return {
    openH: parseInt(m[2], 10),
    openM: parseInt(m[3], 10),
    closeH: parseInt(m[4], 10),
    closeM: parseInt(m[5], 10)
  };
}
function isOpenNow(scheduleText) {
  const s = parseSchedule(scheduleText);
  if (!s) return false;
  const now = getLondonDate();
  const nowMin = now.hour * 60 + now.minute;
  const openMin = s.openH * 60 + s.openM;
  const closeMin = s.closeH * 60 + s.closeM;
  return nowMin >= openMin && nowMin <= closeMin;
}
