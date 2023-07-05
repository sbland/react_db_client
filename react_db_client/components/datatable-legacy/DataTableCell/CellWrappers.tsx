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
import DataTableCellSelect from '../CellTypes/DataTableCellSelect';
import DataTableCellToggle from '../CellTypes/DataTableCellToggle';
import DataTableCellReadOnly from '../CellTypes/DataTableCellReadOnly';
import DataTableCellEntity from '../CellTypes/DataTableCellEntity';
import {
  ICellProps,
  IHeading,
  IHeadingButton,
  IHeadingLink,
  IHeadingNumber,
  IHeadingReference,
  IHeadingSelect,
  IHeadingText,
} from '../lib';
import { EFilterType, Uid } from '@react_db_client/constants.client-types';

/**
 * Data Table cell wrap that handles cell hovering
 *
 * @param {*} { className, style, handleHover, children }
 */
export const DataTableCellHoverWrap = ({ className, style, handleHover, children, disabled }) => (
  <div
    className={`dataTableCell_wrap ${className} ${disabled ? 'disabled' : ''}`}
    onFocus={() => handleHover && handleHover(true)}
    onMouseEnter={() => handleHover && handleHover(true)}
    onMouseLeave={() => handleHover && handleHover(false)}
    onBlur={() => handleHover && handleHover(false)}
    style={{
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

export interface IEditColumnCellProps {
  allowSelection: boolean;
  allowRowDelete: boolean;
  allowRowEditPanel: boolean;
  isSelected: boolean;
  rowIndex: number;
  handleRemoveFromSelection: (rowId: Uid, rowIndex: number) => void;
  handleAddToSelection: (rowId: Uid, rowIndex: number) => void;
  handleDeleteRow: (rowId: Uid, rowIndex: number) => void;
  handleEditPanelBtnClick: (rowId: Uid, columnId: Uid) => void;
  rowUid: Uid;
}

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
}: IEditColumnCellProps) => {
  return (
    <>
      {allowSelection && (
        <input
          className="rowSelectionBox"
          type="checkbox"
          id={String(rowIndex)}
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
      id=""
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
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

CellRightClickWrapper.defaultProps = {
  readOnly: false,
};

export interface IDataTableDataCellProps<HeadingType extends IHeading>
  extends ICellProps<HeadingType> {}

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
export const DataTableDataCell = <HeadingType extends IHeading>(
  props: IDataTableDataCellProps<HeadingType>
) => {
  const {
    columnData: { type, readOnly, defaultValue },
    updateData,
    rowId,
    columnId,
    customFieldComponents = {},
    isDisabled,
  } = props;
  const isCustomCell = customFieldComponents && customFieldComponents[type] !== undefined;
  const customFieldComponentsMapped = Object.entries(customFieldComponents).reduce(
    (acc, [key, Field]: [any, (props: IDataTableDataCellProps<HeadingType>) => JSX.Element]) => {
      acc[key] = () => <Field {...props} />;
      const accOut: any = acc;
      return accOut;
    },
    {} as { [key: string]: () => JSX.Element }
  );
  const cellComponent =
    readOnly && !isCustomCell ? (
      <DataTableCellReadOnly {...props} />
    ) : (
      switchF(
        type,
        {
          [EFilterType.textLong]: () => (
            <DataTableCellText {...(props as unknown as IDataTableDataCellProps<IHeadingText>)} />
          ),
          [EFilterType.text]: () => (
            <DataTableCellText {...(props as unknown as IDataTableDataCellProps<IHeadingText>)} />
          ),
          [EFilterType.number]: () => (
            <DataTableCellNumber
              {...(props as unknown as IDataTableDataCellProps<IHeadingNumber>)}
            />
          ),
          link: () => (
            <DataTableCellLink {...(props as unknown as IDataTableDataCellProps<IHeadingLink>)} />
          ),
          [EFilterType.button]: () => (
            <DataTableCellButton
              {...(props as unknown as IDataTableDataCellProps<IHeadingButton>)}
            />
          ),
          // TODO: Reimplement popup cell type
          // popup: () => <DataTableCellPopup {...props} />,
          // TODO: SelectMulti
          [EFilterType.select]: () => (
            <DataTableCellSelect
              {...(props as unknown as IDataTableDataCellProps<IHeadingSelect>)}
            />
          ),
          // TODO: Reimplement entity cell type
          [EFilterType.reference]: () => (
            <DataTableCellEntity
              {...(props as unknown as IDataTableDataCellProps<IHeadingReference>)}
            />
          ),
          [EFilterType.toggle]: () => (
            <DataTableCellToggle {...(props as unknown as IDataTableDataCellProps<IHeading>)} />
          ),
          [EFilterType.bool]: () => (
            <DataTableCellToggle {...(props as unknown as IDataTableDataCellProps<IHeading>)} />
          ),
          ...customFieldComponentsMapped,
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
  // rowData: PropTypes.shape({}).isRequired,
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
