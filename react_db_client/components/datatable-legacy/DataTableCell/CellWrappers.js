import React from 'react';
import PropTypes from 'prop-types';
import { Emoji } from '@react_db_client/components.emoji';
import { switchF } from '@react_db_client/helpers.func-tools';
import { RightClickWrapper } from '@react_db_client/components.popup-menu';

import '../_dataTable.scss';
import DataTableCellText from '../CellTypes/DataTableCellText';
import DataTableCellNumber from '../CellTypes/DataTableCellNumber';
import DataTableCellLink from '../CellTypes/DataTableCellLink';
import DataTableCellButton from '../CellTypes/DataTableCellButton';
// import DataTableCellPopup from '../CellTypes/DataTableCellPopup';
import DataTableCellSelect from '../CellTypes/DataTableCellSelect';
import DataTableCellToggle from '../CellTypes/DataTableCellToggle';
import DataTableCellReadOnly from '../CellTypes/DataTableCellReadOnly';

/**
 * Data Table cell wrap that handles cell hovering
 *
 * @param {*} { className, style, handleHover, children }
 */
export const DataTableCellHoverWrap = ({
  className,
  style,
  handleHover,
  children,
  columnWidth,
  disabled,
}) => (
  <div
    className={`dataTableCell_wrap ${className} ${disabled ? 'disabled' : ''}`}
    onFocus={() => handleHover && handleHover(true)}
    onMouseEnter={() => handleHover && handleHover(true)}
    onMouseLeave={() => handleHover && handleHover(false)}
    onBlur={() => handleHover && handleHover(false)}
    style={{
      width: columnWidth,
      ...style,
    }}
  >
    {children}
  </div>
);

DataTableCellHoverWrap.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  handleHover: PropTypes.func,
  children: PropTypes.node.isRequired,
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

export const CellRightClickWrapper = ({ readOnly, clearCell, setAsDefault, children }) => {
  if (readOnly) {
    return children || '';
  }

  return (
    <RightClickWrapper
      items={[
        { uid: 'clearCell', label: 'Clear', onClick: clearCell },
        {
          uid: 'setDefault',
          label: 'Set as Default',
          onClick: setAsDefault,
        },
      ]}
    >
      {children}
    </RightClickWrapper>
  );
};

CellRightClickWrapper.propTypes = {
  readOnly: PropTypes.bool,
  clearCell: PropTypes.func.isRequired,
  setAsDefault: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.nodes)]).isRequired,
};

CellRightClickWrapper.defaultProps = {
  readOnly: false,
};

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
export const DataTableDataCell = (props) => {
  const {
    columnData: { type, readOnly, defaultValue },
    updateData,
    rowId,
    columnId,
    customFieldComponents = {},
    isDisabled,
  } = props;
  const isCustomCell = customFieldComponents && customFieldComponents[type] !== undefined;

  const cellComponent =
    readOnly && !isCustomCell ? (
      <DataTableCellReadOnly {...props} />
    ) : (
      switchF(
        type,
        {
          textLong: () => <DataTableCellText {...props} />,
          text: () => <DataTableCellText {...props} />,
          number: () => <DataTableCellNumber {...props} />,
          link: () => <DataTableCellLink {...props} />,
          button: () => <DataTableCellButton {...props} />,
          // TODO: Reimplement popup cell type
          // popup: () => <DataTableCellPopup {...props} />,
          // TODO: SelectMulti
          select: () => <DataTableCellSelect {...props} />,
          // TODO: Reimplement entity cell type
          // entity: () => <DataTableCellEntity {...props} />,
          toggle: () => <DataTableCellToggle {...props} />,
          bool: () => <DataTableCellToggle {...props} />,
          ...Object.entries(customFieldComponents).reduce((acc, [key, Field]) => {
            acc[key] = () => <Field {...props} />;
            return acc;
          }, {}),
        },
        () => <div>Invalid Cell Type {type}</div>
      )
    );
  if (isDisabled) {
    return (
      <div style={{ height: '100%' }} className="disabled">
        {cellComponent}
      </div>
    );
  }

  return (
    <div style={{ height: '100%' }}>
      <CellRightClickWrapper
        readOnly={readOnly}
        clearCell={() => updateData(null, rowId, columnId)}
        setAsDefault={() => updateData(defaultValue, rowId, columnId)}
      >
        {cellComponent}
      </CellRightClickWrapper>
    </div>
  );
};

DataTableDataCell.propTypes = {
  rowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  columnId: PropTypes.string.isRequired,
  rowData: PropTypes.shape({}).isRequired,
  columnData: PropTypes.shape({
    uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    action: PropTypes.func,
    to: PropTypes.string,
    readOnly: PropTypes.bool,
    defaultValue: PropTypes.any,
  }).isRequired,
  updateData: PropTypes.func.isRequired,
  customFieldComponents: PropTypes.objectOf(PropTypes.elementType).isRequired,
  isDisabled: PropTypes.bool.isRequired,
};
