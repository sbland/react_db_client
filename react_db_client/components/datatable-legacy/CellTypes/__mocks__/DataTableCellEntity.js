/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
import React from 'react';

const SelectEntityPanel = ({ currentSelection, collection, headings, handleSubmit }) => (
  <div className="entitySelector">Mock Select Entity panel</div>
);

const DataTableCellEntity = ({ columnData: { collection, headings }, cellData, updateData }) => {
  return <div className="dataTableCellData dataTableCellData-select">{cellData}</div>;
};

export default DataTableCellEntity;
