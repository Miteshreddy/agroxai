import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateText, translateBatch } from '../utils/translate';

/**
 * Hook for translating text programmatically.
 *
 * Returns { t, tBatch, language } where:
 *   t(text)         — returns a Promise<string>
 *   tBatch([texts]) — returns a Promise<string[]>
 *   language        — current language code
 *
 * Example:
 *   const { t } = useTranslate();
 *   const [label, setLabel] = useState('Loading');
 *   useEffect(() => { t('Hello').then(setLabel); }, []);
 */
const useTranslate = () => {
  const { language } = useLanguage();

  const t = useCallback((text) => {
    return translateText(text, language);
  }, [language]);

  const tBatch = useCallback((texts) => {
    return translateBatch(texts, language);
  }, [language]);

  return { t, tBatch, language };
};

/**
 * Hook that maintains translated versions of multiple static strings,
 * refreshing whenever the language changes.
 *
 * Usage:
 *   const { str } = useTranslated({
 *     greeting: 'Hello world',
 *     buttonLabel: 'Get Recommendation',
 *   });
 *   <button>{str.buttonLabel}</button>
 */
export const useTranslated = (strings) => {
  const { language } = useLanguage();
  const [str, setStr] = useState(strings);

  useEffect(() => {
    if (language === 'en') {
      setStr(strings);
      return;
    }
    let cancelled = false;
    const keys = Object.keys(strings);
    const values = Object.values(strings);
    translateBatch(values, language).then(translated => {
      if (cancelled) return;
      const result = {};
      keys.forEach((k, i) => { result[k] = translated[i]; });
      setStr(result);
    });
    return () => { cancelled = true; };
  }, [language]);

  return { str };
};

export default useTranslate;
