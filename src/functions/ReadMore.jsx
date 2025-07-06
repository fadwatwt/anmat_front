import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function ReadMore({ maxLength, htmlContent, children }) {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleReadMore = () => setIsExpanded(!isExpanded);

    const MAX_LENGTH = maxLength || 50;

    // تحديد المصدر: إما htmlContent أو children
    const content = htmlContent ? htmlContent : children;

    // تقطيع النصوص (لـ htmlContent كسلسلة أو children كمصفوفة)
    const truncatedContent =
        typeof content === "string"
            ? content.slice(0, MAX_LENGTH)
            : Array.isArray(content)
                ? content.slice(0, MAX_LENGTH)
                : content;

    return (
        <>
            {/* عرض المحتوى بناءً على نوعه */}
            {htmlContent ? (
                <div
                    dangerouslySetInnerHTML={{
                        __html: isExpanded
                            ? htmlContent
                            : truncatedContent + (htmlContent.length > MAX_LENGTH ? "..." : ""),
                    }}
                />
            ) : (
                <div>
                    {isExpanded ? content : truncatedContent}
                    {!isExpanded && content.length > MAX_LENGTH && "..."}
                </div>
            )}
            {/* زر التبديل */}
            {content.length > MAX_LENGTH && (
                <span
                    className="text-primary-base text-sm dark:text-primary-200 cursor-pointer"
                    onClick={toggleReadMore}
                >
                    {isExpanded ? t("Read Less") : t("Read More")}
                </span>
            )}
        </>
    );
}

ReadMore.propTypes = {
    maxLength: PropTypes.number,
    htmlContent: PropTypes.string, // النصوص بصيغة HTML
    children: PropTypes.node, // عناصر JSX
};

export default ReadMore;
