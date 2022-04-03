import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Data Cell Type Popup Selection
 * Component should be connected to popup component
 *
 * @param {*} {
 *   value,
 *   editMode,
 *   setvalue,
 *   action,
 * }
 */
export const DataTableCellPopup = ({
  cellData,
  rowData,
  columnData: {
    Component, // must use HOC popup component
    readOnly,
  },
  updateData,
}) => {
  const [popupVisable, setPopupVisable] = useState(false);
  return (
    <div className="dataTableCellData dataTableCellData-button">
      {popupVisable && !readOnly && (
        <Component
          isOpen
          data={rowData}
          handleSelect={(newValue) => {
            updateData(newValue);
            setPopupVisable(false);
          }}
          handleClose={() => setPopupVisable(false)}
        />
      )}
      {(!popupVisable || readOnly) && (
        <button type="button" onClick={() => setPopupVisable(true)}>
          {cellData}
        </button>
      )}
    </div>
  );
};

DataTableCellPopup.propTypes = {
  cellData: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  columnData: PropTypes.shape({
    Component: PropTypes.elementType.isRequired,
    readOnly: PropTypes.bool,
  }).isRequired,
  rowData: PropTypes.shape({}).isRequired,
  updateData: PropTypes.func.isRequired,
};
DataTableCellPopup.defaultProps = {
  cellData: '',
};

export default DataTableCellPopup;
