/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
import React from 'react';

const DataTableCellLink = ({
  columnData: { readOnly },
  cellData,
  updateData,
  acceptValue,
  columnData,
}) => {
  return <div className="dataTableCellData dataTableCellData-link">{cellData}</div>;
};

export default DataTableCellLink;
