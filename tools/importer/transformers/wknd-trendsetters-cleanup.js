/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters site-wide cleanup.
 *
 * Removes non-authorable site chrome so the import contains only page-level
 * authorable content. All selectors are taken from the captured DOM in
 * migration-work/cleaned.html (not guessed):
 *   - a.skip-link            (line 1)  skip-to-content link
 *   - div.navbar             (line 1)  top navigation / mega-menu / mobile menu
 *   - div.breadcrumbs        (line 47) breadcrumb trail inside the featured
 *                                      article section (columns-media block region)
 *   - footer.footer          (line 98) site footer
 *
 * NOTE: Do NOT use a broad `header` selector. In this DOM
 * `<header class="section secondary-section">` (line 47) is the authorable
 * hero (section-intro / columns-media), not site chrome.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Breadcrumbs live inside the columns-media block region, so they must be
    // removed before block parsing or they would be captured into the block cell.
    WebImporter.DOMUtils.remove(element, ['.breadcrumbs']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome (outside the authorable page content).
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'div.navbar',
      'footer.footer',
    ]);
  }
}
