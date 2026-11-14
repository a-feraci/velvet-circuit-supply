"use strict";

const catalog = [
  { id: "nocturne", name: "Nocturne Keycap Set", category: "Keycaps", price: 6400, image: "keycaps", alt: "Violet, lavender and peach keycaps laid out in rows", fit: ["mx", "ansi"], compatibility: "Standard MX stems · ANSI 60%, 65%, 75%, TKL and full-size", material: "Dye-sub PBT · Cherry profile · 140 keys", description: "Deep plum alphas, lavender modifiers and peach accents. The kit includes a 1.75u right Shift and common compact-layout modifiers.", variants: [{ label: "140-key ANSI kit", stock: 5 }] },
  { id: "orbit", name: "Orbit Veil Desk Mat", category: "Desk mats", price: 3400, image: "mat", alt: "Dusty mauve desk mat with orbital artwork", fit: ["desk"], compatibility: "Measure your desk before choosing a size.", material: "Cloth surface · Stitched edge · Rubber base · 4 mm thick", description: "A muted orbital print over a soft mouse surface. Choose a full desktop mat or a smaller footprint.", variants: [{ label: "Wide · 900 × 400 mm", stock: 8 }, { label: "Compact · 700 × 300 mm", stock: 3, price: 2900 }] },
  { id: "relay", name: "Blush Relay Cable", category: "Cables", price: 3200, image: "cable", alt: "Dusty pink coiled keyboard cable with silver connector", fit: ["usb"], compatibility: "USB-A host to USB-C keyboard", material: "Braided sleeve · Aviator coupler · 1.5 m total", description: "A dusty rose coil with brushed hardware for wired keyboards that accept USB-C.", variants: [{ label: "USB-A to USB-C", stock: 6 }] },
  { id: "star", name: "Fallen Star Artisan", category: "Keycaps", price: 2400, image: "artisan", alt: "Lavender resin artisan keycap with an embedded silver star", fit: ["mx"], compatibility: "Standard MX stem · Single 1u key", material: "Translucent cast resin · Tall artisan profile", description: "A silver star suspended in lilac resin. Designed as an accent key for a standard-height mechanical board.", variants: [{ label: "Lavender resin", stock: 0 }] },
  { id: "twilight", name: "Twilight Desk Kit", category: "Bundles", price: 5800, image: "hero", alt: "Plum and cream keyboard styling with matching desk mat and cable", fit: ["desk", "usb"], compatibility: "USB-A host to USB-C keyboard · 900 × 400 mm desk footprint", material: "Orbit Veil Wide mat + Blush Relay cable", description: "Two matching accessories in one kit. The keyboard in the styling photo is sold separately from these example goods and is not included.", variants: [{ label: "Wide mat + cable", stock: 4 }] }
];

const byId = new Map(catalog.map((product) => [product.id, product]));
const storageKey = "velvet-circuit-demo-cart-v1";
const get = (selector) => document.querySelector(selector);
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const priceOf = (product, variant) => variant.price ?? product.price;
const format = (cents) => money.format(cents / 100);
const displayPrice = (product) => {
  const prices = product.variants.map((variant) => priceOf(product, variant));
  const lowest = Math.min(...prices);
  return (prices.some((price) => price !== lowest) ? "From " : "") + format(lowest);
};
const variantKey = (product, index) => product.id + ":" + index;

function resolveLine(key) {
  const [id, index] = key.split(":");
  const product = byId.get(id);
  const variant = product?.variants[index];
  return variant ? { product, variant } : null;
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    return new Map(Object.entries(saved).flatMap(([key, qty]) => {
      const line = resolveLine(key);
      return line && Number.isInteger(qty) && qty > 0 && line.variant.stock > 0
        ? [[key, Math.min(qty, line.variant.stock)]]
        : [];
    }));
  } catch {
    return new Map();
  }
}

const cart = loadCart();
const products = get("#products");
const productDialog = get("#product-dialog");
const bagDialog = get("#bag-dialog");
const bagBody = get("#bag-body");
let openedProduct;
let productOpener;
let checkoutStage = "bag";
let shipping = "standard";

function saveCart() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(cart)));
  } catch {
    // Shopping still works within this page when storage is blocked.
  }
  get("#bag-count").textContent = [...cart.values()].reduce((total, qty) => total + qty, 0);
}

function stockLabel(product) {
  const stock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
  if (stock === 0) return "Sold out";
  return stock <= 4 ? "Low stock" : "In stock";
}

