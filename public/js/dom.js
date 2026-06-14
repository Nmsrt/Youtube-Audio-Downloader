// @ts-check

/**
 * Get a required element by id, failing loudly if the markup changed.
 * @param {string} id
 * @returns {HTMLElement}
 */
function byId(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing required element #${id}`);
  return el;
}

/** Cached references to the elements the UI interacts with. */
export const els = {
  url: /** @type {HTMLInputElement} */ (byId('urlInput')),
  filename: /** @type {HTMLInputElement} */ (byId('filenameInput')),
  locationText: byId('locationText'),
  progress: byId('progressContent'),
  themeBtn: byId('themeBtn'),
  qualitySelect: /** @type {HTMLSelectElement} */ (byId('qualitySelect')),
  qualityHint: byId('qualityHint'),
  advancedToggle: /** @type {HTMLInputElement} */ (byId('advancedToggle')),
  advancedBox: byId('advancedBox'),
  clearBtn: byId('clearBtn'),
  changeBtn: byId('changeBtn'),
  downloadBtn: /** @type {HTMLButtonElement} */ (byId('downloadBtn')),
};

/** Audio-format toggle buttons. */
export const formatButtons = /** @type {HTMLButtonElement[]} */ (
  Array.from(document.querySelectorAll('.format'))
);
