const STORAGE_KEY = "cart";
const cartStore = {
  items: JSON.parse(localStorage.getItem(STORAGE_KEY)) || [],
  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    document.dispatchEvent(
      new CustomEvent("cart:update", {
        detail: {
          items: this.items,
          total: this.total(),
          count: this.count()
        }
      })
    );
  },
  add(product, qty = 1) {
    const item = this.items.find((i) => i.id === product.id);
    if (item) {
      item.qty += qty;
    } else {
      this.items.push({ ...product, qty });
    }
    this.save();
  },
  updateQty(id, qty) {
    const item = this.items.find((i) => i.id == id);
    if (!item) return;
    item.qty = qty;
    if (item.qty <= 0) {
      this.remove(id);
      return;
    }
    this.save();
  },
  remove(id) {
    this.items = this.items.filter((i) => i.id != id);
    this.save();
  },
  count() {
    return this.items.reduce((t, i) => t + i.qty, 0);
  },
  total() {
    return this.items.reduce((t, i) => t + i.qty * i.price, 0);
  }
};
export {
  cartStore as c
};
