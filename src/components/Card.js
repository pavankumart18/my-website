import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';

const Card = ({ label, uri, details }) => {
  const {
    getTooltipProps,
    getArrowProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    placement: 'top',
    trigger: 'hover',
  });

  return (
    <div className="card">
      <img src={uri} className="card-img-top" alt={label} />
      <div className="card-body">
        <p className="card-title" ref={setTriggerRef}>
          {label}
        </p>
        {visible && (
          <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container' })}>
            <div {...getArrowProps({ className: 'tooltip-arrow' })} />
            <div className="details">
              <ul>
                {details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
