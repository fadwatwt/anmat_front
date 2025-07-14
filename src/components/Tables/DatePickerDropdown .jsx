import React, { useState, useRef, useEffect } from 'react';
import { TfiCalendar } from 'react-icons/tfi';

const DatePickerDropdown = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const handleDateChange = (value) => {
    setSelectedDate(value);
    setIsDropdownOpen(false);
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative w-fit" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <div
        className="flex items-center justify-between w-full p-3 border-2 rounded-lg cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={toggleDropdown}
      >
        <span
          className={`text-sm ${
            selectedDate ? "text-gray-700" : "text-gray-500"
          }`}
        >
          {selectedDate || "Select Date"}
        </span>
        <TfiCalendar size={18} />
      </div>
      
      {/* Date Picker Dropdown */}
      {isDropdownOpen && (
        <div className="absolute z-10 w-64 mt-2 bg-white border rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="p-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePickerDropdown;
