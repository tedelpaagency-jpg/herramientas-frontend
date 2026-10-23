import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const DestinationSectionV5 = () => {
  return (
    <div className="home5-destination-section mb-100">
      <div className="container">
        <div className="row justify-content-center mb-50 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-xl-6 col-lg-8">
            <div className="section-title text-center">
              <h2>Top Destinations</h2>
            </div>
          </div>
        </div>
        <div className="row g-xl-4 g-lg-3 gy-4">
          <div className="col-lg-5 col-md-7 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="destination-card2 four">
              <div className="destination-img">
                <Image width={550} height={220} src="/assets/img/home5/destination-img1.jpg" alt="" />
              </div>
              <div className="destination-content-wrap">
                <div className="destination-content">
                  <span>Tours (06)</span>
                  <h5><Link href="/destination/details">Rome, Itlay</Link></h5>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-5 wow animate fadeInDown" data-wow-delay="400ms" data-wow-duration="1500ms">
            <div className="destination-card2 four">
              <div className="destination-img">
                <Image width={550} height={220} src="/assets/img/home5/destination-img2.jpg" alt="" />
              </div>
              <div className="destination-content-wrap">
                <div className="destination-content">
                  <span>Tours (12)</span>
                  <h5><Link href="/destination/details">Great Wall of China</Link></h5>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-7 wow animate fadeInDown" data-wow-delay="600ms" data-wow-duration="1500ms">
            <div className="destination-card2 four">
              <div className="destination-img">
                <Image width={550} height={220} src="/assets/img/home5/destination-img3.jpg" alt="" />
              </div>
              <div className="destination-content-wrap">
                <div className="destination-content">
                  <span>Tours (18)</span>
                  <h5><Link href="/destination/details">Great Temple Jordan</Link></h5>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-5 wow animate fadeInDown" data-wow-delay="600ms" data-wow-duration="1500ms">
            <div className="destination-card2 four">
              <div className="destination-img">
                <Image width={550} height={220} src="/assets/img/home5/destination-img4.jpg" alt="" />
              </div>
              <div className="destination-content-wrap">
                <div className="destination-content">
                  <span>Tours (14)</span>
                  <h5><Link href="/destination/details">Swizerland</Link></h5>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-7 wow animate fadeInDown" data-wow-delay="400ms" data-wow-duration="1500ms">
            <div className="destination-card2 four">
              <div className="destination-img">
                <Image width={550} height={220} src="/assets/img/home5/destination-img5.jpg" alt="" />
              </div>
              <div className="destination-content-wrap">
                <div className="destination-content">
                  <span>Tours (07)</span>
                  <h5><Link href="/destination/details">Santorini, Greece</Link></h5>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 col-md-5 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="destination-card2 four">
              <div className="destination-img">
                <Image width={550} height={220} src="/assets/img/home5/destination-img6.jpg" alt="" />
              </div>
              <div className="destination-content-wrap">
                <div className="destination-content">
                  <span>Tours (26)</span>
                  <h5><Link href="/destination/details">Machu Picchu of Peru</Link></h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Image width={115} height={90} src="/assets/img/home3/vector/home3-travel-package-vector1.svg" alt="" className="vector1" />
    </div>
  )
}

export default DestinationSectionV5
