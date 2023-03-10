/* A simple wrapper around the datatable that sets some presets */
import React from 'react';
import PropTypes from 'prop-types';
import { Uid } from '@react_db_client/constants.client-types';
import { headingDataShape, tableDataShape } from './inputDataShapes';
import DataTableWrapper, { IDataTableWrapperProps, IHeading, IRow } from './DataTableWrapper';
import { IDataTableConfig } from './DataTableConfig/DataTableConfig';
import './_dataTable.scss';

export interface IDataTableSimpleProps extends Partial<IDataTableWrapperProps> {
  id: Uid;
  headingsData: IHeading[];
  tableData: IRow[];
  showTotals?: boolean;
  config?: Partial<IDataTableConfig>;
  tableHeight: unknown;
}
/** Data Table Component
 * Converts an array of objects to a table by mapping against a column schema(headingsData)
 *
 */
export const DataTableSimple: React.FC<IDataTableSimpleProps> = ({
  id,
  headingsData: headingsDataList,
  tableData,
  showTotals,
  config={},
  tableHeight,
  ...additionalProps
}) => (
  <DataTableWrapper
    id={id}
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
    {...additionalProps}
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
