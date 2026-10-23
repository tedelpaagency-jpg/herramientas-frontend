"use client"
import Image from 'next/image';
import React from 'react'
import LightGallery from 'lightgallery/react';
// import plugins if you need
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
const PartnersAndVideo: React.FC = () => {
  return (
    <>
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
      <div className="about-video-section mb-100">
        <div className="container">
          <LightGallery speed={500}
            plugins={[lgZoom, lgVideo]}
            elementClassNames="video-wrap" >
            <Image width={1300} height={220} src="/assets/img/innerpages/about-video-img.jpg" alt="" />
            <a data-fancybox="video-player" className="gallery-item play-btn" data-src="https://www.youtube.com/watch?v=u31qwQUeGuM&t=1s" style={{ cursor: "pointer" }}
            >
              <i className="bi bi-play-fill" />
              <div className="waves-block">
                <div className="waves wave-1" />
                <div className="waves wave-2" />
                <div className="waves wave-3" />
              </div>
            </a>
          </LightGallery>
        </div>
      </div>
    </>
  )
}

export default PartnersAndVideo
