import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { Emoji } from '@react_db_client/components.emoji';
import { FilterObjectClass } from '@react_db_client/constants.client-types';
import { useAutoHidePanel } from '@react_db_client/hooks.use-auto-hide-panel-hook';

import { DataTableCellHoverWrap } from '../DataTableCell/CellWrappers';
import { headingDataShape } from '../inputDataShapes';
import { DataTableContext } from '../DataTableConfig/DataTableConfig';

export const DataTableHeadingMenu = ({
  handleAddFilter,
  setSortBy,
  headingData,
  handleHideColumn,
}) => {
  const { allowFilters, allowSortBy, allowHiddenColumns } = useContext(DataTableContext);
  const className = 'dataTableHeading_menuBtnWrap';
  const menuRef = useRef(null);

  const [menuOpen, setMenuOpen] = useAutoHidePanel(menuRef, true, false);

  const allowMenu = allowFilters || allowSortBy || allowHiddenColumns;

  return (
    <div className="dataTableHeading_menuWrap">
      {allowMenu && (
        <button
          className="dataTableCell_btn filterBtn"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Emoji emoj="🔽" label="DropDownMenu" />
        </button>
      )}
      {menuOpen && (
        <div className={className} ref={menuRef}>
          {allowFilters && (
            <button
              className="dataTableCell_btn filterBtn"
              type="button"
              onClick={() => {
                handleAddFilter(
                  new FilterObjectClass({
                    field: headingData.uid,
                    type: headingData.type,
                    label: headingData.label,
                  })
                );
                setMenuOpen(false);
              }}
            >
              Filter by
            </button>
          )}
          {allowSortBy && (
            <button
              className="dataTableCell_btn sortBtn"
              type="button"
              onClick={() => {
                setSortBy(headingData.uid);
                setMenuOpen(false);
              }}
            >
              Sort By
            </button>
          )}
          {allowHiddenColumns && (
            <button
              className="dataTableCell_btn hideBtn"
              type="button"
              onClick={() => {
                handleHideColumn(headingData.uid);
                setMenuOpen(false);
              }}
            >
              Hide Column
            </button>
          )}
        </div>
      )}
    </div>
  );
};

DataTableHeadingMenu.propTypes = {
  handleAddFilter: PropTypes.func.isRequired,
  setSortBy: PropTypes.func.isRequired,
  handleHideColumn: PropTypes.func.isRequired,
  headingData: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
};

export const DataTableHeading = ({ title, id }) => (
  <div data-testid={`heading_${id}`} className="dataTableHeading">
    <div className="heading">{title}</div>
  </div>
);

DataTableHeading.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export const DataTableHeadings = ({
  headingsDataList,
  setSortBy,
  handleHideColumn,
  columnWidths,
  handleAddFilter,
  showFilterBtns,
  tableWidth,
}) => {
  const [activeColumn, setActiveColumn] = useState(null);
  const { hasBtnsColumn } = useContext(DataTableContext);

  const outsideWrapClassName = ['dataTable_headingsOutsideWrap'].join(' ');
  const insideWrapClassName = ['dataTable_headingsInsideWrap'].join(' ');
  const insideWrapStyleOverride = {
    width: `${tableWidth}px`,
    maxWidth: `${tableWidth}px`,
    // position: 'relative',
  };

  const addFilter = (newFilter) => {
    handleAddFilter(newFilter);
  };

  const handleChangeSortBy = (newSortBy) => {
    setSortBy(newSortBy);
  };

  // Map Headings to UI
  const className = 'dataTableHeading_cellWrap';
  const mapHeadings = headingsDataList.map((headingData, i) => (
    <DataTableCellHoverWrap
      className={className}
      key={headingData.uid}
      columnWidth={columnWidths[i]}
      handleHover={() => setActiveColumn(i)}
      style={{
        minWidth: columnWidths[i],
        width: columnWidths[i],
      }}
    >
      <>
        <DataTableHeading key={headingData.uid} id={headingData.uid} title={headingData.label} />
        {showFilterBtns && i === activeColumn && (
          <DataTableHeadingMenu
            handleAddFilter={addFilter}
            setSortBy={handleChangeSortBy}
            handleHideColumn={handleHideColumn}
            headingData={headingData}
          />
        )}
      </>
    </DataTableCellHoverWrap>
  ));

  // if we can edit rows then we need to add extra column for edit buttons
  if (hasBtnsColumn) {
    mapHeadings.unshift(
      <DataTableCellHoverWrap className={className} key="Settings" columnWidth={columnWidths[0]}>
        <></>
      </DataTableCellHoverWrap>
    );
  }

  return (
    <div className={outsideWrapClassName} data-testid="datatable_headings_row">
      <div className={insideWrapClassName} style={insideWrapStyleOverride}>
        {mapHeadings}
      </div>
    </div>
  );
};

DataTableHeadings.propTypes = {
  headingsDataList: PropTypes.arrayOf(PropTypes.shape(headingDataShape)).isRequired,
  setSortBy: PropTypes.func.isRequired,
  handleHideColumn: PropTypes.func.isRequired,
  handleAddFilter: PropTypes.func.isRequired,
  columnWidths: PropTypes.arrayOf(PropTypes.number).isRequired,
  showFilterBtns: PropTypes.bool,
  tableWidth: PropTypes.number.isRequired,
};

DataTableHeadings.defaultProps = {
  showFilterBtns: true,
};

export default DataTableHeadings;
