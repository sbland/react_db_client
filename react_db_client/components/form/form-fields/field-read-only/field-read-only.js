import React from 'react';
import PropTypes from 'prop-types';
import { filterTypes } from '@samnbuk/react_db_client.constants.client-types';

const getSelectValue = (value, options) => {
  const val = options && options.find((o) => o.uid === value);
  return val ? val.label : null;
};

export const FieldReadOnly = ({ unit, value, type, options }) => {
  let val = value;
  if (type === filterTypes.select) val = getSelectValue(value, options);
  if (type === filterTypes.bool) val = value ? 'Yes' : 'no';
  if (typeof value == 'object') val == 'INVALID';
  return (
    <>
      <span>{val}</span>
      <span className="unitSpan">{unit && ` ${unit}`}</span>
    </>
  );
};

FieldReadOnly.propTypes = {
  unit: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]),
  type: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string,
      label: PropTypes.string,
    })
  ),
};

FieldReadOnly.defaultProps = {
  unit: '',
  value: '',
  options: [],
};

export default FieldReadOnly;
