import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { switchF } from '@samnbuk/react_db_client.helpers.func-tools';
import { RowStyleContext } from '@samnbuk/react_db_client.components.datatable.logic';
import { DataTableCellHoverWrap } from './cell-wrappers';
import { CellNavigationCellWrap } from './cell-navigation-cell-wrap';
import { RightClickWrapper } from '@samnbuk/react_db_client.components.popup-menu';
import { DataTableCellReadOnly } from '@samnbuk/react_db_client.components.datatable.cell-types';
import { CellInfoBtn } from './cell-info-btn';
import styled from 'styled-components';
import {
  TableMethodsContext,
  TableStateContext,
} from '@samnbuk/react_db_client.components.datatable.state';
// import {
//   TableMethodsContext,
//   TableStateContext,
// } from '@samnbuk/react_db_client.components.datatable.state';

export const CellStyles = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  .navigationButton,
  .dataTableCell_wrap,
  .dataTableCellData {
    width: 100%;
    height: 100%;
  }

  .navigationButton,
  .dataTableCell_wrap {
    position: absolute;
  }
`;

const defaultComponent = () => (props) => <DataTableCellReadOnly {...props} />;

export function Cell({
  columnIndex,
  rowIndex,
  style,
  className,
  headingsData,
  // methods,
  componentMap,
  disabled, // TODO: Make this per cell
  // tableState,
}) {
  /* Interaction Methods */
  const { onCellKeyPress, onCellChange, onCellAccept, onCellReset, onCellSelect, onCellHover } =
    useContext(TableMethodsContext);
  const { navigationMode, editMode, tableData, currentFocusedRow, currentFocusedColumn } =
    useContext(TableStateContext);

  /* Cell Refs */
  /* The nav btn holds the pointer if this cell is focused but not in edit mode */
  const cellWrapNavBtnRef = useRef(null);

  /* Row State */
  // TODO: Can remove this or should pass to cell component?
  // const rowIsSelected = rowSelectionState[rowIndex];

  /* Cell State */
  const isFocused = currentFocusedColumn === columnIndex && currentFocusedRow === rowIndex;
  /* Cell Data */
  const headingData = useMemo(() => headingsData[columnIndex] || {}, [headingsData, columnIndex]);
  const rowData = useMemo(() => tableData[rowIndex] || {}, [tableData, rowIndex]);
  const { type: cellType, isDisabled, uid: headingId } = headingData;
  const { uid: rowId } = rowData;
  const cellData = useMemo(() => rowData[headingId], [rowData, headingId]);

  /* Cell Style */
  const rowStyles = useContext(RowStyleContext);
  const cellStyle = {
    ...style,
    ...(rowStyles && rowStyles[rowIndex]),
  };

  const cellClassName = [className, isFocused && 'focusedCell'].filter((f) => f).join(' ');

  const classNames = [
    className,
    isFocused ? 'focused' : 'notFocused',
    `row_index_${rowIndex}`,
    `column_index_${columnIndex}`,
    `column_id_${headingId}`,
  ].join(' ');

  /* Update cell Focus State */
  useEffect(() => {
    // If cell is focused set focus to navBtn
    const shouldFocus =
      !editMode && navigationMode && isFocused && cellWrapNavBtnRef && cellWrapNavBtnRef.current
        ? true
        : false;
    if (shouldFocus) {
      cellWrapNavBtnRef.current.focus();
    }
  }, [cellWrapNavBtnRef, isFocused, editMode, navigationMode]);

  const CellComponent = useMemo(
    () => switchF(cellType, componentMap, defaultComponent),
    [cellType, componentMap, defaultComponent]
  );

  // TODO: This is not always e.
  const withCellId = useCallback(
    (fn) => (e) => fn(e, rowIndex, columnIndex),
    [rowIndex, columnIndex]
  );

  const _onCellKeyPress = useCallback(withCellId(onCellKeyPress), [(withCellId, onCellKeyPress)]);
  const _onCellHover = useCallback(withCellId(onCellHover), [(withCellId, onCellHover)]);
  const _onCellSelect = useCallback(withCellId(onCellSelect), [(withCellId, onCellSelect)]);
  const _onCellChange = useCallback(withCellId(onCellChange), [(withCellId, onCellChange)]);
  const _onCellAccept = useCallback(withCellId(onCellAccept), [(withCellId, onCellAccept)]);
  const _onCellReset = useCallback(withCellId(onCellReset), [(withCellId, onCellReset)]);

  // return <div>cell</div>;
  // return rcount.current;
  return (
    <>
     {/* <CellStyles> */}
      {/* <RightClickWrapper
        items={[
          { uid: 'clearCell', label: 'Clear', onClick: () => console.log('Clear') },
          {
            uid: 'setDefault',
            label: 'Set as Default',
            onClick: () => console.log('setAsDefault'),
          },
        ]}
        //TODO: How do we make this generic?
        popupRoot="root"
      /> */}
      <DataTableCellHoverWrap
        className={cellClassName}
        style={cellStyle}
        // handleHover={_onCellHover}
        disabled={disabled}
      />
      <CellNavigationCellWrap
        cellWrapNavBtnRef={cellWrapNavBtnRef}
        classNames={classNames}
        onClick={_onCellSelect}
        onKeyDown={_onCellKeyPress}
        columnIndex={columnIndex}
        rowIndex={rowIndex}
      />
      {/* TODO: Fix info button */}
      {/* <CellInfoBtn
          styles={rowStyles ? rowStyles[rowIndex] : {}}
          message={invalidRowsMessages && invalidRowsMessages[rowIndex]}
        /> */}
      <div style={{ height: '100%', width: '100%' }} className={isDisabled ? 'disabled' : ''}>
        {/* {JSON.stringify(cellData)} */}
        <CellComponent
          isDisabled={disabled}
          rowId={rowId}
          rowIndex={rowIndex}
          classNames={classNames}
          focused={!disabled && isFocused}
          editMode={!disabled && editMode}
          columnId={headingId}
          cellData={cellData}
          rowData={rowData}
          columnData={headingData}
          // TODO: rename as onChange
          updateData={_onCellChange}
          acceptValue={_onCellAccept}
          resetValue={_onCellReset}
          componentMap={componentMap}
        />
      </div>
      {/* </RightClickWrapper> */}
    {/* </CellStyles> */}
    </>
  );
}

Cell.propTypes = {
  columnIndex: PropTypes.number.isRequired,
  rowIndex: PropTypes.number.isRequired,
  style: PropTypes.shape({}),
  headingsData: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
    })
  ).isRequired,
  // tableState: PropTypes.shape({
  //   tableData: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       uid: PropTypes.string.isRequired,
  //     })
  //   ).isRequired,
  //   currentFocusedRow: PropTypes.number,
  //   currentFocusedColumn: PropTypes.number,
  //   navigationMode: PropTypes.bool.isRequired,
  //   editMode: PropTypes.bool.isRequired,
  //   invalidRowsMessages: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       text: PropTypes.string,
  //     })
  //   ),
  // }).isRequired,
  // methods: PropTypes.shape({
  //   onCellKeyPress: PropTypes.func.isRequired,
  //   onCellChange: PropTypes.func.isRequired,
  //   onCellAccept: PropTypes.func.isRequired,
  //   onCellReset: PropTypes.func.isRequired,
  //   onCellSelect: PropTypes.func.isRequired,
  //   onCellHover: PropTypes.func.isRequired,
  // }).isRequired,
  className: PropTypes.string,
  componentMap: PropTypes.objectOf(PropTypes.elementType).isRequired,
  disabled: PropTypes.bool,
};

Cell.defaultProps = {
  disabled: false,
  style: {},
};
