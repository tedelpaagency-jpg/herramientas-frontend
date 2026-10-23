import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const AboutV7 = () => {
  return (
    <div className="home7-about-section mb-100">
      <div className="container">
        <div className="row gy-5 justify-content-between">
          <div className="col-xl-5 col-lg-6 wow animate fadeInLeft" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="about-content">
              <div className="section-title">
                <h2>Conquer Heights, Dive Deep, Explore Freely!</h2>
              </div>
              <div className="content">
                <p>We believe that adventure is more than just a journey—it’s a way of life! Our mission is to bring thrill-seekers, explorers, and nature lovers the most exciting and safe adventure experiences across the globe.</p>
                <p>We are passionate about creating extraordinary adventures that go beyond the ordinary. Our goal is to offer travelers of all types an opportunity to break free from the routine and immerse themselves in thrilling experiences that will leave them with unforgettable memories.</p>
              </div>
              <div className="btn-and-counter-area">
                <Link href="/about" className="primary-btn1 two four black-bg">
                  <span>
                    About More GoFly
                    <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                    </svg>
                  </span>
                  <span>
                    About More GoFly
                    <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                    </svg>
                  </span>
                </Link>
                <div className="counter-area">
                  <ul className="counter-img-grp">
                    <li><Image width={550} height={220} src="/assets/img/home3/counter-people-img1.png" alt="" /></li>
                    <li><Image width={550} height={220} src="/assets/img/home3/counter-people-img2.png" alt="" /></li>
                    <li><Image width={550} height={220} src="/assets/img/home3/counter-people-img3.png" alt="" /></li>
                  </ul>
                  <h6> <strong><span className="counter">25</span>k+</strong> Customer <br /> in Worldwide.</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 wow animate fadeInRight" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="about-img-area">
              <div className="about-img">
                <Image width={550} height={220} src="/assets/img/home7/about-img.jpg" alt="" />
              </div>
              <div className="counter-wrapper">
                <div className="single-counter">
                  <h2><strong className="counter">12</strong><span>+</span></h2>
                  <span>Years of <br /> Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Image width={260} height={220} src="/assets/img/home7/vector/about-section-vector.svg" alt="" className="vector" />
    </div>
  )
}

export default AboutV7
