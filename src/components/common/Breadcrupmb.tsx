"use client";
import Link from "next/link";
import React from "react";

type BreadcrumbProps = {
  title: string; 
  currentPage: string; 
  bgImage?: string;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ title, currentPage,bgImage }) => {
  return (
    <div
      className="breadcrumb-section"
      style={{
        backgroundImage:
          `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(/assets/img/innerpages/${bgImage})`,
      }}
    >
      <div className="container">
        <div className="banner-content">
          <h1>{title}</h1>
          <ul className="breadcrumb-list">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>{currentPage}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
