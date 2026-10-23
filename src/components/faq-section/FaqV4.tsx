import Image from 'next/image'
import React from 'react'

const FaqV4 = () => {
  return (
    <div className="home4-faq-section mb-100">
      <div className="container">
        <div className="row justify-content-center mb-50 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-xl-6 col-lg-8">
            <div className="section-title text-center">
              <h2>Questions &amp; Answer</h2>
              <p>We’re committed to offering more than just products—we provide exceptional experiences.</p>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10">
            <div className="faq-wrap two">
              <div className="accordion accordion-flush" id="accordionFlushExample">
                <div className="accordion-item wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
                  <h5 className="accordion-header" id="flush-headingOne">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">What Services Does Your Travel Agency Provide?</button>
                  </h5>
                  <div id="flush-collapseOne" className="accordion-collapse collapse show" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      A travel agency typically provides a wide range of services to ensure a smooth and enjoyable travel experience. As like- <span>Hotel booking, Flight Booking, Visa &amp; Customized Travel Pakcge etc.</span>
                    </div>
                  </div>
                </div>
                <div className="accordion-item wow animate fadeInDown" data-wow-delay="400ms" data-wow-duration="1500ms">
                  <h5 className="accordion-header" id="flush-headingTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">Do You Offer Customized Travel Packages?</button>
                  </h5>
                  <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      Absolutely! We offer fully customized travel packages based on your interests, budget, and schedule. Whether you're planning <span>a solo adventure, a family vacation, a romantic getaway, or a group tour</span>, our team will tailor every detail to create a personalized travel experience just for you.
                    </div>
                  </div>
                </div>
                <div className="accordion-item wow animate fadeInDown" data-wow-delay="600ms" data-wow-duration="1500ms">
                  <h5 className="accordion-header" id="flush-headingThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">Can I Book Flights, Hotels, and Tours Separately?</button>
                  </h5>
                  <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      Yes, you can! We provide the flexibility to book <span>flights, hotels, and tours separately</span> based on your specific needs. Whether you need just a flight, only accommodation, or want to add a tour later — we’re here to help you plan each part of your trip your way.
                    </div>
                  </div>
                </div>
                <div className="accordion-item wow animate fadeInDown" data-wow-delay="800ms" data-wow-duration="1500ms">
                  <h5 className="accordion-header" id="flush-headingFour">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">Do You Provide Visa Assistance?</button>
                  </h5>
                  <div id="flush-collapseFour" className="accordion-collapse collapse" aria-labelledby="flush-headingFour" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      Yes, we do! Our team offers complete <span>visa assistance services</span> to help you navigate the application process smoothly. From providing guidance on required documents to scheduling appointments and submitting applications, we're here to support you every step of the way.
                    </div>
                  </div>
                </div>
                <div className="accordion-item wow animate fadeInDown" data-wow-delay="800ms" data-wow-duration="1500ms">
                  <h5 className="accordion-header" id="flush-headingFive">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFive" aria-expanded="false" aria-controls="flush-collapseFive">What Payment Methods Do You Accept?</button>
                  </h5>
                  <div id="flush-collapseFive" className="accordion-collapse collapse" aria-labelledby="flush-headingFive" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      We accept a variety of <span>payment methods</span> to make your booking process easy and convenient. These include <span>cash, bank transfers, mobile payments (such as bKash, Nagad), and major debit/credit cards</span>. If you have a preferred payment option, feel free to let us know!
                    </div>
                  </div>
                </div>
                <div className="accordion-item wow animate fadeInDown" data-wow-delay="800ms" data-wow-duration="1500ms">
                  <h5 className="accordion-header" id="flush-headingSix">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseSix" aria-expanded="false" aria-controls="flush-collapseSix">What Travel Documents are Required for International Travel?</button>
                  </h5>
                  <div id="flush-collapseSix" className="accordion-collapse collapse" aria-labelledby="flush-headingSix" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      For international travel, you’ll typically need several important <span>travel documents</span>, including a <span>valid passport, visa (if required), airline tickets, travel insurance, and any COVID-19 related health certificates</span>. Depending on your destination, additional documents may be necessary. Our team will guide you through the specific requirements for your trip.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Image width={70} height={70} src="/assets/img/home4/vector/faq-section-vector.svg" alt="sad" className="vector" />
    </div>
  )
}

export default FaqV4
