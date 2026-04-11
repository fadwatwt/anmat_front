"use client";

const ContentCard = ({ title, subtitle, toolbar, main, footer, className = "" }) => {
    return (
        // Card Container
        <div className={`flex flex-col items-start gap-4 justify-between p-4 bg-white dark:bg-gray-800 border border-status-border rounded-2xl w-full h-full ${className}`}>
            <div className="flex flex-col gap-4 justify-start w-full">
                {/* Card Header */}
                <div className="flex flex-wrap items-center gap-4 justify-between w-full border-b border-status-border p-4">
                    {/* title */}
                    <div className="flex flex-col items-start justify-start gap-1">
                        <span className="text-xl text-center text-table-title">
                            {title}
                        </span>
                        {
                            subtitle && <span className="text-md text-cell-secondary">{subtitle}</span>
                        }
                    </div>
                    {/* Header Actions */}
                    {toolbar}
                </div>

                {/* Card Content */}
                <div className="w-full p-4 justify-self-start">
                    {main}
                </div>
            </div>

            {/* Card Footer */}
            {
                footer && <div className="w-full border-t border-status-border p-4">
                    {footer}
                </div>
            }
        </div>
    );
};

export default ContentCard;