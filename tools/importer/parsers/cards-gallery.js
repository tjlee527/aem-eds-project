/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery
 * Base block: cards
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-29
 *
 * Structure (from library-description.txt, "Cards" with images variant):
 *   2 columns. Row 1: block name. Each subsequent row = one card:
 *     cell 1: image (mandatory)
 *     cell 2: text content (none in this image-only gallery -> empty cell to
 *             keep uniform 2-column structure)
 *
 * Source DOM: div.grid-layout > div.utility-aspect-1x1 > img.cover-image
 *   (image-only gallery cards, no text/heading/CTA)
 */
export default function parse(element, { document }) {
  // Each gallery item wraps a single image; fallback to any img directly
  const items = element.querySelectorAll(':scope > div, :scope > a, :scope > figure');

  const cells = [];

  items.forEach((item) => {
    const img = item.matches('img') ? item : item.querySelector('img');

    // Optional text content (headings/paragraphs/links) if present
    const textContent = [];
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    if (heading) textContent.push(heading);
    const desc = item.querySelector('p');
    if (desc) textContent.push(desc);
    const link = item.querySelector('a[href]');
    if (link) textContent.push(link);

    if (img || textContent.length) {
      cells.push([img || '', textContent.length ? textContent : '']);
    }
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
