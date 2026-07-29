import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer fragment: metadata path, else /content/footer (local) then /footer (DA/EDS)
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/content/footer';
  let fragment = await loadFragment(footerPath);
  if (!fragment) fragment = await loadFragment('/footer');

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // label sections: first section (logo + social list) is the brand column;
  // remaining sections are link-column groups (heading + list).
  const sections = [...footer.children];
  sections.forEach((section, i) => {
    section.classList.add('footer-column');
    if (i === 0) {
      section.classList.add('footer-brand');
      // the social list is the <ul> in the brand column
      const socialList = section.querySelector('ul');
      if (socialList) socialList.classList.add('footer-social');
      // strip button styling global decoration may have applied to the brand link
      section.querySelectorAll('a.button').forEach((a) => { a.className = ''; });
      section.querySelectorAll('.button-container').forEach((p) => { p.className = ''; });
      // tag the brand link (logo + wordmark) — it is the link NOT inside the social list
      const brandLink = [...section.querySelectorAll('a')].find((a) => !a.closest('ul'));
      if (brandLink) brandLink.classList.add('footer-brand-link');
    } else {
      section.classList.add('footer-links');
    }
  });

  block.append(footer);
}
