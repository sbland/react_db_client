import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { DefaultCellInnerStyle } from './style';

export const DataTableCellButton = ({
  cellData,
  columnData: { action, uid, btnLabel },
  rowData,
  rowId,
  editMode,
  focused,
  acceptValue,
}) => {
  const actionFunc = useMemo(() => {
    const a = action
      ? () => action(rowId, cellData, rowData)
      : () => console.warn('Button has no action');
    return () => {
      acceptValue(cellData);
      a();
    };
  }, [rowId, cellData, action, rowData, acceptValue]);

  useEffect(() => {
    if (editMode && focused) {
      actionFunc();
      acceptValue(cellData);
    }
  }, [editMode, focused, actionFunc, acceptValue]);

  const className = ['dataTableCellData', 'dataTableCellData-button', `${uid}_cellBtn`].join(' ');

  const cellDataLabel =
    btnLabel || (cellData && typeof cellData === 'object')
      ? cellData.label || cellData.name
      : cellData;

  return (
    <DefaultCellInnerStyle className={className}>
      <button type="button" onClick={() => {}}>
        {/* CLick disabled as button press handled by focus and edit mode */}
        {/* <button type="button" onClick={() => setCallAction(true)}> */}
        {cellDataLabel}
      </button>
    </DefaultCellInnerStyle>
  );
};

DataTableCellButton.propTypes = {
  rowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  cellData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape({ name: PropTypes.string, label: PropTypes.string }),
  ]),
  columnData: PropTypes.shape({
    action: PropTypes.func,
  }).isRequired,
  rowData: PropTypes.shape({}).isRequired,
  focused: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
  resetValue: PropTypes.func.isRequired,
};
DataTableCellButton.defaultProps = {
  cellData: '',
};
