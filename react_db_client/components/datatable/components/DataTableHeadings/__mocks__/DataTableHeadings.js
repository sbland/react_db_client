/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
import React from 'react';

export const DataTableHeadingMenu = ({
  handleAddFilter,
  setSortBy,
  headingData,
  handleHideColumn,
}) => {
  return <div className="dataTableHeadingMenu">Data Table Heading Menu</div>;
};

export const DataTableHeading = ({ title }) => (
  <div className="dataTableHeading">
    <div className="heading">{title}</div>
  </div>
);

export const DataTableHeadings = ({
  headingsDataList,
  setSortBy,
  handleHideColumn,
  columnWidths,
  handleAddFilter,
  showFilterBtns,
  tableWidth,
}) => {
  return <div className="dataTableHeadings">mock data table headings</div>;
};

export default DataTableHeadings;
