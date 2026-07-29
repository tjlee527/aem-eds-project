// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

/**
 * loads and decorates the tabs-testimonial block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');

  // activates a tab: updates selected/hidden state and moves focus to it
  const selectTab = (button) => {
    block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
      panel.setAttribute('aria-hidden', true);
    });
    tablist.querySelectorAll('button').forEach((btn) => {
      btn.setAttribute('aria-selected', false);
      btn.setAttribute('tabindex', '-1');
    });
    const panel = block.querySelector(`#${button.getAttribute('aria-controls')}`);
    if (panel) panel.setAttribute('aria-hidden', false);
    button.setAttribute('aria-selected', true);
    button.setAttribute('tabindex', '0');
  };

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    // the row becomes the tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-testimonial-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // build tab button from the first cell (avatar + name + role)
    const button = document.createElement('button');
    button.className = 'tabs-testimonial-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;

    // restructure tab content: avatar + text
    const btnPicture = button.querySelector('picture');
    const avatarP = btnPicture ? btnPicture.closest('p') : null;
    if (avatarP) avatarP.className = 'tabs-testimonial-tab-avatar';
    const btnText = document.createElement('div');
    btnText.className = 'tabs-testimonial-tab-text';
    [...button.children].forEach((child) => {
      if (child !== avatarP) btnText.append(child);
    });
    button.append(btnText);

    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    // roving tabindex: only the selected tab is in the tab order
    button.setAttribute('tabindex', i ? '-1' : '0');
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => selectTab(button));
    // ARIA tab pattern: arrow keys move between tabs, Home/End jump to ends
    button.addEventListener('keydown', (e) => {
      const btns = [...tablist.querySelectorAll('button')];
      const idx = btns.indexOf(button);
      let next;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = btns[(idx + 1) % btns.length];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = btns[(idx - 1 + btns.length) % btns.length];
      else if (e.key === 'Home') [next] = btns;
      else if (e.key === 'End') next = btns[btns.length - 1];
      if (next) {
        e.preventDefault();
        selectTab(next);
        next.focus();
      }
    });
    tablist.append(button);

    // remove the tab-label cell; the remaining cell holds the testimonial
    tab.remove();

    // restructure the remaining content cell: image column + text column
    const content = tabpanel.querySelector(':scope > div');
    if (content) {
      const picture = content.querySelector('picture');
      const imageP = picture ? picture.closest('p') : null;
      if (imageP) imageP.className = 'tabs-testimonial-panel-image';
      const textWrap = document.createElement('div');
      textWrap.className = 'tabs-testimonial-panel-text';
      [...content.children].forEach((child) => {
        if (child !== imageP) textWrap.append(child);
      });
      content.append(textWrap);
    }
  });

  // below-the-fold block: lazy-load all imagery to avoid competing with LCP
  block.querySelectorAll('img').forEach((img) => {
    if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
  });

  block.prepend(tablist);
}
