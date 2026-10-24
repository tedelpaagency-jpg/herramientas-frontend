interface FaqV4Props {
  agency?: any;
}

const FaqV4: React.FC<FaqV4Props> = ({ agency }) => {
  const faqTitle = agency?.details?.faq_title || 'Preguntas Frecuentes';
  const faqSubtitle = agency?.details?.faq_subtitle || 'Resolvemos las dudas más comunes para que compres, vendas o rentes con total tranquilidad.';

  return (
    <div className="home4-faq-section mb-100">
      <div className="container">
        <div className="row justify-content-center mb-50 wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-xl-6 col-lg-8">
            <div className="section-title text-center">
              <h2>{faqTitle}</h2>
              <p>{faqSubtitle}</p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10">
            <div className="faq-wrap two">
              <div className="accordion accordion-flush" id="accordionFlushExample">
                <div className="accordion-item wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
                  <h5 className="accordion-header" id="flush-headingOne">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                      ¿Cuáles son los requisitos básicos para comprar una propiedad?
                    </button>
                  </h5>
                  <div id="flush-collapseOne" className="accordion-collapse collapse show" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      Los requisitos generales incluyen: <span>identificación oficial vigente, comprobante de ingresos o preaprobación de crédito hipotecario, RFC con homoclave y el monto de apartado o enganche</span>. Nuestro equipo te asesora paso a paso para reunir la documentación requerida por la Notaría.
                    </div>
                  </div>
                </div>

                <div className="accordion-item wow animate fadeInDown" data-wow-delay="400ms" data-wow-duration="1500ms">
                  <h5 className="accordion-header" id="flush-headingTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                      ¿Cómo funciona el proceso de consignar mi propiedad para venta o renta?
                    </button>
                  </h5>
                  <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      Realizamos una <span>opinión de valor comercial competitiva, sesión de fotos y video profesional, promoción en portales líderes y redes sociales, y filtrado de prospectos calificados</span>. Gestionamos todas las visitas para tu comodidad y seguridad.
                    </div>
                  </div>
                </div>

                <div className="accordion-item wow animate fadeInDown" data-wow-delay="600ms" data-wow-duration="1500ms">
                  <h5 className="accordion-header" id="flush-headingThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                      ¿Aceptan créditos hipotecarios (Bancarios, Infonavit, Fovissste)?
                    </button>
                  </h5>
                  <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      <span>¡Sí, absolutamente!</span> Trabajamos en alianza con los principales bancos e instituciones financieras. Contamos con brokers hipotecarios que comparan las mejores tasas de interés del mercado sin costo adicional para ti.
                    </div>
                  </div>
                </div>

                <div className="accordion-item wow animate fadeInDown" data-wow-delay="800ms" data-wow-duration="1500ms">
                  <h5 className="accordion-header" id="flush-headingFour">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
                      ¿Cómo se garantiza la certeza legal de la compraventa?
                    </button>
                  </h5>
                  <div id="flush-collapseFour" className="accordion-collapse collapse" aria-labelledby="flush-headingFour" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      Todas las propiedades son verificadas minuciosamente ante el <span>Registro Público de la Propiedad, validando el Certificado de Libertad de Gravamen y ausencia de adeudos prediales y de agua</span>. El cierre y escrituración se lleva a cabo estrictamente ante Notario Público.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqV4;
