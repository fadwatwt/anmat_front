import { translateMessage } from '../notificationTranslation';

describe('request notification localization', () => {
  it('translates system enums without changing names or user reasons', () => {
    expect(translateMessage('Mona has submitted a new DAY_OFF request.', 'ar')).toBe('Mona قدم طلب إجازة يومية جديد.');
    expect(translateMessage('Your SHORT_LEAVE request status has been updated to "accepted". Reason: DAY_OFF accepted', 'ar')).toBe('تم تحديث حالة طلبك إجازة قصيرة إلى "مقبول". السبب: DAY_OFF accepted');
  });
  it('preserves English and arbitrary user content', () => {
    const text = 'DAY_OFF is the project name';
    expect(translateMessage(text, 'ar')).toBe(text);
    expect(translateMessage(text, 'en')).toBe(text);
  });
});
