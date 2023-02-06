import React from 'react';
import PropTypes from 'prop-types';
import { CustomSelectDropdown } from '@react_db_client/components.custom-select-dropdown';
import { getRoot } from '@react_db_client/helpers.html-helpers';
import { DefaultCellInnerStyle } from './style';

/**
 * Data Cell Select
 *
 * @param {*} {
 *   cellData,
 *   updateData,
 * }
 * @returns
 */
const DataTableCellSelect = ({
  columnData: { options },
  cellData,
  acceptValue,
  resetValue,
  focused,
  editMode,
}) => {
  const targetRef = React.useRef(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  const acceptValueLocal = (v) => {
    acceptValue(v);
  };

  const rejectValue = () => {
    resetValue();
  };
  const containerRef = getRoot('selectContainer');

  React.useEffect(() => {
    if (targetRef.current) {
      /* Setup the floating dropdown popup */
      const targetPos = targetRef.current.getBoundingClientRect();
      const containerPos = containerRef.getBoundingClientRect();

      const dropDownPos = {
        top: targetPos.y - containerPos.y + targetPos.height,
        left: targetPos.x - containerPos.x,
      };
      containerRef.style.cssText = `
        position: relative;
      `;

      setPosition(dropDownPos);
    }
  }, [containerRef]);

  const displayValue = cellData && options && options.find((opt) => opt.uid === cellData)?.label;

  return (
    <DefaultCellInnerStyle className="dataTableCellData dataTableCellData-select" ref={targetRef}>
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
        position="absolute"
        absolutePosition={position}
        containerRef={containerRef}
      />
    </DefaultCellInnerStyle>
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
