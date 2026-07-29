/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import accordionFaqParser from './parsers/accordion-faq.js';
import cardsArticleParser from './parsers/cards-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import columnsMediaParser from './parsers/columns-media.js';
import heroBannerParser from './parsers/hero-banner.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'accordion-faq': accordionFaqParser,
  'cards-article': cardsArticleParser,
  'cards-gallery': cardsGalleryParser,
  'columns-media': columnsMediaParser,
  'hero-banner': heroBannerParser,
  'tabs-testimonial': tabsTestimonialParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'WKND Trendsetters fashion blog homepage with hero, featured article, image gallery, testimonials tabs, latest articles cards, FAQ accordion, and CTA banner',
  urls: ['https://wknd-trendsetters.site/'],
  blocks: [
    {
      name: 'section-intro',
      instances: ['#main-content > header.section.secondary-section'],
      section: 'secondary',
    },
    {
      name: 'columns-media',
      instances: [
        '#main-content > header.section.secondary-section div.grid-layout.tablet-1-column.grid-gap-xxl',
        '#main-content > section.section:nth-of-type(1) div.grid-layout',
      ],
    },
    {
      name: 'section-gallery',
      instances: ['#main-content > section.section.secondary-section:nth-of-type(2)'],
      section: 'secondary',
    },
    {
      name: 'cards-gallery',
      instances: ['#main-content > section.section.secondary-section:nth-of-type(2) div.grid-layout.desktop-4-column.grid-gap-sm'],
    },
    {
      name: 'tabs-testimonial',
      instances: ['#main-content > section.section:nth-of-type(3) div.tabs-wrapper'],
    },
    {
      name: 'section-articles',
      instances: ['#main-content > section.section.secondary-section:nth-of-type(4)'],
      section: 'secondary',
    },
    {
      name: 'cards-article',
      instances: ['#main-content > section.section.secondary-section:nth-of-type(4) div.grid-layout.desktop-4-column.grid-gap-md'],
    },
    {
      name: 'accordion-faq',
      instances: ['#main-content > section.section:nth-of-type(5) div.faq-list'],
    },
    {
      name: 'hero-banner',
      instances: ['#main-content > section.section.inverse-section'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    // Section markers (section-*) are not parsed as blocks; they only carry section styling
    if (blockDef.name.startsWith('section-')) return;
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
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
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

    // 4. Execute afterTransform transformers (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    // Root path ('/') collapses to an empty string after trimming the trailing
    // slash; map that to '/index' so the homepage becomes /index (matches the
    // documentPath from analysis) and avoids resolving against an undefined cwd.
    const rawPath = new URL(params.originalURL).pathname.replace(/\.html$/, '').replace(/\/$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath || '/index');

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
