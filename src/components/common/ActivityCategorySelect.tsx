"use client";
import React, { useState, useRef, useEffect } from "react";

const ActivityCategorySelect: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("Scuba Diving");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activities: string[] = [
    "Water Rafting",
    "Surfing",
    "Zip-lining",
    "Paragliding",
    "Snowboarding",
    "Bungee Jumping",
    "Rock Climbing",
  ];

  // Close dropdown when clicking outside
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

  const handleSelect = (activity: string) => {
    setSelectedActivity(activity);
    setIsOpen(false);
  };

  return (
    <div className="single-search-box" ref={dropdownRef}>
         <svg width={20} height={20} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.3023 4.186H9.99992C9.81489 4.186 9.63743 4.1125 9.50659 3.98166C9.37575 3.85082 9.30225 3.67336 9.30225 3.48833C9.30225 3.30329 9.37575 3.12583 9.50659 2.99499C9.63743 2.86415 9.81489 2.79065 9.99992 2.79065H19.3023C19.4873 2.79065 19.6648 2.86415 19.7956 2.99499C19.9265 3.12583 20 3.30329 20 3.48833C20 3.67336 19.9265 3.85082 19.7956 3.98166C19.6648 4.1125 19.4873 4.186 19.3023 4.186ZM17.4418 7.90695H9.99992C9.81489 7.90695 9.63743 7.83344 9.50659 7.7026C9.37575 7.57176 9.30225 7.39431 9.30225 7.20927C9.30225 7.02424 9.37575 6.84678 9.50659 6.71594C9.63743 6.5851 9.81489 6.5116 9.99992 6.5116H17.4418C17.6269 6.5116 17.8043 6.5851 17.9351 6.71594C18.066 6.84678 18.1395 7.02424 18.1395 7.20927C18.1395 7.39431 18.066 7.57176 17.9351 7.7026C17.8043 7.83344 17.6269 7.90695 17.4418 7.90695ZM19.3023 13.4884H9.99992C9.81489 13.4884 9.63743 13.4149 9.50659 13.284C9.37575 13.1532 9.30225 12.9757 9.30225 12.7907C9.30225 12.6057 9.37575 12.4282 9.50659 12.2974C9.63743 12.1665 9.81489 12.093 9.99992 12.093H19.3023C19.4873 12.093 19.6648 12.1665 19.7956 12.2974C19.9265 12.4282 20 12.6057 20 12.7907C20 12.9757 19.9265 13.1532 19.7956 13.284C19.6648 13.4149 19.4873 13.4884 19.3023 13.4884ZM17.4418 17.2093H9.99992C9.81489 17.2093 9.63743 17.1358 9.50659 17.005C9.37575 16.8741 9.30225 16.6967 9.30225 16.5116C9.30225 16.3266 9.37575 16.1491 9.50659 16.0183C9.63743 15.8875 9.81489 15.814 9.99992 15.814H17.4418C17.6269 15.814 17.8043 15.8875 17.9351 16.0183C18.066 16.1491 18.1395 16.3266 18.1395 16.5116C18.1395 16.6967 18.066 16.8741 17.9351 17.005C17.8043 17.1358 17.6269 17.2093 17.4418 17.2093Z" />
                  <path d="M3.48839 8.83719C5.41497 8.83719 6.97677 7.27538 6.97677 5.3488C6.97677 3.42222 5.41497 1.86041 3.48839 1.86041C1.5618 1.86041 0 3.42222 0 5.3488C0 7.27538 1.5618 8.83719 3.48839 8.83719Z" />
                  <path d="M3.48839 18.1396C5.41497 18.1396 6.97677 16.5778 6.97677 14.6512C6.97677 12.7246 5.41497 11.1628 3.48839 11.1628C1.5618 11.1628 0 12.7246 0 14.6512C0 16.5778 1.5618 18.1396 3.48839 18.1396Z" />
                </svg>
      <div
        className="custom-select-dropdown"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <input type="text" readOnly value={selectedActivity} />
        <span>Activity Category</span>
      </div>

      <div
        className={`custom-select-wrap two no-scroll ${
          isOpen ? "active" : ""
        }`}
      >
        <ul className="option-list">
          {activities.map((activity) => (
            <li
              key={activity}
              className="single-item"
              onClick={() => handleSelect(activity)}
            >
              <h6>{activity}</h6>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ActivityCategorySelect;
