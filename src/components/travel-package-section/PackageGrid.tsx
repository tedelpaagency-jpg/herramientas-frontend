"use client";
import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import SelectComponent from "../common/SelectComponent";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { SwiperOptions } from "swiper/types";

const PackageGrid = () => {
     useEffect(() => {
    const listItems = document.querySelectorAll(".grid-view li");
    const targetDiv = document.querySelector(".list-grid-product-wrap");

    const handleClick = (e: Event) => {
      const clicked = e.currentTarget as HTMLElement;
      const clickedClass = clicked.getAttribute("class") || "";
      const className = clickedClass.replace("item-", "");

      // Update the wrapper div classes
      if (targetDiv) {
        targetDiv.className = `list-grid-product-wrap ${className}-wrapper`;
      }

      // Remove 'active' from siblings
      listItems.forEach((li) => li.classList.remove("active"));

      // Add 'active' to clicked element
      clicked.classList.add("active");
    };

    // Attach event listeners
    listItems.forEach((li) => li.addEventListener("click", handleClick));

    // Cleanup (important to avoid memory leaks)
    return () => {
      listItems.forEach((li) => li.removeEventListener("click", handleClick));
    };
  }, []);
  useEffect(() => {
    const expandButtons = document.querySelectorAll(
      ".checkbox-container span.expand"
    );

    const handleExpand = (e: Event) => {
      const containerTwo = document.querySelector(
        ".checkbox-container.two ul"
      ) as HTMLElement;
      const clickedExpand = e.currentTarget as HTMLElement;

      if (containerTwo) {
        containerTwo.style.height = "auto"; // ✅ expand list
      }
      if (clickedExpand) {
        clickedExpand.style.display = "none"; // ✅ hide button
      }
    };

    // Attach event listeners
    expandButtons.forEach((btn) => btn.addEventListener("click", handleExpand));

    // Cleanup on unmount
    return () => {
      expandButtons.forEach((btn) =>
        btn.removeEventListener("click", handleExpand)
      );
    };
  }, []);
  const pagination1: SwiperOptions = useMemo(() => {
    return {
      pagination: {
        el: `.package-card-img-pagi-1`,
        clickable: true,
      },
    };
  }, []);
  const pagination2: SwiperOptions = useMemo(() => {
    return {
      pagination: {
        el: `.package-card-img-pagi-2`,
        clickable: true,
      },
    };
  }, []);
  const pagination3: SwiperOptions = useMemo(() => {
    return {
      pagination: {
        el: `.package-card-img-pagi-3`,
        clickable: true,
      },
    };
  }, []);
  const settings: SwiperOptions = useMemo(() => {
    return {
      slidesPerView: "auto",
      speed: 1500,
      spaceBetween: 24,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      pagination: {
        el: `.package-card-img-pagi}`,
        clickable: true,
      },
      autoplay: {
        delay: 1500,
        disableOnInteraction: false,
      },
    };
  }, []);
  return (
    <>
      <div className="package-grid-page pt-100 mb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="package-sidebar-area">
                <div className="sidebar-wrapper">
                  <div className="title-area">
                    <h5>Filter</h5>
                    <span id="clear-filters">Clear All</span>
                  </div>
                  <div className="single-widgets">
                    <div className="widget-title">
                      <h5>Destinations</h5>
                    </div>
                    <div className="checkbox-container">
                      <ul>
                        <li className="sidebar-category-dropdown">
                          <label className="containerss">
                            <input type="checkbox" />
                            <span className="checkmark" />
                            <strong>Europe</strong>
                          </label>
                          <ul className="sub-category">
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Paris, France</span> <span>08</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Rome, Italy</span> <span>12</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>United Kingdom</span> <span>15</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Netherlands</span> <span>02</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Portugal</span> <span>10</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Germany</span> <span>12</span>
                                </strong>
                              </label>
                            </li>
                          </ul>
                          <i className="bi bi-caret-right-fill sidebar-category-icon active" />
                        </li>
                        <li className="sidebar-category-dropdown">
                          <label className="containerss">
                            <input type="checkbox" />
                            <span className="checkmark" />
                            <strong>Asia</strong>
                          </label>
                          <ul className="sub-category">
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Tokyo, Japan</span> <span>15</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Indonesia</span> <span>07</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Thailand</span> <span>18</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Malaysia</span> <span>08</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Hanoi, Vietnam</span> <span>10</span>
                                </strong>
                              </label>
                            </li>
                          </ul>
                          <i className="bi bi-caret-right-fill sidebar-category-icon" />
                        </li>
                        <li className="sidebar-category-dropdown">
                          <label className="containerss">
                            <input type="checkbox" />
                            <span className="checkmark" />
                            <strong>Africa</strong>
                          </label>
                          <ul className="sub-category">
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Egypt</span> <span>05</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>South Africa</span> <span>07</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Thailand</span> <span>18</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Zimbabwe</span> <span>02</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Morocco</span> <span>12</span>
                                </strong>
                              </label>
                            </li>
                          </ul>
                          <i className="bi bi-caret-right-fill sidebar-category-icon" />
                        </li>
                        <li className="sidebar-category-dropdown">
                          <label className="containerss">
                            <input type="checkbox" />
                            <span className="checkmark" />
                            <strong>North America</strong>
                          </label>
                          <ul className="sub-category">
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>United States</span> <span>20</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Canada</span> <span>08</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Mexico</span> <span>13</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Costa Rica</span> <span>06</span>
                                </strong>
                              </label>
                            </li>
                          </ul>
                          <i className="bi bi-caret-right-fill sidebar-category-icon" />
                        </li>
                        <li className="sidebar-category-dropdown">
                          <label className="containerss">
                            <input type="checkbox" />
                            <span className="checkmark" />
                            <strong>Oceania</strong>
                          </label>
                          <ul className="sub-category">
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Australia</span> <span>12</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>New Zealand</span> <span>08</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Papua New Guinea</span> <span>14</span>
                                </strong>
                              </label>
                            </li>
                          </ul>
                          <i className="bi bi-caret-right-fill sidebar-category-icon" />
                        </li>
                        <li className="sidebar-category-dropdown">
                          <label className="containerss">
                            <input type="checkbox" />
                            <span className="checkmark" />
                            <strong>Middle East</strong>
                          </label>
                          <ul className="sub-category">
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>United Arab Emirates</span>{" "}
                                  <span>04</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Qatar</span> <span>06</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Saudi Arabia</span> <span>13</span>
                                </strong>
                              </label>
                            </li>
                            <li>
                              <label className="containerss">
                                <input type="checkbox" />
                                <span className="checkmark" />
                                <strong>
                                  <span>Jordan</span> <span>03</span>
                                </strong>
                              </label>
                            </li>
                          </ul>
                          <i className="bi bi-caret-right-fill sidebar-category-icon" />
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="single-widgets">
                    <div className="widget-title">
                      <h5>Tour Type</h5>
                    </div>
                    <ul className="tour-type">
                      <li>Group Tours</li>
                      <li>Small Group</li>
                      <li>Family</li>
                      <li>Single Tours</li>
                      <li>Private Tours</li>
                    </ul>
                  </div>
                  {/* <div className="single-widgets">
                    <div className="widget-title">
                      <h5>Pricing</h5>
                    </div>
                    <div className="range-wrap">
                      <div className="row">
                        <div className="col-sm-12">
                          <form>
                            <input type="hidden" name="min-value" />
                            <input type="hidden" name="max-value" />
                          </form>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12">
                          <div id="slider-range" />
                        </div>
                      </div>
                      <div className="slider-labels">
                        <div className="caption">
                          <span id="slider-range-value1" />
                        </div>
                        <div className="caption">
                          <span id="slider-range-value2" />
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="single-widgets">
                    <div className="widget-title">
                      <h5>Activities</h5>
                    </div>
                    <div className="checkbox-container two">
                      <ul className="experience">
                        <li>
                          <label className="containerss">
                            <input type="checkbox" />
                            <span className="checkmark" />
                            <strong>
                              <span>Hiking &amp; Trekking</span> <span>04</span>
                            </strong>
                          </label>
                        </li>
                        <li>
                          <label className="containerss">
                            <input type="checkbox" />
                            <span className="checkmark" />
                            <strong>
                              <span>Rock Climbing</span> <span>06</span>
                            </strong>
                          </label>
                        </li>
                        <li>
                          <label className="containerss">
                            <input type="checkbox" />
                            <span className="checkmark" />
                            <strong>
                              <span>Zip-lining</span> <span>02</span>
                            </strong>
                          </label>
                        </li>
                        <li>
                          <label className="containerss">
                            <input type="checkbox" />
                            <span className="checkmark" />
                            <strong>
                              <span>Bungee Jumping</span> <span>07</span>
                            </strong>
                          </label>
                        </li>
                        <li>
                          <label className="containerss">
                            <input type="checkbox" />
                            <span className="checkmark" />
                            <strong>
                              <span>Paragliding</span> <span>12</span>
                            </strong>
                          </label>
                        </li>
                        <li>
                          <label className="containerss">
                            <input type="checkbox" />
                            <span className="checkmark" />
                            <strong>
                              <span>Skydiving</span> <span>06</span>
                            </strong>
                          </label>
                        </li>
                        <li>
                          <label className="containerss">
                            <input type="checkbox" />
                            <span className="checkmark" />
                            <strong>
                              <span>Surfing</span> <span>08</span>
                            </strong>
                          </label>
                        </li>
                      </ul>
                      <span className="expand">See More +</span>
                    </div>
                  </div>
                  <div className="single-widgets">
                    <div className="widget-title">
                      <h5>Discount &amp; Offer</h5>
                    </div>
                    <div className="checkbox-container two">
                      <ul>
                        <li>
                          <label className="containerss">
                            <input type="checkbox" />
                            <span className="checkmark" />
                            <strong>
                              <span>Special Offer</span> <span>04</span>
                            </strong>
                          </label>
                        </li>
                        <li>
                          <label className="containerss">
                            <input type="checkbox" />
                            <span className="checkmark" />
                            <strong>
                              <span>Last Minutes Deal</span> <span>06</span>
                            </strong>
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="package-grid-top-area">
                <span>
                  <strong>70</strong> Unforgettable Journeys Await!
                </span>
                <div className="selector-and-list-grid-area">
                  <div className="filter-btn d-lg-none d-flex">
                    <svg
                      width={18}
                      height={18}
                      viewBox="0 0 18 18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_456_25)">
                        <path d="M0.5625 3.17317H9.12674C9.38486 4.34806 10.4341 5.2301 11.6853 5.2301C12.9366 5.2301 13.9858 4.3481 14.2439 3.17317H17.4375C17.7481 3.17317 18 2.92131 18 2.61067C18 2.30003 17.7481 2.04817 17.4375 2.04817H14.2437C13.9851 0.873885 12.9344 -0.00871277 11.6853 -0.00871277C10.4356 -0.00871277 9.38545 0.873744 9.12695 2.04817H0.5625C0.251859 2.04817 0 2.30003 0 2.61067C0 2.92131 0.251859 3.17317 0.5625 3.17317ZM10.191 2.61215L10.191 2.6061C10.1935 1.78461 10.8638 1.11632 11.6853 1.11632C12.5057 1.11632 13.1761 1.78369 13.1796 2.6048L13.1797 2.61306C13.1784 3.43597 12.5086 4.10513 11.6853 4.10513C10.8625 4.10513 10.1928 3.43663 10.191 2.61422L10.191 2.61215ZM17.4375 14.8268H14.2437C13.985 13.6525 12.9344 12.7699 11.6853 12.7699C10.4356 12.7699 9.38545 13.6524 9.12695 14.8268H0.5625C0.251859 14.8268 0 15.0786 0 15.3893C0 15.7 0.251859 15.9518 0.5625 15.9518H9.12674C9.38486 17.1267 10.4341 18.0087 11.6853 18.0087C12.9366 18.0087 13.9858 17.1267 14.2439 15.9518H17.4375C17.7481 15.9518 18 15.7 18 15.3893C18 15.0786 17.7481 14.8268 17.4375 14.8268ZM11.6853 16.8837C10.8625 16.8837 10.1928 16.2152 10.191 15.3928L10.191 15.3908L10.191 15.3847C10.1935 14.5632 10.8638 13.8949 11.6853 13.8949C12.5057 13.8949 13.1761 14.5623 13.1796 15.3834L13.1797 15.3916C13.1785 16.2146 12.5086 16.8837 11.6853 16.8837ZM17.4375 8.43751H8.87326C8.61514 7.26262 7.56594 6.38062 6.31466 6.38062C5.06338 6.38062 4.01418 7.26262 3.75606 8.43751H0.5625C0.251859 8.43751 0 8.68936 0 9.00001C0 9.31068 0.251859 9.56251 0.5625 9.56251H3.75634C4.01498 10.7368 5.06559 11.6194 6.31466 11.6194C7.56439 11.6194 8.61455 10.7369 8.87305 9.56251H17.4375C17.7481 9.56251 18 9.31068 18 9.00001C18 8.68936 17.7481 8.43751 17.4375 8.43751ZM7.80901 8.99853L7.80898 9.00458C7.80652 9.82607 7.13619 10.4944 6.31466 10.4944C5.49429 10.4944 4.82393 9.82699 4.82038 9.00591L4.82027 8.99769C4.8215 8.17468 5.49141 7.50562 6.31466 7.50562C7.13753 7.50562 7.80718 8.17408 7.80905 8.99653L7.80901 8.99853Z"></path>
                      </g>
                    </svg>
                    <span>Filters</span>
                  </div>
                  <div className="selector-area">
                    <span>Sort By:</span>
                    <SelectComponent
                      options={[
                        "latest",
                        "Price High",
                        "Price High",
                        "Price Low",
                      ]}
                      placeholder="Default"
                      customClass="my-select"
                    />
                  </div>
                  <ul className="grid-view d-md-flex d-none">
                    <li className="column-2 active">
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 18 18"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M4 11C5.65685 11 7 12.3431 7 14C7 15.6569 5.65685 17 4 17C2.34315 17 1 15.6569 1 14C1 12.3431 2.34315 11 4 11ZM14 11C15.6569 11 17 12.3431 17 14C17 15.6569 15.6569 17 14 17C12.3431 17 11 15.6569 11 14C11 12.3431 12.3431 11 14 11ZM4 1C5.65685 1 7 2.34315 7 4C7 5.65685 5.65685 7 4 7C2.34315 7 1 5.65685 1 4C1 2.34315 2.34315 1 4 1ZM14 1C15.6569 1 17 2.34315 17 4C17 5.65685 15.6569 7 14 7C12.3431 7 11 5.65685 11 4C11 2.34315 12.3431 1 14 1Z" />
                      </svg>
                    </li>
                    <li className="column-1">
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 18 18"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.25 9.95007H0.75C0.336 9.95007 0 9.61407 0 9.20007C0 8.78607 0.336 8.45007 0.75 8.45007H17.25C17.664 8.45007 18 8.78607 18 9.20007C18 9.61407 17.664 9.95007 17.25 9.95007ZM17.25 4.20001H0.75C0.336 4.20001 0 3.86401 0 3.45001C0 3.03601 0.336 2.70001 0.75 2.70001H17.25C17.664 2.70001 18 3.03601 18 3.45001C18 3.86401 17.664 4.20001 17.25 4.20001ZM17.25 15.6999H0.75C0.336 15.6999 0 15.3639 0 14.9499C0 14.5359 0.336 14.1999 0.75 14.1999H17.25C17.664 14.1999 18 14.5359 18 14.9499C18 15.3639 17.664 15.6999 17.25 15.6999Z" />
                      </svg>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="list-grid-product-wrap">
                <div className="row gy-md-5 gy-4">
                  <div
                    className="col-md-6 item wow animate fadeInDown"
                    data-wow-delay="200ms"
                    data-wow-duration="1500ms"
                  >
                    <div className="package-card">
                      <div className="package-img-wrap">
                        <Link
                          href="/experience-details"
                          className="package-img"
                        >
                          <Image
                            width={395}
                            height={235}
                            src="/assets/img/home6/tour-package-img1.jpg"
                            alt=""
                          />
                        </Link>
                        <div className="batch">
                          <span>Sale on!</span>
                        </div>
                      </div>
                      <div className="package-content">
                        <h5>
                          <Link href="/experience-details">
                            Zip-lining &amp; Canopy
                          </Link>
                        </h5>
                        <div className="location-and-time">
                          <div className="location">
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M6.83615 0C3.77766 0 1.28891 2.48879 1.28891 5.54892C1.28891 7.93837 4.6241 11.8351 6.05811 13.3994C6.25669 13.6175 6.54154 13.7411 6.83615 13.7411C7.13076 13.7411 7.41561 13.6175 7.6142 13.3994C9.04821 11.8351 12.3834 7.93833 12.3834 5.54892C12.3834 2.48879 9.89464 0 6.83615 0ZM7.31469 13.1243C7.18936 13.2594 7.02008 13.3342 6.83615 13.3342C6.65222 13.3342 6.48295 13.2594 6.35761 13.1243C4.95614 11.5959 1.69584 7.79515 1.69584 5.54896C1.69584 2.7134 4.00067 0.406933 6.83615 0.406933C9.67164 0.406933 11.9765 2.7134 11.9765 5.54896C11.9765 7.79515 8.71617 11.5959 7.31469 13.1243Z" />
                              <path d="M6.83618 8.54554C8.4624 8.54554 9.7807 7.22723 9.7807 5.60102C9.7807 3.9748 8.4624 2.65649 6.83618 2.65649C5.20997 2.65649 3.89166 3.9748 3.89166 5.60102C3.89166 7.22723 5.20997 8.54554 6.83618 8.54554Z" />
                            </svg>
                            <Link href="/experience-grid">
                              Himachal Pradesh, India
                            </Link>
                          </div>
                          <svg
                            className="arrow"
                            width={25}
                            height={6}
                            viewBox="0 0 25 6"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 3L5 5.88675V0.113249L0 3ZM25 3L20 0.113249V5.88675L25 3ZM4.5 3.5H20.5V2.5H4.5V3.5Z" />
                          </svg>
                          <span>01 Hour</span>
                        </div>
                        <ul className="package-info">
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Thrilling Aerial Adventure
                          </li>
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Breathtaking Scenic Views
                          </li>
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Multiple Zip Lines &amp; Canopy Walkways
                          </li>
                        </ul>
                        <div className="btn-and-price-area">
                          <Link
                            href="/experience-details"
                            className="primary-btn1"
                          >
                            <span>
                              Book Now
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                              </svg>
                            </span>
                            <span>
                              Book Now
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                              </svg>
                            </span>
                          </Link>
                          <div className="price-area">
                            <h6>Per Person</h6>
                            <span>$99</span>
                          </div>
                        </div>
                        <svg
                          className="divider"
                          height={6}
                          viewBox="0 0 374 6"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5 2.5L0 0.113249V5.88675L5 3.5V2.5ZM369 3.5L374 5.88675V0.113249L369 2.5V3.5ZM4.5 3.5H369.5V2.5H4.5V3.5Z" />
                        </svg>
                        <div className="bottom-area">
                          <ul>
                            <li>
                              <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.2732 12.9807H6.7268C6.68429 12.9807 6.64298 12.9666 6.60935 12.9406C6.55906 12.9018 5.36398 11.9718 4.14989 10.4857C3.43499 9.61078 2.86499 8.72565 2.45543 7.8549C1.93974 6.75846 1.67834 5.68141 1.67834 4.65329C1.67834 3.50657 2.36043 2.33394 3.54995 1.43595C4.1378 0.992226 4.81163 0.641781 5.55321 0.394396C6.33797 0.132617 7.16112 0 8 0C8.83888 0 9.66203 0.132617 10.4466 0.394396C11.1882 0.641781 11.862 0.992035 12.4499 1.43595C13.6392 2.33394 14.3215 3.50676 14.3215 4.65329C14.3215 5.63247 14.0599 6.67939 13.544 7.7647C13.1348 8.62565 12.5652 9.51367 11.8511 10.4036C10.6383 11.9148 9.40697 12.9272 9.39468 12.9371C9.36046 12.9653 9.31752 12.9807 9.2732 12.9807ZM6.79378 12.5969H9.20334C9.4465 12.3905 10.5082 11.4651 11.5563 10.1576C12.6425 8.8026 13.9374 6.74772 13.9374 4.65329C13.9374 2.63794 11.3981 0.38384 7.99981 0.38384C4.60148 0.38384 2.06238 2.63794 2.06238 4.65329C2.06238 6.85769 3.3563 8.90624 4.44199 10.2364C5.49084 11.5215 6.55311 12.4032 6.79378 12.5969Z" />
                                <path d="M7.51886 12.7888C7.51886 12.7888 5.68372 9.03538 5.68372 4.65327C5.68372 2.43045 6.72066 0.191895 8 0.191895C9.27934 0.191895 10.3163 2.43045 10.3163 4.65327C10.3163 8.82024 8.48114 12.7888 8.48114 12.7888" />
                                <path d="M7.34653 12.873C7.32753 12.8343 6.87594 11.9042 6.41802 10.4209C5.9956 9.05229 5.492 6.94079 5.492 4.65329C5.492 3.53843 5.74668 2.39036 6.19079 1.50312C6.67577 0.533921 7.31832 0 8.00002 0C8.68172 0 9.32426 0.53373 9.80944 1.50312C10.2535 2.39036 10.5082 3.53843 10.5082 4.65329C10.5082 6.82928 10.0048 8.94655 9.5824 10.3393C9.12505 11.8478 8.67423 12.8283 8.65542 12.8692L8.30709 12.7082C8.31169 12.6984 8.7675 11.7058 9.21717 10.2213C9.63114 8.85481 10.1246 6.77977 10.1246 4.65329C10.1246 3.5962 9.88467 2.51051 9.46648 1.67489C9.05577 0.854428 8.52146 0.38384 8.00021 0.38384C7.47895 0.38384 6.94465 0.854428 6.53394 1.67489C6.11574 2.51051 5.87584 3.5962 5.87584 4.65329C5.87584 6.893 6.37023 8.96439 6.78497 10.3076C7.23406 11.7626 7.68699 12.6951 7.6916 12.7043L7.34653 12.873ZM8.77038 16H7.22965C6.84658 16 6.5349 15.6883 6.5349 15.3052V13.9892C6.5349 13.8833 6.62088 13.7973 6.72682 13.7973H9.27321C9.37915 13.7973 9.46513 13.8833 9.46513 13.9892V15.3052C9.46513 15.6883 9.15346 16 8.77038 16ZM6.91874 14.1812V15.3052C6.91874 15.4766 7.05826 15.6162 7.22965 15.6162H8.77038C8.94177 15.6162 9.08129 15.4766 9.08129 15.3052V14.1812H6.91874Z" />
                                <path d="M8.90952 14.1812H7.0907C7.00606 14.1812 6.93159 14.126 6.90703 14.045L6.54334 12.8445C6.52568 12.7863 6.53662 12.7232 6.5729 12.6745C6.60917 12.6257 6.66636 12.5969 6.72701 12.5969H9.2734C9.33424 12.5969 9.39143 12.6257 9.42751 12.6745C9.4454 12.6985 9.45739 12.7264 9.46252 12.756C9.46765 12.7855 9.46579 12.8158 9.45707 12.8445L9.09338 14.045C9.06862 14.1258 8.99397 14.1812 8.90952 14.1812ZM7.23291 13.7974H8.76693L9.01431 12.9808H6.98552L7.23291 13.7974Z" />
                              </svg>
                              Experience
                              <div className="info">
                                <svg
                                  width={12}
                                  height={12}
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="M6 0.375C4.88748 0.375 3.79995 0.704901 2.87492 1.32298C1.94989 1.94107 1.22892 2.81957 0.80318 3.84741C0.377437 4.87524 0.266043 6.00624 0.483085 7.09738C0.700127 8.18853 1.23586 9.19081 2.02253 9.97748C2.8092 10.7641 3.81148 11.2999 4.90262 11.5169C5.99376 11.734 7.12476 11.6226 8.1526 11.1968C9.18043 10.7711 10.0589 10.0501 10.677 9.12508C11.2951 8.20006 11.625 7.11252 11.625 6C11.6245 4.50831 11.0317 3.07786 9.97693 2.02307C8.92215 0.968289 7.49169 0.375497 6 0.375ZM6 9.375C5.85167 9.375 5.70666 9.33101 5.58333 9.2486C5.45999 9.16619 5.36386 9.04906 5.30709 8.91201C5.25033 8.77497 5.23548 8.62417 5.26441 8.47868C5.29335 8.3332 5.36478 8.19956 5.46967 8.09467C5.57456 7.98978 5.7082 7.91835 5.85369 7.88941C5.99917 7.86047 6.14997 7.87533 6.28702 7.93209C6.42406 7.98886 6.54119 8.08499 6.62361 8.20832C6.70602 8.33166 6.75 8.47666 6.75 8.625C6.74941 8.82373 6.6702 9.01415 6.52968 9.15468C6.38915 9.2952 6.19873 9.37441 6 9.375ZM6.85875 3.55875L6.6075 6.56625C6.5944 6.71834 6.52472 6.85999 6.41224 6.9632C6.29976 7.0664 6.15266 7.12367 6 7.12367C5.84735 7.12367 5.70024 7.0664 5.58776 6.9632C5.47528 6.85999 5.40561 6.71834 5.3925 6.56625L5.14125 3.55875C5.13042 3.44226 5.1434 3.32478 5.1794 3.21346C5.2154 3.10214 5.27367 2.99931 5.35067 2.91123C5.42767 2.82314 5.52178 2.75165 5.62729 2.70108C5.73279 2.65052 5.84748 2.62195 5.96437 2.61711C6.08127 2.61227 6.19793 2.63126 6.30725 2.67294C6.41657 2.71461 6.51627 2.77808 6.60029 2.8595C6.6843 2.94092 6.75087 3.03858 6.79595 3.14655C6.84103 3.25451 6.86367 3.37051 6.8625 3.4875C6.86313 3.51131 6.86187 3.53514 6.85875 3.55875Z" />
                                  </g>
                                </svg>
                                <div className="tooltip-text">
                                  Including Activities{" "}
                                  <span>
                                    Scuba Diving, Zip-lining, Rafting &amp; Rock
                                    Climbing
                                  </span>{" "}
                                  with this premium package.
                                </div>
                              </div>
                            </li>
                            <li>
                              <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g>
                                  <path d="M8 0C3.58853 0 0 3.58853 0 8C0 12.4115 3.58853 16 8 16C12.4115 16 16 12.4108 16 8C16 3.58916 12.4115 0 8 0ZM8 14.7607C4.27266 14.7607 1.23934 11.728 1.23934 8C1.23934 4.27203 4.27266 1.23934 8 1.23934C11.7273 1.23934 14.7607 4.27203 14.7607 8C14.7607 11.728 11.728 14.7607 8 14.7607Z" />
                                  <path d="M11.0984 7.32445H8.6197V4.84576C8.6197 4.5037 8.3427 4.22607 8.00001 4.22607C7.65733 4.22607 7.38033 4.5037 7.38033 4.84576V7.32445H4.90164C4.55895 7.32445 4.28195 7.60207 4.28195 7.94414C4.28195 8.2862 4.55895 8.56382 4.90164 8.56382H7.38033V11.0425C7.38033 11.3846 7.65733 11.6622 8.00001 11.6622C8.3427 11.6622 8.6197 11.3846 8.6197 11.0425V8.56382H11.0984C11.4411 8.56382 11.7181 8.2862 11.7181 7.94414C11.7181 7.60207 11.4411 7.32445 11.0984 7.32445Z" />
                                </g>
                              </svg>
                              Inclusion
                              <div className="info">
                                <svg
                                  width={12}
                                  height={12}
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="M6 0.375C4.88748 0.375 3.79995 0.704901 2.87492 1.32298C1.94989 1.94107 1.22892 2.81957 0.80318 3.84741C0.377437 4.87524 0.266043 6.00624 0.483085 7.09738C0.700127 8.18853 1.23586 9.19081 2.02253 9.97748C2.8092 10.7641 3.81148 11.2999 4.90262 11.5169C5.99376 11.734 7.12476 11.6226 8.1526 11.1968C9.18043 10.7711 10.0589 10.0501 10.677 9.12508C11.2951 8.20006 11.625 7.11252 11.625 6C11.6245 4.50831 11.0317 3.07786 9.97693 2.02307C8.92215 0.968289 7.49169 0.375497 6 0.375ZM6 9.375C5.85167 9.375 5.70666 9.33101 5.58333 9.2486C5.45999 9.16619 5.36386 9.04906 5.30709 8.91201C5.25033 8.77497 5.23548 8.62417 5.26441 8.47868C5.29335 8.3332 5.36478 8.19956 5.46967 8.09467C5.57456 7.98978 5.7082 7.91835 5.85369 7.88941C5.99917 7.86047 6.14997 7.87533 6.28702 7.93209C6.42406 7.98886 6.54119 8.08499 6.62361 8.20832C6.70602 8.33166 6.75 8.47666 6.75 8.625C6.74941 8.82373 6.6702 9.01415 6.52968 9.15468C6.38915 9.2952 6.19873 9.37441 6 9.375ZM6.85875 3.55875L6.6075 6.56625C6.5944 6.71834 6.52472 6.85999 6.41224 6.9632C6.29976 7.0664 6.15266 7.12367 6 7.12367C5.84735 7.12367 5.70024 7.0664 5.58776 6.9632C5.47528 6.85999 5.40561 6.71834 5.3925 6.56625L5.14125 3.55875C5.13042 3.44226 5.1434 3.32478 5.1794 3.21346C5.2154 3.10214 5.27367 2.99931 5.35067 2.91123C5.42767 2.82314 5.52178 2.75165 5.62729 2.70108C5.73279 2.65052 5.84748 2.62195 5.96437 2.61711C6.08127 2.61227 6.19793 2.63126 6.30725 2.67294C6.41657 2.71461 6.51627 2.77808 6.60029 2.8595C6.6843 2.94092 6.75087 3.03858 6.79595 3.14655C6.84103 3.25451 6.86367 3.37051 6.8625 3.4875C6.86313 3.51131 6.86187 3.53514 6.85875 3.55875Z" />
                                  </g>
                                </svg>
                                <div className="tooltip-text">
                                  This package covers{" "}
                                  <span>
                                    Accommodation, Daily Meals, Entry Fees &amp;
                                    Local Transfers
                                  </span>{" "}
                                  to ensure a worry-free trip.
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-6 item wow animate fadeInDown"
                    data-wow-delay="400ms"
                    data-wow-duration="1500ms"
                  >
                    <div className="package-card">
                      <div className="package-img-wrap">
                        <Swiper
                          {...settings}
                          {...pagination3}
                          modules={[EffectFade, Pagination, Autoplay]}
                          className="swiper package-card-img-slider"
                        >
                          <div className="swiper-wrapper">
                            <SwiperSlide className="swiper-slide">
                              <Link
                                href="/experience-details"
                                className="package-img"
                              >
                                <Image
                                  width={395}
                                  height={235}
                                  src="/assets/img/home6/tour-package-img2.jpg"
                                  alt=""
                                />
                              </Link>
                            </SwiperSlide>
                            <SwiperSlide className="swiper-slide">
                              <Link
                                href="/experience-details"
                                className="package-img"
                              >
                                <Image
                                  width={395}
                                  height={235}
                                  src="/assets/img/home6/tour-package-img3.jpg"
                                  alt=""
                                />
                              </Link>
                            </SwiperSlide>
                            <SwiperSlide className="swiper-slide">
                              <Link
                                href="/experience-details"
                                className="package-img"
                              >
                                <Image
                                  width={395}
                                  height={235}
                                  src="/assets/img/home6/tour-package-img4.jpg"
                                  alt=""
                                />
                              </Link>
                            </SwiperSlide>
                          </div>
                        </Swiper>
                        <div className="slider-pagi-wrap">
                          <div className="package-card-img-pagi paginations" />
                        </div>
                        <div className="batch">
                          <span className="discount">City Tour</span>
                        </div>
                      </div>
                      <div className="package-content">
                        <h5>
                          <Link href="/experience-details">
                            Ultimate City Adventure
                          </Link>
                        </h5>
                        <div className="location-and-time">
                          <div className="location">
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M6.83615 0C3.77766 0 1.28891 2.48879 1.28891 5.54892C1.28891 7.93837 4.6241 11.8351 6.05811 13.3994C6.25669 13.6175 6.54154 13.7411 6.83615 13.7411C7.13076 13.7411 7.41561 13.6175 7.6142 13.3994C9.04821 11.8351 12.3834 7.93833 12.3834 5.54892C12.3834 2.48879 9.89464 0 6.83615 0ZM7.31469 13.1243C7.18936 13.2594 7.02008 13.3342 6.83615 13.3342C6.65222 13.3342 6.48295 13.2594 6.35761 13.1243C4.95614 11.5959 1.69584 7.79515 1.69584 5.54896C1.69584 2.7134 4.00067 0.406933 6.83615 0.406933C9.67164 0.406933 11.9765 2.7134 11.9765 5.54896C11.9765 7.79515 8.71617 11.5959 7.31469 13.1243Z" />
                              <path d="M6.83618 8.54554C8.4624 8.54554 9.7807 7.22723 9.7807 5.60102C9.7807 3.9748 8.4624 2.65649 6.83618 2.65649C5.20997 2.65649 3.89166 3.9748 3.89166 5.60102C3.89166 7.22723 5.20997 8.54554 6.83618 8.54554Z" />
                            </svg>
                            <Link href="/experience-grid">Maldives</Link>
                          </div>
                          <svg
                            className="arrow"
                            width={25}
                            height={6}
                            viewBox="0 0 25 6"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 3L5 5.88675V0.113249L0 3ZM25 3L20 0.113249V5.88675L25 3ZM4.5 3.5H20.5V2.5H4.5V3.5Z" />
                          </svg>
                          <span>30 Minute</span>
                        </div>
                        <ul className="package-info">
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Thrilling Aerial Adventure
                          </li>
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Breathtaking Scenic Views
                          </li>
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Multiple Zip Lines &amp; Canopy Walkways
                          </li>
                        </ul>
                        <div className="btn-and-price-area">
                          <Link
                            href="/experience-details"
                            className="primary-btn1"
                          >
                            <span>
                              Book Now
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                              </svg>
                            </span>
                            <span>
                              Book Now
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                              </svg>
                            </span>
                          </Link>
                          <div className="price-area">
                            <h6>Starting From</h6>
                            <span>$49</span>
                          </div>
                        </div>
                        <svg
                          className="divider"
                          height={6}
                          viewBox="0 0 374 6"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5 2.5L0 0.113249V5.88675L5 3.5V2.5ZM369 3.5L374 5.88675V0.113249L369 2.5V3.5ZM4.5 3.5H369.5V2.5H4.5V3.5Z" />
                        </svg>
                        <div className="bottom-area">
                          <ul>
                            <li>
                              <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.2732 12.9807H6.7268C6.68429 12.9807 6.64298 12.9666 6.60935 12.9406C6.55906 12.9018 5.36398 11.9718 4.14989 10.4857C3.43499 9.61078 2.86499 8.72565 2.45543 7.8549C1.93974 6.75846 1.67834 5.68141 1.67834 4.65329C1.67834 3.50657 2.36043 2.33394 3.54995 1.43595C4.1378 0.992226 4.81163 0.641781 5.55321 0.394396C6.33797 0.132617 7.16112 0 8 0C8.83888 0 9.66203 0.132617 10.4466 0.394396C11.1882 0.641781 11.862 0.992035 12.4499 1.43595C13.6392 2.33394 14.3215 3.50676 14.3215 4.65329C14.3215 5.63247 14.0599 6.67939 13.544 7.7647C13.1348 8.62565 12.5652 9.51367 11.8511 10.4036C10.6383 11.9148 9.40697 12.9272 9.39468 12.9371C9.36046 12.9653 9.31752 12.9807 9.2732 12.9807ZM6.79378 12.5969H9.20334C9.4465 12.3905 10.5082 11.4651 11.5563 10.1576C12.6425 8.8026 13.9374 6.74772 13.9374 4.65329C13.9374 2.63794 11.3981 0.38384 7.99981 0.38384C4.60148 0.38384 2.06238 2.63794 2.06238 4.65329C2.06238 6.85769 3.3563 8.90624 4.44199 10.2364C5.49084 11.5215 6.55311 12.4032 6.79378 12.5969Z" />
                                <path d="M7.51886 12.7888C7.51886 12.7888 5.68372 9.03538 5.68372 4.65327C5.68372 2.43045 6.72066 0.191895 8 0.191895C9.27934 0.191895 10.3163 2.43045 10.3163 4.65327C10.3163 8.82024 8.48114 12.7888 8.48114 12.7888" />
                                <path d="M7.34653 12.873C7.32753 12.8343 6.87594 11.9042 6.41802 10.4209C5.9956 9.05229 5.492 6.94079 5.492 4.65329C5.492 3.53843 5.74668 2.39036 6.19079 1.50312C6.67577 0.533921 7.31832 0 8.00002 0C8.68172 0 9.32426 0.53373 9.80944 1.50312C10.2535 2.39036 10.5082 3.53843 10.5082 4.65329C10.5082 6.82928 10.0048 8.94655 9.5824 10.3393C9.12505 11.8478 8.67423 12.8283 8.65542 12.8692L8.30709 12.7082C8.31169 12.6984 8.7675 11.7058 9.21717 10.2213C9.63114 8.85481 10.1246 6.77977 10.1246 4.65329C10.1246 3.5962 9.88467 2.51051 9.46648 1.67489C9.05577 0.854428 8.52146 0.38384 8.00021 0.38384C7.47895 0.38384 6.94465 0.854428 6.53394 1.67489C6.11574 2.51051 5.87584 3.5962 5.87584 4.65329C5.87584 6.893 6.37023 8.96439 6.78497 10.3076C7.23406 11.7626 7.68699 12.6951 7.6916 12.7043L7.34653 12.873ZM8.77038 16H7.22965C6.84658 16 6.5349 15.6883 6.5349 15.3052V13.9892C6.5349 13.8833 6.62088 13.7973 6.72682 13.7973H9.27321C9.37915 13.7973 9.46513 13.8833 9.46513 13.9892V15.3052C9.46513 15.6883 9.15346 16 8.77038 16ZM6.91874 14.1812V15.3052C6.91874 15.4766 7.05826 15.6162 7.22965 15.6162H8.77038C8.94177 15.6162 9.08129 15.4766 9.08129 15.3052V14.1812H6.91874Z" />
                                <path d="M8.90952 14.1812H7.0907C7.00606 14.1812 6.93159 14.126 6.90703 14.045L6.54334 12.8445C6.52568 12.7863 6.53662 12.7232 6.5729 12.6745C6.60917 12.6257 6.66636 12.5969 6.72701 12.5969H9.2734C9.33424 12.5969 9.39143 12.6257 9.42751 12.6745C9.4454 12.6985 9.45739 12.7264 9.46252 12.756C9.46765 12.7855 9.46579 12.8158 9.45707 12.8445L9.09338 14.045C9.06862 14.1258 8.99397 14.1812 8.90952 14.1812ZM7.23291 13.7974H8.76693L9.01431 12.9808H6.98552L7.23291 13.7974Z" />
                              </svg>
                              Experience
                              <div className="info">
                                <svg
                                  width={12}
                                  height={12}
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="M6 0.375C4.88748 0.375 3.79995 0.704901 2.87492 1.32298C1.94989 1.94107 1.22892 2.81957 0.80318 3.84741C0.377437 4.87524 0.266043 6.00624 0.483085 7.09738C0.700127 8.18853 1.23586 9.19081 2.02253 9.97748C2.8092 10.7641 3.81148 11.2999 4.90262 11.5169C5.99376 11.734 7.12476 11.6226 8.1526 11.1968C9.18043 10.7711 10.0589 10.0501 10.677 9.12508C11.2951 8.20006 11.625 7.11252 11.625 6C11.6245 4.50831 11.0317 3.07786 9.97693 2.02307C8.92215 0.968289 7.49169 0.375497 6 0.375ZM6 9.375C5.85167 9.375 5.70666 9.33101 5.58333 9.2486C5.45999 9.16619 5.36386 9.04906 5.30709 8.91201C5.25033 8.77497 5.23548 8.62417 5.26441 8.47868C5.29335 8.3332 5.36478 8.19956 5.46967 8.09467C5.57456 7.98978 5.7082 7.91835 5.85369 7.88941C5.99917 7.86047 6.14997 7.87533 6.28702 7.93209C6.42406 7.98886 6.54119 8.08499 6.62361 8.20832C6.70602 8.33166 6.75 8.47666 6.75 8.625C6.74941 8.82373 6.6702 9.01415 6.52968 9.15468C6.38915 9.2952 6.19873 9.37441 6 9.375ZM6.85875 3.55875L6.6075 6.56625C6.5944 6.71834 6.52472 6.85999 6.41224 6.9632C6.29976 7.0664 6.15266 7.12367 6 7.12367C5.84735 7.12367 5.70024 7.0664 5.58776 6.9632C5.47528 6.85999 5.40561 6.71834 5.3925 6.56625L5.14125 3.55875C5.13042 3.44226 5.1434 3.32478 5.1794 3.21346C5.2154 3.10214 5.27367 2.99931 5.35067 2.91123C5.42767 2.82314 5.52178 2.75165 5.62729 2.70108C5.73279 2.65052 5.84748 2.62195 5.96437 2.61711C6.08127 2.61227 6.19793 2.63126 6.30725 2.67294C6.41657 2.71461 6.51627 2.77808 6.60029 2.8595C6.6843 2.94092 6.75087 3.03858 6.79595 3.14655C6.84103 3.25451 6.86367 3.37051 6.8625 3.4875C6.86313 3.51131 6.86187 3.53514 6.85875 3.55875Z" />
                                  </g>
                                </svg>
                                <div className="tooltip-text">
                                  Including Activities{" "}
                                  <span>
                                    Scuba Diving, Zip-lining, Rafting &amp; Rock
                                    Climbing
                                  </span>{" "}
                                  with this premium package.
                                </div>
                              </div>
                            </li>
                            <li>
                              <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g>
                                  <path d="M8 0C3.58853 0 0 3.58853 0 8C0 12.4115 3.58853 16 8 16C12.4115 16 16 12.4108 16 8C16 3.58916 12.4115 0 8 0ZM8 14.7607C4.27266 14.7607 1.23934 11.728 1.23934 8C1.23934 4.27203 4.27266 1.23934 8 1.23934C11.7273 1.23934 14.7607 4.27203 14.7607 8C14.7607 11.728 11.728 14.7607 8 14.7607Z" />
                                  <path d="M11.0984 7.32445H8.6197V4.84576C8.6197 4.5037 8.3427 4.22607 8.00001 4.22607C7.65733 4.22607 7.38033 4.5037 7.38033 4.84576V7.32445H4.90164C4.55895 7.32445 4.28195 7.60207 4.28195 7.94414C4.28195 8.2862 4.55895 8.56382 4.90164 8.56382H7.38033V11.0425C7.38033 11.3846 7.65733 11.6622 8.00001 11.6622C8.3427 11.6622 8.6197 11.3846 8.6197 11.0425V8.56382H11.0984C11.4411 8.56382 11.7181 8.2862 11.7181 7.94414C11.7181 7.60207 11.4411 7.32445 11.0984 7.32445Z" />
                                </g>
                              </svg>
                              Inclusion
                              <div className="info">
                                <svg
                                  width={12}
                                  height={12}
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="M6 0.375C4.88748 0.375 3.79995 0.704901 2.87492 1.32298C1.94989 1.94107 1.22892 2.81957 0.80318 3.84741C0.377437 4.87524 0.266043 6.00624 0.483085 7.09738C0.700127 8.18853 1.23586 9.19081 2.02253 9.97748C2.8092 10.7641 3.81148 11.2999 4.90262 11.5169C5.99376 11.734 7.12476 11.6226 8.1526 11.1968C9.18043 10.7711 10.0589 10.0501 10.677 9.12508C11.2951 8.20006 11.625 7.11252 11.625 6C11.6245 4.50831 11.0317 3.07786 9.97693 2.02307C8.92215 0.968289 7.49169 0.375497 6 0.375ZM6 9.375C5.85167 9.375 5.70666 9.33101 5.58333 9.2486C5.45999 9.16619 5.36386 9.04906 5.30709 8.91201C5.25033 8.77497 5.23548 8.62417 5.26441 8.47868C5.29335 8.3332 5.36478 8.19956 5.46967 8.09467C5.57456 7.98978 5.7082 7.91835 5.85369 7.88941C5.99917 7.86047 6.14997 7.87533 6.28702 7.93209C6.42406 7.98886 6.54119 8.08499 6.62361 8.20832C6.70602 8.33166 6.75 8.47666 6.75 8.625C6.74941 8.82373 6.6702 9.01415 6.52968 9.15468C6.38915 9.2952 6.19873 9.37441 6 9.375ZM6.85875 3.55875L6.6075 6.56625C6.5944 6.71834 6.52472 6.85999 6.41224 6.9632C6.29976 7.0664 6.15266 7.12367 6 7.12367C5.84735 7.12367 5.70024 7.0664 5.58776 6.9632C5.47528 6.85999 5.40561 6.71834 5.3925 6.56625L5.14125 3.55875C5.13042 3.44226 5.1434 3.32478 5.1794 3.21346C5.2154 3.10214 5.27367 2.99931 5.35067 2.91123C5.42767 2.82314 5.52178 2.75165 5.62729 2.70108C5.73279 2.65052 5.84748 2.62195 5.96437 2.61711C6.08127 2.61227 6.19793 2.63126 6.30725 2.67294C6.41657 2.71461 6.51627 2.77808 6.60029 2.8595C6.6843 2.94092 6.75087 3.03858 6.79595 3.14655C6.84103 3.25451 6.86367 3.37051 6.8625 3.4875C6.86313 3.51131 6.86187 3.53514 6.85875 3.55875Z" />
                                  </g>
                                </svg>
                                <div className="tooltip-text">
                                  This package covers{" "}
                                  <span>
                                    Accommodation, Daily Meals, Entry Fees &amp;
                                    Local Transfers
                                  </span>{" "}
                                  to ensure a worry-free trip.
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-6 item wow animate fadeInDown"
                    data-wow-delay="600ms"
                    data-wow-duration="1500ms"
                  >
                    <div className="package-card">
                      <div className="package-img-wrap">
                        <Link
                          href="/experience-details"
                          className="package-img"
                        >
                          <Image
                            width={395}
                            height={235}
                            src="/assets/img/home6/tour-package-img5.jpg"
                            alt=""
                          />
                        </Link>
                        <div className="batch">
                          <span className="yellow-bg">Family Tour</span>
                        </div>
                      </div>
                      <div className="package-content">
                        <h5>
                          <Link href="/experience-details">
                            Skydiving &amp; Paragliding
                          </Link>
                        </h5>
                        <div className="location-and-time">
                          <div className="location">
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M6.83615 0C3.77766 0 1.28891 2.48879 1.28891 5.54892C1.28891 7.93837 4.6241 11.8351 6.05811 13.3994C6.25669 13.6175 6.54154 13.7411 6.83615 13.7411C7.13076 13.7411 7.41561 13.6175 7.6142 13.3994C9.04821 11.8351 12.3834 7.93833 12.3834 5.54892C12.3834 2.48879 9.89464 0 6.83615 0ZM7.31469 13.1243C7.18936 13.2594 7.02008 13.3342 6.83615 13.3342C6.65222 13.3342 6.48295 13.2594 6.35761 13.1243C4.95614 11.5959 1.69584 7.79515 1.69584 5.54896C1.69584 2.7134 4.00067 0.406933 6.83615 0.406933C9.67164 0.406933 11.9765 2.7134 11.9765 5.54896C11.9765 7.79515 8.71617 11.5959 7.31469 13.1243Z" />
                              <path d="M6.83618 8.54554C8.4624 8.54554 9.7807 7.22723 9.7807 5.60102C9.7807 3.9748 8.4624 2.65649 6.83618 2.65649C5.20997 2.65649 3.89166 3.9748 3.89166 5.60102C3.89166 7.22723 5.20997 8.54554 6.83618 8.54554Z" />
                            </svg>
                            <Link href="/experience-grid">Nepal</Link>
                          </div>
                          <svg
                            className="arrow"
                            width={25}
                            height={6}
                            viewBox="0 0 25 6"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 3L5 5.88675V0.113249L0 3ZM25 3L20 0.113249V5.88675L25 3ZM4.5 3.5H20.5V2.5H4.5V3.5Z" />
                          </svg>
                          <span>40 Minute</span>
                        </div>
                        <ul className="package-info">
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Professional Safety Standards
                          </li>
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            No Experience Needed
                          </li>
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Sunrise &amp; Sunset Jumps
                          </li>
                        </ul>
                        <div className="btn-and-price-area">
                          <Link
                            href="/experience-details"
                            className="primary-btn1"
                          >
                            <span>
                              Book Now
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                              </svg>
                            </span>
                            <span>
                              Book Now
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                              </svg>
                            </span>
                          </Link>
                          <div className="price-area">
                            <h6>Per Person</h6>
                            <span>$129</span>
                          </div>
                        </div>
                        <svg
                          className="divider"
                          height={6}
                          viewBox="0 0 374 6"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5 2.5L0 0.113249V5.88675L5 3.5V2.5ZM369 3.5L374 5.88675V0.113249L369 2.5V3.5ZM4.5 3.5H369.5V2.5H4.5V3.5Z" />
                        </svg>
                        <div className="bottom-area">
                          <ul>
                            <li>
                              <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.2732 12.9807H6.7268C6.68429 12.9807 6.64298 12.9666 6.60935 12.9406C6.55906 12.9018 5.36398 11.9718 4.14989 10.4857C3.43499 9.61078 2.86499 8.72565 2.45543 7.8549C1.93974 6.75846 1.67834 5.68141 1.67834 4.65329C1.67834 3.50657 2.36043 2.33394 3.54995 1.43595C4.1378 0.992226 4.81163 0.641781 5.55321 0.394396C6.33797 0.132617 7.16112 0 8 0C8.83888 0 9.66203 0.132617 10.4466 0.394396C11.1882 0.641781 11.862 0.992035 12.4499 1.43595C13.6392 2.33394 14.3215 3.50676 14.3215 4.65329C14.3215 5.63247 14.0599 6.67939 13.544 7.7647C13.1348 8.62565 12.5652 9.51367 11.8511 10.4036C10.6383 11.9148 9.40697 12.9272 9.39468 12.9371C9.36046 12.9653 9.31752 12.9807 9.2732 12.9807ZM6.79378 12.5969H9.20334C9.4465 12.3905 10.5082 11.4651 11.5563 10.1576C12.6425 8.8026 13.9374 6.74772 13.9374 4.65329C13.9374 2.63794 11.3981 0.38384 7.99981 0.38384C4.60148 0.38384 2.06238 2.63794 2.06238 4.65329C2.06238 6.85769 3.3563 8.90624 4.44199 10.2364C5.49084 11.5215 6.55311 12.4032 6.79378 12.5969Z" />
                                <path d="M7.51886 12.7888C7.51886 12.7888 5.68372 9.03538 5.68372 4.65327C5.68372 2.43045 6.72066 0.191895 8 0.191895C9.27934 0.191895 10.3163 2.43045 10.3163 4.65327C10.3163 8.82024 8.48114 12.7888 8.48114 12.7888" />
                                <path d="M7.34653 12.873C7.32753 12.8343 6.87594 11.9042 6.41802 10.4209C5.9956 9.05229 5.492 6.94079 5.492 4.65329C5.492 3.53843 5.74668 2.39036 6.19079 1.50312C6.67577 0.533921 7.31832 0 8.00002 0C8.68172 0 9.32426 0.53373 9.80944 1.50312C10.2535 2.39036 10.5082 3.53843 10.5082 4.65329C10.5082 6.82928 10.0048 8.94655 9.5824 10.3393C9.12505 11.8478 8.67423 12.8283 8.65542 12.8692L8.30709 12.7082C8.31169 12.6984 8.7675 11.7058 9.21717 10.2213C9.63114 8.85481 10.1246 6.77977 10.1246 4.65329C10.1246 3.5962 9.88467 2.51051 9.46648 1.67489C9.05577 0.854428 8.52146 0.38384 8.00021 0.38384C7.47895 0.38384 6.94465 0.854428 6.53394 1.67489C6.11574 2.51051 5.87584 3.5962 5.87584 4.65329C5.87584 6.893 6.37023 8.96439 6.78497 10.3076C7.23406 11.7626 7.68699 12.6951 7.6916 12.7043L7.34653 12.873ZM8.77038 16H7.22965C6.84658 16 6.5349 15.6883 6.5349 15.3052V13.9892C6.5349 13.8833 6.62088 13.7973 6.72682 13.7973H9.27321C9.37915 13.7973 9.46513 13.8833 9.46513 13.9892V15.3052C9.46513 15.6883 9.15346 16 8.77038 16ZM6.91874 14.1812V15.3052C6.91874 15.4766 7.05826 15.6162 7.22965 15.6162H8.77038C8.94177 15.6162 9.08129 15.4766 9.08129 15.3052V14.1812H6.91874Z" />
                                <path d="M8.90952 14.1812H7.0907C7.00606 14.1812 6.93159 14.126 6.90703 14.045L6.54334 12.8445C6.52568 12.7863 6.53662 12.7232 6.5729 12.6745C6.60917 12.6257 6.66636 12.5969 6.72701 12.5969H9.2734C9.33424 12.5969 9.39143 12.6257 9.42751 12.6745C9.4454 12.6985 9.45739 12.7264 9.46252 12.756C9.46765 12.7855 9.46579 12.8158 9.45707 12.8445L9.09338 14.045C9.06862 14.1258 8.99397 14.1812 8.90952 14.1812ZM7.23291 13.7974H8.76693L9.01431 12.9808H6.98552L7.23291 13.7974Z" />
                              </svg>
                              Experience
                              <div className="info">
                                <svg
                                  width={12}
                                  height={12}
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="M6 0.375C4.88748 0.375 3.79995 0.704901 2.87492 1.32298C1.94989 1.94107 1.22892 2.81957 0.80318 3.84741C0.377437 4.87524 0.266043 6.00624 0.483085 7.09738C0.700127 8.18853 1.23586 9.19081 2.02253 9.97748C2.8092 10.7641 3.81148 11.2999 4.90262 11.5169C5.99376 11.734 7.12476 11.6226 8.1526 11.1968C9.18043 10.7711 10.0589 10.0501 10.677 9.12508C11.2951 8.20006 11.625 7.11252 11.625 6C11.6245 4.50831 11.0317 3.07786 9.97693 2.02307C8.92215 0.968289 7.49169 0.375497 6 0.375ZM6 9.375C5.85167 9.375 5.70666 9.33101 5.58333 9.2486C5.45999 9.16619 5.36386 9.04906 5.30709 8.91201C5.25033 8.77497 5.23548 8.62417 5.26441 8.47868C5.29335 8.3332 5.36478 8.19956 5.46967 8.09467C5.57456 7.98978 5.7082 7.91835 5.85369 7.88941C5.99917 7.86047 6.14997 7.87533 6.28702 7.93209C6.42406 7.98886 6.54119 8.08499 6.62361 8.20832C6.70602 8.33166 6.75 8.47666 6.75 8.625C6.74941 8.82373 6.6702 9.01415 6.52968 9.15468C6.38915 9.2952 6.19873 9.37441 6 9.375ZM6.85875 3.55875L6.6075 6.56625C6.5944 6.71834 6.52472 6.85999 6.41224 6.9632C6.29976 7.0664 6.15266 7.12367 6 7.12367C5.84735 7.12367 5.70024 7.0664 5.58776 6.9632C5.47528 6.85999 5.40561 6.71834 5.3925 6.56625L5.14125 3.55875C5.13042 3.44226 5.1434 3.32478 5.1794 3.21346C5.2154 3.10214 5.27367 2.99931 5.35067 2.91123C5.42767 2.82314 5.52178 2.75165 5.62729 2.70108C5.73279 2.65052 5.84748 2.62195 5.96437 2.61711C6.08127 2.61227 6.19793 2.63126 6.30725 2.67294C6.41657 2.71461 6.51627 2.77808 6.60029 2.8595C6.6843 2.94092 6.75087 3.03858 6.79595 3.14655C6.84103 3.25451 6.86367 3.37051 6.8625 3.4875C6.86313 3.51131 6.86187 3.53514 6.85875 3.55875Z" />
                                  </g>
                                </svg>
                                <div className="tooltip-text">
                                  Including Activities{" "}
                                  <span>
                                    Scuba Diving, Zip-lining, Rafting &amp; Rock
                                    Climbing
                                  </span>{" "}
                                  with this premium package.
                                </div>
                              </div>
                            </li>
                            <li>
                              <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g>
                                  <path d="M8 0C3.58853 0 0 3.58853 0 8C0 12.4115 3.58853 16 8 16C12.4115 16 16 12.4108 16 8C16 3.58916 12.4115 0 8 0ZM8 14.7607C4.27266 14.7607 1.23934 11.728 1.23934 8C1.23934 4.27203 4.27266 1.23934 8 1.23934C11.7273 1.23934 14.7607 4.27203 14.7607 8C14.7607 11.728 11.728 14.7607 8 14.7607Z" />
                                  <path d="M11.0984 7.32445H8.6197V4.84576C8.6197 4.5037 8.3427 4.22607 8.00001 4.22607C7.65733 4.22607 7.38033 4.5037 7.38033 4.84576V7.32445H4.90164C4.55895 7.32445 4.28195 7.60207 4.28195 7.94414C4.28195 8.2862 4.55895 8.56382 4.90164 8.56382H7.38033V11.0425C7.38033 11.3846 7.65733 11.6622 8.00001 11.6622C8.3427 11.6622 8.6197 11.3846 8.6197 11.0425V8.56382H11.0984C11.4411 8.56382 11.7181 8.2862 11.7181 7.94414C11.7181 7.60207 11.4411 7.32445 11.0984 7.32445Z" />
                                </g>
                              </svg>
                              Inclusion
                              <div className="info">
                                <svg
                                  width={12}
                                  height={12}
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="M6 0.375C4.88748 0.375 3.79995 0.704901 2.87492 1.32298C1.94989 1.94107 1.22892 2.81957 0.80318 3.84741C0.377437 4.87524 0.266043 6.00624 0.483085 7.09738C0.700127 8.18853 1.23586 9.19081 2.02253 9.97748C2.8092 10.7641 3.81148 11.2999 4.90262 11.5169C5.99376 11.734 7.12476 11.6226 8.1526 11.1968C9.18043 10.7711 10.0589 10.0501 10.677 9.12508C11.2951 8.20006 11.625 7.11252 11.625 6C11.6245 4.50831 11.0317 3.07786 9.97693 2.02307C8.92215 0.968289 7.49169 0.375497 6 0.375ZM6 9.375C5.85167 9.375 5.70666 9.33101 5.58333 9.2486C5.45999 9.16619 5.36386 9.04906 5.30709 8.91201C5.25033 8.77497 5.23548 8.62417 5.26441 8.47868C5.29335 8.3332 5.36478 8.19956 5.46967 8.09467C5.57456 7.98978 5.7082 7.91835 5.85369 7.88941C5.99917 7.86047 6.14997 7.87533 6.28702 7.93209C6.42406 7.98886 6.54119 8.08499 6.62361 8.20832C6.70602 8.33166 6.75 8.47666 6.75 8.625C6.74941 8.82373 6.6702 9.01415 6.52968 9.15468C6.38915 9.2952 6.19873 9.37441 6 9.375ZM6.85875 3.55875L6.6075 6.56625C6.5944 6.71834 6.52472 6.85999 6.41224 6.9632C6.29976 7.0664 6.15266 7.12367 6 7.12367C5.84735 7.12367 5.70024 7.0664 5.58776 6.9632C5.47528 6.85999 5.40561 6.71834 5.3925 6.56625L5.14125 3.55875C5.13042 3.44226 5.1434 3.32478 5.1794 3.21346C5.2154 3.10214 5.27367 2.99931 5.35067 2.91123C5.42767 2.82314 5.52178 2.75165 5.62729 2.70108C5.73279 2.65052 5.84748 2.62195 5.96437 2.61711C6.08127 2.61227 6.19793 2.63126 6.30725 2.67294C6.41657 2.71461 6.51627 2.77808 6.60029 2.8595C6.6843 2.94092 6.75087 3.03858 6.79595 3.14655C6.84103 3.25451 6.86367 3.37051 6.8625 3.4875C6.86313 3.51131 6.86187 3.53514 6.85875 3.55875Z" />
                                  </g>
                                </svg>
                                <div className="tooltip-text">
                                  This package covers{" "}
                                  <span>
                                    Accommodation, Daily Meals, Entry Fees &amp;
                                    Local Transfers
                                  </span>{" "}
                                  to ensure a worry-free trip.
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-6 item wow animate fadeInDown"
                    data-wow-delay="800ms"
                    data-wow-duration="1500ms"
                  >
                    <div className="package-card">
                      <div className="package-img-wrap">
                        <Swiper
                          {...settings}
                          {...pagination1}
                          modules={[Autoplay, EffectFade, Pagination]}
                          className="swiper package-card-img-slider"
                        >
                          <div className="swiper-wrapper">
                            <SwiperSlide className="swiper-slide">
                              <Link
                                href="/experience-details"
                                className="package-img"
                              >
                                <Image
                                  width={395}
                                  height={235}
                                  src="/assets/img/home6/tour-package-img6.jpg"
                                  alt=""
                                />
                              </Link>
                            </SwiperSlide>
                            <SwiperSlide className="swiper-slide">
                              <Link
                                href="/experience-details"
                                className="package-img"
                              >
                                <Image
                                  width={395}
                                  height={235}
                                  src="/assets/img/home6/tour-package-img7.jpg"
                                  alt=""
                                />
                              </Link>
                            </SwiperSlide>
                            <SwiperSlide className="swiper-slide">
                              <Link
                                href="/experience-details"
                                className="package-img"
                              >
                                <Image
                                  width={395}
                                  height={235}
                                  src="/assets/img/home6/tour-package-img8.jpg"
                                  alt=""
                                />
                              </Link>
                            </SwiperSlide>
                          </div>
                        </Swiper>
                        <div className="slider-pagi-wrap">
                          <div className="package-card-img-pagi paginations" />
                        </div>
                      </div>
                      <div className="package-content">
                        <h5>
                          <Link href="/experience-details">
                            Surfing &amp; Waterfalls
                          </Link>
                        </h5>
                        <div className="location-and-time">
                          <div className="location">
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M6.83615 0C3.77766 0 1.28891 2.48879 1.28891 5.54892C1.28891 7.93837 4.6241 11.8351 6.05811 13.3994C6.25669 13.6175 6.54154 13.7411 6.83615 13.7411C7.13076 13.7411 7.41561 13.6175 7.6142 13.3994C9.04821 11.8351 12.3834 7.93833 12.3834 5.54892C12.3834 2.48879 9.89464 0 6.83615 0ZM7.31469 13.1243C7.18936 13.2594 7.02008 13.3342 6.83615 13.3342C6.65222 13.3342 6.48295 13.2594 6.35761 13.1243C4.95614 11.5959 1.69584 7.79515 1.69584 5.54896C1.69584 2.7134 4.00067 0.406933 6.83615 0.406933C9.67164 0.406933 11.9765 2.7134 11.9765 5.54896C11.9765 7.79515 8.71617 11.5959 7.31469 13.1243Z" />
                              <path d="M6.83618 8.54554C8.4624 8.54554 9.7807 7.22723 9.7807 5.60102C9.7807 3.9748 8.4624 2.65649 6.83618 2.65649C5.20997 2.65649 3.89166 3.9748 3.89166 5.60102C3.89166 7.22723 5.20997 8.54554 6.83618 8.54554Z" />
                            </svg>
                            <Link href="/experience-grid">Goa, India</Link>
                          </div>
                          <svg
                            className="arrow"
                            width={25}
                            height={6}
                            viewBox="0 0 25 6"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 3L5 5.88675V0.113249L0 3ZM25 3L20 0.113249V5.88675L25 3ZM4.5 3.5H20.5V2.5H4.5V3.5Z" />
                          </svg>
                          <span>20 Minute</span>
                        </div>
                        <ul className="package-info">
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Beginner to Pro-Friendly
                          </li>
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Beach Vibes &amp; Surf Culture
                          </li>
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Swimming &amp; Cliff Jumping
                          </li>
                        </ul>
                        <div className="btn-and-price-area">
                          <Link
                            href="/experience-details"
                            className="primary-btn1"
                          >
                            <span>
                              Book Now
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                              </svg>
                            </span>
                            <span>
                              Book Now
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                              </svg>
                            </span>
                          </Link>
                          <div className="price-area">
                            <h6>Stating From</h6>
                            <span>$39</span>
                          </div>
                        </div>
                        <svg
                          className="divider"
                          height={6}
                          viewBox="0 0 374 6"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5 2.5L0 0.113249V5.88675L5 3.5V2.5ZM369 3.5L374 5.88675V0.113249L369 2.5V3.5ZM4.5 3.5H369.5V2.5H4.5V3.5Z" />
                        </svg>
                        <div className="bottom-area">
                          <ul>
                            <li>
                              <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.2732 12.9807H6.7268C6.68429 12.9807 6.64298 12.9666 6.60935 12.9406C6.55906 12.9018 5.36398 11.9718 4.14989 10.4857C3.43499 9.61078 2.86499 8.72565 2.45543 7.8549C1.93974 6.75846 1.67834 5.68141 1.67834 4.65329C1.67834 3.50657 2.36043 2.33394 3.54995 1.43595C4.1378 0.992226 4.81163 0.641781 5.55321 0.394396C6.33797 0.132617 7.16112 0 8 0C8.83888 0 9.66203 0.132617 10.4466 0.394396C11.1882 0.641781 11.862 0.992035 12.4499 1.43595C13.6392 2.33394 14.3215 3.50676 14.3215 4.65329C14.3215 5.63247 14.0599 6.67939 13.544 7.7647C13.1348 8.62565 12.5652 9.51367 11.8511 10.4036C10.6383 11.9148 9.40697 12.9272 9.39468 12.9371C9.36046 12.9653 9.31752 12.9807 9.2732 12.9807ZM6.79378 12.5969H9.20334C9.4465 12.3905 10.5082 11.4651 11.5563 10.1576C12.6425 8.8026 13.9374 6.74772 13.9374 4.65329C13.9374 2.63794 11.3981 0.38384 7.99981 0.38384C4.60148 0.38384 2.06238 2.63794 2.06238 4.65329C2.06238 6.85769 3.3563 8.90624 4.44199 10.2364C5.49084 11.5215 6.55311 12.4032 6.79378 12.5969Z" />
                                <path d="M7.51886 12.7888C7.51886 12.7888 5.68372 9.03538 5.68372 4.65327C5.68372 2.43045 6.72066 0.191895 8 0.191895C9.27934 0.191895 10.3163 2.43045 10.3163 4.65327C10.3163 8.82024 8.48114 12.7888 8.48114 12.7888" />
                                <path d="M7.34653 12.873C7.32753 12.8343 6.87594 11.9042 6.41802 10.4209C5.9956 9.05229 5.492 6.94079 5.492 4.65329C5.492 3.53843 5.74668 2.39036 6.19079 1.50312C6.67577 0.533921 7.31832 0 8.00002 0C8.68172 0 9.32426 0.53373 9.80944 1.50312C10.2535 2.39036 10.5082 3.53843 10.5082 4.65329C10.5082 6.82928 10.0048 8.94655 9.5824 10.3393C9.12505 11.8478 8.67423 12.8283 8.65542 12.8692L8.30709 12.7082C8.31169 12.6984 8.7675 11.7058 9.21717 10.2213C9.63114 8.85481 10.1246 6.77977 10.1246 4.65329C10.1246 3.5962 9.88467 2.51051 9.46648 1.67489C9.05577 0.854428 8.52146 0.38384 8.00021 0.38384C7.47895 0.38384 6.94465 0.854428 6.53394 1.67489C6.11574 2.51051 5.87584 3.5962 5.87584 4.65329C5.87584 6.893 6.37023 8.96439 6.78497 10.3076C7.23406 11.7626 7.68699 12.6951 7.6916 12.7043L7.34653 12.873ZM8.77038 16H7.22965C6.84658 16 6.5349 15.6883 6.5349 15.3052V13.9892C6.5349 13.8833 6.62088 13.7973 6.72682 13.7973H9.27321C9.37915 13.7973 9.46513 13.8833 9.46513 13.9892V15.3052C9.46513 15.6883 9.15346 16 8.77038 16ZM6.91874 14.1812V15.3052C6.91874 15.4766 7.05826 15.6162 7.22965 15.6162H8.77038C8.94177 15.6162 9.08129 15.4766 9.08129 15.3052V14.1812H6.91874Z" />
                                <path d="M8.90952 14.1812H7.0907C7.00606 14.1812 6.93159 14.126 6.90703 14.045L6.54334 12.8445C6.52568 12.7863 6.53662 12.7232 6.5729 12.6745C6.60917 12.6257 6.66636 12.5969 6.72701 12.5969H9.2734C9.33424 12.5969 9.39143 12.6257 9.42751 12.6745C9.4454 12.6985 9.45739 12.7264 9.46252 12.756C9.46765 12.7855 9.46579 12.8158 9.45707 12.8445L9.09338 14.045C9.06862 14.1258 8.99397 14.1812 8.90952 14.1812ZM7.23291 13.7974H8.76693L9.01431 12.9808H6.98552L7.23291 13.7974Z" />
                              </svg>
                              Experience
                              <div className="info">
                                <svg
                                  width={12}
                                  height={12}
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="M6 0.375C4.88748 0.375 3.79995 0.704901 2.87492 1.32298C1.94989 1.94107 1.22892 2.81957 0.80318 3.84741C0.377437 4.87524 0.266043 6.00624 0.483085 7.09738C0.700127 8.18853 1.23586 9.19081 2.02253 9.97748C2.8092 10.7641 3.81148 11.2999 4.90262 11.5169C5.99376 11.734 7.12476 11.6226 8.1526 11.1968C9.18043 10.7711 10.0589 10.0501 10.677 9.12508C11.2951 8.20006 11.625 7.11252 11.625 6C11.6245 4.50831 11.0317 3.07786 9.97693 2.02307C8.92215 0.968289 7.49169 0.375497 6 0.375ZM6 9.375C5.85167 9.375 5.70666 9.33101 5.58333 9.2486C5.45999 9.16619 5.36386 9.04906 5.30709 8.91201C5.25033 8.77497 5.23548 8.62417 5.26441 8.47868C5.29335 8.3332 5.36478 8.19956 5.46967 8.09467C5.57456 7.98978 5.7082 7.91835 5.85369 7.88941C5.99917 7.86047 6.14997 7.87533 6.28702 7.93209C6.42406 7.98886 6.54119 8.08499 6.62361 8.20832C6.70602 8.33166 6.75 8.47666 6.75 8.625C6.74941 8.82373 6.6702 9.01415 6.52968 9.15468C6.38915 9.2952 6.19873 9.37441 6 9.375ZM6.85875 3.55875L6.6075 6.56625C6.5944 6.71834 6.52472 6.85999 6.41224 6.9632C6.29976 7.0664 6.15266 7.12367 6 7.12367C5.84735 7.12367 5.70024 7.0664 5.58776 6.9632C5.47528 6.85999 5.40561 6.71834 5.3925 6.56625L5.14125 3.55875C5.13042 3.44226 5.1434 3.32478 5.1794 3.21346C5.2154 3.10214 5.27367 2.99931 5.35067 2.91123C5.42767 2.82314 5.52178 2.75165 5.62729 2.70108C5.73279 2.65052 5.84748 2.62195 5.96437 2.61711C6.08127 2.61227 6.19793 2.63126 6.30725 2.67294C6.41657 2.71461 6.51627 2.77808 6.60029 2.8595C6.6843 2.94092 6.75087 3.03858 6.79595 3.14655C6.84103 3.25451 6.86367 3.37051 6.8625 3.4875C6.86313 3.51131 6.86187 3.53514 6.85875 3.55875Z" />
                                  </g>
                                </svg>
                                <div className="tooltip-text">
                                  Including Activities{" "}
                                  <span>
                                    Scuba Diving, Zip-lining, Rafting &amp; Rock
                                    Climbing
                                  </span>{" "}
                                  with this premium package.
                                </div>
                              </div>
                            </li>
                            <li>
                              <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g>
                                  <path d="M8 0C3.58853 0 0 3.58853 0 8C0 12.4115 3.58853 16 8 16C12.4115 16 16 12.4108 16 8C16 3.58916 12.4115 0 8 0ZM8 14.7607C4.27266 14.7607 1.23934 11.728 1.23934 8C1.23934 4.27203 4.27266 1.23934 8 1.23934C11.7273 1.23934 14.7607 4.27203 14.7607 8C14.7607 11.728 11.728 14.7607 8 14.7607Z" />
                                  <path d="M11.0984 7.32445H8.6197V4.84576C8.6197 4.5037 8.3427 4.22607 8.00001 4.22607C7.65733 4.22607 7.38033 4.5037 7.38033 4.84576V7.32445H4.90164C4.55895 7.32445 4.28195 7.60207 4.28195 7.94414C4.28195 8.2862 4.55895 8.56382 4.90164 8.56382H7.38033V11.0425C7.38033 11.3846 7.65733 11.6622 8.00001 11.6622C8.3427 11.6622 8.6197 11.3846 8.6197 11.0425V8.56382H11.0984C11.4411 8.56382 11.7181 8.2862 11.7181 7.94414C11.7181 7.60207 11.4411 7.32445 11.0984 7.32445Z" />
                                </g>
                              </svg>
                              Inclusion
                              <div className="info">
                                <svg
                                  width={12}
                                  height={12}
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="M6 0.375C4.88748 0.375 3.79995 0.704901 2.87492 1.32298C1.94989 1.94107 1.22892 2.81957 0.80318 3.84741C0.377437 4.87524 0.266043 6.00624 0.483085 7.09738C0.700127 8.18853 1.23586 9.19081 2.02253 9.97748C2.8092 10.7641 3.81148 11.2999 4.90262 11.5169C5.99376 11.734 7.12476 11.6226 8.1526 11.1968C9.18043 10.7711 10.0589 10.0501 10.677 9.12508C11.2951 8.20006 11.625 7.11252 11.625 6C11.6245 4.50831 11.0317 3.07786 9.97693 2.02307C8.92215 0.968289 7.49169 0.375497 6 0.375ZM6 9.375C5.85167 9.375 5.70666 9.33101 5.58333 9.2486C5.45999 9.16619 5.36386 9.04906 5.30709 8.91201C5.25033 8.77497 5.23548 8.62417 5.26441 8.47868C5.29335 8.3332 5.36478 8.19956 5.46967 8.09467C5.57456 7.98978 5.7082 7.91835 5.85369 7.88941C5.99917 7.86047 6.14997 7.87533 6.28702 7.93209C6.42406 7.98886 6.54119 8.08499 6.62361 8.20832C6.70602 8.33166 6.75 8.47666 6.75 8.625C6.74941 8.82373 6.6702 9.01415 6.52968 9.15468C6.38915 9.2952 6.19873 9.37441 6 9.375ZM6.85875 3.55875L6.6075 6.56625C6.5944 6.71834 6.52472 6.85999 6.41224 6.9632C6.29976 7.0664 6.15266 7.12367 6 7.12367C5.84735 7.12367 5.70024 7.0664 5.58776 6.9632C5.47528 6.85999 5.40561 6.71834 5.3925 6.56625L5.14125 3.55875C5.13042 3.44226 5.1434 3.32478 5.1794 3.21346C5.2154 3.10214 5.27367 2.99931 5.35067 2.91123C5.42767 2.82314 5.52178 2.75165 5.62729 2.70108C5.73279 2.65052 5.84748 2.62195 5.96437 2.61711C6.08127 2.61227 6.19793 2.63126 6.30725 2.67294C6.41657 2.71461 6.51627 2.77808 6.60029 2.8595C6.6843 2.94092 6.75087 3.03858 6.79595 3.14655C6.84103 3.25451 6.86367 3.37051 6.8625 3.4875C6.86313 3.51131 6.86187 3.53514 6.85875 3.55875Z" />
                                  </g>
                                </svg>
                                <div className="tooltip-text">
                                  This package covers{" "}
                                  <span>
                                    Accommodation, Daily Meals, Entry Fees &amp;
                                    Local Transfers
                                  </span>{" "}
                                  to ensure a worry-free trip.
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-6 item wow animate fadeInDown"
                    data-wow-delay="800ms"
                    data-wow-duration="1500ms"
                  >
                    <div className="package-card">
                      <div className="package-img-wrap">
                        <Link
                          href="/experience-details"
                          className="package-img"
                        >
                          <Image
                            width={395}
                            height={235}
                            src="/assets/img/home6/tour-package-img9.jpg"
                            alt=""
                          />
                        </Link>
                        <div className="batch">
                          <span className="yellow-bg">Group Tour</span>
                        </div>
                      </div>
                      <div className="package-content">
                        <h5>
                          <Link href="/experience-details">
                            Mountain Rock Climbing
                          </Link>
                        </h5>
                        <div className="location-and-time">
                          <div className="location">
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M6.83615 0C3.77766 0 1.28891 2.48879 1.28891 5.54892C1.28891 7.93837 4.6241 11.8351 6.05811 13.3994C6.25669 13.6175 6.54154 13.7411 6.83615 13.7411C7.13076 13.7411 7.41561 13.6175 7.6142 13.3994C9.04821 11.8351 12.3834 7.93833 12.3834 5.54892C12.3834 2.48879 9.89464 0 6.83615 0ZM7.31469 13.1243C7.18936 13.2594 7.02008 13.3342 6.83615 13.3342C6.65222 13.3342 6.48295 13.2594 6.35761 13.1243C4.95614 11.5959 1.69584 7.79515 1.69584 5.54896C1.69584 2.7134 4.00067 0.406933 6.83615 0.406933C9.67164 0.406933 11.9765 2.7134 11.9765 5.54896C11.9765 7.79515 8.71617 11.5959 7.31469 13.1243Z" />
                              <path d="M6.83618 8.54554C8.4624 8.54554 9.7807 7.22723 9.7807 5.60102C9.7807 3.9748 8.4624 2.65649 6.83618 2.65649C5.20997 2.65649 3.89166 3.9748 3.89166 5.60102C3.89166 7.22723 5.20997 8.54554 6.83618 8.54554Z" />
                            </svg>
                            <Link href="/experience-grid">Switzerland,</Link>
                            <Link href="/experience-grid">Nepal</Link>
                          </div>
                          <svg
                            className="arrow"
                            width={25}
                            height={6}
                            viewBox="0 0 25 6"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 3L5 5.88675V0.113249L0 3ZM25 3L20 0.113249V5.88675L25 3ZM4.5 3.5H20.5V2.5H4.5V3.5Z" />
                          </svg>
                          <span>45 Minute</span>
                        </div>
                        <ul className="package-info">
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Beginner to Pro-Friendly
                          </li>
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Beach Vibes &amp; Surf Culture
                          </li>
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Swimming &amp; Cliff Jumping
                          </li>
                        </ul>
                        <div className="btn-and-price-area">
                          <Link
                            href="/experience-details"
                            className="primary-btn1"
                          >
                            <span>
                              Book Now
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                              </svg>
                            </span>
                            <span>
                              Book Now
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                              </svg>
                            </span>
                          </Link>
                          <div className="price-area">
                            <h6>Starting From</h6>
                            <span>$89</span>
                          </div>
                        </div>
                        <svg
                          className="divider"
                          height={6}
                          viewBox="0 0 374 6"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5 2.5L0 0.113249V5.88675L5 3.5V2.5ZM369 3.5L374 5.88675V0.113249L369 2.5V3.5ZM4.5 3.5H369.5V2.5H4.5V3.5Z" />
                        </svg>
                        <div className="bottom-area">
                          <ul>
                            <li>
                              <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.2732 12.9807H6.7268C6.68429 12.9807 6.64298 12.9666 6.60935 12.9406C6.55906 12.9018 5.36398 11.9718 4.14989 10.4857C3.43499 9.61078 2.86499 8.72565 2.45543 7.8549C1.93974 6.75846 1.67834 5.68141 1.67834 4.65329C1.67834 3.50657 2.36043 2.33394 3.54995 1.43595C4.1378 0.992226 4.81163 0.641781 5.55321 0.394396C6.33797 0.132617 7.16112 0 8 0C8.83888 0 9.66203 0.132617 10.4466 0.394396C11.1882 0.641781 11.862 0.992035 12.4499 1.43595C13.6392 2.33394 14.3215 3.50676 14.3215 4.65329C14.3215 5.63247 14.0599 6.67939 13.544 7.7647C13.1348 8.62565 12.5652 9.51367 11.8511 10.4036C10.6383 11.9148 9.40697 12.9272 9.39468 12.9371C9.36046 12.9653 9.31752 12.9807 9.2732 12.9807ZM6.79378 12.5969H9.20334C9.4465 12.3905 10.5082 11.4651 11.5563 10.1576C12.6425 8.8026 13.9374 6.74772 13.9374 4.65329C13.9374 2.63794 11.3981 0.38384 7.99981 0.38384C4.60148 0.38384 2.06238 2.63794 2.06238 4.65329C2.06238 6.85769 3.3563 8.90624 4.44199 10.2364C5.49084 11.5215 6.55311 12.4032 6.79378 12.5969Z" />
                                <path d="M7.51886 12.7888C7.51886 12.7888 5.68372 9.03538 5.68372 4.65327C5.68372 2.43045 6.72066 0.191895 8 0.191895C9.27934 0.191895 10.3163 2.43045 10.3163 4.65327C10.3163 8.82024 8.48114 12.7888 8.48114 12.7888" />
                                <path d="M7.34653 12.873C7.32753 12.8343 6.87594 11.9042 6.41802 10.4209C5.9956 9.05229 5.492 6.94079 5.492 4.65329C5.492 3.53843 5.74668 2.39036 6.19079 1.50312C6.67577 0.533921 7.31832 0 8.00002 0C8.68172 0 9.32426 0.53373 9.80944 1.50312C10.2535 2.39036 10.5082 3.53843 10.5082 4.65329C10.5082 6.82928 10.0048 8.94655 9.5824 10.3393C9.12505 11.8478 8.67423 12.8283 8.65542 12.8692L8.30709 12.7082C8.31169 12.6984 8.7675 11.7058 9.21717 10.2213C9.63114 8.85481 10.1246 6.77977 10.1246 4.65329C10.1246 3.5962 9.88467 2.51051 9.46648 1.67489C9.05577 0.854428 8.52146 0.38384 8.00021 0.38384C7.47895 0.38384 6.94465 0.854428 6.53394 1.67489C6.11574 2.51051 5.87584 3.5962 5.87584 4.65329C5.87584 6.893 6.37023 8.96439 6.78497 10.3076C7.23406 11.7626 7.68699 12.6951 7.6916 12.7043L7.34653 12.873ZM8.77038 16H7.22965C6.84658 16 6.5349 15.6883 6.5349 15.3052V13.9892C6.5349 13.8833 6.62088 13.7973 6.72682 13.7973H9.27321C9.37915 13.7973 9.46513 13.8833 9.46513 13.9892V15.3052C9.46513 15.6883 9.15346 16 8.77038 16ZM6.91874 14.1812V15.3052C6.91874 15.4766 7.05826 15.6162 7.22965 15.6162H8.77038C8.94177 15.6162 9.08129 15.4766 9.08129 15.3052V14.1812H6.91874Z" />
                                <path d="M8.90952 14.1812H7.0907C7.00606 14.1812 6.93159 14.126 6.90703 14.045L6.54334 12.8445C6.52568 12.7863 6.53662 12.7232 6.5729 12.6745C6.60917 12.6257 6.66636 12.5969 6.72701 12.5969H9.2734C9.33424 12.5969 9.39143 12.6257 9.42751 12.6745C9.4454 12.6985 9.45739 12.7264 9.46252 12.756C9.46765 12.7855 9.46579 12.8158 9.45707 12.8445L9.09338 14.045C9.06862 14.1258 8.99397 14.1812 8.90952 14.1812ZM7.23291 13.7974H8.76693L9.01431 12.9808H6.98552L7.23291 13.7974Z" />
                              </svg>
                              Experience
                              <div className="info">
                                <svg
                                  width={12}
                                  height={12}
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="M6 0.375C4.88748 0.375 3.79995 0.704901 2.87492 1.32298C1.94989 1.94107 1.22892 2.81957 0.80318 3.84741C0.377437 4.87524 0.266043 6.00624 0.483085 7.09738C0.700127 8.18853 1.23586 9.19081 2.02253 9.97748C2.8092 10.7641 3.81148 11.2999 4.90262 11.5169C5.99376 11.734 7.12476 11.6226 8.1526 11.1968C9.18043 10.7711 10.0589 10.0501 10.677 9.12508C11.2951 8.20006 11.625 7.11252 11.625 6C11.6245 4.50831 11.0317 3.07786 9.97693 2.02307C8.92215 0.968289 7.49169 0.375497 6 0.375ZM6 9.375C5.85167 9.375 5.70666 9.33101 5.58333 9.2486C5.45999 9.16619 5.36386 9.04906 5.30709 8.91201C5.25033 8.77497 5.23548 8.62417 5.26441 8.47868C5.29335 8.3332 5.36478 8.19956 5.46967 8.09467C5.57456 7.98978 5.7082 7.91835 5.85369 7.88941C5.99917 7.86047 6.14997 7.87533 6.28702 7.93209C6.42406 7.98886 6.54119 8.08499 6.62361 8.20832C6.70602 8.33166 6.75 8.47666 6.75 8.625C6.74941 8.82373 6.6702 9.01415 6.52968 9.15468C6.38915 9.2952 6.19873 9.37441 6 9.375ZM6.85875 3.55875L6.6075 6.56625C6.5944 6.71834 6.52472 6.85999 6.41224 6.9632C6.29976 7.0664 6.15266 7.12367 6 7.12367C5.84735 7.12367 5.70024 7.0664 5.58776 6.9632C5.47528 6.85999 5.40561 6.71834 5.3925 6.56625L5.14125 3.55875C5.13042 3.44226 5.1434 3.32478 5.1794 3.21346C5.2154 3.10214 5.27367 2.99931 5.35067 2.91123C5.42767 2.82314 5.52178 2.75165 5.62729 2.70108C5.73279 2.65052 5.84748 2.62195 5.96437 2.61711C6.08127 2.61227 6.19793 2.63126 6.30725 2.67294C6.41657 2.71461 6.51627 2.77808 6.60029 2.8595C6.6843 2.94092 6.75087 3.03858 6.79595 3.14655C6.84103 3.25451 6.86367 3.37051 6.8625 3.4875C6.86313 3.51131 6.86187 3.53514 6.85875 3.55875Z" />
                                  </g>
                                </svg>
                                <div className="tooltip-text">
                                  Including Activities{" "}
                                  <span>
                                    Scuba Diving, Zip-lining, Rafting &amp; Rock
                                    Climbing
                                  </span>{" "}
                                  with this premium package.
                                </div>
                              </div>
                            </li>
                            <li>
                              <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g>
                                  <path d="M8 0C3.58853 0 0 3.58853 0 8C0 12.4115 3.58853 16 8 16C12.4115 16 16 12.4108 16 8C16 3.58916 12.4115 0 8 0ZM8 14.7607C4.27266 14.7607 1.23934 11.728 1.23934 8C1.23934 4.27203 4.27266 1.23934 8 1.23934C11.7273 1.23934 14.7607 4.27203 14.7607 8C14.7607 11.728 11.728 14.7607 8 14.7607Z" />
                                  <path d="M11.0984 7.32445H8.6197V4.84576C8.6197 4.5037 8.3427 4.22607 8.00001 4.22607C7.65733 4.22607 7.38033 4.5037 7.38033 4.84576V7.32445H4.90164C4.55895 7.32445 4.28195 7.60207 4.28195 7.94414C4.28195 8.2862 4.55895 8.56382 4.90164 8.56382H7.38033V11.0425C7.38033 11.3846 7.65733 11.6622 8.00001 11.6622C8.3427 11.6622 8.6197 11.3846 8.6197 11.0425V8.56382H11.0984C11.4411 8.56382 11.7181 8.2862 11.7181 7.94414C11.7181 7.60207 11.4411 7.32445 11.0984 7.32445Z" />
                                </g>
                              </svg>
                              Inclusion
                              <div className="info">
                                <svg
                                  width={12}
                                  height={12}
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="M6 0.375C4.88748 0.375 3.79995 0.704901 2.87492 1.32298C1.94989 1.94107 1.22892 2.81957 0.80318 3.84741C0.377437 4.87524 0.266043 6.00624 0.483085 7.09738C0.700127 8.18853 1.23586 9.19081 2.02253 9.97748C2.8092 10.7641 3.81148 11.2999 4.90262 11.5169C5.99376 11.734 7.12476 11.6226 8.1526 11.1968C9.18043 10.7711 10.0589 10.0501 10.677 9.12508C11.2951 8.20006 11.625 7.11252 11.625 6C11.6245 4.50831 11.0317 3.07786 9.97693 2.02307C8.92215 0.968289 7.49169 0.375497 6 0.375ZM6 9.375C5.85167 9.375 5.70666 9.33101 5.58333 9.2486C5.45999 9.16619 5.36386 9.04906 5.30709 8.91201C5.25033 8.77497 5.23548 8.62417 5.26441 8.47868C5.29335 8.3332 5.36478 8.19956 5.46967 8.09467C5.57456 7.98978 5.7082 7.91835 5.85369 7.88941C5.99917 7.86047 6.14997 7.87533 6.28702 7.93209C6.42406 7.98886 6.54119 8.08499 6.62361 8.20832C6.70602 8.33166 6.75 8.47666 6.75 8.625C6.74941 8.82373 6.6702 9.01415 6.52968 9.15468C6.38915 9.2952 6.19873 9.37441 6 9.375ZM6.85875 3.55875L6.6075 6.56625C6.5944 6.71834 6.52472 6.85999 6.41224 6.9632C6.29976 7.0664 6.15266 7.12367 6 7.12367C5.84735 7.12367 5.70024 7.0664 5.58776 6.9632C5.47528 6.85999 5.40561 6.71834 5.3925 6.56625L5.14125 3.55875C5.13042 3.44226 5.1434 3.32478 5.1794 3.21346C5.2154 3.10214 5.27367 2.99931 5.35067 2.91123C5.42767 2.82314 5.52178 2.75165 5.62729 2.70108C5.73279 2.65052 5.84748 2.62195 5.96437 2.61711C6.08127 2.61227 6.19793 2.63126 6.30725 2.67294C6.41657 2.71461 6.51627 2.77808 6.60029 2.8595C6.6843 2.94092 6.75087 3.03858 6.79595 3.14655C6.84103 3.25451 6.86367 3.37051 6.8625 3.4875C6.86313 3.51131 6.86187 3.53514 6.85875 3.55875Z" />
                                  </g>
                                </svg>
                                <div className="tooltip-text">
                                  This package covers{" "}
                                  <span>
                                    Accommodation, Daily Meals, Entry Fees &amp;
                                    Local Transfers
                                  </span>{" "}
                                  to ensure a worry-free trip.
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-6 item wow animate fadeInDown"
                    data-wow-delay="600ms"
                    data-wow-duration="1500ms"
                  >
                    <div className="package-card">
                      <div className="package-img-wrap">
                        <Swiper
                          {...settings}
                          {...pagination2}
                          modules={[Autoplay, EffectFade, Pagination]}
                          className="swiper package-card-img-slider"
                        >
                          <div className="swiper-wrapper">
                            <SwiperSlide className="swiper-slide">
                              <Link
                                href="/experience-details"
                                className="package-img"
                              >
                                <Image
                                  width={395}
                                  height={235}
                                  src="/assets/img/home6/tour-package-img10.jpg"
                                  alt=""
                                />
                              </Link>
                            </SwiperSlide>
                            <SwiperSlide className="swiper-slide">
                              <Link
                                href="/experience-details"
                                className="package-img"
                              >
                                <Image
                                  width={395}
                                  height={235}
                                  src="/assets/img/home6/tour-package-img11.jpg"
                                  alt=""
                                />
                              </Link>
                            </SwiperSlide>
                            <SwiperSlide className="swiper-slide">
                              <Link
                                href="/experience-details"
                                className="package-img"
                              >
                                <Image
                                  width={395}
                                  height={235}
                                  src="/assets/img/home6/tour-package-img12.jpg"
                                  alt=""
                                />
                              </Link>
                            </SwiperSlide>
                          </div>
                        </Swiper>
                        <div className="slider-pagi-wrap">
                          <div className="package-card-img-pagi paginations" />
                        </div>
                        <div className="batch">
                          <span>Sale On!</span>
                          <span className="discount">City Tour</span>
                        </div>
                      </div>
                      <div className="package-content">
                        <h5>
                          <Link href="/experience-details">
                            City Highlights &amp; Activities
                          </Link>
                        </h5>
                        <div className="location-and-time">
                          <div className="location">
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M6.83615 0C3.77766 0 1.28891 2.48879 1.28891 5.54892C1.28891 7.93837 4.6241 11.8351 6.05811 13.3994C6.25669 13.6175 6.54154 13.7411 6.83615 13.7411C7.13076 13.7411 7.41561 13.6175 7.6142 13.3994C9.04821 11.8351 12.3834 7.93833 12.3834 5.54892C12.3834 2.48879 9.89464 0 6.83615 0ZM7.31469 13.1243C7.18936 13.2594 7.02008 13.3342 6.83615 13.3342C6.65222 13.3342 6.48295 13.2594 6.35761 13.1243C4.95614 11.5959 1.69584 7.79515 1.69584 5.54896C1.69584 2.7134 4.00067 0.406933 6.83615 0.406933C9.67164 0.406933 11.9765 2.7134 11.9765 5.54896C11.9765 7.79515 8.71617 11.5959 7.31469 13.1243Z" />
                              <path d="M6.83618 8.54554C8.4624 8.54554 9.7807 7.22723 9.7807 5.60102C9.7807 3.9748 8.4624 2.65649 6.83618 2.65649C5.20997 2.65649 3.89166 3.9748 3.89166 5.60102C3.89166 7.22723 5.20997 8.54554 6.83618 8.54554Z" />
                            </svg>
                            <Link href="/experience-grid">France</Link>
                          </div>
                          <svg
                            className="arrow"
                            width={25}
                            height={6}
                            viewBox="0 0 25 6"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 3L5 5.88675V0.113249L0 3ZM25 3L20 0.113249V5.88675L25 3ZM4.5 3.5H20.5V2.5H4.5V3.5Z" />
                          </svg>
                          <span>50 Minute</span>
                        </div>
                        <ul className="package-info">
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Beginner to Pro-Friendly
                          </li>
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Beach Vibes &amp; Surf Culture
                          </li>
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Swimming &amp; Cliff Jumping
                          </li>
                        </ul>
                        <div className="btn-and-price-area">
                          <Link
                            href="/experience-details"
                            className="primary-btn1"
                          >
                            <span>
                              Book Now
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                              </svg>
                            </span>
                            <span>
                              Book Now
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                              </svg>
                            </span>
                          </Link>
                          <div className="price-area">
                            <h6>Starting From</h6>
                            <span>$69</span>
                          </div>
                        </div>
                        <svg
                          className="divider"
                          height={6}
                          viewBox="0 0 374 6"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5 2.5L0 0.113249V5.88675L5 3.5V2.5ZM369 3.5L374 5.88675V0.113249L369 2.5V3.5ZM4.5 3.5H369.5V2.5H4.5V3.5Z" />
                        </svg>
                        <div className="bottom-area">
                          <ul>
                            <li>
                              <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.2732 12.9807H6.7268C6.68429 12.9807 6.64298 12.9666 6.60935 12.9406C6.55906 12.9018 5.36398 11.9718 4.14989 10.4857C3.43499 9.61078 2.86499 8.72565 2.45543 7.8549C1.93974 6.75846 1.67834 5.68141 1.67834 4.65329C1.67834 3.50657 2.36043 2.33394 3.54995 1.43595C4.1378 0.992226 4.81163 0.641781 5.55321 0.394396C6.33797 0.132617 7.16112 0 8 0C8.83888 0 9.66203 0.132617 10.4466 0.394396C11.1882 0.641781 11.862 0.992035 12.4499 1.43595C13.6392 2.33394 14.3215 3.50676 14.3215 4.65329C14.3215 5.63247 14.0599 6.67939 13.544 7.7647C13.1348 8.62565 12.5652 9.51367 11.8511 10.4036C10.6383 11.9148 9.40697 12.9272 9.39468 12.9371C9.36046 12.9653 9.31752 12.9807 9.2732 12.9807ZM6.79378 12.5969H9.20334C9.4465 12.3905 10.5082 11.4651 11.5563 10.1576C12.6425 8.8026 13.9374 6.74772 13.9374 4.65329C13.9374 2.63794 11.3981 0.38384 7.99981 0.38384C4.60148 0.38384 2.06238 2.63794 2.06238 4.65329C2.06238 6.85769 3.3563 8.90624 4.44199 10.2364C5.49084 11.5215 6.55311 12.4032 6.79378 12.5969Z" />
                                <path d="M7.51886 12.7888C7.51886 12.7888 5.68372 9.03538 5.68372 4.65327C5.68372 2.43045 6.72066 0.191895 8 0.191895C9.27934 0.191895 10.3163 2.43045 10.3163 4.65327C10.3163 8.82024 8.48114 12.7888 8.48114 12.7888" />
                                <path d="M7.34653 12.873C7.32753 12.8343 6.87594 11.9042 6.41802 10.4209C5.9956 9.05229 5.492 6.94079 5.492 4.65329C5.492 3.53843 5.74668 2.39036 6.19079 1.50312C6.67577 0.533921 7.31832 0 8.00002 0C8.68172 0 9.32426 0.53373 9.80944 1.50312C10.2535 2.39036 10.5082 3.53843 10.5082 4.65329C10.5082 6.82928 10.0048 8.94655 9.5824 10.3393C9.12505 11.8478 8.67423 12.8283 8.65542 12.8692L8.30709 12.7082C8.31169 12.6984 8.7675 11.7058 9.21717 10.2213C9.63114 8.85481 10.1246 6.77977 10.1246 4.65329C10.1246 3.5962 9.88467 2.51051 9.46648 1.67489C9.05577 0.854428 8.52146 0.38384 8.00021 0.38384C7.47895 0.38384 6.94465 0.854428 6.53394 1.67489C6.11574 2.51051 5.87584 3.5962 5.87584 4.65329C5.87584 6.893 6.37023 8.96439 6.78497 10.3076C7.23406 11.7626 7.68699 12.6951 7.6916 12.7043L7.34653 12.873ZM8.77038 16H7.22965C6.84658 16 6.5349 15.6883 6.5349 15.3052V13.9892C6.5349 13.8833 6.62088 13.7973 6.72682 13.7973H9.27321C9.37915 13.7973 9.46513 13.8833 9.46513 13.9892V15.3052C9.46513 15.6883 9.15346 16 8.77038 16ZM6.91874 14.1812V15.3052C6.91874 15.4766 7.05826 15.6162 7.22965 15.6162H8.77038C8.94177 15.6162 9.08129 15.4766 9.08129 15.3052V14.1812H6.91874Z" />
                                <path d="M8.90952 14.1812H7.0907C7.00606 14.1812 6.93159 14.126 6.90703 14.045L6.54334 12.8445C6.52568 12.7863 6.53662 12.7232 6.5729 12.6745C6.60917 12.6257 6.66636 12.5969 6.72701 12.5969H9.2734C9.33424 12.5969 9.39143 12.6257 9.42751 12.6745C9.4454 12.6985 9.45739 12.7264 9.46252 12.756C9.46765 12.7855 9.46579 12.8158 9.45707 12.8445L9.09338 14.045C9.06862 14.1258 8.99397 14.1812 8.90952 14.1812ZM7.23291 13.7974H8.76693L9.01431 12.9808H6.98552L7.23291 13.7974Z" />
                              </svg>
                              Experience
                              <div className="info">
                                <svg
                                  width={12}
                                  height={12}
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="M6 0.375C4.88748 0.375 3.79995 0.704901 2.87492 1.32298C1.94989 1.94107 1.22892 2.81957 0.80318 3.84741C0.377437 4.87524 0.266043 6.00624 0.483085 7.09738C0.700127 8.18853 1.23586 9.19081 2.02253 9.97748C2.8092 10.7641 3.81148 11.2999 4.90262 11.5169C5.99376 11.734 7.12476 11.6226 8.1526 11.1968C9.18043 10.7711 10.0589 10.0501 10.677 9.12508C11.2951 8.20006 11.625 7.11252 11.625 6C11.6245 4.50831 11.0317 3.07786 9.97693 2.02307C8.92215 0.968289 7.49169 0.375497 6 0.375ZM6 9.375C5.85167 9.375 5.70666 9.33101 5.58333 9.2486C5.45999 9.16619 5.36386 9.04906 5.30709 8.91201C5.25033 8.77497 5.23548 8.62417 5.26441 8.47868C5.29335 8.3332 5.36478 8.19956 5.46967 8.09467C5.57456 7.98978 5.7082 7.91835 5.85369 7.88941C5.99917 7.86047 6.14997 7.87533 6.28702 7.93209C6.42406 7.98886 6.54119 8.08499 6.62361 8.20832C6.70602 8.33166 6.75 8.47666 6.75 8.625C6.74941 8.82373 6.6702 9.01415 6.52968 9.15468C6.38915 9.2952 6.19873 9.37441 6 9.375ZM6.85875 3.55875L6.6075 6.56625C6.5944 6.71834 6.52472 6.85999 6.41224 6.9632C6.29976 7.0664 6.15266 7.12367 6 7.12367C5.84735 7.12367 5.70024 7.0664 5.58776 6.9632C5.47528 6.85999 5.40561 6.71834 5.3925 6.56625L5.14125 3.55875C5.13042 3.44226 5.1434 3.32478 5.1794 3.21346C5.2154 3.10214 5.27367 2.99931 5.35067 2.91123C5.42767 2.82314 5.52178 2.75165 5.62729 2.70108C5.73279 2.65052 5.84748 2.62195 5.96437 2.61711C6.08127 2.61227 6.19793 2.63126 6.30725 2.67294C6.41657 2.71461 6.51627 2.77808 6.60029 2.8595C6.6843 2.94092 6.75087 3.03858 6.79595 3.14655C6.84103 3.25451 6.86367 3.37051 6.8625 3.4875C6.86313 3.51131 6.86187 3.53514 6.85875 3.55875Z" />
                                  </g>
                                </svg>
                                <div className="tooltip-text">
                                  Including Activities{" "}
                                  <span>
                                    Scuba Diving, Zip-lining, Rafting &amp; Rock
                                    Climbing
                                  </span>{" "}
                                  with this premium package.
                                </div>
                              </div>
                            </li>
                            <li>
                              <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g>
                                  <path d="M8 0C3.58853 0 0 3.58853 0 8C0 12.4115 3.58853 16 8 16C12.4115 16 16 12.4108 16 8C16 3.58916 12.4115 0 8 0ZM8 14.7607C4.27266 14.7607 1.23934 11.728 1.23934 8C1.23934 4.27203 4.27266 1.23934 8 1.23934C11.7273 1.23934 14.7607 4.27203 14.7607 8C14.7607 11.728 11.728 14.7607 8 14.7607Z" />
                                  <path d="M11.0984 7.32445H8.6197V4.84576C8.6197 4.5037 8.3427 4.22607 8.00001 4.22607C7.65733 4.22607 7.38033 4.5037 7.38033 4.84576V7.32445H4.90164C4.55895 7.32445 4.28195 7.60207 4.28195 7.94414C4.28195 8.2862 4.55895 8.56382 4.90164 8.56382H7.38033V11.0425C7.38033 11.3846 7.65733 11.6622 8.00001 11.6622C8.3427 11.6622 8.6197 11.3846 8.6197 11.0425V8.56382H11.0984C11.4411 8.56382 11.7181 8.2862 11.7181 7.94414C11.7181 7.60207 11.4411 7.32445 11.0984 7.32445Z" />
                                </g>
                              </svg>
                              Inclusion
                              <div className="info">
                                <svg
                                  width={12}
                                  height={12}
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="M6 0.375C4.88748 0.375 3.79995 0.704901 2.87492 1.32298C1.94989 1.94107 1.22892 2.81957 0.80318 3.84741C0.377437 4.87524 0.266043 6.00624 0.483085 7.09738C0.700127 8.18853 1.23586 9.19081 2.02253 9.97748C2.8092 10.7641 3.81148 11.2999 4.90262 11.5169C5.99376 11.734 7.12476 11.6226 8.1526 11.1968C9.18043 10.7711 10.0589 10.0501 10.677 9.12508C11.2951 8.20006 11.625 7.11252 11.625 6C11.6245 4.50831 11.0317 3.07786 9.97693 2.02307C8.92215 0.968289 7.49169 0.375497 6 0.375ZM6 9.375C5.85167 9.375 5.70666 9.33101 5.58333 9.2486C5.45999 9.16619 5.36386 9.04906 5.30709 8.91201C5.25033 8.77497 5.23548 8.62417 5.26441 8.47868C5.29335 8.3332 5.36478 8.19956 5.46967 8.09467C5.57456 7.98978 5.7082 7.91835 5.85369 7.88941C5.99917 7.86047 6.14997 7.87533 6.28702 7.93209C6.42406 7.98886 6.54119 8.08499 6.62361 8.20832C6.70602 8.33166 6.75 8.47666 6.75 8.625C6.74941 8.82373 6.6702 9.01415 6.52968 9.15468C6.38915 9.2952 6.19873 9.37441 6 9.375ZM6.85875 3.55875L6.6075 6.56625C6.5944 6.71834 6.52472 6.85999 6.41224 6.9632C6.29976 7.0664 6.15266 7.12367 6 7.12367C5.84735 7.12367 5.70024 7.0664 5.58776 6.9632C5.47528 6.85999 5.40561 6.71834 5.3925 6.56625L5.14125 3.55875C5.13042 3.44226 5.1434 3.32478 5.1794 3.21346C5.2154 3.10214 5.27367 2.99931 5.35067 2.91123C5.42767 2.82314 5.52178 2.75165 5.62729 2.70108C5.73279 2.65052 5.84748 2.62195 5.96437 2.61711C6.08127 2.61227 6.19793 2.63126 6.30725 2.67294C6.41657 2.71461 6.51627 2.77808 6.60029 2.8595C6.6843 2.94092 6.75087 3.03858 6.79595 3.14655C6.84103 3.25451 6.86367 3.37051 6.8625 3.4875C6.86313 3.51131 6.86187 3.53514 6.85875 3.55875Z" />
                                  </g>
                                </svg>
                                <div className="tooltip-text">
                                  This package covers{" "}
                                  <span>
                                    Accommodation, Daily Meals, Entry Fees &amp;
                                    Local Transfers
                                  </span>{" "}
                                  to ensure a worry-free trip.
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-6 item wow animate fadeInDown"
                    data-wow-delay="400ms"
                    data-wow-duration="1500ms"
                  >
                    <div className="package-card">
                      <div className="package-img-wrap">
                        <Link
                          href="/experience-details"
                          className="package-img"
                        >
                          <Image
                            width={330}
                            height={200}
                            src="/assets/img/innerpages/tour-package-img6.jpg"
                            alt=""
                          />
                        </Link>
                        <div className="batch">
                          <span className="yellow-bg">Family Tour</span>
                        </div>
                      </div>
                      <div className="package-content">
                        <h5>
                          <Link href="/experience-details">
                            Hiking &amp; Trekking
                          </Link>
                        </h5>
                        <div className="location-and-time">
                          <div className="location">
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M6.83615 0C3.77766 0 1.28891 2.48879 1.28891 5.54892C1.28891 7.93837 4.6241 11.8351 6.05811 13.3994C6.25669 13.6175 6.54154 13.7411 6.83615 13.7411C7.13076 13.7411 7.41561 13.6175 7.6142 13.3994C9.04821 11.8351 12.3834 7.93833 12.3834 5.54892C12.3834 2.48879 9.89464 0 6.83615 0ZM7.31469 13.1243C7.18936 13.2594 7.02008 13.3342 6.83615 13.3342C6.65222 13.3342 6.48295 13.2594 6.35761 13.1243C4.95614 11.5959 1.69584 7.79515 1.69584 5.54896C1.69584 2.7134 4.00067 0.406933 6.83615 0.406933C9.67164 0.406933 11.9765 2.7134 11.9765 5.54896C11.9765 7.79515 8.71617 11.5959 7.31469 13.1243Z" />
                              <path d="M6.83618 8.54554C8.4624 8.54554 9.7807 7.22723 9.7807 5.60102C9.7807 3.9748 8.4624 2.65649 6.83618 2.65649C5.20997 2.65649 3.89166 3.9748 3.89166 5.60102C3.89166 7.22723 5.20997 8.54554 6.83618 8.54554Z" />
                            </svg>
                            <Link href="/experience-grid">Switzerland,</Link>
                            <Link href="/experience-grid">Nepal</Link>
                          </div>
                          <svg
                            className="arrow"
                            width={25}
                            height={6}
                            viewBox="0 0 25 6"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 3L5 5.88675V0.113249L0 3ZM25 3L20 0.113249V5.88675L25 3ZM4.5 3.5H20.5V2.5H4.5V3.5Z" />
                          </svg>
                          <span>01 Hour</span>
                        </div>
                        <ul className="package-info">
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Beginner to Pro-Friendly
                          </li>
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Beach Vibes &amp; Surf Culture
                          </li>
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Swimming &amp; Cliff Jumping
                          </li>
                        </ul>
                        <div className="btn-and-price-area">
                          <Link
                            href="/experience-details"
                            className="primary-btn1"
                          >
                            <span>
                              Book Now
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                              </svg>
                            </span>
                            <span>
                              Book Now
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                              </svg>
                            </span>
                          </Link>
                          <div className="price-area">
                            <h6>Starting From</h6>
                            <span>$89</span>
                          </div>
                        </div>
                        <svg
                          className="divider"
                          height={6}
                          viewBox="0 0 374 6"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5 2.5L0 0.113249V5.88675L5 3.5V2.5ZM369 3.5L374 5.88675V0.113249L369 2.5V3.5ZM4.5 3.5H369.5V2.5H4.5V3.5Z" />
                        </svg>
                        <div className="bottom-area">
                          <ul>
                            <li>
                              <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.2732 12.9807H6.7268C6.68429 12.9807 6.64298 12.9666 6.60935 12.9406C6.55906 12.9018 5.36398 11.9718 4.14989 10.4857C3.43499 9.61078 2.86499 8.72565 2.45543 7.8549C1.93974 6.75846 1.67834 5.68141 1.67834 4.65329C1.67834 3.50657 2.36043 2.33394 3.54995 1.43595C4.1378 0.992226 4.81163 0.641781 5.55321 0.394396C6.33797 0.132617 7.16112 0 8 0C8.83888 0 9.66203 0.132617 10.4466 0.394396C11.1882 0.641781 11.862 0.992035 12.4499 1.43595C13.6392 2.33394 14.3215 3.50676 14.3215 4.65329C14.3215 5.63247 14.0599 6.67939 13.544 7.7647C13.1348 8.62565 12.5652 9.51367 11.8511 10.4036C10.6383 11.9148 9.40697 12.9272 9.39468 12.9371C9.36046 12.9653 9.31752 12.9807 9.2732 12.9807ZM6.79378 12.5969H9.20334C9.4465 12.3905 10.5082 11.4651 11.5563 10.1576C12.6425 8.8026 13.9374 6.74772 13.9374 4.65329C13.9374 2.63794 11.3981 0.38384 7.99981 0.38384C4.60148 0.38384 2.06238 2.63794 2.06238 4.65329C2.06238 6.85769 3.3563 8.90624 4.44199 10.2364C5.49084 11.5215 6.55311 12.4032 6.79378 12.5969Z" />
                                <path d="M7.51886 12.7888C7.51886 12.7888 5.68372 9.03538 5.68372 4.65327C5.68372 2.43045 6.72066 0.191895 8 0.191895C9.27934 0.191895 10.3163 2.43045 10.3163 4.65327C10.3163 8.82024 8.48114 12.7888 8.48114 12.7888" />
                                <path d="M7.34653 12.873C7.32753 12.8343 6.87594 11.9042 6.41802 10.4209C5.9956 9.05229 5.492 6.94079 5.492 4.65329C5.492 3.53843 5.74668 2.39036 6.19079 1.50312C6.67577 0.533921 7.31832 0 8.00002 0C8.68172 0 9.32426 0.53373 9.80944 1.50312C10.2535 2.39036 10.5082 3.53843 10.5082 4.65329C10.5082 6.82928 10.0048 8.94655 9.5824 10.3393C9.12505 11.8478 8.67423 12.8283 8.65542 12.8692L8.30709 12.7082C8.31169 12.6984 8.7675 11.7058 9.21717 10.2213C9.63114 8.85481 10.1246 6.77977 10.1246 4.65329C10.1246 3.5962 9.88467 2.51051 9.46648 1.67489C9.05577 0.854428 8.52146 0.38384 8.00021 0.38384C7.47895 0.38384 6.94465 0.854428 6.53394 1.67489C6.11574 2.51051 5.87584 3.5962 5.87584 4.65329C5.87584 6.893 6.37023 8.96439 6.78497 10.3076C7.23406 11.7626 7.68699 12.6951 7.6916 12.7043L7.34653 12.873ZM8.77038 16H7.22965C6.84658 16 6.5349 15.6883 6.5349 15.3052V13.9892C6.5349 13.8833 6.62088 13.7973 6.72682 13.7973H9.27321C9.37915 13.7973 9.46513 13.8833 9.46513 13.9892V15.3052C9.46513 15.6883 9.15346 16 8.77038 16ZM6.91874 14.1812V15.3052C6.91874 15.4766 7.05826 15.6162 7.22965 15.6162H8.77038C8.94177 15.6162 9.08129 15.4766 9.08129 15.3052V14.1812H6.91874Z" />
                                <path d="M8.90952 14.1812H7.0907C7.00606 14.1812 6.93159 14.126 6.90703 14.045L6.54334 12.8445C6.52568 12.7863 6.53662 12.7232 6.5729 12.6745C6.60917 12.6257 6.66636 12.5969 6.72701 12.5969H9.2734C9.33424 12.5969 9.39143 12.6257 9.42751 12.6745C9.4454 12.6985 9.45739 12.7264 9.46252 12.756C9.46765 12.7855 9.46579 12.8158 9.45707 12.8445L9.09338 14.045C9.06862 14.1258 8.99397 14.1812 8.90952 14.1812ZM7.23291 13.7974H8.76693L9.01431 12.9808H6.98552L7.23291 13.7974Z" />
                              </svg>
                              Experience
                              <div className="info">
                                <svg
                                  width={12}
                                  height={12}
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="M6 0.375C4.88748 0.375 3.79995 0.704901 2.87492 1.32298C1.94989 1.94107 1.22892 2.81957 0.80318 3.84741C0.377437 4.87524 0.266043 6.00624 0.483085 7.09738C0.700127 8.18853 1.23586 9.19081 2.02253 9.97748C2.8092 10.7641 3.81148 11.2999 4.90262 11.5169C5.99376 11.734 7.12476 11.6226 8.1526 11.1968C9.18043 10.7711 10.0589 10.0501 10.677 9.12508C11.2951 8.20006 11.625 7.11252 11.625 6C11.6245 4.50831 11.0317 3.07786 9.97693 2.02307C8.92215 0.968289 7.49169 0.375497 6 0.375ZM6 9.375C5.85167 9.375 5.70666 9.33101 5.58333 9.2486C5.45999 9.16619 5.36386 9.04906 5.30709 8.91201C5.25033 8.77497 5.23548 8.62417 5.26441 8.47868C5.29335 8.3332 5.36478 8.19956 5.46967 8.09467C5.57456 7.98978 5.7082 7.91835 5.85369 7.88941C5.99917 7.86047 6.14997 7.87533 6.28702 7.93209C6.42406 7.98886 6.54119 8.08499 6.62361 8.20832C6.70602 8.33166 6.75 8.47666 6.75 8.625C6.74941 8.82373 6.6702 9.01415 6.52968 9.15468C6.38915 9.2952 6.19873 9.37441 6 9.375ZM6.85875 3.55875L6.6075 6.56625C6.5944 6.71834 6.52472 6.85999 6.41224 6.9632C6.29976 7.0664 6.15266 7.12367 6 7.12367C5.84735 7.12367 5.70024 7.0664 5.58776 6.9632C5.47528 6.85999 5.40561 6.71834 5.3925 6.56625L5.14125 3.55875C5.13042 3.44226 5.1434 3.32478 5.1794 3.21346C5.2154 3.10214 5.27367 2.99931 5.35067 2.91123C5.42767 2.82314 5.52178 2.75165 5.62729 2.70108C5.73279 2.65052 5.84748 2.62195 5.96437 2.61711C6.08127 2.61227 6.19793 2.63126 6.30725 2.67294C6.41657 2.71461 6.51627 2.77808 6.60029 2.8595C6.6843 2.94092 6.75087 3.03858 6.79595 3.14655C6.84103 3.25451 6.86367 3.37051 6.8625 3.4875C6.86313 3.51131 6.86187 3.53514 6.85875 3.55875Z" />
                                  </g>
                                </svg>
                                <div className="tooltip-text">
                                  Including Activities{" "}
                                  <span>
                                    Scuba Diving, Zip-lining, Rafting &amp; Rock
                                    Climbing
                                  </span>{" "}
                                  with this premium package.
                                </div>
                              </div>
                            </li>
                            <li>
                              <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g>
                                  <path d="M8 0C3.58853 0 0 3.58853 0 8C0 12.4115 3.58853 16 8 16C12.4115 16 16 12.4108 16 8C16 3.58916 12.4115 0 8 0ZM8 14.7607C4.27266 14.7607 1.23934 11.728 1.23934 8C1.23934 4.27203 4.27266 1.23934 8 1.23934C11.7273 1.23934 14.7607 4.27203 14.7607 8C14.7607 11.728 11.728 14.7607 8 14.7607Z" />
                                  <path d="M11.0984 7.32445H8.6197V4.84576C8.6197 4.5037 8.3427 4.22607 8.00001 4.22607C7.65733 4.22607 7.38033 4.5037 7.38033 4.84576V7.32445H4.90164C4.55895 7.32445 4.28195 7.60207 4.28195 7.94414C4.28195 8.2862 4.55895 8.56382 4.90164 8.56382H7.38033V11.0425C7.38033 11.3846 7.65733 11.6622 8.00001 11.6622C8.3427 11.6622 8.6197 11.3846 8.6197 11.0425V8.56382H11.0984C11.4411 8.56382 11.7181 8.2862 11.7181 7.94414C11.7181 7.60207 11.4411 7.32445 11.0984 7.32445Z" />
                                </g>
                              </svg>
                              Inclusion
                              <div className="info">
                                <svg
                                  width={12}
                                  height={12}
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="M6 0.375C4.88748 0.375 3.79995 0.704901 2.87492 1.32298C1.94989 1.94107 1.22892 2.81957 0.80318 3.84741C0.377437 4.87524 0.266043 6.00624 0.483085 7.09738C0.700127 8.18853 1.23586 9.19081 2.02253 9.97748C2.8092 10.7641 3.81148 11.2999 4.90262 11.5169C5.99376 11.734 7.12476 11.6226 8.1526 11.1968C9.18043 10.7711 10.0589 10.0501 10.677 9.12508C11.2951 8.20006 11.625 7.11252 11.625 6C11.6245 4.50831 11.0317 3.07786 9.97693 2.02307C8.92215 0.968289 7.49169 0.375497 6 0.375ZM6 9.375C5.85167 9.375 5.70666 9.33101 5.58333 9.2486C5.45999 9.16619 5.36386 9.04906 5.30709 8.91201C5.25033 8.77497 5.23548 8.62417 5.26441 8.47868C5.29335 8.3332 5.36478 8.19956 5.46967 8.09467C5.57456 7.98978 5.7082 7.91835 5.85369 7.88941C5.99917 7.86047 6.14997 7.87533 6.28702 7.93209C6.42406 7.98886 6.54119 8.08499 6.62361 8.20832C6.70602 8.33166 6.75 8.47666 6.75 8.625C6.74941 8.82373 6.6702 9.01415 6.52968 9.15468C6.38915 9.2952 6.19873 9.37441 6 9.375ZM6.85875 3.55875L6.6075 6.56625C6.5944 6.71834 6.52472 6.85999 6.41224 6.9632C6.29976 7.0664 6.15266 7.12367 6 7.12367C5.84735 7.12367 5.70024 7.0664 5.58776 6.9632C5.47528 6.85999 5.40561 6.71834 5.3925 6.56625L5.14125 3.55875C5.13042 3.44226 5.1434 3.32478 5.1794 3.21346C5.2154 3.10214 5.27367 2.99931 5.35067 2.91123C5.42767 2.82314 5.52178 2.75165 5.62729 2.70108C5.73279 2.65052 5.84748 2.62195 5.96437 2.61711C6.08127 2.61227 6.19793 2.63126 6.30725 2.67294C6.41657 2.71461 6.51627 2.77808 6.60029 2.8595C6.6843 2.94092 6.75087 3.03858 6.79595 3.14655C6.84103 3.25451 6.86367 3.37051 6.8625 3.4875C6.86313 3.51131 6.86187 3.53514 6.85875 3.55875Z" />
                                  </g>
                                </svg>
                                <div className="tooltip-text">
                                  This package covers{" "}
                                  <span>
                                    Accommodation, Daily Meals, Entry Fees &amp;
                                    Local Transfers
                                  </span>{" "}
                                  to ensure a worry-free trip.
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-6 item wow animate fadeInDown"
                    data-wow-delay="200ms"
                    data-wow-duration="1500ms"
                  >
                    <div className="package-card">
                      <div className="package-img-wrap">
                        <Link
                          href="/experience-details"
                          className="package-img"
                        >
                          <Image
                            width={330}
                            height={200}
                            src="/assets/img/innerpages/tour-package-img7.jpg"
                            alt=""
                          />
                        </Link>
                        <div className="batch">
                          <span>Sale on!</span>
                        </div>
                      </div>
                      <div className="package-content">
                        <h5>
                          <Link href="/experience-details">
                            Scuba Diving &amp; Snorkeling
                          </Link>
                        </h5>
                        <div className="location-and-time">
                          <div className="location">
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M6.83615 0C3.77766 0 1.28891 2.48879 1.28891 5.54892C1.28891 7.93837 4.6241 11.8351 6.05811 13.3994C6.25669 13.6175 6.54154 13.7411 6.83615 13.7411C7.13076 13.7411 7.41561 13.6175 7.6142 13.3994C9.04821 11.8351 12.3834 7.93833 12.3834 5.54892C12.3834 2.48879 9.89464 0 6.83615 0ZM7.31469 13.1243C7.18936 13.2594 7.02008 13.3342 6.83615 13.3342C6.65222 13.3342 6.48295 13.2594 6.35761 13.1243C4.95614 11.5959 1.69584 7.79515 1.69584 5.54896C1.69584 2.7134 4.00067 0.406933 6.83615 0.406933C9.67164 0.406933 11.9765 2.7134 11.9765 5.54896C11.9765 7.79515 8.71617 11.5959 7.31469 13.1243Z" />
                              <path d="M6.83618 8.54554C8.4624 8.54554 9.7807 7.22723 9.7807 5.60102C9.7807 3.9748 8.4624 2.65649 6.83618 2.65649C5.20997 2.65649 3.89166 3.9748 3.89166 5.60102C3.89166 7.22723 5.20997 8.54554 6.83618 8.54554Z" />
                            </svg>
                            <Link href="/experience-grid">Maldives</Link>
                          </div>
                          <svg
                            className="arrow"
                            width={25}
                            height={6}
                            viewBox="0 0 25 6"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 3L5 5.88675V0.113249L0 3ZM25 3L20 0.113249V5.88675L25 3ZM4.5 3.5H20.5V2.5H4.5V3.5Z" />
                          </svg>
                          <span>20 Minute</span>
                        </div>
                        <ul className="package-info">
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Beginner to Pro-Friendly
                          </li>
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Beach Vibes &amp; Surf Culture
                          </li>
                          <li>
                            <svg
                              width={14}
                              height={14}
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width={14} height={14} rx={7} />
                              <path d="M10.6947 5.45777L6.24644 9.90841C6.17556 9.97689 6.08572 10.0124 5.99596 10.0124C5.9494 10.0125 5.90328 10.0033 5.86027 9.98548C5.81727 9.96763 5.77822 9.94144 5.7454 9.90841L3.3038 7.46681C3.16436 7.32969 3.16436 7.10521 3.3038 6.96577L4.16652 6.10065C4.29892 5.96833 4.53524 5.96833 4.66764 6.10065L5.99596 7.42897L9.33092 4.09161C9.36377 4.05868 9.40278 4.03255 9.44573 4.01471C9.48868 3.99686 9.53473 3.98766 9.58124 3.98761C9.67572 3.98761 9.76556 4.02545 9.83172 4.09161L10.6944 4.95681C10.8341 5.09625 10.8341 5.32073 10.6947 5.45777Z" />
                            </svg>
                            Swimming &amp; Cliff Jumping
                          </li>
                        </ul>
                        <div className="btn-and-price-area">
                          <Link
                            href="/experience-details"
                            className="primary-btn1"
                          >
                            <span>
                              Book Now
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                              </svg>
                            </span>
                            <span>
                              Book Now
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                              </svg>
                            </span>
                          </Link>
                          <div className="price-area">
                            <h6>Starting From</h6>
                            <span>$49</span>
                          </div>
                        </div>
                        <svg
                          className="divider"
                          height={6}
                          viewBox="0 0 374 6"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5 2.5L0 0.113249V5.88675L5 3.5V2.5ZM369 3.5L374 5.88675V0.113249L369 2.5V3.5ZM4.5 3.5H369.5V2.5H4.5V3.5Z" />
                        </svg>
                        <div className="bottom-area">
                          <ul>
                            <li>
                              <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.2732 12.9807H6.7268C6.68429 12.9807 6.64298 12.9666 6.60935 12.9406C6.55906 12.9018 5.36398 11.9718 4.14989 10.4857C3.43499 9.61078 2.86499 8.72565 2.45543 7.8549C1.93974 6.75846 1.67834 5.68141 1.67834 4.65329C1.67834 3.50657 2.36043 2.33394 3.54995 1.43595C4.1378 0.992226 4.81163 0.641781 5.55321 0.394396C6.33797 0.132617 7.16112 0 8 0C8.83888 0 9.66203 0.132617 10.4466 0.394396C11.1882 0.641781 11.862 0.992035 12.4499 1.43595C13.6392 2.33394 14.3215 3.50676 14.3215 4.65329C14.3215 5.63247 14.0599 6.67939 13.544 7.7647C13.1348 8.62565 12.5652 9.51367 11.8511 10.4036C10.6383 11.9148 9.40697 12.9272 9.39468 12.9371C9.36046 12.9653 9.31752 12.9807 9.2732 12.9807ZM6.79378 12.5969H9.20334C9.4465 12.3905 10.5082 11.4651 11.5563 10.1576C12.6425 8.8026 13.9374 6.74772 13.9374 4.65329C13.9374 2.63794 11.3981 0.38384 7.99981 0.38384C4.60148 0.38384 2.06238 2.63794 2.06238 4.65329C2.06238 6.85769 3.3563 8.90624 4.44199 10.2364C5.49084 11.5215 6.55311 12.4032 6.79378 12.5969Z" />
                                <path d="M7.51886 12.7888C7.51886 12.7888 5.68372 9.03538 5.68372 4.65327C5.68372 2.43045 6.72066 0.191895 8 0.191895C9.27934 0.191895 10.3163 2.43045 10.3163 4.65327C10.3163 8.82024 8.48114 12.7888 8.48114 12.7888" />
                                <path d="M7.34653 12.873C7.32753 12.8343 6.87594 11.9042 6.41802 10.4209C5.9956 9.05229 5.492 6.94079 5.492 4.65329C5.492 3.53843 5.74668 2.39036 6.19079 1.50312C6.67577 0.533921 7.31832 0 8.00002 0C8.68172 0 9.32426 0.53373 9.80944 1.50312C10.2535 2.39036 10.5082 3.53843 10.5082 4.65329C10.5082 6.82928 10.0048 8.94655 9.5824 10.3393C9.12505 11.8478 8.67423 12.8283 8.65542 12.8692L8.30709 12.7082C8.31169 12.6984 8.7675 11.7058 9.21717 10.2213C9.63114 8.85481 10.1246 6.77977 10.1246 4.65329C10.1246 3.5962 9.88467 2.51051 9.46648 1.67489C9.05577 0.854428 8.52146 0.38384 8.00021 0.38384C7.47895 0.38384 6.94465 0.854428 6.53394 1.67489C6.11574 2.51051 5.87584 3.5962 5.87584 4.65329C5.87584 6.893 6.37023 8.96439 6.78497 10.3076C7.23406 11.7626 7.68699 12.6951 7.6916 12.7043L7.34653 12.873ZM8.77038 16H7.22965C6.84658 16 6.5349 15.6883 6.5349 15.3052V13.9892C6.5349 13.8833 6.62088 13.7973 6.72682 13.7973H9.27321C9.37915 13.7973 9.46513 13.8833 9.46513 13.9892V15.3052C9.46513 15.6883 9.15346 16 8.77038 16ZM6.91874 14.1812V15.3052C6.91874 15.4766 7.05826 15.6162 7.22965 15.6162H8.77038C8.94177 15.6162 9.08129 15.4766 9.08129 15.3052V14.1812H6.91874Z" />
                                <path d="M8.90952 14.1812H7.0907C7.00606 14.1812 6.93159 14.126 6.90703 14.045L6.54334 12.8445C6.52568 12.7863 6.53662 12.7232 6.5729 12.6745C6.60917 12.6257 6.66636 12.5969 6.72701 12.5969H9.2734C9.33424 12.5969 9.39143 12.6257 9.42751 12.6745C9.4454 12.6985 9.45739 12.7264 9.46252 12.756C9.46765 12.7855 9.46579 12.8158 9.45707 12.8445L9.09338 14.045C9.06862 14.1258 8.99397 14.1812 8.90952 14.1812ZM7.23291 13.7974H8.76693L9.01431 12.9808H6.98552L7.23291 13.7974Z" />
                              </svg>
                              Experience
                              <div className="info">
                                <svg
                                  width={12}
                                  height={12}
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="M6 0.375C4.88748 0.375 3.79995 0.704901 2.87492 1.32298C1.94989 1.94107 1.22892 2.81957 0.80318 3.84741C0.377437 4.87524 0.266043 6.00624 0.483085 7.09738C0.700127 8.18853 1.23586 9.19081 2.02253 9.97748C2.8092 10.7641 3.81148 11.2999 4.90262 11.5169C5.99376 11.734 7.12476 11.6226 8.1526 11.1968C9.18043 10.7711 10.0589 10.0501 10.677 9.12508C11.2951 8.20006 11.625 7.11252 11.625 6C11.6245 4.50831 11.0317 3.07786 9.97693 2.02307C8.92215 0.968289 7.49169 0.375497 6 0.375ZM6 9.375C5.85167 9.375 5.70666 9.33101 5.58333 9.2486C5.45999 9.16619 5.36386 9.04906 5.30709 8.91201C5.25033 8.77497 5.23548 8.62417 5.26441 8.47868C5.29335 8.3332 5.36478 8.19956 5.46967 8.09467C5.57456 7.98978 5.7082 7.91835 5.85369 7.88941C5.99917 7.86047 6.14997 7.87533 6.28702 7.93209C6.42406 7.98886 6.54119 8.08499 6.62361 8.20832C6.70602 8.33166 6.75 8.47666 6.75 8.625C6.74941 8.82373 6.6702 9.01415 6.52968 9.15468C6.38915 9.2952 6.19873 9.37441 6 9.375ZM6.85875 3.55875L6.6075 6.56625C6.5944 6.71834 6.52472 6.85999 6.41224 6.9632C6.29976 7.0664 6.15266 7.12367 6 7.12367C5.84735 7.12367 5.70024 7.0664 5.58776 6.9632C5.47528 6.85999 5.40561 6.71834 5.3925 6.56625L5.14125 3.55875C5.13042 3.44226 5.1434 3.32478 5.1794 3.21346C5.2154 3.10214 5.27367 2.99931 5.35067 2.91123C5.42767 2.82314 5.52178 2.75165 5.62729 2.70108C5.73279 2.65052 5.84748 2.62195 5.96437 2.61711C6.08127 2.61227 6.19793 2.63126 6.30725 2.67294C6.41657 2.71461 6.51627 2.77808 6.60029 2.8595C6.6843 2.94092 6.75087 3.03858 6.79595 3.14655C6.84103 3.25451 6.86367 3.37051 6.8625 3.4875C6.86313 3.51131 6.86187 3.53514 6.85875 3.55875Z" />
                                  </g>
                                </svg>
                                <div className="tooltip-text">
                                  Including Activities{" "}
                                  <span>
                                    Scuba Diving, Zip-lining, Rafting &amp; Rock
                                    Climbing
                                  </span>{" "}
                                  with this premium package.
                                </div>
                              </div>
                            </li>
                            <li>
                              <svg
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g>
                                  <path d="M8 0C3.58853 0 0 3.58853 0 8C0 12.4115 3.58853 16 8 16C12.4115 16 16 12.4108 16 8C16 3.58916 12.4115 0 8 0ZM8 14.7607C4.27266 14.7607 1.23934 11.728 1.23934 8C1.23934 4.27203 4.27266 1.23934 8 1.23934C11.7273 1.23934 14.7607 4.27203 14.7607 8C14.7607 11.728 11.728 14.7607 8 14.7607Z" />
                                  <path d="M11.0984 7.32445H8.6197V4.84576C8.6197 4.5037 8.3427 4.22607 8.00001 4.22607C7.65733 4.22607 7.38033 4.5037 7.38033 4.84576V7.32445H4.90164C4.55895 7.32445 4.28195 7.60207 4.28195 7.94414C4.28195 8.2862 4.55895 8.56382 4.90164 8.56382H7.38033V11.0425C7.38033 11.3846 7.65733 11.6622 8.00001 11.6622C8.3427 11.6622 8.6197 11.3846 8.6197 11.0425V8.56382H11.0984C11.4411 8.56382 11.7181 8.2862 11.7181 7.94414C11.7181 7.60207 11.4411 7.32445 11.0984 7.32445Z" />
                                </g>
                              </svg>
                              Inclusion
                              <div className="info">
                                <svg
                                  width={12}
                                  height={12}
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="M6 0.375C4.88748 0.375 3.79995 0.704901 2.87492 1.32298C1.94989 1.94107 1.22892 2.81957 0.80318 3.84741C0.377437 4.87524 0.266043 6.00624 0.483085 7.09738C0.700127 8.18853 1.23586 9.19081 2.02253 9.97748C2.8092 10.7641 3.81148 11.2999 4.90262 11.5169C5.99376 11.734 7.12476 11.6226 8.1526 11.1968C9.18043 10.7711 10.0589 10.0501 10.677 9.12508C11.2951 8.20006 11.625 7.11252 11.625 6C11.6245 4.50831 11.0317 3.07786 9.97693 2.02307C8.92215 0.968289 7.49169 0.375497 6 0.375ZM6 9.375C5.85167 9.375 5.70666 9.33101 5.58333 9.2486C5.45999 9.16619 5.36386 9.04906 5.30709 8.91201C5.25033 8.77497 5.23548 8.62417 5.26441 8.47868C5.29335 8.3332 5.36478 8.19956 5.46967 8.09467C5.57456 7.98978 5.7082 7.91835 5.85369 7.88941C5.99917 7.86047 6.14997 7.87533 6.28702 7.93209C6.42406 7.98886 6.54119 8.08499 6.62361 8.20832C6.70602 8.33166 6.75 8.47666 6.75 8.625C6.74941 8.82373 6.6702 9.01415 6.52968 9.15468C6.38915 9.2952 6.19873 9.37441 6 9.375ZM6.85875 3.55875L6.6075 6.56625C6.5944 6.71834 6.52472 6.85999 6.41224 6.9632C6.29976 7.0664 6.15266 7.12367 6 7.12367C5.84735 7.12367 5.70024 7.0664 5.58776 6.9632C5.47528 6.85999 5.40561 6.71834 5.3925 6.56625L5.14125 3.55875C5.13042 3.44226 5.1434 3.32478 5.1794 3.21346C5.2154 3.10214 5.27367 2.99931 5.35067 2.91123C5.42767 2.82314 5.52178 2.75165 5.62729 2.70108C5.73279 2.65052 5.84748 2.62195 5.96437 2.61711C6.08127 2.61227 6.19793 2.63126 6.30725 2.67294C6.41657 2.71461 6.51627 2.77808 6.60029 2.8595C6.6843 2.94092 6.75087 3.03858 6.79595 3.14655C6.84103 3.25451 6.86367 3.37051 6.8625 3.4875C6.86313 3.51131 6.86187 3.53514 6.85875 3.55875Z" />
                                  </g>
                                </svg>
                                <div className="tooltip-text">
                                  This package covers{" "}
                                  <span>
                                    Accommodation, Daily Meals, Entry Fees &amp;
                                    Local Transfers
                                  </span>{" "}
                                  to ensure a worry-free trip.
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="pagination-area mt-60 wow animate fadeInUp"
                data-wow-delay="200ms"
                data-wow-duration="1500ms"
              >
                <div className="paginations-button">
                  <a href="#">
                    <svg
                      width={10}
                      height={10}
                      viewBox="0 0 10 10"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <path
                          d="M7.86133 9.28516C7.14704 7.49944 3.57561 5.71373 1.43276 4.99944C3.57561 4.28516 6.7899 3.21373 7.86133 0.713728"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </g>
                    </svg>
                    Prev
                  </a>
                </div>
                <ul className="paginations">
                  <li className="page-item active">
                    <a href="#">01</a>
                  </li>
                  <li className="page-item">
                    <a href="#">02</a>
                  </li>
                  <li className="page-item">
                    <a href="#">03</a>
                  </li>
                  <li className="page-item">
                    <a href="#">04</a>
                  </li>
                </ul>
                <div className="paginations-button">
                  <a href="#">
                    Next
                    <svg
                      width={10}
                      height={10}
                      viewBox="0 0 10 10"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <path
                          d="M1.42969 9.28613C2.14397 7.50042 5.7154 5.7147 7.85826 5.00042C5.7154 4.28613 2.50112 3.21471 1.42969 0.714705"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </g>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackageGrid;
