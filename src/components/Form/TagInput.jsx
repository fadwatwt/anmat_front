import { useState } from "react";
import PropTypes from "prop-types";

const TagInput = ({ suggestions, placeholder, title, isRequired }) => {
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false); // تتبع حالة التركيز

    // إضافة الشخص إلى العلامات
    const addTag = (person) => {
        if (!tags.find((tag) => tag.id === person.id)) {
            setTags([...tags, person]);
        }
        setInputValue("");
    };

    // حذف العلامة
    const removeTag = (id) => {
        setTags(tags.filter((tag) => tag.id !== id));
    };

    // تصفية الاقتراحات بناءً على الإدخال والعلامات الحالية
    const filteredSuggestions = () => {
        if (inputValue) {
            return suggestions.filter(
                (person) =>
                    person.name.toLowerCase().includes(inputValue.trim().toLowerCase()) &&
                    !tags.find((tag) => tag.id === person.id)
            );
        }
        if (isFocused) {
            return suggestions.filter(
                (person) => !tags.find((tag) => tag.id === person.id)
            );
        }
        return [];
    };

    return (
        <div className="w-full max-w-lg">
            <div className={`relative flex flex-col gap-1 w-full items-start`}>
                {title && <label className="text-gray-900 dark:text-gray-200 text-sm">
                    {title}{isRequired && <span className={"text-red-500 ms-1"}>*</span>}
                </label>}
                <div className="relative flex  crsor-pointer flex-wrap dark:bg-gray-900 gap-1 px-1 items-center border dark:border-none py-2 rounded-lg w-full">
                    {tags.map((tag) => (
                        <div
                            key={tag.id}
                            className="flex items-center z-25 space-x-2 bg-primary-100 dark:border-primary-800 dark:bg-primary-800 gap-2 border rounded-full px-3 py-1"
                        >
                            {tag.image && <img
                                src={tag.image}
                                alt={tag.name}
                                className="w-6 h-6 rounded-full"
                            />}
                            <span className="text-sm text-primary-700 dark:text-primary-400">{tag.name}</span>
                            <button
                                onClick={() => removeTag(tag.id)}
                                className="text-primary-500 hover:text-red-500"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.trimStart())}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        className="flex-grow bg-transparent focus:outline-none text-sm p-1 min-w-[150px]"
                    />
                </div>
            </div>
            {(inputValue || isFocused) && filteredSuggestions().length > 0 && (
                <div className="mt-2 border dark:border-gray-700 dark:bg-gray-900 rounded-lg shadow bg-white">
                    {filteredSuggestions().map((person) => (
                        <div
                            key={person.id}
                            onMouseDown={() => addTag(person)} // معالجة الإضافة عند النقر
                            className="flex items-center gap-2 dark:bg-gray-900 p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {person.image && <img
                                src={person.image}
                                alt={person.name}
                                className="w-6 h-6 rounded-full mr-2"
                            />}
                            <span className="text-sm text-gray-700 dark:text-gray-400">{person.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

TagInput.propTypes = {
    suggestions: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    title: PropTypes.string,
    isRequired: PropTypes.bool
};

export default TagInput;
