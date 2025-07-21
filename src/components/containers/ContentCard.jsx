"use client";

const ContentCard = ({ title, subtitle, toolbar, main, footer }) => {
    return (
        // Card Container
        <div className="flex flex-col items-start justify-start gap-8 p-4 bg-white dark:bg-gray-800 border border-gray-200 rounded-2xl w-full h-full">
            {/* Card Header */}
            <div className="flex flex-wrap items-center gap-4 justify-between w-full border-b border-gray-50 p-4">
                {/* title */}
                <div className="flex flex-col items-start justify-start gap-1">
                    <span className="text-xl text-center text-gray-900 dark:text-gray-500">
                        {title}
                    </span>
                    {
                        subtitle && <span className="text-md text-gray-500">{subtitle}</span>
                    }
                </div>
                {/* Header Actions */}
                {toolbar}
            </div>

            {/* Card Content */}
            <div className="w-full p-4">
                {main}
            </div>

            {/* Card Footer */}
            {
                footer && <div className="w-full border-t border-gray-100 p-4">
                    {footer}
                </div>
            }
        </div>
    );
};

export default ContentCard;