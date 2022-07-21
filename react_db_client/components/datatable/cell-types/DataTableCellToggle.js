import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ToggleBox } from '@samnbuk/react_db_client.components.form.form-components.toggle-box';
import { DefaultCellInnerStyle } from './style';

export const DataTableCellToggle = ({
  cellData,
  // updateData,  //Update data not needed for toggle
  columnData,
  acceptValue,
  editMode,
  focused,
}) => {
  useEffect(() => {
    if (editMode && focused) {
      console.log("toggle")
      acceptValue(!cellData);
    }
  }, [editMode, focused, cellData, acceptValue]);
  return (
    <DefaultCellInnerStyle className="dataTableCellData dataTableCellData-text">
      <ToggleBox id={columnData.uid} stateIn={cellData} onChange={acceptValue} />
    </DefaultCellInnerStyle>
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
