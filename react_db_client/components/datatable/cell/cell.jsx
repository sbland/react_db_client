import React, { useCallback, useContext, useMemo } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { switchF } from '@samnbuk/react_db_client.helpers.func-tools';
import { RowStyleContext } from '@samnbuk/react_db_client.components.datatable.logic';
import { CellNavigationCellWrap } from './cell-navigation-cell-wrap';
// import { CellInfoBtn } from './cell-info-btn';
import styled from 'styled-components';
import {
  TableMethodsContext,
  TableStateContext,
} from '@samnbuk/react_db_client.components.datatable.state';

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

const defaultComponent = () => (props) => <div>Unknown Data Type</div>;

export const ActiveCell = ({ position, children }) => {
  return ReactDOM.createPortal(
    <div
      style={{
        zIndex: 100,
        position: 'absolute',
        top: position.top,
        minWidth: position.width,
        minHeight: position.height,
        background: 'white',
        left: position.left,
      }}
    >
      {children}
    </div>,
    // TODO: GET ROOT CORRECTLY
    document.getElementById('root')
  );
};

export function Cell({
  columnIndex,
  rowIndex,
  style,
  className,
  headingData,
  componentMap,
  disabled, // TODO: Make this per cell
  rowData,
}) {
  /* Interaction Methods */
  const { onCellChange, onCellAccept, onCellReset } = useContext(TableMethodsContext);
  const { navigationMode, editMode, currentFocusedRow, currentFocusedColumn } =
    useContext(TableStateContext);

  /* Cell Refs */
  const cellWrapRef = React.useRef(null);
  const [cellPosition, setCellPosition] = React.useState({ top: 999 });

  /* Cell State */
  const isFocused = currentFocusedColumn === columnIndex && currentFocusedRow === rowIndex;

  React.useEffect(() => {
    if (cellWrapRef.current && isFocused && navigationMode)
      setCellPosition(cellWrapRef.current.getBoundingClientRect());
  }, [isFocused]);

  // console.log(cellPosition);
  /* Cell Data */

  // TODO: Check if it is faster to get data from props or context
  // const headingData = useMemo(() => headingsData[columnIndex] || {}, [headingsData, columnIndex]);
  // const rowData = useMemo(() => tableData[rowIndex] || {}, [tableData, rowIndex]);
  const { type: cellType, isDisabled, uid: headingId } = headingData;
  const { uid: rowId } = rowData;
  const cellData = useMemo(() => rowData[headingId], [rowData, headingId]);

  /* Cell Style */
  const rowStyles = useContext(RowStyleContext);
  const cellStyle = {
    ...style,
    ...(rowStyles && rowStyles[rowIndex]),
  };

  const classNames = [
    className,
    isFocused ? 'focused' : 'notFocused',
    `row_index_${rowIndex}`,
    `column_index_${columnIndex}`,
    `column_id_${headingId}`,
    isDisabled ? 'disabled' : null,
  ].join(' ');

  const CellComponent = useMemo(
    () => switchF(cellType, componentMap, defaultComponent),
    [cellType, componentMap, defaultComponent]
  );

  // TODO: This is not always e.
  const withCellId = useCallback(
    (fn) => (e) => fn(e, rowIndex, columnIndex),
    [rowIndex, columnIndex]
  );

  const _onCellChange = useCallback(withCellId(onCellChange), [(withCellId, onCellChange)]);
  const _onCellAccept = useCallback(withCellId(onCellAccept), [(withCellId, onCellAccept)]);
  const _onCellReset = useCallback(withCellId(onCellReset), [(withCellId, onCellReset)]);

  return (
    <>
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
      {/* TODO: Fix info button */}
      {/* <CellInfoBtn
          styles={rowStyles ? rowStyles[rowIndex] : {}}
          message={invalidRowsMessages && invalidRowsMessages[rowIndex]}
        /> */}
      <CellNavigationCellWrap columnIndex={columnIndex} rowIndex={rowIndex} />
      <div
        style={{ zIndex: isFocused ? 999 : 'inherit', ...cellStyle }}
        className={isDisabled ? 'cellWrap disabled' : 'cellWrap'}
        ref={(el) => {
          cellWrapRef.current = el;
        }}
      >
        {isFocused && editMode ? (
          <ActiveCell
            cellWrapRef={cellWrapRef.current}
            isFocused={isFocused}
            position={cellPosition}
          >
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
              updateData={_onCellChange}
              acceptValue={_onCellAccept}
              resetValue={_onCellReset}
              componentMap={componentMap}
            />
          </ActiveCell>
        ) : (
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
        )}
      </div>
    </>
  );
}

Cell.propTypes = {
  columnIndex: PropTypes.number.isRequired,
  rowIndex: PropTypes.number.isRequired,
  style: PropTypes.shape({}),
  headingData: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
  componentMap: PropTypes.objectOf(PropTypes.elementType).isRequired,
  disabled: PropTypes.bool,
};

Cell.defaultProps = {
  disabled: false,
  style: {},
};
