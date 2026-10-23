import React from 'react';

interface CounterV4Props {
  agency?: any;
}

const CounterV4: React.FC<CounterV4Props> = ({ agency }) => {
  return (
    <div className="home4-counter-section mb-100">
      <div className="container">
        <div className="counter-wrapper">
          <div className="single-counter">
            <div className="content">
              <span>Inmuebles Comercializados</span>
              <h2><strong className="counter">1,250</strong>+</h2>
            </div>
          </div>

          <div className="single-counter two">
            <div className="content">
              <span>Años de Experiencia</span>
              <h2><strong className="counter">15</strong>+</h2>
            </div>
          </div>

          <div className="single-counter three">
            <div className="content">
              <span>Familias Satisfechas</span>
              <h2><strong className="counter">3,500</strong>+</h2>
            </div>
          </div>

          <div className="single-counter four">
            <div className="content">
              <span>Tasa de Satisfacción</span>
              <h2><strong className="counter">99</strong>%</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterV4;
