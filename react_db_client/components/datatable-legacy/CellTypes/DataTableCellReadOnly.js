import React from 'react';
import PropTypes from 'prop-types';
import { sanitizeCellData } from '@react_db_client/helpers.data-processing';

const DataTableCellReadOnly = ({ cellData, columnData }) => {
  return (
    <div className="dataTableCellData readOnly">
      <div type="button" className="dataTableCellData_text">
        {sanitizeCellData(cellData, columnData)}
      </div>
    </div>
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
