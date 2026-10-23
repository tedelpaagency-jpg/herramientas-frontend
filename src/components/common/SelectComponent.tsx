// src/components/common/SelectComponent.tsx
"use client";
import useCustomSelect from "@/customHooks/useCustomSelect";
import React, { useEffect, useRef, useCallback } from "react"; // Added useCallback

interface SelectComponentProps {
  options: string[];
  placeholder?: string;
  open?: boolean;
  customClass?: string;
  onSelect?: (option: string) => void;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  options, // This is now directly compatible with useCustomSelect
  placeholder = "Select...",
  open = false,
  customClass = "",
  onSelect,
}) => {
  const {
    isOpen,
    selectedOption, // This is now `string | null`
    // openDropdown, // Typically not needed after selection, as selectOption calls closeDropdown
    closeDropdown,
    toggleDropdown,
    selectOption,
  } = useCustomSelect(options, open);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Wrap handleClickOutside in useCallback to stabilize it
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    },
    [closeDropdown] // Dependency array for useCallback
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      // Ensure listener is removed when dropdown closes
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]); // Added handleClickOutside to useEffect's dependency array

  const handleOptionSelect = (option: string) => {
    selectOption(option); // This calls closeDropdown internally
    // openDropdown(); // Removed: Calling openDropdown here would immediately reopen it after selection, which is usually not desired.
    if (onSelect) onSelect(option);
  };

  const dropdownClassName = `nice-select ${customClass} ${isOpen ? "open" : ""}`;

  return (
    <div
      className={dropdownClassName}
      tabIndex={0}
      onClick={toggleDropdown}
      ref={dropdownRef}
    >
      <span className="current">{selectedOption || placeholder}</span>
      <ul className="list">
        {options.map((option, index) => (
          <li
            key={index} // Consider using `option` itself if unique, or a stable ID for keys
            className={`option${selectedOption === option ? " selected focus" : ""}`}
            data-value={option} // data-value should probably be the option string itself for clarity
            onClick={(e) => {
              e.stopPropagation(); // Prevent the parent div's onClick (toggleDropdown) from firing
              handleOptionSelect(option);
            }}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectComponent;