import React from 'react';
import PropTypes from 'prop-types';
import { CellNavigationCellWrap } from './cell-navigation-cell-wrap';
import { stringifyData } from '@samnbuk/react_db_client.helpers.data-processing';
import styled from 'styled-components';


export function CellSimple({ columnIndex, rowIndex, style, headingData, rowData }) {
  const { type: cellType, isDisabled, uid: headingId } = headingData;
  const cellData = React.useMemo(() => rowData[headingId], [rowData, headingId]);

  const cellStyle = {
    ...style,
  };

  // TODO: Add custom parsers
  const readableData = stringifyData(cellData, headingData, {}, false);

  return (
    <div className="td" style={cellStyle}>
      <CellNavigationCellWrap columnIndex={columnIndex} rowIndex={rowIndex} />
      {/* TODO: CellData may not always be renderable */}
      {readableData}
      {/* {cellData || null} */}
    </div>
  );
}

CellSimple.propTypes = {
  columnIndex: PropTypes.number.isRequired,
  rowIndex: PropTypes.number.isRequired,
  style: PropTypes.shape({}),
  headingData: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
};

CellSimple.defaultProps = {
  disabled: false,
  style: {},
};
