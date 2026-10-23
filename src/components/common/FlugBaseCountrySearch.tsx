"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

interface Country {
  name: string;
  flag: string;
}

const countries: Country[] = [
  { name: "Bangladesh", flag: "/assets/img/home1/filter-bd-flag.png" },
  { name: "Indonesia", flag: "/assets/img/home1/filter-indo-flag.png" },
  { name: "Nepal", flag: "/assets/img/home1/filter-nepal-flag.png" },
  { name: "India", flag: "/assets/img/home1/filter-india-flag.png" },
  { name: "Brazil", flag: "/assets/img/home1/filter-brazil-flag.png" },
  { name: "Thailand", flag: "/assets/img/home1/filter-thailand-flag.png" },
  { name: "Spain", flag: "/assets/img/home1/filter-spain-flag.png" },
  { name: "Dubai", flag: "/assets/img/home1/filter-uae-flag.png" },
  { name: "United States", flag: "/assets/img/home1/filter-usa-flag.png" },
];

const FlugBaseCountrySearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtered countries
  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="single-search-box" ref={dropdownRef}>
       <svg width={18} height={18} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path d="M12.5944 8.99987C12.5944 10.988 10.9826 12.5998 8.99443 12.5998C7.00627 12.5998 5.39465 10.988 5.39465 8.99987C5.39465 7.0117 7.00627 5.40009 8.99443 5.40009C10.9826 5.40009 12.5944 7.0117 12.5944 8.99987Z" />
                  <path d="M17.4601 8.4599H16.2564C15.9858 4.86535 13.1291 2.00812 9.53458 1.7372V0.539976C9.53458 0.241723 9.29268 0 8.9946 0C8.69635 0 8.45462 0.241723 8.45462 0.539976V1.7372C4.85986 2.00812 2.00297 4.86535 1.73235 8.4599H0.540018C0.241723 8.4599 0 8.7017 0 8.99987C0 9.29813 0.241723 9.53985 0.539976 9.53985H1.73239C2.00297 13.1344 4.85991 15.9916 8.45441 16.2625V17.4601C8.45441 17.7583 8.69614 18 8.99439 18C9.29251 18 9.53428 17.7583 9.53428 17.4601V16.2625C13.1289 15.9918 15.9858 13.1346 16.2564 9.53985H17.4601C17.7583 9.53985 18 9.29813 18 8.99987C18 8.70175 17.7583 8.4599 17.4601 8.4599ZM8.99443 15.2096C5.56504 15.2094 2.78509 12.4291 2.78509 8.9997C2.78522 5.57014 5.56554 2.7902 8.99494 2.7902C12.4245 2.7902 15.2046 5.57048 15.2046 8.99987C15.2005 12.428 12.4225 15.2058 8.99443 15.2096Z" />
                </g>
              </svg>
      <div
        className="custom-select-dropdown"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <input type="text" readOnly value={selectedCountry.name} />
        <span>Country</span>
      </div>

      {/* Dropdown list */}
      {isOpen && (
        <div className="custom-select-wrap active">
          <div className="custom-select-search-area">
            <i className="bx bx-search" />
            <input
              type="text"
              placeholder="Type Your Destination"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()} // prevent closing
            />
          </div>
          <ul className="option-list visa-list">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <li
                  key={country.name}
                  onClick={() => handleSelect(country)}
                  className={
                    country.name === selectedCountry.name ? "active" : ""
                  }
                >
                  <div className="destination">
                    <h6>{country.name}</h6>
                  </div>
                  <div className="flag">
                    <Image width={550} height={220} src={country.flag} alt={country.name} />
                  </div>
                </li>
              ))
            ) : (
              <li className="no-result">
                <div className="destination">
                  <h6>No Country Found</h6>
                </div>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FlugBaseCountrySearch;
