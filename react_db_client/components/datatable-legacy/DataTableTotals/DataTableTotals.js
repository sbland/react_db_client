import React from 'react';
import PropTypes from 'prop-types';
import { formatValue } from '@react_db_client/helpers.data-processing';
import { headingDataShape } from '../inputDataShapes';
import { DataTableCellHoverWrap, DataTableDataCell } from '../DataTableCell/CellWrappers';

const DataTableTotals = ({
  className,
  headingsDataList,
  columnWidths,
  totals,
  tableWidth,
  customFieldComponents,
}) => {
  const insideWrapStyleOverride = {
    width: `${tableWidth}px`,
  };

  const mapTotals = headingsDataList.map((headingData, i) => {
    const cellData = headingData.showTotals ? (
      formatValue(Number(totals[headingData.uid]), headingData.step || 0.01)
    ) : (
      <div />
    );
    return (
      <DataTableCellHoverWrap
        key={headingData.uid}
        columnWidth={columnWidths[i]}
        className="dataTableTotals"
        style={{
          minWidth: columnWidths[i],
          width: columnWidths[i],
        }}
      >
        {headingData.showTotals ? (
          <DataTableDataCell
            rowId="_totals"
            rowIndex={-1}
            rowData={{}}
            classNames={className}
            columnId={headingData.uid}
            cellData={cellData}
            columnData={headingData}
            // cellDataBtnRef={cellDataBtnRef}
            customFieldComponents={customFieldComponents}
            updateData={() => {}} // included for future
            acceptValue={() => {}} // included for future
            resetValue={() => {}} // included for future
            focused={false} // included for future
            editMode={false} // included for future
            isDisabled={false}
          />
        ) : (
          <div />
        )}
      </DataTableCellHoverWrap>
    );
  });

  return (
    <div className="dataTable_totalsOutsideWrap">
      <div className="dataTable_totalsInsideWrap" style={insideWrapStyleOverride}>
        {mapTotals}
      </div>
    </div>
  );
};

DataTableTotals.propTypes = {
  headingsDataList: PropTypes.arrayOf(PropTypes.shape(headingDataShape)).isRequired,
  totals: PropTypes.objectOf(PropTypes.number).isRequired,
  columnWidths: PropTypes.arrayOf(PropTypes.number).isRequired,
  tableWidth: PropTypes.number.isRequired,
  customFieldComponents: PropTypes.objectOf(PropTypes.elementType).isRequired,
  className: PropTypes.string,
};

DataTableTotals.defaultProps = {
  className: '',
};

export default DataTableTotals;
