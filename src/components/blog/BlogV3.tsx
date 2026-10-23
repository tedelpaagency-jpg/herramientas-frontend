import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogV3 = () => {
  return (
    <div className="blog-and-newsletter-section">
      <div className="home3-blog-section mb-100">
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
              <Link href="/travel-inspiration" className="primary-btn1 two black-bg">
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
      <div className="newsletter-section">
        <div className="container">
          <div className="newsletter-wrapper">
            <div className="section-title">
              <h2>Join to Newsletter.</h2>
            </div>
            <form className="newsletter-form">
              <input type="text" placeholder="Type Your Email Address" />
              <button>
                <svg width={18} height={18} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.9597 0.771505C18.0006 0.669287 18.0107 0.557308 17.9885 0.449451C17.9664 0.341594 17.9131 0.242601 17.8353 0.164747C17.7574 0.0868923 17.6584 0.033599 17.5506 0.0114739C17.4427 -0.0106512 17.3307 -0.000635146 17.2285 0.0402804L0.863689 6.58643H0.862564L0.354081 6.78892C0.257774 6.82734 0.173959 6.89163 0.111895 6.97469C0.0498308 7.05775 0.0119333 7.15635 0.00238854 7.25959C-0.00715624 7.36284 0.0120231 7.46671 0.0578081 7.55974C0.103593 7.65278 0.174202 7.73134 0.261834 7.78676L0.723068 8.07925L0.724193 8.0815L6.34337 11.6566L9.9185 17.2758L9.92075 17.2781L10.2132 17.7393C10.2688 17.8266 10.3474 17.8968 10.4404 17.9423C10.5334 17.9878 10.6371 18.0068 10.7401 17.9972C10.8432 17.9875 10.9416 17.9496 11.0245 17.8876C11.1073 17.8257 11.1715 17.742 11.21 17.6459L17.9597 0.771505ZM15.8977 2.89768L7.46721 11.3281L7.22534 10.9479C7.18103 10.8781 7.12188 10.819 7.0521 10.7747L6.67186 10.5328L15.1023 2.10233L16.4275 1.57248L15.8988 2.89768H15.8977Z" />
                </svg>
              </button>
            </form>
            <span>To get monthly upto 10% best offer in all package. </span>
            <Image width={121} height={220} src="/assets/img/home3/vector/newsletter-section-vector1.svg" alt="" className="vector1" />
            <Image width={121} height={220} src="/assets/img/home3/vector/newsletter-section-vector2.svg" alt="" className="vector2" />
          </div>
        </div>
      </div>
      <Image width={550} height={220} src="/assets/img/home3/newsletter-bg-shape.png" alt="" className="bg-shape" />
    </div>
  )
}

export default BlogV3
