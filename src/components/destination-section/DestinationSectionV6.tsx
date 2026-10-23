import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const DestinationSectionV6 = () => {
  return (
    <div className="home6-destination-section mb-60">
      <div className="container">
        <div className="row justify-content-center mb-50 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-xl-6 col-lg-8">
            <div className="section-title text-center">
              <h2>Popular Activities Place</h2>
            </div>
          </div>
        </div>
        <div className="row g-xl-4 g-md-3 g-4">
          <div className="col-md-4 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="destination-card3">
              <Image width={550} height={220} src="/assets/img/home6/destination-img1.jpg" alt="" />
              <div className="destination-content">
                <h2><Link href="/destination/details">Rome</Link></h2>
                <span>15 Activities</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="destination-card3 sm-card mb-20">
              <Image width={550} height={220} src="/assets/img/home6/destination-img2.jpg" alt="" />
              <div className="destination-content">
                <h2><Link href="/destination/details">Thailand</Link></h2>
                <span>12 Activities</span>
              </div>
            </div>
            <div className="destination-card3 sm-card">
              <Image width={550} height={220} src="/assets/img/home6/destination-img3.jpg" alt="" />
              <div className="destination-content">
                <h2><Link href="/destination/details">Maldives</Link></h2>
                <span>20 Activities</span>
              </div>
            </div>
          </div>
          <div className="col-md-4 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="destination-card3">
              <Image width={550} height={220} src="/assets/img/home6/destination-img4.jpg" alt="" />
              <div className="destination-content">
                <h2><Link href="/destination/details">Indonesia</Link></h2>
                <span>18 Activities</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DestinationSectionV6
