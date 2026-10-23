"use client";
import React, { useState, useRef, useEffect } from "react";

const TourCategorySelect: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Family Tour");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories: string[] = [
    "Family Tour",
    "Honeymoon Tour",
    "Group Tour",
    "Adventure Tour",
    "Solo Tour",
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (category: string) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  return (
    <div className="single-search-box" ref={dropdownRef}>
      <div
        className="custom-select-dropdown"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <input type="text" readOnly value={selectedCategory} />
        <span>Category</span>
      </div>

      <div
        className={`custom-select-wrap two ${isOpen ? "active" : ""}`}
      >
        <ul className="option-list">
          {categories.map((category) => (
            <li
              key={category}
              className="single-item"
              onClick={() => handleSelect(category)}
            >
              <h6>{category}</h6>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TourCategorySelect;
