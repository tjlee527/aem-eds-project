import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Closes all open nav drops.
 * @param {Element} navSections the sections container
 * @param {Element} [except] optional drop to leave open
 */
function closeAllDrops(navSections, except) {
  navSections.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((drop) => {
    if (drop !== except) drop.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Toggles the mobile menu open/closed.
 * @param {Element} nav the nav element
 * @param {Element} navSections the sections container
 * @param {boolean|null} forceExpanded force a specific state
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // when collapsing (or on desktop) also close any expanded drops
  if (expanded || isDesktop.matches) closeAllDrops(navSections);
}

/**
 * Closes menu/drops on Escape.
 * @param {KeyboardEvent} e the key event
 * @param {Element} nav the nav element
 * @param {Element} navSections the sections container
 */
function closeOnEscape(e, nav, navSections) {
  if (e.code !== 'Escape') return;
  if (isDesktop.matches) {
    closeAllDrops(navSections);
  } else if (nav.getAttribute('aria-expanded') === 'true') {
    toggleMenu(nav, navSections);
    const button = nav.querySelector('.nav-hamburger button');
    if (button) button.focus();
  }
}

/**
 * Wires a nav-drop (a top-level item that owns a panel) for hover + click + keyboard.
 * Generic: works for both the megamenu and the simple dropdown.
 * @param {Element} drop the top-level <li> with a child panel
 * @param {Element} navSections the sections container
 */
function decorateDrop(drop, navSections) {
  drop.setAttribute('aria-expanded', 'false');
  // the label is the leading paragraph; make it a focusable button-like trigger
  const label = drop.querySelector(':scope > p') || drop.firstElementChild;
  if (label) {
    label.classList.add('nav-drop-label');
    label.setAttribute('tabindex', '0');
    label.setAttribute('role', 'button');
  }

  const setExpanded = (state) => {
    drop.setAttribute('aria-expanded', state ? 'true' : 'false');
    if (label) label.setAttribute('aria-expanded', state ? 'true' : 'false');
  };

  // desktop: hover opens/closes
  drop.addEventListener('mouseenter', () => {
    if (isDesktop.matches) {
      closeAllDrops(navSections, drop);
      setExpanded(true);
    }
  });
  drop.addEventListener('mouseleave', () => {
    if (isDesktop.matches) setExpanded(false);
  });

  // click/tap toggles (primary interaction on mobile, secondary on desktop)
  if (label) {
    const toggle = () => {
      const open = drop.getAttribute('aria-expanded') === 'true';
      if (isDesktop.matches) closeAllDrops(navSections, drop);
      setExpanded(!open);
    };
    label.addEventListener('click', toggle);
    label.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        toggle();
      }
    });
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav fragment: metadata path, else /content/nav (local) then /nav (DA/EDS)
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/content/nav';
  let fragment = await loadFragment(navPath);
  if (!fragment) fragment = await loadFragment('/nav');

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // label the three fragment sections: brand, sections, tools
  ['brand', 'sections', 'tools'].forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // brand: strip button styling that global decoration may have applied
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    navBrand.querySelectorAll('a.button').forEach((a) => { a.className = ''; });
    navBrand.querySelectorAll('.button-container').forEach((p) => { p.className = ''; });
  }

  // tools (Subscribe): render as the source's black pill button
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const cta = navTools.querySelector('a');
    if (cta) {
      cta.classList.add('button', 'primary');
      const wrapper = cta.closest('p');
      if (wrapper) wrapper.classList.remove('button-container');
    }
  }

  // sections: identify drops (top-level items that own a panel), classify megamenu vs simple
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    // the top-level list may be wrapped in a default-content-wrapper by the fragment loader
    const topList = navSections.querySelector('ul');
    if (topList) topList.parentElement.classList.add('nav-sections-list-wrapper');
    navSections.querySelectorAll('.nav-sections-list-wrapper > ul > li').forEach((li) => {
      const panel = li.querySelector(':scope > ul');
      if (!panel) return;
      li.classList.add('nav-drop');
      // megamenu when its child items themselves own sub-lists (columns); else simple dropdown
      const isMegamenu = [...panel.children].some((col) => col.querySelector(':scope > ul'));
      li.classList.add(isMegamenu ? 'nav-drop-mega' : 'nav-drop-simple');
      decorateDrop(li, navSections);
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // keyboard: Escape closes
  window.addEventListener('keydown', (e) => closeOnEscape(e, nav, navSections));

  // viewport resize handling: reset state when crossing between mobile and desktop
  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, navSections, isDesktop.matches);
    closeAllDrops(navSections);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
