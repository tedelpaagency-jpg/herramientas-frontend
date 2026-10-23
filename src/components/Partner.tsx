import Image from 'next/image'
import React from 'react'

const Partner = () => {
  return (
    <div className="partner-section mb-100">
      <div className="container">
        <div className="partner-title wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
          <h5>Those Company You Can Easily Trust!</h5>
        </div>
        <div className="partner-wrap">
          <div className="marquee">
            <div className="marquee__group">
              <a href="#"><Image width={550} height={220} src="/assets/img/home1/partner-01.png" alt="" /></a>
              <a href="#"><Image width={550} height={220} src="/assets/img/home1/partner-02.png" alt="" /></a>
              <a href="#"><Image width={550} height={220} src="/assets/img/home1/partner-03.png" alt="" /></a>
              <a href="#"><Image width={550} height={220} src="/assets/img/home1/partner-04.png" alt="" /></a>
              <a href="#"><Image width={550} height={220} src="/assets/img/home1/partner-05.png" alt="" /></a>
              <a href="#"><Image width={550} height={220} src="/assets/img/home1/partner-06.png" alt="" /></a>
            </div>
            <div aria-hidden="true" className="marquee__group">
              <a href="#"><Image width={550} height={220} src="/assets/img/home1/partner-01.png" alt="" /></a>
              <a href="#"><Image width={550} height={220} src="/assets/img/home1/partner-02.png" alt="" /></a>
              <a href="#"><Image width={550} height={220} src="/assets/img/home1/partner-03.png" alt="" /></a>
              <a href="#"><Image width={550} height={220} src="/assets/img/home1/partner-04.png" alt="" /></a>
              <a href="#"><Image width={550} height={220} src="/assets/img/home1/partner-05.png" alt="" /></a>
              <a href="#"><Image width={550} height={220} src="/assets/img/home1/partner-06.png" alt="" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Partner
