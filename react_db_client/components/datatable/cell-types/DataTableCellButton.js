import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

export const DataTableCellButton = ({
  columnData: { action, uid, btnLabel },
  rowData,
  rowId,
  cellData,
  editMode,
  focused,
  resetValue, // called to end edit mode
}) => {
  const actionFunc = useMemo(() => {
    const a = action
      ? () => action(rowId, cellData, rowData)
      : () => console.warn('Button has no action');
    return () => {
      resetValue();
      a();
    };
  }, [rowId, cellData, action, rowData, resetValue]);

  useEffect(() => {
    if (editMode && focused) {
      actionFunc();
      resetValue();
    }
  }, [editMode, focused, actionFunc, resetValue]);

  const className = [
    'dataTableCellData',
    'dataTableCellData-button',
    `${uid}_cellBtn`,
  ].join(' ')

  const cellDataLabel = btnLabel ||
    cellData && typeof cellData === 'object' ? cellData.label || cellData.name : cellData;
  return (
    <div className={className}>
      <button type="button" onClick={() => {}}>
        {/* CLick disabled as button press handled by focus and edit mode */}
        {/* <button type="button" onClick={() => setCallAction(true)}> */}
        {cellDataLabel}
      </button>
    </div>
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
