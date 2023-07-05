/* A simple wrapper around the datatable that sets some presets */
import React from 'react';
import PropTypes from 'prop-types';
import { Uid } from '@react_db_client/constants.client-types';
import { headingDataShape, tableDataShape } from './inputDataShapes';
import DataTableWrapper, { IDataTableWrapperProps } from './DataTableWrapper';
import { IDataTableConfig } from './DataTableConfig/DataTableConfig';
import './_dataTable.scss';
import { IRow, THeading } from './lib';

export interface IDataTableSimpleProps
  extends Omit<IDataTableWrapperProps, 'data' | 'headings' | 'saveData'> {
  id: Uid;
  headingsData: THeading[];
  tableData: IRow[];
  showTotals?: boolean;
  config?: Partial<IDataTableConfig>;
  tableHeight: number;
  saveData?: (data, action: string, newData?, rowId?: Uid, colIds?: Uid[]) => void;
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
  config = {},
  tableHeight,
  ...additionalProps
}) => (
  <DataTableWrapper
    {...additionalProps}
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
    saveData={additionalProps.saveData || (() => {})}
  />
);

DataTableSimple.propTypes = {
  // @ts-ignore
  headingsData: PropTypes.arrayOf(PropTypes.shape(headingDataShape)).isRequired,
  // @ts-ignore
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
