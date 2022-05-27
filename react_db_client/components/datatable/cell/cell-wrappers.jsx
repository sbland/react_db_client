import React from 'react';
import PropTypes from 'prop-types';
import { Emoji } from '@react_db_client/components.emoji';
// import '../_dataTable.scss';
// import { RightClickWrapper } from '@samnbuk/react_db_client.components.popup-menu';
import { DataTableCellReadOnly } from '@samnbuk/react_db_client.components.datatable.cell-types';

/**
 * Data Table cell wrap that handles cell hovering
 *
 * @param {*} { className, style, handleHover, children }
 */
export const DataTableCellHoverWrap = ({
  className,
  style,
  handleHover,
  // columnWidth,
  disabled,
}) => (
  <div
    className={`dataTableCell_wrap ${className} ${disabled ? 'disabled' : 'enabled'}`}
    onFocus={() => handleHover && handleHover(true)}
    onMouseEnter={() => handleHover && handleHover(true)}
    onMouseLeave={() => handleHover && handleHover(false)}
    onBlur={() => handleHover && handleHover(false)}
    style={{
      // width: '100%',
      // height: '100%',
      ...style,
    }}
  />
);

DataTableCellHoverWrap.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  handleHover: PropTypes.func,
  columnWidth: PropTypes.number,
  disabled: PropTypes.bool,
};

DataTableCellHoverWrap.defaultProps = {
  className: '',
  style: {},
  handleHover: () => {},
  columnWidth: 100,
  disabled: false,
};

/**
 *
 * @param {*} param0
 * @returns
 */
export const EditColumnCell = ({
  allowSelection,
  allowRowDelete,
  allowRowEditPanel,
  isSelected,
  rowIndex,
  handleRemoveFromSelection,
  handleAddToSelection,
  handleDeleteRow,
  handleEditPanelBtnClick,
  rowUid,
}) => {
  return (
    <>
      {allowSelection && (
        <input
          className="rowSelectionBox"
          type="checkbox"
          id={rowIndex}
          checked={isSelected || false}
          onChange={() =>
            isSelected
              ? handleRemoveFromSelection(rowUid, rowIndex)
              : handleAddToSelection(rowUid, rowIndex)
          }
        />
      )}
      {allowRowDelete && (
        <button
          type="button"
          className="rowDeleteBtn"
          onClick={() => {
            handleDeleteRow(rowUid, rowIndex);
          }}
        >
          <Emoji emoj="🗑️" label="Delete" />
        </button>
      )}
      {allowRowEditPanel && (
        <button
          type="button"
          onClick={() => {
            handleEditPanelBtnClick(rowUid, rowIndex);
          }}
        >
          <Emoji emoj="📖" label="Open" />
        </button>
      )}
    </>
  );
};

EditColumnCell.propTypes = {
  allowSelection: PropTypes.bool.isRequired,
  allowRowDelete: PropTypes.bool.isRequired,
  allowRowEditPanel: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  rowIndex: PropTypes.number.isRequired,
  handleRemoveFromSelection: PropTypes.func.isRequired,
  handleAddToSelection: PropTypes.func.isRequired,
  handleDeleteRow: PropTypes.func.isRequired,
  handleEditPanelBtnClick: PropTypes.func.isRequired,
  rowUid: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

// export const CellRightClickWrapper = ({ readOnly, clearCell, setAsDefault, children }) => {
//   if (readOnly) {
//     return children || '';
//   }

//   return (
//     <RightClickWrapper
//       items={[
//         { uid: 'clearCell', label: 'Clear', onClick: clearCell },
//         {
//           uid: 'setDefault',
//           label: 'Set as Default',
//           onClick: setAsDefault,
//         },
//       ]}
//       //TODO: How do we make this generic?
//       popupRoot="root"
//     >
//       {children}
//     </RightClickWrapper>
//   );
// };

// CellRightClickWrapper.propTypes = {
//   readOnly: PropTypes.bool,
//   clearCell: PropTypes.func.isRequired,
//   setAsDefault: PropTypes.func.isRequired,
//   children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.nodes)]).isRequired,
// };

// CellRightClickWrapper.defaultProps = {
//   readOnly: false,
// };

const defaultComponent = () => (props) => <DataTableCellReadOnly {...props} />;

/**
 * Data Table Cell
 * Selects the correct cell type based on headings
 * Adds a right click wrapper
 *
 * @param {*} {
 *   rowId,
 *   cellData,
 *   columnData,
 *   updateData,
 * }
 * @returns
 */
// export const DataTableDataCell = (props) => {
//   const {
//     columnData: { type, readOnly, defaultValue },
//     updateData,
//     rowId,
//     columnId,
//     isDisabled,
//     componentMap,
//   } = props;
//   // TODO: Make sure read only component can parse any data
//   // const cellComponent = useMemo(
//   //   () =>
//   //     readOnly ? (
//   //       <DataTableCellReadOnly {...props} />
//   //     ) : (
//   //       switchF(type, componentMap, defaultComponent)
//   //     ),
//   //   [type, componentMap]
//   // );

//   const CellComponent = useMemo(
//     () => switchF(type, componentMap, defaultComponent),
//     [type, componentMap, defaultComponent]
//   );

//   // TODO: Can this not also handle read only?
//   if (isDisabled) {
//     return (
//       <div style={{ height: '100%' }} className="disabled">
//         <CellComponent {...props} />
//       </div>
//     );
//   }

//   return (
//     <div style={{ height: '100%' }}>
//         <CellComponent {...props} />
//     </div>
//   );
// };

// DataTableDataCell.propTypes = {
//   rowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//   columnId: PropTypes.string.isRequired,
//   rowData: PropTypes.shape({}).isRequired,
//   columnData: PropTypes.shape({
//     uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//     label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//     type: PropTypes.string.isRequired,
//     action: PropTypes.func,
//     to: PropTypes.string,
//     readOnly: PropTypes.bool,
//     defaultValue: PropTypes.any,
//   }).isRequired,
//   updateData: PropTypes.func.isRequired,
//   componentMap: PropTypes.objectOf(PropTypes.elementType).isRequired,
//   isDisabled: PropTypes.bool,
// };

// DataTableDataCell.defaultProps = {
//   isDisabled: false,
// }