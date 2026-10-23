import Image from 'next/image'
import React from 'react'

const AboutSection = () => {
  return (
    <div className="about-section pt-100 mb-100">
      <div className="container">
        <div className="about-wrapper">
          <div className="row align-items-center justify-content-between">
            <div className="col-xl-6 col-lg-7 wow animate fadeInLeft" data-wow-delay="200ms" data-wow-duration="1500ms">
              <div className="about-content">
                <div className="section-title">
                  <h2>Why We’re Best Agency</h2>
                  <h4>Welcome to GoFly Travel Agency – Your Gateway to Unforgettable Journeys!</h4>
                  <p>GoFly Travel Agency is a trusted name in the travel industry, offering seamless travel planning, personalized itineraries, and unforgettable adventures. With years of experience and a network of global partners, we ensure a hassle-free and memorable journey for every traveler.</p>
                  <p>We believe that travel is more than just moving from one place to another—it’s about discovering new cultures, creating unforgettable experiences, and making lifelong memories.</p>
                </div>
                <div className="founder-area">
                  <Image width={100} height={220} src="/assets/img/innerpages/about-page-founder-signature.png" alt="" />
                  <div className="founder-info">
                    <h6>Robert Harringson</h6>
                    <span>Founder at GoFly</span>
                  </div>
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

export default AboutSection
