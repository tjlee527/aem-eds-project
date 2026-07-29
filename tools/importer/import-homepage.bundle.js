/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/accordion-faq.js
  function parse(element, { document }) {
    const items = element.querySelectorAll(":scope > details, :scope > .faq-item, :scope > .accordion-item");
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary, .faq-question, .accordion-title");
      let title = null;
      if (summary) {
        const titleSpan = summary.querySelector("span");
        title = titleSpan || summary;
      }
      const content = item.querySelector(".faq-answer, .accordion-content, .accordion-body");
      if (title || content) {
        cells.push([title || "", content || ""]);
      }
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse2(element, { document }) {
    const cards = element.querySelectorAll(":scope > a.article-card, :scope > .article-card, :scope > .card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".article-card-image img, img");
      const textContent = [];
      const meta = card.querySelector(".article-card-meta");
      if (meta) textContent.push(meta);
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      if (heading) textContent.push(heading);
      const href = card.matches("a[href]") ? card.getAttribute("href") : card.querySelector("a[href]") ? card.querySelector("a[href]").getAttribute("href") : null;
      if (href) {
        const cta = document.createElement("a");
        cta.href = href;
        cta.textContent = heading ? heading.textContent.trim() : "Read more";
        textContent.push(cta);
      }
      if (img || textContent.length) {
        cells.push([img || "", textContent.length ? textContent : ""]);
      }
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document }) {
    const items = element.querySelectorAll(":scope > div, :scope > a, :scope > figure");
    const cells = [];
    items.forEach((item) => {
      const img = item.matches("img") ? item : item.querySelector("img");
      const textContent = [];
      const heading = item.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      if (heading) textContent.push(heading);
      const desc = item.querySelector("p");
      if (desc) textContent.push(desc);
      const link = item.querySelector("a[href]");
      if (link) textContent.push(link);
      if (img || textContent.length) {
        cells.push([img || "", textContent.length ? textContent : ""]);
      }
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-media.js
  function parse4(element, { document }) {
    let columns = Array.from(element.querySelectorAll(":scope > div"));
    if (columns.length === 0) {
      columns = Array.from(element.children);
    }
    if (columns.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [columns];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse5(element, { document }) {
    const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img');
    const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
    const subheading = element.querySelector("p.subheading, p");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a[href], a.button"));
    if (!bgImage && !heading && !subheading && ctaLinks.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse6(element, { document }) {
    const labels = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button, [class*="tab-menu"] button'));
    const panes = Array.from(element.querySelectorAll('.tabs-content .tab-pane, .tabs-content > div, [class*="tab-pane"]'));
    const cells = [];
    const count = Math.max(labels.length, panes.length);
    for (let i = 0; i < count; i += 1) {
      const label = labels[i] || "";
      const pane = panes[i] || "";
      if (label || pane) {
        cells.push([label, pane]);
      }
    }
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".breadcrumbs"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        "div.navbar",
        "footer.footer"
      ]);
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "accordion-faq": parse,
    "cards-article": parse2,
    "cards-gallery": parse3,
    "columns-media": parse4,
    "hero-banner": parse5,
    "tabs-testimonial": parse6
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "WKND Trendsetters fashion blog homepage with hero, featured article, image gallery, testimonials tabs, latest articles cards, FAQ accordion, and CTA banner",
    urls: ["https://wknd-trendsetters.site/"],
    blocks: [
      {
        name: "section-intro",
        instances: ["#main-content > header.section.secondary-section"],
        section: "secondary"
      },
      {
        name: "columns-media",
        instances: [
          "#main-content > header.section.secondary-section div.grid-layout.tablet-1-column.grid-gap-xxl",
          "#main-content > section.section:nth-of-type(1) div.grid-layout"
        ]
      },
      {
        name: "section-gallery",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(2)"],
        section: "secondary"
      },
      {
        name: "cards-gallery",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(2) div.grid-layout.desktop-4-column.grid-gap-sm"]
      },
      {
        name: "tabs-testimonial",
        instances: ["#main-content > section.section:nth-of-type(3) div.tabs-wrapper"]
      },
      {
        name: "section-articles",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(4)"],
        section: "secondary"
      },
      {
        name: "cards-article",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(4) div.grid-layout.desktop-4-column.grid-gap-md"]
      },
      {
        name: "accordion-faq",
        instances: ["#main-content > section.section:nth-of-type(5) div.faq-list"]
      },
      {
        name: "hero-banner",
        instances: ["#main-content > section.section.inverse-section"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      if (blockDef.name.startsWith("section-")) return;
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\.html$/, "").replace(/\/$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath || "/index");
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
