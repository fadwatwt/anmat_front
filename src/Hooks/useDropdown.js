import { useState, useEffect } from "react";

function useDropdown() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleClickOutside = (event) => {
        if (!event.target.closest(".dropdown-container")) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return [dropdownOpen, setDropdownOpen];
}

export default useDropdown;
