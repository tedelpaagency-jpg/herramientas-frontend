import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogV6 = () => {
  return (
    <>
      <div className="home6-blog-section">
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
              <div className="blog-card2 three">
                <div className="blog-img-wrap">
                  <Link href="/travel-inspiration/details" className="blog-img">
                    <Image width={550} height={220} src="/assets/img/home6/blog-img1.jpg" alt="" />
                  </Link>
                </div>
                <div className="blog-content">
                  <Link href="travel-inspiration" className="batch">Holiday Tips</Link>
                  <h4><Link href="/travel-inspiration/details">10 Breathtaking Destinations You Need to Visit This Year.</Link></h4>
                  <ul className="blog-meta">
                    <li><Link href="travel-inspiration">05 March, 2025</Link></li>
                    <li>4 min read</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow animate fadeInDown" data-wow-delay="400ms" data-wow-duration="1500ms">
              <div className="blog-card2 three">
                <div className="blog-img-wrap">
                  <Link href="/travel-inspiration/details" className="blog-img">
                    <Image width={550} height={220} src="/assets/img/home6/blog-img2.jpg" alt="" />
                  </Link>
                </div>
                <div className="blog-content">
                  <Link href="travel-inspiration" className="batch">Vacation Destination </Link>
                  <h4><Link href="/travel-inspiration/details">Top 5 All-Inclusive Resorts Worth Every Penny.</Link></h4>
                  <ul className="blog-meta">
                    <li><Link href="travel-inspiration">12 March, 2025</Link></li>
                    <li>2 min read</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow animate fadeInDown" data-wow-delay="600ms" data-wow-duration="1500ms">
              <div className="blog-card2 three">
                <div className="blog-img-wrap">
                  <Link href="/travel-inspiration/details" className="blog-img">
                    <Image width={550} height={220} src="/assets/img/home6/blog-img3.jpg" alt="" />
                  </Link>
                </div>
                <div className="blog-content">
                  <Link href="travel-inspiration" className="batch">Activities</Link>
                  <h4><Link href="/travel-inspiration/details">Scuba Diving vs. Snorkeling Which One Should You Try?</Link></h4>
                  <ul className="blog-meta">
                    <li><Link href="travel-inspiration">15 March, 2025</Link></li>
                    <li>5 min read</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="row wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="col-lg-12 d-flex justify-content-center">
              <Link href="travel-inspiration" className="primary-btn1 two three transparent">
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
      <div className="home6-newletter-section mb-100">
        <div className="container">
          <div className="row justify-content-center wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="col-xl-10">
              <div className="newsletter-wrapper">
                <h3>Subscribe our newsletter to discount 10% all package.</h3>
                <form className="newsletter-form">
                  <input type="text" placeholder="Type Your Email Address" />
                  <button>
                    <svg width={18} height={18} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.9597 0.771505C18.0006 0.669287 18.0107 0.557308 17.9885 0.449451C17.9664 0.341594 17.9131 0.242601 17.8353 0.164747C17.7574 0.0868923 17.6584 0.033599 17.5506 0.0114739C17.4427 -0.0106512 17.3307 -0.000635146 17.2285 0.0402804L0.863689 6.58643H0.862564L0.354081 6.78892C0.257774 6.82734 0.173959 6.89163 0.111895 6.97469C0.0498308 7.05775 0.0119333 7.15635 0.00238854 7.25959C-0.00715624 7.36284 0.0120231 7.46671 0.0578081 7.55974C0.103593 7.65278 0.174202 7.73134 0.261834 7.78676L0.723068 8.07925L0.724193 8.0815L6.34337 11.6566L9.9185 17.2758L9.92075 17.2781L10.2132 17.7393C10.2688 17.8266 10.3474 17.8968 10.4404 17.9423C10.5334 17.9878 10.6371 18.0068 10.7401 17.9972C10.8432 17.9875 10.9416 17.9496 11.0245 17.8876C11.1073 17.8257 11.1715 17.742 11.21 17.6459L17.9597 0.771505ZM15.8977 2.89768L7.46721 11.3281L7.22534 10.9479C7.18103 10.8781 7.12188 10.819 7.0521 10.7747L6.67186 10.5328L15.1023 2.10233L16.4275 1.57248L15.8988 2.89768H15.8977Z" />
                    </svg>
                  </button>
                </form>
                <span>To get monthly upto 10% best offer in all package. </span>
                <Image width={550} height={220} src="/assets/img/home6/newletter-img.png" alt="" className="newsletter-img" />
              </div>
            </div>
          </div>
        </div>
        <Image width={550} height={220} src="/assets/img/home6/vector/refund-area-vector.svg" alt="" className="vector1" />
      </div>
    </>
  )
}

export default BlogV6
