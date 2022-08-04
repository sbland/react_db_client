import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ToggleBox } from '@react_db_client/components.form.form-components.toggle-box';

const DataTableCellToggle = ({
  cellData,
  // updateData,  //Update data not needed for toggle
  acceptValue,
  editMode,
  focused,
}) => {
  useEffect(() => {
    if (editMode && focused) {
      acceptValue(!cellData);
    }
  }, [editMode, focused, cellData, acceptValue]);
  return (
    <div className="dataTableCellData dataTableCellData-text">
      <ToggleBox stateIn={cellData} onChange={acceptValue} />
    </div>
  );
};

DataTableCellToggle.propTypes = {
  cellData: PropTypes.oneOfType([PropTypes.bool]),
  columnData: PropTypes.shape({
    readOnly: PropTypes.bool,
  }).isRequired,
  // updateData: PropTypes.func.isRequired,
  acceptValue: PropTypes.func.isRequired,

  focused: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
};

DataTableCellToggle.defaultProps = {
  cellData: null,
};

export default DataTableCellToggle;