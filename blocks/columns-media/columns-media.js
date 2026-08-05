export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-media-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-media-img-col');
        }
      }
      // a column holding multiple images (each in its own <p>) is the
      // intro's photo mosaic — tag it so CSS can lay it out as a grid
      if (col.querySelectorAll('img').length > 1) {
        col.classList.add('columns-media-img-mosaic');
      }
    });
  });

  // LCP optimization: the first columns-media on the page holds the hero
  // image. Prioritize its first image; the rest of this block's images are
  // near the fold, so leave them at default priority.
  const isFirstBlock = block === block.closest('main')?.querySelector('.block');
  const img = block.querySelector('img');
  if (img && isFirstBlock) {
    img.setAttribute('fetchpriority', 'high');
    img.setAttribute('loading', 'eager');
  }
}
