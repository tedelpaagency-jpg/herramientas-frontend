import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogV4 = () => {
  return (
    <div className="home4-blog-section mb-100">
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
            <div className="blog-card2 two">
              <div className="blog-img-wrap">
                <Link href="/travel-inspiration/details" className="blog-img">
                  <Image width={550} height={220} src="/assets/img/home3/blog-img1.jpg" alt="" />
                </Link>
                <Link href="/travel-inspiration" className="location">
                  <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.83615 0C3.77766 0 1.28891 2.48879 1.28891 5.54892C1.28891 7.93837 4.6241 11.8351 6.05811 13.3994C6.25669 13.6175 6.54154 13.7411 6.83615 13.7411C7.13076 13.7411 7.41561 13.6175 7.6142 13.3994C9.04821 11.8351 12.3834 7.93833 12.3834 5.54892C12.3834 2.48879 9.89464 0 6.83615 0ZM7.31469 13.1243C7.18936 13.2594 7.02008 13.3342 6.83615 13.3342C6.65222 13.3342 6.48295 13.2594 6.35761 13.1243C4.95614 11.5959 1.69584 7.79515 1.69584 5.54896C1.69584 2.7134 4.00067 0.406933 6.83615 0.406933C9.67164 0.406933 11.9765 2.7134 11.9765 5.54896C11.9765 7.79515 8.71617 11.5959 7.31469 13.1243Z" />
                    <path d="M6.83618 8.54529C8.4624 8.54529 9.7807 7.22698 9.7807 5.60077C9.7807 3.97456 8.4624 2.65625 6.83618 2.65625C5.20997 2.65625 3.89166 3.97456 3.89166 5.60077C3.89166 7.22698 5.20997 8.54529 6.83618 8.54529Z" />
                  </svg>
                  Tokyeo, Japan
                </Link>
              </div>
              <div className="blog-content">
                <Link href="/travel-inspiration" className="blog-date">24 February, 2025</Link>
                <h4><Link href="/travel-inspiration/details">Nature, Culture &amp; Thrill: Travel Stories That Inspire.</Link></h4>
                <p>Nature, Culture &amp; Thrill: Travel Stories Inspire is a collection of experiences from explorers.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 wow animate fadeInDown" data-wow-delay="400ms" data-wow-duration="1500ms">
            <div className="blog-card2 two">
              <div className="blog-img-wrap">
                <Link href="/travel-inspiration/details" className="blog-img">
                  <Image width={550} height={220} src="/assets/img/home3/blog-img2.jpg" alt="" />
                </Link>
                <Link href="/travel-inspiration" className="location">
                  <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.83615 0C3.77766 0 1.28891 2.48879 1.28891 5.54892C1.28891 7.93837 4.6241 11.8351 6.05811 13.3994C6.25669 13.6175 6.54154 13.7411 6.83615 13.7411C7.13076 13.7411 7.41561 13.6175 7.6142 13.3994C9.04821 11.8351 12.3834 7.93833 12.3834 5.54892C12.3834 2.48879 9.89464 0 6.83615 0ZM7.31469 13.1243C7.18936 13.2594 7.02008 13.3342 6.83615 13.3342C6.65222 13.3342 6.48295 13.2594 6.35761 13.1243C4.95614 11.5959 1.69584 7.79515 1.69584 5.54896C1.69584 2.7134 4.00067 0.406933 6.83615 0.406933C9.67164 0.406933 11.9765 2.7134 11.9765 5.54896C11.9765 7.79515 8.71617 11.5959 7.31469 13.1243Z" />
                    <path d="M6.83618 8.54529C8.4624 8.54529 9.7807 7.22698 9.7807 5.60077C9.7807 3.97456 8.4624 2.65625 6.83618 2.65625C5.20997 2.65625 3.89166 3.97456 3.89166 5.60077C3.89166 7.22698 5.20997 8.54529 6.83618 8.54529Z" />
                  </svg>
                  Maldives
                </Link>
              </div>
              <div className="blog-content">
                <Link href="/travel-inspiration" className="blog-date">28 February, 2025</Link>
                <h4><Link href="/travel-inspiration/details">Dream. Explore. Discover. Where Will You Go Next?</Link></h4>
                <p>Dream. Explore. Discover. is more than just a travel motto; it’s an invitation to step out.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 wow animate fadeInDown" data-wow-delay="600ms" data-wow-duration="1500ms">
            <div className="blog-card2 two">
              <div className="blog-img-wrap">
                <Link href="/travel-inspiration/details" className="blog-img">
                  <Image width={550} height={220} src="/assets/img/home3/blog-img3.jpg" alt="" />
                </Link>
                <Link href="/travel-inspiration" className="location">
                  <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.83615 0C3.77766 0 1.28891 2.48879 1.28891 5.54892C1.28891 7.93837 4.6241 11.8351 6.05811 13.3994C6.25669 13.6175 6.54154 13.7411 6.83615 13.7411C7.13076 13.7411 7.41561 13.6175 7.6142 13.3994C9.04821 11.8351 12.3834 7.93833 12.3834 5.54892C12.3834 2.48879 9.89464 0 6.83615 0ZM7.31469 13.1243C7.18936 13.2594 7.02008 13.3342 6.83615 13.3342C6.65222 13.3342 6.48295 13.2594 6.35761 13.1243C4.95614 11.5959 1.69584 7.79515 1.69584 5.54896C1.69584 2.7134 4.00067 0.406933 6.83615 0.406933C9.67164 0.406933 11.9765 2.7134 11.9765 5.54896C11.9765 7.79515 8.71617 11.5959 7.31469 13.1243Z" />
                    <path d="M6.83618 8.54529C8.4624 8.54529 9.7807 7.22698 9.7807 5.60077C9.7807 3.97456 8.4624 2.65625 6.83618 2.65625C5.20997 2.65625 3.89166 3.97456 3.89166 5.60077C3.89166 7.22698 5.20997 8.54529 6.83618 8.54529Z" />
                  </svg>
                  Vietnam
                </Link>
              </div>
              <div className="blog-content">
                <Link href="/travel-inspiration" className="blog-date">05 March, 2025</Link>
                <h4><Link href="/travel-inspiration/details">Top 10 Beaches to Visit This Summer Season.</Link></h4>
                <p>Sun, sand, and crystal-clear waters—summer is the perfect time to escape to the world’s.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-lg-12 d-flex justify-content-center">
            <Link href="/travel-inspiration" className="primary-btn1 two transparent">
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
      <Image width={114} height={91} src="/assets/img/home4/vector/blog-section-vector.svg" alt="" className="vector" />
    </div>
  )
}

export default BlogV4
