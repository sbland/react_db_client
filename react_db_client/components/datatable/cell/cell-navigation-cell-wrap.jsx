import React from 'react';
import PropTypes from 'prop-types';

import {
  TableMethodsContext,
  TableStateContext,
} from '@react_db_client/components.datatable.state';

export const CellNavigationCellWrap = ({ classNames, columnIndex, rowIndex }) => {
  /* Interaction Methods */
  const { onCellKeyPress, onCellSelect } = React.useContext(TableMethodsContext);
  const { navigationMode, editMode, currentFocusedRow, currentFocusedColumn } =
    React.useContext(TableStateContext);
  const cellWrapNavBtnRef = React.useRef(null);
  const isFocused = currentFocusedColumn === columnIndex && currentFocusedRow === rowIndex;

  // TODO: This is not always e.
  const withCellId = React.useCallback(
    (fn) => (e) => fn(e, rowIndex, columnIndex),
    [rowIndex, columnIndex]
  );

  const _onCellKeyPress = React.useCallback(withCellId(onCellKeyPress), [
    (withCellId, onCellKeyPress),
  ]);
  const _onCellSelect = React.useCallback(withCellId(onCellSelect), [(withCellId, onCellSelect)]);

  /* Update cell Focus State */
  React.useEffect(() => {
    // If cell is focused set focus to navBtn
    const shouldFocus =
      !editMode && navigationMode && isFocused && cellWrapNavBtnRef && cellWrapNavBtnRef.current
        ? true
        : false;
    if (shouldFocus) {
      cellWrapNavBtnRef.current.focus();
    }
  }, [cellWrapNavBtnRef, isFocused, editMode, navigationMode]);

  return (
    <div
      ref={cellWrapNavBtnRef}
      type="button"
      className={`${classNames} navigationButton cellWrapBtn button-reset`}
      onClick={_onCellSelect}
      onKeyDown={_onCellKeyPress}
      role="presentation"
      tabIndex={`${columnIndex + rowIndex * 10}`}
    />
  );
};

CellNavigationCellWrap.propTypes = {
  classNames: PropTypes.string,
  columnIndex: PropTypes.number.isRequired,
  rowIndex: PropTypes.number.isRequired,
};

CellNavigationCellWrap.defaultProps = {
  classNames: "",
}

/* ====================== */
// import React, { useCallback, useContext } from 'react';
// import PropTypes from 'prop-types';
// import {
//   TableMethodsContext,
//   TableStateContext,
// } from '@react_db_client/components.datatable.state';

// export const CellNavigationCellWrap = ({
//   cellWrapNavBtnRef,
//   classNames,
//   onClick,
//   // onKeyDown,
//   columnIndex,
//   rowIndex,
//   columns,
// }) => {
//   const { moveCellFocus } =
//     useContext(TableMethodsContext);
//   const { navigationMode, editMode, tableData, currentFocusedRow, currentFocusedColumn } =
//     useContext(TableStateContext);

//     // const _onCellKeyPress = useCallback(withCellId(onCellKeyPress), [(withCellId, onCellKeyPress)]);
//   const columnCount = columns.length;
//   const rowCount = tableData.length;

//   const onCellKeyPress = (e, rowIndex, columnIndex) => {
//     const atEndOfRow = columnIndex === columnCount - 1;
//     const atStartOfRow = columnIndex === 0;
//     const atTopRow = rowIndex === 0;
//     const atBottomRow = rowIndex === rowCount - 1;

//     if (navigationMode) {
//       switch (e.key) {
//         case 'ArrowRight':
//           e.preventDefault();
//           if (!atEndOfRow) handleMoveFocusToTargetCell(rowIndex, columnIndex + 1);
//           else handleMoveFocusToTargetCell(rowIndex, columnIndex);
//           break;
//         case 'ArrowLeft':
//           e.preventDefault();
//           if (!atStartOfRow) handleMoveFocusToTargetCell(rowIndex, columnIndex - 1);
//           else handleMoveFocusToTargetCell(rowIndex, columnIndex);
//           break;
//         case 'ArrowUp':
//           e.preventDefault();
//           if (!atTopRow) handleMoveFocusToTargetCell(rowIndex - 1, columnIndex);
//           else handleMoveFocusToTargetCell(rowIndex, columnIndex);
//           break;
//         case 'ArrowDown':
//           e.preventDefault();
//           if (!atBottomRow) handleMoveFocusToTargetCell(rowIndex + 1, columnIndex);
//           else handleMoveFocusToTargetCell(rowIndex, columnIndex);
//           // TODO: If at bottom row then add new row
//           break;
//         case 'Enter':
//           e.preventDefault();
//           onCellSelect(e, rowIndex, columnIndex);
//           break;
//         default:
//           break;
//       }
//     } else {
//       // pass
//     }
//   };

//   return (
//     <div
//       ref={cellWrapNavBtnRef}
//       type="button"
//       aria-roledescription="cell navigation"
//       className={`${classNames} navigationButton cellWrapBtn button-reset`}
//       onClick={onClick}
//       onKeyDown={onKeyDown}
//       role="presentation"
//       tabIndex={`${columnIndex + rowIndex * 10}`}
//     />
//   );
// };

// const refPropType = PropTypes.oneOfType([
//   // Either a function
//   PropTypes.func,
//   // Or the instance of a DOM native element (see the note about SSR)
//   PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
// ]);
// const childrenPropType = PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]);

// CellNavigationCellWrap.propTypes = {
//   cellWrapNavBtnRef: refPropType.isRequired,
//   classNames: PropTypes.string.isRequired,
//   onClick: PropTypes.func.isRequired,
//   onKeyDown: PropTypes.func.isRequired,
//   columnIndex: PropTypes.number.isRequired,
//   rowIndex: PropTypes.number.isRequired,
// };
