/* A interface for the old and new datatable */
import React from 'react';
import PropTypes from 'prop-types';
import { tableDataShape } from './inputDataShapes';
import DataTableConfigConnector from './DataTableConfig/DataTableConfig';
import DataTableWrapper from './DataTableWrapper';
import './_dataTable.scss';
import './_dataTable_condensed.scss';

/** Data Table Component
 * Converts an array of objects to a table by mapping against a column schema(headingsData)
 *
 */
export const DataTableFunc = ({
  headingsData: headingsDataList,
  // TODO: Make table data array instead of objof
  tableData,
  handleSaveData,
  autoSave,
  allowAddRow,
  showTotals,
  outputTotals,
  initialSortBy,
  config,
}) => (
  <DataTableWrapper
    headings={headingsDataList}
    data={Object.values(tableData)}
    updateTotals={outputTotals}
    config={{
      allowAddRow,
      showTotals,
      ...config,
    }}
    sortByOverride={initialSortBy}
    autoSave={autoSave}
    saveData={handleSaveData}
  />
);

DataTableFunc.propTypes = {
  headingsData: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf([
        'text',
        'link',
        'button',
        'number',
        'popup',
        'select',
        'selectMulti',
        'entity',
        'textLong',
        'bool',
      ]).isRequired,
      action: PropTypes.func,
      to: PropTypes.string,
      hidden: PropTypes.bool,
      columnWidth: PropTypes.number,
    })
  ).isRequired,
  tableData: PropTypes.objectOf(PropTypes.shape(tableDataShape)).isRequired,
  handleSaveData: PropTypes.func.isRequired,
  autoSave: PropTypes.bool,
  allowAddRow: PropTypes.bool,
  showTotals: PropTypes.bool,
  outputTotals: PropTypes.func,
  initialSortBy: PropTypes.shape({
    heading: PropTypes.string.isRequired,
    direction: PropTypes.bool.isRequired,
  }),
  config: PropTypes.shape({}),
};

DataTableFunc.defaultProps = {
  autoSave: false,
  allowAddRow: true,
  showTotals: false,
  outputTotals: () => {},
  initialSortBy: {
    heading: 'uid',
    direction: true,
  },
  config: {},
};

export const DataTableLegacy = DataTableConfigConnector({})(DataTableFunc);

export default DataTableLegacy;
