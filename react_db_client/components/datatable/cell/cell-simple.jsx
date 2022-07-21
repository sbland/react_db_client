import React from 'react';
import PropTypes from 'prop-types';
import { stringifyData } from '@react_db_client/helpers.data-processing';
import { switchF } from '@react_db_client/helpers.func-tools';
import { TableStateContext } from '@samnbuk/react_db_client.components.datatable.state';
import { CellNavigationCellWrap } from './cell-navigation-cell-wrap';
import { Text, CellStyles, DefaultCellInnerStyle } from './styles';

const defaultSimpleComponent =
  () =>
  ({ cellData }) =>
    <Text>{cellData}</Text>;

const simpleComponentMap = {
  text:
    () =>
    ({ cellData }) =>
      <Text>{cellData}</Text>,
  textLong:
    () =>
    ({ cellData }) =>
      <Text>{cellData}</Text>,
  number:
    () =>
    ({ cellData }) =>
      <Text>{cellData}</Text>,
};

const defaultSimpleParser = () => (cellData, headingData) => '';

const simpleParsers = {
  text: () => (cellData, headingData) => stringifyData(cellData, headingData, {}, false),
  textLong: () => (cellData, headingData) => stringifyData(cellData, headingData, {}, false),
  number: () => (cellData, headingData) => stringifyData(cellData, headingData, {}, false),
};

export function CellSimple({ columnIndex, rowIndex, style, headingData }) {
  const { type: cellType, uid: headingId } = headingData;

  const { tableData } = React.useContext(TableStateContext);
  const rowData = React.useMemo(() => tableData[rowIndex] || {}, [tableData, rowIndex]);

  const cellData = React.useMemo(() => rowData[headingId], [rowData, headingId]);

  const cellStyle = {
    ...style,
  };

  const dataParser = React.useMemo(
    () => switchF(cellType, simpleParsers, defaultSimpleParser),
    [cellType]
  );

  // TODO: Add custom parsers
  const readableData = React.useMemo(
    () => dataParser(cellData, headingData),
    [dataParser, cellData, headingData]
  );

  const SimpleCellComponent = React.useMemo(
    () => switchF(cellType, simpleComponentMap, defaultSimpleComponent),
    [cellType]
  );

  return (
    <CellStyles className="td" style={cellStyle}>
      <CellNavigationCellWrap columnIndex={columnIndex} rowIndex={rowIndex} />
      {/* TODO: CellData may not always be renderable */}
      {/* {readableData} */}
      {/* <DefaultCellInnerStyle>{readableData}</DefaultCellInnerStyle> */}
      <DefaultCellInnerStyle><SimpleCellComponent cellData={readableData} /> </DefaultCellInnerStyle>
      {/* */}
      {/* {cellData || null} */}
    </CellStyles>
  );
}

CellSimple.propTypes = {
  columnIndex: PropTypes.number.isRequired,
  rowIndex: PropTypes.number.isRequired,
  style: PropTypes.shape({}),
  headingData: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
};

CellSimple.defaultProps = {
  disabled: false,
  style: {},
};
