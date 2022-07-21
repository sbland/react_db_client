import React, { useCallback, useContext, useMemo } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { switchF } from '@react_db_client/helpers.func-tools';
import { RowStyleContext } from '@samnbuk/react_db_client.components.datatable.logic';
import { TableStateContext } from '@samnbuk/react_db_client.components.datatable.state';
import { getRoot } from '@react_db_client/helpers.html-helpers';
import { CellNavigationCellWrap } from './cell-navigation-cell-wrap';
// import { CellInfoBtn } from './cell-info-btn';

const defaultComponent = () => () => <div>Unknown Data Type</div>;

const focusedBoxShadow = '1px 1px 5px 0 grey';
export const CellOuterStyle = styled.div`
  width: ${({ focused }) => (focused ? 'fit-content' : '100%')};
  height: ${({ focused }) => (focused ? 'fit-content' : '100%')};
  overflow: hidden;
  padding: 1px;
  position: relative;
  min-height: 100%;
  min-width: 100%;
  box-shadow: ${({ focused }) => (focused ? focusedBoxShadow : 'none')};
  outline: ${({ focused, theme }) =>
    focused ? `1px solid ${theme.primaryColor || 'red'}` : 'none'};
  background: ${({ theme, focused }) => (focused ? theme.cellBackground : 'none')};
  outline-offset: -1px;
  display: flex;
  align-items: flex-start;
  z-index: ${({ focused }) => (focused ? 10 : 'inherit')};
`;
export const ActiveCell = ({ position, children }) => {
  const root = React.useRef(getRoot('datatable-active-cell'));
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
      data-testid="activeCellWrap"
    >
      {children}
    </div>,
    // TODO: GET ROOT CORRECTLY
    root.current
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
}) {
  const {
    onCellChange,
    onCellAccept,
    onCellReset,
    editMode,
    currentFocusedRow,
    currentFocusedColumn,
    tableData,
  } = useContext(TableStateContext);

  /* Cell Refs */
  const cellWrapRef = React.useRef(null);
  const [cellPosition, setCellPosition] = React.useState({ top: 999 });

  /* Cell State */
  const isFocused = currentFocusedColumn === columnIndex && currentFocusedRow === rowIndex;

  React.useEffect(() => {
    if (cellWrapRef.current && isFocused)
      setCellPosition(cellWrapRef.current.getBoundingClientRect());
  }, [isFocused]);

  /* Cell Data */

  // TODO: Check if it is faster to get data from props or context
  // const headingData = useMemo(() => headingsData[columnIndex] || {}, [headingsData, columnIndex]);
  const rowData = useMemo(() => tableData[rowIndex] || {}, [rowIndex, tableData]);
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
    [cellType, componentMap]
  );

  /* NOTE: This is not always e. */
  const withCellId = useCallback(
    (fn) => (e) => fn(e, rowIndex, columnIndex, headingId),
    [rowIndex, columnIndex, headingId]
  );

  const _onCellChange = useMemo(() => withCellId(onCellChange), [withCellId, onCellChange]);
  const _onCellAccept = useMemo(() => withCellId(onCellAccept), [withCellId, onCellAccept]);
  const _onCellReset = useMemo(() => withCellId(onCellReset), [withCellId, onCellReset]);

  const innerCellComponent = React.useMemo(
    () => (
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
    ),
    [
      disabled,
      rowId,
      rowIndex,
      classNames,
      isFocused,
      editMode,
      headingId,
      cellData,
      headingData,
      rowData,
      _onCellAccept,
      _onCellChange,
      _onCellReset,
      componentMap,
      CellComponent,
    ]
  );

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
      <CellOuterStyle
        style={{ zIndex: isFocused ? 999 : 'inherit', ...cellStyle }}
        className={isDisabled ? 'cellWrap disabled' : 'cellWrap'}
        focused={isFocused}
        ref={(el) => {
          cellWrapRef.current = el;
        }}
      >
        <CellNavigationCellWrap columnIndex={columnIndex} rowIndex={rowIndex} />
        {isFocused && editMode ? (
          <ActiveCell
            isFocused={isFocused}
            position={cellPosition}
          >
            {innerCellComponent}
          </ActiveCell>
        ) : (
          innerCellComponent
        )}
      </CellOuterStyle>
    </>
  );
}

Cell.propTypes = {
  columnIndex: PropTypes.number.isRequired,
  rowIndex: PropTypes.number.isRequired,
  style: PropTypes.shape({}),
  headingData: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
  }).isRequired,
  className: PropTypes.string,
  componentMap: PropTypes.objectOf(PropTypes.elementType).isRequired,
  disabled: PropTypes.bool,
};

Cell.defaultProps = {
  disabled: false,
  style: {},
};
