import { createOptimizedPicture } from '../../scripts/aem.js';

const MONTHS = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec';
const DATE_RE = new RegExp(`((?:${MONTHS})[a-z]*\\.?\\s+\\d{1,2})\\s*$`);

/**
 * loads and decorates the cards-article block
 * Content model per row: image cell + body cell (category+date, title heading, title link).
 * Renders each card as a single clickable link with a category pill + date meta row.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-article-card-image';
      else div.className = 'cards-article-card-body';
    });

    const body = li.querySelector('.cards-article-card-body');
    let href = '#';
    if (body) {
      // pull the article href from the redundant title link, then remove it
      const linkP = [...body.querySelectorAll('p')].find((p) => p.querySelector('a'));
      if (linkP) {
        href = linkP.querySelector('a').getAttribute('href') || '#';
        linkP.remove();
      }
      // split the meta paragraph ("Category Month DD") into a pill + date
      const metaP = body.querySelector('p');
      if (metaP && !metaP.querySelector('a')) {
        const text = metaP.textContent.trim();
        const meta = document.createElement('div');
        meta.className = 'cards-article-card-meta';
        const match = text.match(DATE_RE);
        const [, dateText] = match || [];
        const category = match ? text.slice(0, match.index).trim() : text;
        if (category) {
          const tag = document.createElement('span');
          tag.className = 'cards-article-tag';
          tag.textContent = category;
          meta.append(tag);
        }
        if (match) {
          const date = document.createElement('span');
          date.className = 'cards-article-date';
          date.textContent = dateText;
          meta.append(date);
        }
        metaP.replaceWith(meta);
      }
    }

    // wrap the whole card in a single link
    const cardLink = document.createElement('a');
    cardLink.className = 'cards-article-card-link';
    cardLink.href = href;
    while (li.firstElementChild) cardLink.append(li.firstElementChild);
    li.append(cardLink);

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
