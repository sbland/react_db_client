/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';

export const DataTableCellHoverWrap = ({ className, columnWidth, handleHover, children }) => (
  <div>{children}</div>
);

export const DataTableDataCell = (props) => {
  const {
    columnData: { type, readOnly, defaultValue },
    updateData,
    rowId,
    columnId,
    // cellData,
    // rowData,
  } = props;
  return <div className="DataTableCell">Data Table Cell mock</div>;
};

export const EditColumnCell = () => <div className="EditColumnCell">EditColumnCell</div>;
export const CellRightClickWrapper = () => (
  <div className="CellRightClickWrapper">CellRightClickWrapper</div>
);