function renderProducts() {
  const category = get("#category").value;
  const fit = get("#fit").value;
  const inStock = get("#available").checked;
  const selection = catalog.filter((product) =>
    (!category || product.category === category) &&
    (!fit || product.fit.includes(fit)) &&
    (!inStock || stockLabel(product) !== "Sold out"));
  const sort = get("#sort").value;
  const minPrice = (product) => Math.min(...product.variants.map((variant) => priceOf(product, variant)));
  if (sort === "low") selection.sort((a, b) => minPrice(a) - minPrice(b));
  if (sort === "high") selection.sort((a, b) => minPrice(b) - minPrice(a));
  if (sort === "name") selection.sort((a, b) => a.name.localeCompare(b.name));

  get("#matches").textContent = selection.length + (selection.length === 1 ? " product" : " products");
  products.innerHTML = selection.map((product) => `
    <article class="product">
      <img src="assets/${product.image}.webp" alt="${product.alt}" width="600" height="400" loading="lazy">
      <div class="product-copy">
        <p class="availability">${product.category} · ${stockLabel(product)}</p>
        <h3>${product.name}</h3>
        <p class="price">${displayPrice(product)}</p>
        <button class="outline" type="button" data-product="${product.id}" aria-label="View ${product.name}">View details <span aria-hidden="true">↗</span></button>
      </div>
    </article>`).join("");
  if (selection.length === 0) {
    products.innerHTML = '<p>No products match these filters. <button class="outline" type="button" id="reset-filters">Clear filters</button></p>';
  }
}

function showProduct(product, opener) {
  openedProduct = product;
  productOpener = opener;
  get("#detail").innerHTML = `
    <div class="detail-wrap">
      <img src="assets/${product.image}.webp" alt="${product.alt}" width="600" height="400">
      <div class="detail-copy">
        <div class="dialog-head"><h2 id="product-title" tabindex="-1">${product.name}</h2><button class="close" type="button" data-close aria-label="Close product">×</button></div>
        <p>${product.description}</p>
        <dl><div><dt>Fit</dt><dd>${product.compatibility}</dd></div><div><dt>Specs</dt><dd>${product.material}</dd></div></dl>
        <label class="field">Option<select id="variant">${product.variants.map((variant, index) => `<option value="${index}">${variant.label}</option>`).join("")}</select></label>
        <p class="price" id="variant-price"></p>
        <p id="variant-stock"></p>
        <div class="inline-actions"><button class="button" type="button" id="add-to-bag">Add to bag</button><button class="outline" type="button" id="view-bag">View bag</button></div>
        <p id="product-status" role="status"></p>
      </div>
    </div>`;
  updateVariant();
  productDialog.showModal();
  get("#product-title").focus();
}

function updateVariant() {
  const index = Number(get("#variant").value);
  const variant = openedProduct.variants[index];
  const remaining = variant.stock - (cart.get(variantKey(openedProduct, index)) || 0);
  get("#variant-price").textContent = format(priceOf(openedProduct, variant));
  get("#variant-stock").textContent = variant.stock === 0
    ? "Sold out in the demo"
    : variant.stock + " in demo inventory · " + remaining + " more can be added";
  const add = get("#add-to-bag");
  add.disabled = remaining <= 0;
  add.textContent = variant.stock === 0 ? "Sold out" : remaining <= 0 ? "Stock limit reached" : "Add to bag";
}

function totalCart() {
  return [...cart].reduce((total, [key, qty]) => {
    const { product, variant } = resolveLine(key);
    return total + priceOf(product, variant) * qty;
  }, 0);
}

