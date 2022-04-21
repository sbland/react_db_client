import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { validateValue, formatValue } from '@samnbuk/react_db_client.helpers.data-processing';
import { DefaultCellInnerStyle } from './style';

/**
 * Data Cell Number
 *
 * @param {*} {
 *   cellData,
 *   updateData,
 * }
 * @returns
 */
export const DataTableCellNumber = ({
  columnData: { min, max, uid, defaultValue, step = 0.01 },
  cellData,
  updateData,
  acceptValue,
  resetValue,
  rowData,
  focused,
  editMode,
}) => {
  const ref = useRef(null);
  // const [ignoreNextBlur, setIgnoreNextBlur] = useState(false);

  // get row data max for this cell
  const minApplied = min != null ? min : rowData[`${uid}-min`];
  const maxApplied = max != null ? max : rowData[`${uid}-max`];

  useEffect(() => {
    if (focused && editMode) {
      // setIgnoreNextBlur(false)
      ref.current.select();
    }
  }, [focused, ref, editMode]);

  const handleInputChange = (e) => {
    const newVal = validateValue(e.target.value, minApplied, maxApplied, step, defaultValue);
    updateData(newVal);
  };

  const acceptValueLocal = () => {
    acceptValue(cellData);
  };

  const rejectValue = () => {
    resetValue();
  };

  const onKeyPress = (e) => {
    // setIgnoreNextBlur(true);
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      acceptValueLocal();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      rejectValue();
    }
  };

  const onBlur = () => {
    // if (!ignoreNextBlur) acceptValueLocal();
    acceptValueLocal();
    // setIgnoreNextBlur(false);
  };

  const formatedValue = Number(cellData) && formatValue(Number(cellData), step);
  const showEditor = focused && editMode;

  return (
    <DefaultCellInnerStyle className="dataTableCellData dataTableCellData-number">
      {(!editMode || !focused) && (
        <span className="dataTableCellData_number">
          {formatedValue}
        </span>
      )}
      <input
        style={{
          display: showEditor ? 'block' : 'none',
        }}
        className="cellInput-number"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        ref={ref}
        onFocus={() => {}}
        type="number"
        max={maxApplied}
        min={minApplied}
        onChange={handleInputChange}
        value={formatedValue || ''}
        step={step}
        onBlur={onBlur}
        onKeyDown={onKeyPress}
      />
    </DefaultCellInnerStyle>
  );
};

DataTableCellNumber.propTypes = {
  cellData: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateData: PropTypes.func.isRequired,
  columnData: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    max: PropTypes.number,
    min: PropTypes.number,
    step: PropTypes.number,
    defaultValue: PropTypes.number,
  }).isRequired,
  rowData: PropTypes.shape({}).isRequired,
  acceptValue: PropTypes.func.isRequired,
  resetValue: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
};

DataTableCellNumber.defaultProps = {
  cellData: 0,
};

export default DataTableCellNumber;
