import { RiLoader4Line } from '@remixicon/react';
import PropTypes from "prop-types";

export const LoadingSplash = ({ message, showProgress = true }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-t to-primary-500 from-primary-900 via-primary-600 dark:from-gray-950 dark:to-gray-900">
      <div className="flex flex-col items-center gap-6">
        <img
          src="/images/LandingPage/logoBlue.png"
          alt="Anmaat"
          className="w-20 h-20 md:w-24 md:h-24 animate-pulse-slow"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-white">أنماط | Anmaat</h1>
        
        {showProgress && (
          <div className="w-48 md:w-64 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full animate-progress-bar" />
          </div>
        )}
      </div>
    </div>
  );
};

LoadingSplash.propTypes = {
  message: PropTypes.string,
  showProgress: PropTypes.bool,
};

const Loading = ({ size = 24, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <RiLoader4Line className="animate-spin text-primary-base dark:text-primary-200" size={size} />
    </div>
  );
};

Loading.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
};

export default Loading;
