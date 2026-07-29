/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article
 * Base block: cards
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-29
 *
 * Structure (from library-description.txt, "Cards" with images variant):
 *   2 columns. Row 1: block name. Each subsequent row = one card:
 *     cell 1: image/icon (mandatory)
 *     cell 2: text content (tag/meta, heading, optional CTA link)
 *
 * Source DOM: div.grid-layout > a.article-card.card-link (whole card is a link)
 *   > div.article-card-image > img
 *   > div.article-card-body > div.article-card-meta (spans) + h3 heading
 */
export default function parse(element, { document }) {
  // Each card is an anchor wrapper (fallback to generic card containers)
  const cards = element.querySelectorAll(':scope > a.article-card, :scope > .article-card, :scope > .card');

  const cells = [];

  cards.forEach((card) => {
    // Image cell
    const img = card.querySelector('.article-card-image img, img');

    // Text content cell
    const textContent = [];

    // Meta (tag + date)
    const meta = card.querySelector('.article-card-meta');
    if (meta) textContent.push(meta);

    // Heading
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    if (heading) textContent.push(heading);

    // Preserve the card link as a CTA if the card is/contains an anchor with an href
    const href = card.matches('a[href]')
      ? card.getAttribute('href')
      : (card.querySelector('a[href]') ? card.querySelector('a[href]').getAttribute('href') : null);
    if (href) {
      const cta = document.createElement('a');
      cta.href = href;
      cta.textContent = heading ? heading.textContent.trim() : 'Read more';
      textContent.push(cta);
    }

    // Only add a row if we found something meaningful
    if (img || textContent.length) {
      cells.push([img || '', textContent.length ? textContent : '']);
    }
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
