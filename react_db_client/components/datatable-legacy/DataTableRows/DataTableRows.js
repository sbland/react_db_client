import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Emoji } from '@react_db_client/components.emoji';
import { DataTableCellHoverWrap, DataTableDataCell } from '../DataTableCell/CellWrappers';

import { DataTableContext } from '../DataTableConfig/DataTableConfig';

/**
 * @deprecated Use react-window grid now
 *
 * @param {*} {
 *   headingsDataList,
 *   tableDataFiltered,
 *   handleDeleteRow,
 *   columnWidths,
 *   handleValueChange,
 *   handleValueAccept,
 *   handleValueReset,
 *   openEditPanel,
 *   tableWidth,
 * }
 * @return {*}
 */
const DataTableRows = ({
  headingsDataList,
  tableDataFiltered,
  handleDeleteRow,
  columnWidths,
  handleValueChange,
  handleValueAccept,
  handleValueReset,
  openEditPanel,
  tableWidth,
}) => {
  const [currentHoverRow, setCurrentHoverRow] = useState(-1);
  const { allowRowDelete, allowRowEditPanel, allowEditRow, limitHeight, hasBtnsColumn } =
    useContext(DataTableContext);
  const outsideWrapClassName = [
    'dataTable_rowsOutsideWrap',
    limitHeight ? 'dataTable_rowsOutsideWrap-limitHeight' : '',
  ].join(' ');
  const outsideWrapStyleOverride = {
    maxHeight: limitHeight || null,
  };

  const insideWrapClassName = [
    'dataTable_rowsInsideWrap',
    limitHeight ? 'dataTable_rowsInsideWrap-limitHeight' : '',
  ].join(' ');
  const insideWrapStyleOverride = {
    width: `${tableWidth}px`,
  };

  const handleCellUpdate = (newValue, rowId, rowIndex, columnId) => {
    if (allowEditRow) handleValueChange(newValue, rowId, rowIndex, columnId);
  };

  const handleCellAccept = (newValue, rowId, rowIndex, columnId) => {
    if (allowEditRow) handleValueAccept(newValue, rowId, rowIndex, columnId);
  };

  const handleCellReset = (rowId, rowIndex, columnId) => {
    if (allowEditRow) handleValueReset(rowId, rowIndex, columnId);
  };

  const mapRows = tableDataFiltered.map((rowData, rowId) =>
    headingsDataList.map((headingData, i) => (
      // Each cell is wrapped by a CellWrap component to manage column width and row hover
      <DataTableCellHoverWrap
        className={`
            ${currentHoverRow === rowId ? 'hover' : ''}
            ${rowId % 2 === 1 ? 'oddRow' : ''}
          `}
        key={headingData.uid}
        columnWidth={columnWidths[hasBtnsColumn ? i + 1 : i]}
        handleHover={(mouseIn) => setCurrentHoverRow(mouseIn ? rowId : -1)}
      >
        <DataTableDataCell
          rowId={rowData.uid}
          rowIndex={rowId}
          // key={`${rowData.uid}-${rowData[headingData.uid]}`}
          columnId={headingData.uid}
          cellData={rowData[headingData.uid]}
          rowData={rowData}
          columnData={headingData}
          updateData={(newVal) => handleCellUpdate(newVal, rowData.uid, rowId, headingData.uid)}
          acceptValue={(newVal) => handleCellAccept(newVal, rowData.uid, rowId, headingData.uid)}
          resetValue={() => handleCellReset(rowData.uid, rowId, headingData.uid)}
        />
      </DataTableCellHoverWrap>
    ))
  );

  if (hasBtnsColumn) {
    mapRows.forEach((row, i) => {
      mapRows[i].unshift(
        <DataTableCellHoverWrap key="btns" columnWidth={columnWidths[0]}>
          {allowRowDelete && (
            <button
              type="button"
              className="deleteRowBtn"
              onClick={() => {
                const { uid } = tableDataFiltered[i];
                handleDeleteRow(uid);
              }}
            >
              <Emoji emoj="🗑️" label="Delete" />
            </button>
          )}
          {allowRowEditPanel && (
            <button
              type="button"
              onClick={() => {
                const { uid } = tableDataFiltered[i];
                openEditPanel(uid);
              }}
            >
              <Emoji emoj="📖" label="Open" />
            </button>
          )}
        </DataTableCellHoverWrap>
      );
    });
  }

  return (
    <div
      data-testid="datatable-legacy-outsideWrap"
      className={outsideWrapClassName}
      style={outsideWrapStyleOverride}
    >
      <div
        data-testid="datatable-legacy-insideWrap"
        className={insideWrapClassName}
        style={insideWrapStyleOverride}
      >
        {mapRows}
      </div>
    </div>
  );
};

DataTableRows.propTypes = {
  headingsDataList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  tableDataFiltered: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleValueChange: PropTypes.func.isRequired,
  handleValueAccept: PropTypes.func.isRequired,
  handleValueReset: PropTypes.func.isRequired,
  handleDeleteRow: PropTypes.func.isRequired,

  columnWidths: PropTypes.arrayOf(PropTypes.number).isRequired,
  openEditPanel: PropTypes.func.isRequired,
  tableWidth: PropTypes.number.isRequired,
};

DataTableRows.defaultProps = {};

export default DataTableRows;
