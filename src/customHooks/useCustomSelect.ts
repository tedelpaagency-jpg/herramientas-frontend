// customHooks/useCustomSelect.ts
import { useState, useCallback, useEffect } from "react";

// No CustomSelectOption interface here, as we're handling strings directly

interface UseCustomSelectReturn {
  isOpen: boolean;
  selectedOption: string | null; // Selected option is now a string or null
  options: string[]; // Options are strings
  openDropdown: () => void;
  closeDropdown: () => void;
  toggleDropdown: () => void;
  selectOption: (option: string) => void; // selectOption now accepts a string
}

const useCustomSelect = (
  initialOptions: string[], // Expects an array of strings
  isOpenByDefault: boolean = false
): UseCustomSelectReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(isOpenByDefault);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // If there are initial options and no selected option, set the first one
  useEffect(() => {
    if (!selectedOption && initialOptions.length > 0) {
      setSelectedOption(initialOptions[0]);
    }
  }, [initialOptions, selectedOption]);

  const openDropdown = useCallback(() => setIsOpen(true), []);
  const closeDropdown = useCallback(() => setIsOpen(false), []);
  const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);
  const selectOption = useCallback((option: string) => {
    setSelectedOption(option);
    closeDropdown(); // Close the dropdown after selecting an option
  }, [closeDropdown]); // Depend on closeDropdown

  return {
    isOpen,
    selectedOption,
    options: initialOptions, // Simply return the initial options as they are strings
    openDropdown,
    closeDropdown,
    toggleDropdown,
    selectOption,
  };
};

export default useCustomSelect;