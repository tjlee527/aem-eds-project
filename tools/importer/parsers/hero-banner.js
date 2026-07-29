/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner
 * Base block: hero
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-29
 *
 * Structure (from library-description.txt):
 *   1 column, 3 rows. Row 1: block name.
 *   Row 2 (single cell): background image (optional).
 *   Row 3 (single cell): title (heading), subheading, CTA link(s).
 *
 * Source DOM: section.inverse-section > ... > img.cover-image (background)
 *   and div.card-body > h2 (title) + p.subheading + div.button-group > a (CTA).
 *   The instance selector points at the section, so `element` is the section.
 */
export default function parse(element, { document }) {
  // Background image (first cover/overlay image)
  const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img');

  // Title heading
  const heading = element.querySelector('h1, h2, h3, [class*="heading"]');

  // Subheading / description
  const subheading = element.querySelector('p.subheading, p');

  // Call-to-action link(s)
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a[href], a.button'));

  // Empty-block guard: nothing meaningful found
  if (!bgImage && !heading && !subheading && ctaLinks.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (single cell) — only if present
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: content (single cell holding all text/CTA elements)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
