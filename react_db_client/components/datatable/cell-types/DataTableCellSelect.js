import React from 'react';
import PropTypes from 'prop-types';
import { CustomSelectDropdown } from '@samnbuk/react_db_client.components.custom-select-dropdown';

/**
 * Data Cell Select
 *
 * @param {*} {
 *   cellData,
 *   updateData,
 * }
 * @returns
 */
export const DataTableCellSelect = ({
  columnData: { options },
  cellData,
  acceptValue,
  resetValue,
  focused,
  editMode,
}) => {
  const acceptValueLocal = (v) => {
    acceptValue(v);
  };

  const rejectValue = () => {
    resetValue();
  };

  const displayValue = cellData && options && options.find((opt) => opt.uid === cellData)?.label;

  return (
    <div className="dataTableCellData dataTableCellData-select">
      {/* TODO: Implement search dropdown */}
      {/* <div
        style={{
          display: (showEditor) ? 'block' : 'none',
        }}
        className="cellInput-select"
      >
        <SearchAndSelectDropdown
          searchFunction={dropDownSearch}
          handleSelect={acceptValueLocal}
          labelField="label"
          returnFieldOnSelect="uid"
          searchFieldTargetField="label"
        />
      </div> */}
      <div className="displayCellData dataTableCellData_text" style={{ position: 'absolute' }}>
        {displayValue}
      </div>
      <CustomSelectDropdown
        options={options}
        handleSelect={acceptValueLocal}
        isOpen={focused && editMode}
        firstItemRef={{ current: {} }}
        handleClose={() => rejectValue()}
        goBackToSearchField={() => rejectValue()}
      />
    </div>
  );
};

DataTableCellSelect.propTypes = {
  cellData: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  columnData: PropTypes.shape({
    options: PropTypes.arrayOf(
      PropTypes.shape({
        uid: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      })
    ).isRequired,
    readOnly: PropTypes.bool,
  }).isRequired,
  acceptValue: PropTypes.func.isRequired,
  resetValue: PropTypes.func.isRequired,

  focused: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
};

DataTableCellSelect.defaultProps = {
  cellData: 0,
};

export default DataTableCellSelect;
