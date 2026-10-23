"use client";
import React, { useEffect, useRef, useState } from "react";

interface Destination {
  name: string;
  country: string; // ISO Code
  fullCountry: string; // For display
}

const destinations: Destination[] = [
  { name: "Bali Paradaise", country: "ID", fullCountry: "Indonesia" },
  { name: "Cox's Bazar", country: "BD", fullCountry: "Bangladesh" },
  { name: "POKHARA", country: "NP", fullCountry: "Nepal" },
  { name: "Himachal", country: "IN", fullCountry: "India" },
  { name: "Sao Paulo", country: "BR", fullCountry: "Brazil" },
  { name: "Bangkok", country: "TH", fullCountry: "Thailand" },
  { name: "Barcelona", country: "ES", fullCountry: "Spain" },
  { name: "Burj Khalifa", country: "AE", fullCountry: "Dubai" },
  { name: "New York", country: "US", fullCountry: "United States" },
];

const SortNameCountrySearch: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<Destination>(destinations[0]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Toggle dropdown
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActive((prev) => !prev);
  };

  // Keep dropdown open when clicking inside
  const handleInsideClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Filter countries
  const filtered = destinations.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullCountry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Select destination
  const handleSelect = (item: Destination) => {
    setSelected(item);
    setSearchTerm("");
    setIsActive(false);
  };

  return (
    <div className="single-search-box" ref={wrapperRef}>
     <svg width={18} height={18} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path d="M12.5944 8.99987C12.5944 10.988 10.9826 12.5998 8.99443 12.5998C7.00627 12.5998 5.39465 10.988 5.39465 8.99987C5.39465 7.0117 7.00627 5.40009 8.99443 5.40009C10.9826 5.40009 12.5944 7.0117 12.5944 8.99987Z" />
          <path d="M17.4601 8.4599H16.2564C15.9858 4.86535 13.1291 2.00812 9.53458 1.7372V0.539976C9.53458 0.241723 9.29268 0 8.9946 0C8.69635 0 8.45462 0.241723 8.45462 0.539976V1.7372C4.85986 2.00812 2.00297 4.86535 1.73235 8.4599H0.540018C0.241723 8.4599 0 8.7017 0 8.99987C0 9.29813 0.241723 9.53985 0.539976 9.53985H1.73239C2.00297 13.1344 4.85991 15.9916 8.45441 16.2625V17.4601C8.45441 17.7583 8.69614 18 8.99439 18C9.29251 18 9.53428 17.7583 9.53428 17.4601V16.2625C13.1289 15.9918 15.9858 13.1346 16.2564 9.53985H17.4601C17.7583 9.53985 18 9.29813 18 8.99987C18 8.70175 17.7583 8.4599 17.4601 8.4599ZM8.99443 15.2096C5.56504 15.2094 2.78509 12.4291 2.78509 8.9997C2.78522 5.57014 5.56554 2.7902 8.99494 2.7902C12.4245 2.7902 15.2046 5.57048 15.2046 8.99987C15.2005 12.428 12.4225 15.2058 8.99443 15.2096Z" />
        </g>
      </svg>
      <div
        className="custom-select-dropdown destination-dropdown"
        onClick={handleToggle}
      >
        <input
          type="text"
          readOnly
          value={`${selected.name}, ${selected.fullCountry}`}
        />
        <div className="input-field-value">
          <div className="destination">
            <h6>{selected.name}</h6>
            <span>{selected.fullCountry}</span>
          </div>
        </div>
      </div>

      {/* Dropdown Body */}
      {isActive && (
        <div className="custom-select-wrap three active" onClick={handleInsideClick}>
          <div className="custom-select-search-area">
            <i className="bx bx-search" />
            <input
              type="text"
              placeholder="Type Your Destination"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ul className="option-list-destination">
            {filtered.length > 0 ? (
              filtered.map((item, index) => (
                <li key={index} onClick={() => handleSelect(item)}>
                  <div className="tour">
                    <span>{item.country}</span>
                  </div>
                  <div className="destination">
                    <h6>{item.name}</h6>
                    <span>{item.fullCountry}</span>
                  </div>
                </li>
              ))
            ) : (
              <li>
                <div className="destination">
                  <h6>No results found</h6>
                </div>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortNameCountrySearch;
