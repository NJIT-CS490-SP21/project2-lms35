import PropTypes from 'prop-types';
import React from 'react';

const Square = ({ idx, value, onClick }) => (
  <div
    className="box"
    role="button"
    onClick={onClick}
    onKeyDown={onClick}
    tabIndex={idx}
  >
    {value}
  </div>
);

Square.propTypes = {
  idx: PropTypes.number.isRequired,
  value: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

Square.defaultProps = {
  value: null,
};

export default Square;
