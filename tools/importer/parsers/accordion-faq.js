/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq
 * Base block: accordion
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-29
 *
 * Structure (from library-description.txt):
 *   2 columns. Row 1: block name. Each subsequent row = one accordion item
 *   with 2 cells: [title, content].
 *
 * Source DOM: <div class="faq-list"> containing <details class="faq-item">
 *   with <summary class="faq-question"><span>Title</span><img icon></summary>
 *   and <div class="faq-answer">...content...</div>
 */
export default function parse(element, { document }) {
  // Each accordion item is a <details> element (fallback to generic item classes)
  const items = element.querySelectorAll(':scope > details, :scope > .faq-item, :scope > .accordion-item');

  const cells = [];

  items.forEach((item) => {
    // Title: prefer the span text inside the summary/question, excluding the toggle icon
    const summary = item.querySelector('summary, .faq-question, .accordion-title');
    let title = null;
    if (summary) {
      const titleSpan = summary.querySelector('span');
      title = titleSpan || summary;
    }

    // Content: the answer/body panel
    const content = item.querySelector('.faq-answer, .accordion-content, .accordion-body');

    // Only add a row if we have a title (content optional but expected)
    if (title || content) {
      cells.push([title || '', content || '']);
    }
  });

  // Empty-block guard: nothing extracted, unwrap the element
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
