import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const FeatureSectionV4 = () => {
  return (
    <div className="home4-feature-section mb-100">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="feature-card">
              <div className="icon">
                <Image width={60} height={220} src="/assets/img/home4/icon/feature-icon1.svg" alt="" />
              </div>
              <h4>One Click Booking.</h4>
              <p>You can hassle-free and fast tour &amp; travel package booking by GoFly.</p>
              <Image width={120} height={220} src="/assets/img/home4/vector/feature-card-vector.svg" alt="" className="vector" />
            </div>
          </div>
          <div className="col-lg-4 col-md-6 wow animate fadeInDown" data-wow-delay="400ms" data-wow-duration="1500ms">
            <div className="feature-card two">
              <div className="icon">
                <Image width={69} height={220} src="/assets/img/home4/icon/feature-icon2.svg" alt="" />
              </div>
              <h4>Discount &amp; Offer.</h4>
              <p>Agencies have special discounts on flights, hotels, &amp; packages.</p>
              <Image width={120} height={220} src="/assets/img/home4/vector/feature-card-vector.svg" alt="" className="vector" />
            </div>
          </div>
          <div className="col-lg-4 col-md-6 wow animate fadeInDown" data-wow-delay="600ms" data-wow-duration="1500ms">
            <div className="feature-card three">
              <div className="icon">
                <Image width={60} height={220} src="/assets/img/home4/icon/feature-icon3.svg" alt="" />
              </div>
              <h4>Local Experties.</h4>
              <p>You can hassle-free and fast tour &amp; travel package booking by GoFly.</p>
              <Image width={120} height={220} src="/assets/img/home4/vector/feature-card-vector.svg" alt="" className="vector" />
            </div>
          </div>
        </div>
        <div className="bottom-area d-flex justify-content-center wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms" style={{ visibility: 'visible', animationDuration: '1500ms', animationDelay: '200ms' }}>
          <div className="batch">
            <span>You’ve Customize Your Travel Package by One Click.</span>
          </div>
          <div className="batch two">
            <Link href="/contact">Customize Package
              <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 9L9 1M9 1C7.22222 1.33333 3.33333 2 1 1M9 1C8.66667 2.66667 8 6.33333 9 9" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <Image width={550} height={220} src="/assets/img/home4/feature-section-vector.png" alt="" className="section-vector" />
      <Image width={57} height={60} src="/assets/img/home4/vector/feature-section-vector2.svg" alt="" className="section-vector2" />
    </div>
  )
}

export default FeatureSectionV4
