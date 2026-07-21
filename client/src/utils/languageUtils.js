/**
 * Utility helper to safely extract localized string from a field that can either
 * be a plain string or a multilingual object: { en: "...", hi: "...", kn: "..." }
 *
 * @param {string|object} field - The text field to localize
 * @param {string} lang - The active language code ('en', 'hi', 'kn')
 * @returns {string} The localized text string
 */
export const getLocalizedText = (field, lang = 'en') => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  
  // Standardize active language key (e.g. 'en-US' -> 'en')
  const activeLang = lang ? lang.substring(0, 2).toLowerCase() : 'en';
  
  if (typeof field === 'object') {
    return field[activeLang] || field.en || field.hi || field.kn || '';
  }
  
  return String(field);
};