function renderBag() {
  const heading = get("#bag-title");
  heading.textContent = checkoutStage === "bag" ? "Your bag" : checkoutStage === "review" ? "Demo checkout" : "Simulation complete";
  if (checkoutStage === "done") {
    bagBody.innerHTML = '<p>Your example order is complete. No purchase was made and no information was sent.</p><div class="inline-actions"><button class="button" type="button" data-close>Keep browsing</button></div>';
    return;
  }

  const subtotal = totalCart();
  if (checkoutStage === "review") {
    const shippingCost = shipping === "express" ? 1200 : subtotal >= 7500 ? 0 : 600;
    bagBody.innerHTML = `
      <div class="checkout">
        <p>Example order only. No address or payment details are needed.</p>
        <label class="field">Shipping option<select id="shipping"><option value="standard">Standard</option><option value="express">Express</option></select></label>
        <dl><div><dt>Subtotal</dt><dd>${format(subtotal)}</dd></div><div><dt>Shipping</dt><dd>${format(shippingCost)}</dd></div><div><dt>Demo total</dt><dd><strong>${format(subtotal + shippingCost)}</strong></dd></div></dl>
        <div class="inline-actions"><button class="button" type="button" data-stage="done">Complete simulation</button><button class="outline" type="button" data-stage="bag">Back to bag</button></div>
      </div>`;
    get("#shipping").value = shipping;
    return;
  }

  if (cart.size === 0) {
    bagBody.innerHTML = '<p>Your bag is empty.</p><div class="inline-actions"><button class="button" type="button" data-close>Keep browsing</button></div>';
    return;
  }

  const lines = [...cart].map(([key, qty]) => {
    const { product, variant } = resolveLine(key);
    const options = Array.from({ length: variant.stock }, (_, index) => {
      const value = index + 1;
      return `<option value="${value}" ${value === qty ? "selected" : ""}>${value}</option>`;
    }).join("");
    return `<li><div><strong>${product.name}</strong><small>${variant.label} · ${format(priceOf(product, variant) * qty)}</small></div>
      <label>Quantity<select data-qty="${key}" aria-label="Quantity for ${product.name}, ${variant.label}">${options}</select></label>
      <button class="remove" type="button" data-remove="${key}" aria-label="Remove ${product.name}, ${variant.label}">Remove</button></li>`;
  }).join("");
  bagBody.innerHTML = `<ul class="bag-lines">${lines}</ul>
    <div class="totals"><strong>Subtotal ${format(subtotal)}</strong><p>Shipping shown in the next step.</p></div>
    <button class="button" type="button" data-stage="review">Try demo checkout</button>`;
}

function openBag() {
  checkoutStage = "bag";
  shipping = "standard";
  get("#bag-status").textContent = "";
  renderBag();
  bagDialog.showModal();
  get("#bag-title").focus();
}

get("#filters").addEventListener("change", renderProducts);
products.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.id === "reset-filters") {
    for (const id of ["category", "fit"]) get("#" + id).value = "";
    get("#available").checked = false;
    get("#sort").value = "featured";
    renderProducts();
    get("#category").focus();
  } else if (button.dataset.product) {
    showProduct(byId.get(button.dataset.product), button);
  }
});
get("#bundle-view").addEventListener("click", (event) => showProduct(byId.get("twilight"), event.currentTarget));
get("#open-bag").addEventListener("click", openBag);

productDialog.addEventListener("change", (event) => {
  if (event.target.id !== "variant") return;
  get("#product-status").textContent = "";
  updateVariant();
});
productDialog.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.id === "add-to-bag") {
    const index = Number(get("#variant").value);
    const key = variantKey(openedProduct, index);
    const qty = cart.get(key) || 0;
    if (qty >= openedProduct.variants[index].stock) return;
    cart.set(key, qty + 1);
    saveCart();
    updateVariant();
    get("#product-status").textContent = openedProduct.name + " added. " + (qty + 1) + " of this option in your bag.";
    if (button.disabled) get("#view-bag").focus();
  } else if (button.id === "view-bag") {
    productDialog.close();
    openBag();
  }
});
productDialog.addEventListener("close", () => {
  if (!bagDialog.open) productOpener?.focus();
});
bagDialog.addEventListener("close", () => get("#open-bag").focus());

bagDialog.addEventListener("change", (event) => {
  const input = event.target;
  if (input.dataset.qty) {
    cart.set(input.dataset.qty, Number(input.value));
    saveCart();
    renderBag();
    bagBody.querySelector(`[data-qty="${input.dataset.qty}"]`).focus();
    get("#bag-status").textContent = "Quantity updated. Subtotal " + format(totalCart()) + ".";
  } else if (input.id === "shipping") {
    shipping = input.value;
    renderBag();
    get("#shipping").focus();
    get("#bag-status").textContent = "Shipping updated. Demo total " + bagBody.querySelector("dd:last-child strong").textContent + ".";
  }
});
bagDialog.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.remove) {
    const line = resolveLine(button.dataset.remove);
    cart.delete(button.dataset.remove);
    saveCart();
    renderBag();
    get("#bag-title").focus();
    get("#bag-status").textContent = line.product.name + " removed.";
  } else if (button.dataset.stage) {
    checkoutStage = button.dataset.stage;
    if (checkoutStage === "done") {
      cart.clear();
      saveCart();
    }
    renderBag();
    get("#bag-title").focus();
  }
});
for (const dialog of [productDialog, bagDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target.closest("[data-close]")) dialog.close();
  });
}

saveCart();
renderProducts();
for (const id of ["filters", "open-bag", "bundle-view"]) get("#" + id).hidden = false;
