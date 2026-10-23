import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const AboutV3 = () => {
  return (
    <div className="home3-about-section">
      <div className="container">
        <div className="about-wrapper">
          <div className="row align-items-center justify-content-between">
            <div className="col-xl-6 col-lg-7 wow animate fadeInLeft" data-wow-delay="200ms" data-wow-duration="1500ms">
              <div className="about-content">
                <div className="section-title">
                  <h2>Why We’re Best Agency</h2>
                  <h4>Welcome to GoFly Travel Agency – Your Gateway to Unforgettable Journeys!</h4>
                  <p>GoFly Travel Agency is a trusted name in the travel industry, offering seamless travel planning, personalized itineraries, and unforgettable adventures. With years of experience and a network of global partners, we ensure a hassle-free and memorable journey for every traveler.</p>
                  <Link href="/about">
                    About More GoFly
                    <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 9L9 1M9 1C7.22222 1.33333 3.33333 2 1 1M9 1C8.66667 2.66667 8 6.33333 9 9" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </Link>
                </div>
                <div className="review-area">
                  <a href="https://www.tripadvisor.com/" className="single-rating">
                    <strong>4.5</strong>
                    <div className="tripadvisor-rating">
                      <Image width={135} height={28} src="/assets/img/home1/icon/tripadvisor-logo.svg" alt="" />
                      <div className="rating-area">
                        <span>Reviews</span>
                        <Image width={65} height={12} src="/assets/img/home1/icon/tripadvisor-start.svg" alt="" />
                      </div>
                    </div>
                  </a>
                  <a href="https://www.trustpilot.com/" className="single-rating">
                    <strong>4.5</strong>
                    <div className="trustpilot-rating">
                      <Image width={100} height={24} src="/assets/img/home1/icon/trustpilot-logo.svg" alt="" />
                      <div className="rating-area">
                        <Image width={80} height={16} src="/assets/img/home1/icon/trustpilot-star.svg" alt="" />
                      </div>
                    </div>
                  </a>
                  <svg className="divider" width={6} height={54} viewBox="0 0 6 54" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 5L5.88675 0H0.113249L2.5 5H3.5ZM2.5 49L0.113249 54H5.88675L3.5 49H2.5ZM2.5 4.5V49.5H3.5V4.5H2.5Z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="col-lg-5 d-lg-block d-none wow animate fadeInRight" data-wow-delay="200ms" data-wow-duration="1500ms">
              <div className="about-img">
                <Image width={550} height={220} src="/assets/img/home3/about-img.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutV3
