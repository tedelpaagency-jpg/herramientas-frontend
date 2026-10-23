"use client"
import Image from 'next/image';
import React from 'react'
import LightGallery from 'lightgallery/react';
// import plugins if you need
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
const WhyChooseUsV4: React.FC = () => {
  return (
    <>
      <div className="home4-why-choose-us-section">
        <div className="container">
          <div className="row g-4 justify-content-between align-items-end mb-60 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="col-xxl-5 col-xl-6 col-lg-7">
              <div className="section-title">
                <h2>Why We’re Best Agency</h2>
                <p>A curated list of the most popular travel packages based on different destinations.</p>
              </div>
            </div>
            <div className="col-lg-3 d-flex justify-content-lg-end">
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
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-3 col-md-4 col-sm-6 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
              <div className="single-feature">
                <div className="icon">
                  <Image width={550} height={220} src="/assets/img/home3/icon/destination-feature-icon1.svg" alt="" />
                </div>
                <h5>Customizable Package.</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 wow animate fadeInUp" data-wow-delay="400ms" data-wow-duration="1500ms">
              <div className="single-feature">
                <div className="icon">
                  <Image width={550} height={220} src="/assets/img/home3/icon/destination-feature-icon2.svg" alt="" />
                </div>
                <h5>24/7 Support</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 wow animate fadeInUp" data-wow-delay="600ms" data-wow-duration="1500ms">
              <div className="single-feature">
                <div className="icon">
                  <Image width={550} height={220} src="/assets/img/home3/icon/destination-feature-icon3.svg" alt="" />
                </div>
                <h5>Trusted by Thousands</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 wow animate fadeInUp" data-wow-delay="800ms" data-wow-duration="1500ms">
              <div className="single-feature">
                <div className="icon">
                  <Image width={550} height={220} src="/assets/img/home3/icon/destination-feature-icon4.svg" alt="" />
                </div>
                <h5>Local Experties</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="why-choose-video-area mb-100">
        <div className="container">
          <LightGallery selector=".gallery-item"
              speed={500}
              plugins={[lgZoom, lgVideo]} elementClassNames="why-choose-video-wrap">
            <Image width={1330} height={220} src="/assets/img/home4/why-choose-video-img.jpg" alt="" />
            <a data-fancybox="video-player" data-src="https://www.youtube.com/watch?v=u31qwQUeGuM&t=1s"  style={{ cursor: "pointer" }}
               className="play-btn gallery-item">
              <i className="bi bi-play-fill" />
              <div className="waves-block">
                <div className="waves wave-1" />
                <div className="waves wave-2" />
                <div className="waves wave-3" />
              </div>
            </a>
            <div className="contact-wrap">
              <div className="contact-area">
                <h6>Need to Help? Don’t Hesitate Friendly Collaboarte with Experties</h6>
                <div className="single-contact">
                  <div className="icon">
                    <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <g>
                        <path d="M15.5646 11.7424L13.3317 9.50954C12.5343 8.7121 11.1786 9.03111 10.8596 10.0678C10.6204 10.7855 9.82296 11.1842 9.10526 11.0247C7.51037 10.626 5.35726 8.55261 4.95854 6.87797C4.71931 6.16024 5.19778 5.36279 5.91548 5.12359C6.95216 4.80461 7.27113 3.44895 6.47369 2.65151L4.24084 0.418659C3.60288 -0.139553 2.64595 -0.139553 2.08774 0.418659L0.572591 1.93381C-0.942555 3.5287 0.73208 7.75516 4.48007 11.5032C8.22807 15.2512 12.4545 17.0056 14.0494 15.4106L15.5646 13.8955C16.1228 13.2575 16.1228 12.3006 15.5646 11.7424Z" />
                      </g>
                    </svg>
                  </div>
                  <div className="content">
                    <span>Need Help?</span>
                    <a href="tel:91345533865">+91 345 533 865</a>
                  </div>
                </div>
              </div>
            </div>
          </LightGallery>
        </div>
      </div>
    </>

  )
}

export default WhyChooseUsV4
