import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { headingDataShape } from '@samnbuk/react_db_client.components.datatable.extras';
import { DataTableContext } from '@samnbuk/react_db_client.components.datatable.logic';
import { formatValue } from '@samnbuk/react_db_client.helpers.data-processing';
import {
  DataTableCellHoverWrap,
  DataTableDataCell,
} from '@samnbuk/react_db_client.components.datatable.cell-types';

export const DataTableTotals = ({
  className,
  headingsDataList,
  columnWidths,
  totals,
  tableWidth,
  componentMap,
}) => {
  const { hasBtnsColumn } = useContext(DataTableContext);

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
        columnWidth={columnWidths[hasBtnsColumn ? i + 1 : i]}
        className="dataTableTotals"
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
            componentMap={componentMap}
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

  if (hasBtnsColumn) {
    mapTotals.unshift(
      <DataTableCellHoverWrap
        className="dataTableTotals"
        key="Settings"
        columnWidth={columnWidths[0]}
      >
        <></>
      </DataTableCellHoverWrap>
    );
  }

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
  componentMap: PropTypes.objectOf(PropTypes.elementType).isRequired,
  className: PropTypes.string,
};

DataTableTotals.defaultProps = {
  className: '',
};

export default DataTableTotals;
