/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial
 * Base block: tabs
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-29
 *
 * Structure (from library-description.txt):
 *   2 columns. Row 1: block name. Each subsequent row = one tab:
 *     cell 1: tab label (mandatory)
 *     cell 2: tab content (mandatory)
 *
 * Source DOM: div.tabs-wrapper
 *   > div.tabs-content > div.tab-pane (content, one per tab)
 *   > div.tab-menu > button.tab-menu-link (labels, one per tab)
 *   Labels and panes correspond by order (tab-0 <-> tabpanel-0).
 */
export default function parse(element, { document }) {
  // Tab labels (menu buttons) and content panes
  const labels = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button, [class*="tab-menu"] button'));
  const panes = Array.from(element.querySelectorAll('.tabs-content .tab-pane, .tabs-content > div, [class*="tab-pane"]'));

  const cells = [];
  const count = Math.max(labels.length, panes.length);

  for (let i = 0; i < count; i += 1) {
    const label = labels[i] || '';
    const pane = panes[i] || '';
    // Only add a row if at least one side has content; pad to keep 2 columns
    if (label || pane) {
      cells.push([label, pane]);
    }
  }

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
