export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // this CTA banner sits at the bottom of the page: lazy-load its background
  const bgImg = block.querySelector('img');
  if (bgImg && !bgImg.getAttribute('loading')) bgImg.setAttribute('loading', 'lazy');

  // The CTA is a standalone link that global decoration leaves as a plain link
  // (it only buttonizes strong/em links). Promote it to a button so it renders
  // as the source's pill CTA.
  const cta = block.querySelector(':scope > div:last-child a');
  if (cta && !cta.classList.contains('button')) {
    cta.classList.add('button');
    const p = cta.closest('p');
    if (p && p.textContent.trim() === cta.textContent.trim()) {
      p.classList.add('button-container');
    }
  }
}
