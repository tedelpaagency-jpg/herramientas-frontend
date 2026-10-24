import React from 'react';

interface CounterV4Props {
  agency?: any;
}

const CounterV4: React.FC<CounterV4Props> = ({ agency }) => {
  const c1Num = agency?.details?.counter1_num || '1,250';
  const c1Label = agency?.details?.counter1_label || 'Inmuebles Comercializados';
  const c2Num = agency?.details?.counter2_num || '15';
  const c2Label = agency?.details?.counter2_label || 'Años de Experiencia';
  const c3Num = agency?.details?.counter3_num || '3,500';
  const c3Label = agency?.details?.counter3_label || 'Familias Satisfechas';
  const c4Num = agency?.details?.counter4_num || '99';
  const c4Label = agency?.details?.counter4_label || 'Tasa de Satisfacción';

  return (
    <div className="home4-counter-section mb-100">
      <div className="container">
        <div className="counter-wrapper">
          <div className="single-counter">
            <div className="content">
              <span>{c1Label}</span>
              <h2><strong className="counter">{c1Num}</strong>+</h2>
            </div>
          </div>

          <div className="single-counter two">
            <div className="content">
              <span>{c2Label}</span>
              <h2><strong className="counter">{c2Num}</strong>+</h2>
            </div>
          </div>

          <div className="single-counter three">
            <div className="content">
              <span>{c3Label}</span>
              <h2><strong className="counter">{c3Num}</strong>+</h2>
            </div>
          </div>

          <div className="single-counter four">
            <div className="content">
              <span>{c4Label}</span>
              <h2><strong className="counter">{c4Num}</strong>%</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterV4;
