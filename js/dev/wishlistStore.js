const STORAGE_KEY = "wishlist";
const wishlistStore = {
  items: JSON.parse(localStorage.getItem(STORAGE_KEY)) || [],
  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    document.dispatchEvent(
      new CustomEvent("wishlist:update", {
        detail: { items: this.items, count: this.count() }
      })
    );
  },
  toggle(product) {
    const exists = this.items.find((i) => i.id === product.id);
    if (exists) {
      this.items = this.items.filter((i) => i.id !== product.id);
    } else {
      this.items.push(product);
    }
    this.save();
  },
  has(id) {
    return this.items.some((i) => i.id == id);
  },
  remove(id) {
    this.items = this.items.filter((i) => i.id != id);
    this.save();
  },
  count() {
    return this.items.length;
  }
};
export {
  wishlistStore as w
};
