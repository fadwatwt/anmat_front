import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ar';
import 'dayjs/locale/en';
import duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const setLanguage = (language) => {
    dayjs.locale(language);
};

const translateTime = (time) => dayjs(time).fromNow();
const translateDate = (englishDate) => {
    return dayjs(englishDate).format("D MMMM، YYYY");
};

const getTimeDifference = (date1, date2) => {
    const diffInMilliseconds = dayjs(date1).diff(dayjs(date2)); // حساب الفرق بالملي ثانية
    const diffDuration = dayjs.duration(diffInMilliseconds); // تحويل الفرق إلى مدة (Duration)

    const days = Math.abs(diffDuration.days()); // الفرق بالأيام
    const hours = Math.abs(diffDuration.hours()); // الفرق بالساعات
    const minutes = Math.abs(diffDuration.minutes()); // الفرق بالدقائق

    // تحديد النصوص بناءً على اللغة الحالية
    const currentLocale = dayjs.locale();
    const translations = {
        en: {
            days: "days",
            hours: "hours",
            minutes: "minutes late",
        },
        ar: {
            days: "أيام",
            hours: "ساعات",
            minutes: "دقائق متأخر",
        },
    };

    const localeTexts = translations[currentLocale] || translations.en; // اختيار النصوص المناسبة للغة الحالية

    return `${days} ${localeTexts.days}, ${hours}:${minutes < 10 ? "0" : ""}${minutes} ${localeTexts.minutes}`;
};





export { setLanguage, translateTime,translateDate,getTimeDifference };
