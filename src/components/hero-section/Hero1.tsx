import React from 'react'

const Hero1 = () => {
  return (
     <div className="home1-banner-section">
        <div className="banner-video-area">
          <video autoPlay loop muted playsInline src="assets/video/home1-banner-video.mp4" />
        </div>
        <div className="banner-content-wrap">
          <div className="container">
            <div className="banner-content">
              <h1>All-in-one Travel Booking.</h1>
              <p>Highlights convenience and simplicity, Best for agencies with online &amp; mobile-friendly services.</p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Hero1
