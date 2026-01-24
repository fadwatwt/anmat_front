import React from "react";
import PropTypes from "prop-types";

function Progress({ percentage }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[30px]">
                {percentage}%
            </span>
            {/* Optional: Add a small bar if needed, but the screenshot just showed text "20 %" mostly. 
          But "Progress" implies a visual usually. I'll add a minimal bar. */}
            {/* Remove visual bar if strict adherence to "text only" from quick glance, 
           but usually user wants "Progress" to look like progress. 
           I will return just text for now to match simplicity if that's what was seen. 
           Wait, "20 %" is text. */}
        </div>
    );
}

Progress.propTypes = {
    percentage: PropTypes.number.isRequired,
};

export default Progress;
