import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogV2 = () => {
  return (
    <div className="home2-blog-section mb-100">
      <div className="container">
        <div className="row justify-content-center mb-50 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-xl-6 col-lg-8">
            <div className="section-title text-center">
              <h2>Travel Inspirations</h2>
              <p>A curated list of the most popular travel packages based on different destinations.</p>
            </div>
          </div>
        </div>
        <div className="row g-4 mb-40">
          <div className="col-lg-4 col-md-6 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="blog-card2">
              <div className="blog-img-wrap">
                <Link href="/travel-inspiration/details" className="blog-img">
                  <Image width={550} height={220} src="/assets/img/home2/blog-img1.jpg" alt="" />
                </Link>
                <Link href="/travel-inspiration" className="blog-date">
                  02 <span>Jan.</span>
                </Link>
              </div>
              <div className="blog-content">
                <Link href="/travel-inspiration" className="location">
                  <svg width={14} height={16} viewBox="0 0 14 16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.81276 0C3.31734 0 0.473053 2.84433 0.473053 6.34163C0.473053 9.07242 4.2847 13.5258 5.92356 15.3136C6.15052 15.5628 6.47606 15.7042 6.81276 15.7042C7.14946 15.7042 7.475 15.5628 7.70196 15.3136C9.34082 13.5258 13.1525 9.07238 13.1525 6.34163C13.1525 2.84433 10.3082 0 6.81276 0ZM7.35966 14.9991C7.21642 15.1535 7.02297 15.2391 6.81276 15.2391C6.60255 15.2391 6.4091 15.1536 6.26586 14.9991C4.66417 13.2525 0.93812 8.90875 0.93812 6.34167C0.93812 3.10103 3.57221 0.465067 6.81276 0.465067C10.0533 0.465067 12.6874 3.10103 12.6874 6.34167C12.6874 8.90875 8.96135 13.2524 7.35966 14.9991Z" />
                    <path d="M6.81277 9.76647C8.6713 9.76647 10.1779 8.25983 10.1779 6.4013C10.1779 4.54277 8.6713 3.03613 6.81277 3.03613C4.95424 3.03613 3.4476 4.54277 3.4476 6.4013C3.4476 8.25983 4.95424 9.76647 6.81277 9.76647Z" />
                  </svg>
                  Tokyeo, Japan
                </Link>
                <h4><Link href="/travel-inspiration/details">Nature, Culture &amp; Thrill: Travel Stories That Inspire.</Link></h4>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 wow animate fadeInDown" data-wow-delay="400ms" data-wow-duration="1500ms">
            <div className="blog-card2">
              <div className="blog-img-wrap">
                <Link href="/travel-inspiration/details" className="blog-img">
                  <Image width={550} height={220} src="/assets/img/home2/blog-img2.jpg" alt="" />
                </Link>
                <Link href="/travel-inspiration" className="blog-date">
                  04 <span>Feb.</span>
                </Link>
              </div>
              <div className="blog-content">
                <Link href="/travel-inspiration" className="location">
                  <svg width={14} height={16} viewBox="0 0 14 16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.81276 0C3.31734 0 0.473053 2.84433 0.473053 6.34163C0.473053 9.07242 4.2847 13.5258 5.92356 15.3136C6.15052 15.5628 6.47606 15.7042 6.81276 15.7042C7.14946 15.7042 7.475 15.5628 7.70196 15.3136C9.34082 13.5258 13.1525 9.07238 13.1525 6.34163C13.1525 2.84433 10.3082 0 6.81276 0ZM7.35966 14.9991C7.21642 15.1535 7.02297 15.2391 6.81276 15.2391C6.60255 15.2391 6.4091 15.1536 6.26586 14.9991C4.66417 13.2525 0.93812 8.90875 0.93812 6.34167C0.93812 3.10103 3.57221 0.465067 6.81276 0.465067C10.0533 0.465067 12.6874 3.10103 12.6874 6.34167C12.6874 8.90875 8.96135 13.2524 7.35966 14.9991Z" />
                    <path d="M6.81277 9.76647C8.6713 9.76647 10.1779 8.25983 10.1779 6.4013C10.1779 4.54277 8.6713 3.03613 6.81277 3.03613C4.95424 3.03613 3.4476 4.54277 3.4476 6.4013C3.4476 8.25983 4.95424 9.76647 6.81277 9.76647Z" />
                  </svg>
                  Dubai, Middle East
                </Link>
                <h4><Link href="/travel-inspiration/details">Top 10 Beaches to Visit This Summer Season.</Link></h4>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 wow animate fadeInDown" data-wow-delay="600ms" data-wow-duration="1500ms">
            <div className="blog-card2">
              <div className="blog-img-wrap">
                <Link href="/travel-inspiration/details" className="blog-img">
                  <Image width={550} height={220} src="/assets/img/home2/blog-img3.jpg" alt="" />
                </Link>
                <Link href="/travel-inspiration" className="blog-date">
                  07 <span>Feb.</span>
                </Link>
              </div>
              <div className="blog-content">
                <Link href="/travel-inspiration" className="location">
                  <svg width={14} height={16} viewBox="0 0 14 16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.81276 0C3.31734 0 0.473053 2.84433 0.473053 6.34163C0.473053 9.07242 4.2847 13.5258 5.92356 15.3136C6.15052 15.5628 6.47606 15.7042 6.81276 15.7042C7.14946 15.7042 7.475 15.5628 7.70196 15.3136C9.34082 13.5258 13.1525 9.07238 13.1525 6.34163C13.1525 2.84433 10.3082 0 6.81276 0ZM7.35966 14.9991C7.21642 15.1535 7.02297 15.2391 6.81276 15.2391C6.60255 15.2391 6.4091 15.1536 6.26586 14.9991C4.66417 13.2525 0.93812 8.90875 0.93812 6.34167C0.93812 3.10103 3.57221 0.465067 6.81276 0.465067C10.0533 0.465067 12.6874 3.10103 12.6874 6.34167C12.6874 8.90875 8.96135 13.2524 7.35966 14.9991Z" />
                    <path d="M6.81277 9.76647C8.6713 9.76647 10.1779 8.25983 10.1779 6.4013C10.1779 4.54277 8.6713 3.03613 6.81277 3.03613C4.95424 3.03613 3.4476 4.54277 3.4476 6.4013C3.4476 8.25983 4.95424 9.76647 6.81277 9.76647Z" />
                  </svg>
                  Tokyeo, Japan
                </Link>
                <h4><Link href="/travel-inspiration/details">Dream. Explore. Discover. Where Will You Go Next?</Link></h4>
              </div>
            </div>
          </div>
        </div>
        <div className="row wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-lg-12 d-flex justify-content-center">
            <Link href="/travel-inspiration" className="primary-btn1 transparent">
              <span>
                View All Inspiration
                <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                </svg>
              </span>
              <span>
                View All Inspiration
                <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.73535 1.14746C9.57033 1.97255 9.32924 3.26406 9.24902 4.66797C9.16817 6.08312 9.25559 7.5453 9.70214 8.73633C9.84754 9.12406 9.65129 9.55659 9.26367 9.70215C8.9001 9.83849 8.4969 9.67455 8.32812 9.33398L8.29785 9.26367L8.19921 8.98438C7.73487 7.5758 7.67054 5.98959 7.75097 4.58203C7.77875 4.09598 7.82525 3.62422 7.87988 3.17969L1.53027 9.53027C1.23738 9.82317 0.762615 9.82317 0.469722 9.53027C0.176829 9.23738 0.176829 8.76262 0.469722 8.46973L6.83593 2.10254C6.3319 2.16472 5.79596 2.21841 5.25 2.24902C3.8302 2.32862 2.2474 2.26906 0.958003 1.79102L0.704097 1.68945L0.635738 1.65527C0.303274 1.47099 0.157578 1.06102 0.310542 0.704102C0.463655 0.347333 0.860941 0.170391 1.22363 0.28418L1.29589 0.310547L1.48828 0.387695C2.47399 0.751207 3.79966 0.827571 5.16601 0.750977C6.60111 0.670504 7.97842 0.428235 8.86132 0.262695L9.95312 0.0585938L9.73535 1.14746Z" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogV2
