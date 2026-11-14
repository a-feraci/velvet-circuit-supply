# N0V4.PORTFOLIO // PROJECT HANDOFF

**Velvet Circuit Supply · After Hours Collection · v0.1.0 · Live MVP · November 14, 2026**  
Fictional direct-to-consumer e-commerce · Mechanical keyboard and desk accessories

[Verified public storefront](https://a-feraci.github.io/velvet-circuit-supply/) · [GitHub repository](https://github.com/a-feraci/velvet-circuit-supply) · [MVP source commit](https://github.com/a-feraci/velvet-circuit-supply/commit/9c9830bed20eb0dd30e383bac67682a25c7cbf34) · [Successful GitHub Pages run](https://github.com/a-feraci/velvet-circuit-supply/actions/runs/43622739283)

## Problem and audience

Keyboard hobbyists, developers, gamers, artists and students want accessories that fit both their setup and their taste. An appealing keycap photo alone cannot tell a shopper which stem, layout or profile it supports. The fictional store earns revenue from individual products, bundles and seasonal collections.

## Design and implementation

The brief and wireframes established a discover → filter → check fit → customize → checkout journey. Keychron informed the fit vocabulary, NovelKeys informed desk mat specs and stock cues, and Baymard informed the filter and sorting experience. The first working HTML prototype became the launch. Plum surfaces, blush accents and original studio imagery make the collection recognizable. Fit, specifications, price and stock are grouped beside the option selector.

The project uses buildless HTML, responsive CSS and vanilla JavaScript. Vite with React and Astro were considered. A five-product catalog works with a single data model and native dialogs, while a larger indexable catalog would benefit from dedicated pages and reusable templates. Prices use integer cents. The bag stores variant keys and quantities on the current browser with an in-tab fallback. Checkout has no account, payment, address or order endpoint.

## Features and skills

- Five fictional listings covering keycaps, an artisan, a two-size desk mat, a cable and a matching bundle.
- Category, fit and stock filters, price and name sorts, match counts and clear-filters recovery.
- Product dialogs with images, compatibility, specs, variant price and stock limits.
- Persistent bag with quantity changes, removal and derived subtotals.
- Example standard, express and free shipping, simulated confirmation, and shipping and returns disclosures.
- Skills demonstrated include e-commerce discovery, responsive wireframing, semantic markup, asset optimization, DOM and state management, variant inventory, price arithmetic, focus handling, deployment and QA.

## Testing evidence and technical challenges

The initial Pages run was cancelled when the MVP source commit replaced the initialization commit. The successor completed successfully. The deployed page was opened and tested in Chrome.

| Check | Observed result |
| --- | --- |
| Catalog | Standard MX + Keycaps showed two items. Adding In stock only reduced the result to one. An incompatible fit showed a clear-filters recovery action. Low-price sorting produced the expected five-item order. |
| Options and stock | Fallen Star Artisan disabled purchase. Compact Orbit Veil changed to $29 and stopped accepting additions at three. |
| Bag | Two Compact mats totaled $58 and remained in the bag after reload. Removing the Twilight bundle returned the bag to empty. |
| Simulated checkout | $58 subtotal became $64 standard or $70 express. Three Compact mats totaled $87 and qualified for free standard shipping. Completion emptied the bag. |
| Keyboard | Enter opened a focused product button and Escape restored focus to that button. |
| Responsive | No horizontal overflow at 320, 375, 768, and 1,278 CSS px. The checkout completed at 375 px. |
| Source and assets | Node syntax check passed. The hero and catalog images reported loaded intrinsic widths. HTML, CSS, JS and WebP files totaled 177,263 bytes before HTTP compression. Internal navigation anchors resolved. |

Lighthouse and a full assistive-technology audit remain pending. Product details are modal views and have no individual shareable URLs. Inventory is fixed, local to the demo, and independent per SKU. For the bundle, stock is independent of its components. v0.1.0 is the baseline. No conversion, speed or usability improvement is claimed.

## Visuals and release history

[Desktop storefront](screenshots/velvet-circuit-desktop.jpg) · [Product detail with Compact selected](screenshots/velvet-circuit-product.jpg) · [375 px catalog](screenshots/velvet-circuit-mobile.jpg) · [Brief, research, wireframes and decision record](project-notes.md) · [Changelog](../CHANGELOG.md)

## Prioritized backlog

1. **Usability and accessibility.** Observe shoppers selecting caps for a compact ANSI board, document fit errors, and run a full keyboard, screen-reader and Lighthouse baseline. Compare outcomes after any label or focus fixes.
2. **Business clarity.** Add explicit board-fit exclusions, second product angles and shareable product links. Verify deep links, browser back behavior and image payload before and after.
3. **Portfolio enhancement.** Prototype a compatibility picker and shared bundle inventory only after defining the board and stock rules. Test with synthetic compatible, incompatible and low-stock cases.

## Portfolio-ready writing

**Project card.** Velvet Circuit Supply is an editorial storefront for fictional keyboard accessories. Filter by fit, choose a product option and try a cart with stock limits and simulated shipping.

**Case-study summary.** The After Hours storefront pairs product photography with a practical question for keyboard shoppers. Will this fit my board or desk? Category and compatibility filters lead to product details with dimensions, connector or stem requirements and variant-level stock. An editable browser-local bag carries the selected variant through shipping review and simulated checkout. The static site is live on GitHub Pages and was tested at desktop and phone widths.

**Resume bullet suggestions.** Use the lines that reflect work you personally complete.

- Shipped a responsive e-commerce portfolio demo with compatibility filters, variant selection and illustrative stock rules.
- Implemented browser-local cart persistence, stock-capped quantities and integer-cent calculations for simulated checkout.
- Verified the live storefront with mobile and desktop browser tests and documented the design and technical decisions in GitHub.
