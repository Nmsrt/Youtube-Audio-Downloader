// @ts-check

/**
 * Extract a human-readable message from an unknown thrown value.
 * @param {unknown} err
 * @param {string} [fallback='Something went wrong']
 * @returns {string}
 */
export function errorMessage(err, fallback = 'Something went wrong') {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === 'string' && err) return err;
  return fallback;
}
