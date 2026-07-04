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
    const diffInMilliseconds = dayjs(date1).diff(dayjs(date2));
    const diffDuration = dayjs.duration(diffInMilliseconds);

    const days = Math.abs(diffDuration.days());
    const hours = Math.abs(diffDuration.hours());
    const minutes = Math.abs(diffDuration.minutes());

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

    const localeTexts = translations[currentLocale] || translations.en;
    const parts = [];
    if (days > 0) parts.push(`${days} ${localeTexts.days}`);
    if (hours > 0) parts.push(`${hours} ${localeTexts.hours}`);
    parts.push(`${minutes} ${localeTexts.minutes}`);

    return parts.join(", ");
};





export { setLanguage, translateTime,translateDate,getTimeDifference };
