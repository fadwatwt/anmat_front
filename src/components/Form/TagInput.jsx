import {useState, useRef, useEffect} from "react";
import PropTypes from "prop-types";
import {createPortal} from "react-dom";

const TagInput = ({suggestions, apparent, placeholder, title, isRequired}) => {
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const inputContainerRef = useRef(null); // العنصر الذي يحيط بالـ Input والـ Tags
    const [dropdownStyle, setDropdownStyle] = useState({});

    const addTag = (person) => {
        if (!tags.find((tag) => tag.id === person.id)) {
            setTags([...tags, person]);
        }
        setInputValue("");
    };

    const removeTag = (id) => {
        setTags(tags.filter((tag) => tag.id !== id));
    };

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

    const calculateDropdownPosition = () => {
        if (inputContainerRef.current) {
            const rect = inputContainerRef.current.getBoundingClientRect();

            setDropdownStyle({
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
            });
        }
    };

    useEffect(() => {
        if (isFocused && filteredSuggestions().length > 0) {
            calculateDropdownPosition();
            window.addEventListener('resize', calculateDropdownPosition);
            window.addEventListener('scroll', calculateDropdownPosition);
        } else {
            window.removeEventListener('resize', calculateDropdownPosition);
            window.removeEventListener('scroll', calculateDropdownPosition);
        }

        return () => {
            window.removeEventListener('resize', calculateDropdownPosition);
            window.removeEventListener('scroll', calculateDropdownPosition);
        };
    }, [isFocused, inputValue]);


    const handleBlur = () => {
        setTimeout(() => setIsFocused(false), 200);
    };


    const dropdownContent = (
        <div
            style={dropdownStyle}
            className="fixed z-[9999] border dark:border-gray-700 dark:bg-gray-900 rounded-lg shadow bg-white mt-0 max-h-60 overflow-y-auto"
        >
            {filteredSuggestions().map((person) => (
                <div
                    key={person.id}
                    onMouseDown={() => addTag(person)}
                    className="flex items-center gap-2 dark:bg-gray-900 p-2 hover:bg-gray-100 cursor-pointer"
                >
                    {person.image && <img
                        src={person.image}
                        alt={person.name}
                        className="w-6 h-6 rounded-full mr-2"
                    />}
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-700 dark:text-gray-400">{person.name}</span>
                        {
                            person.email &&
                            <span className="text-xs text-gray-500 dark:text-gray-400">{person.email}</span>
                        }
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="w-full max-w-lg">
            <div className={`relative flex flex-col gap-1 w-full items-start`}>
                {title && <label className="text-gray-900 dark:text-gray-200 text-sm">
                    {title}{isRequired && <span className={"text-red-500 ms-1"}>*</span>}
                </label>}

                <div
                    ref={inputContainerRef}
                    className="relative flex crsor-pointer flex-wrap dark:bg-gray-900 gap-1 px-1 items-center border dark:border-none py-2 rounded-lg w-full"
                >
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
                            {
                                apparent ?
                                    <span className="text-sm text-primary-700 dark:text-primary-400">
                                        {tag[apparent]}
                                    </span>
                                    : <span className="text-sm text-primary-700 dark:text-primary-400">{tag.name}</span>
                            }

                            <button
                                onClick={() => removeTag(tag.id)}
                                className="text-primary-500 hover:text-red-500"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.trimStart())}
                        onFocus={() => {
                            setIsFocused(true);
                            calculateDropdownPosition();
                        }}
                        onBlur={handleBlur}
                        className="flex-grow bg-transparent focus:outline-none text-sm p-1 min-w-[150px]"
                    />
                </div>
            </div>

            {(inputValue || isFocused) && filteredSuggestions().length > 0 &&
                createPortal(
                    dropdownContent,
                    document.body
                )
            }
        </div>
    );
};

TagInput.propTypes = {
    suggestions: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    apparent: PropTypes.string,
    title: PropTypes.string,
    isRequired: PropTypes.bool
};

export default TagInput;