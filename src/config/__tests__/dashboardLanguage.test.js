import { createInstance } from 'i18next';
import ar from '../../../public/locales/ar/translation.json';
import en from '../../../public/locales/en/translation.json';
import { AI_MODELS } from '../aiModels';

describe('Dashboard language consistency', () => {
  it('preserves interpolation parameters in both languages', () => {
    const parameters = value => (String(value).match(/\{\{.*?\}\}/g) || []).sort();
    for (const key of Object.keys(en)) {
      if (key in ar) expect({ key, parameters: parameters(ar[key]) }).toEqual({ key, parameters: parameters(en[key]) });
    }
  });

  it('translates every model description into Arabic', () => {
    for (const model of AI_MODELS) expect(ar[model.description]).toMatch(/[\u0600-\u06ff]/);
  });

  it('renders unavailable platform text and supports switching languages without a network fetch', async () => {
    const i18n = createInstance();
    await i18n.init({ lng: 'ar', resources: { ar: { translation: ar }, en: { translation: en } } });
    expect(i18n.t('Integration unavailable', { platform: i18n.t('Facebook') })).toBe('تكامل فيسبوك غير متاح');
    await i18n.changeLanguage('en');
    expect(i18n.t('Integration unavailable', { platform: 'Facebook' })).toBe('Facebook integration unavailable');
  });
});
