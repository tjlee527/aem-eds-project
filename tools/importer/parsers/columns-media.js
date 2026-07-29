/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-media
 * Base block: columns
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-29
 *
 * Structure (from library-description.txt):
 *   Multiple columns/rows. Row 1: block name. Second row = one cell per column,
 *   based on the natural visual grouping of content.
 *
 * Source DOM: div.grid-layout with direct-child <div>s, each becoming a column.
 *   Instance 1: [text div (h1, subheading, button-group), image grid div]
 *   Two instances mapped -> extract direct children as columns for resilience.
 */
export default function parse(element, { document }) {
  // Each direct child div is a column
  let columns = Array.from(element.querySelectorAll(':scope > div'));

  // Fallback: if no direct-child divs, treat any direct children as columns
  if (columns.length === 0) {
    columns = Array.from(element.children);
  }

  // Empty-block guard
  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single row with one cell per column
  const cells = [columns];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
