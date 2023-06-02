import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { validateValue, formatValue } from '@react_db_client/helpers.data-processing';
import { DefaultCellInnerStyle } from './style';
import { ICellProps, IHeadingNumber } from '../lib';

export interface IDataTableCellLinkProps extends ICellProps<IHeadingNumber> {
  cellData: number;
}

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
  columnData: { uid: columnId, min, max, uid, defaultValue, step = 0.01 },
  cellData,
  updateData,
  acceptValue,
  resetValue,
  rowData,
  focused,
  editMode,
  rowId,
}: IDataTableCellLinkProps) => {
  const ref = useRef<HTMLInputElement>(null);

  // get row data max for this cell
  const minApplied = min != null ? min : rowData[`${uid}-min`];
  const maxApplied = max != null ? max : rowData[`${uid}-max`];

  useEffect(() => {
    if (focused && editMode) {
      // setIgnoreNextBlur(false)
      ref.current?.select();
    }
  }, [focused, ref, editMode]);

  const handleInputChange = (e) => {
    // const newVal = validateValue(e.target.value, minApplied, maxApplied, step, defaultValue);
    const newVal = e.target.value;
    updateData(newVal, rowId, columnId);
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
    if (focused) {
      acceptValueLocal();
    }
    // setIgnoreNextBlur(false);
  };

  const formattedValue = Number(cellData) && formatValue(Number(cellData), step);
  const formattedValueOrNull = Number.isNaN(formattedValue) ? null : formattedValue;
  const showEditor = focused && editMode;

  return (
    <DefaultCellInnerStyle className="dataTableCellData dataTableCellData-number">
      {(!editMode || !focused) && (
        <span className="dataTableCellData_number">{formattedValueOrNull}</span>
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
        value={formattedValueOrNull || ''}
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
