/* A simple wrapper around the datatable that sets some presets */
import React from 'react';
import PropTypes from 'prop-types';

import { headingDataShape, tableDataShape } from './inputDataShapes';
import './_dataTable.scss';
import DataTableWrapper from './DataTableWrapper';

/** Data Table Component
 * Converts an array of objects to a table by mapping against a column schema(headingsData)
 *
 */
const DataTableSimple = ({
  headingsData: headingsDataList,
  tableData,
  showTotals,
  config,
  tableHeight,
}) => (
  <DataTableWrapper
    headings={headingsDataList}
    data={tableData}
    maxTableHeight={tableHeight}
    config={{
      allowRowDelete: false,
      allowEditRow: false,
      allowAddRow: false,
      allowSortBy: false,
      allowFilters: false,
      showBottomMenu: false,
      allowHiddenColumns: false,
      showTotals,
      ...config,
    }}
  />
);

DataTableSimple.propTypes = {
  headingsData: PropTypes.arrayOf(PropTypes.shape(headingDataShape)).isRequired,
  tableData: PropTypes.arrayOf(PropTypes.shape(tableDataShape)).isRequired,
  showTotals: PropTypes.bool,
  config: PropTypes.shape({}),
  tableHeight: PropTypes.number,
};

DataTableSimple.defaultProps = {
  showTotals: false,
  config: {},
  tableHeight: 300,
};

export default DataTableSimple;
