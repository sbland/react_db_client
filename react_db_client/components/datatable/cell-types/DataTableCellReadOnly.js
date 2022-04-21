import React from 'react';
import PropTypes from 'prop-types';
import { sanitizeCellData } from '@samnbuk/react_db_client.helpers.data-processing';
import { DefaultCellInnerStyle } from './style';

export const DataTableCellReadOnly = ({ cellData, columnData }) => {
  return (
    <DefaultCellInnerStyle className="dataTableCellData readOnly">
      <div type="button" className="dataTableCellData_text">
        {sanitizeCellData(cellData, columnData)}
      </div>
    </DefaultCellInnerStyle>
  );
};

DataTableCellReadOnly.propTypes = {
  cellData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
    }),
  ]),
  columnData: PropTypes.shape({
    name: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
};

DataTableCellReadOnly.defaultProps = {
  cellData: '',
};

export default DataTableCellReadOnly;
