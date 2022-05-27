import React, { useState } from 'react';
import { useRef } from 'react';
import Spreadsheet from 'react-spreadsheet';
import classnames from 'classnames';

const demoTableData = [
  [{ value: 'Vanilla', type: 'text' }, { value: 'Chocolate' }],
  [{ value: 'Strawberry' }, { value: 'Cookies' }],
];
const DEMO_TABLE_DATA = Array(1)
  .fill(0)
  .reduce((acc, _) => [...acc, ...Object.values(demoTableData)], []);

export const DemoSpreadsheet = () => {
  return <Spreadsheet data={DEMO_TABLE_DATA} />;
};

export const DemoSpreadsheetControlled = () => {
  const [data, setData] = useState(DEMO_TABLE_DATA);
  return <Spreadsheet data={data} onChange={setData} />;
};

const Cell = ({
  row,
  column,
  DataViewer,
  formulaParser,
  selected,
  active,
  dragging,
  mode,
  data,
  select,
  activate,
  setCellDimensions,
}) => {
  const rootRef = useRef(null);
  const handleMouseOver = () => {};
  const handleMouseDown = () => {};

  return (
    <td
      ref={rootRef}
      className={classnames('Spreadsheet__cell', data?.className, {
        'Spreadsheet__cell--readonly': data?.readOnly,
      })}
      style={data?.type === 'text' ? { border: '1px solid red' } : {}}
      onMouseOver={handleMouseOver}
      onMouseDown={handleMouseDown}
      tabIndex={0}
    >
      {/* {typeof data} */}
      <DataViewer row={row} column={column} cell={data} formulaParser={formulaParser} />
    </td>
  );
};

export const DemoSpreadsheetControlledCustomCell = () => {
  const [data, setData] = useState(DEMO_TABLE_DATA);
  return <Spreadsheet data={data} onChange={setData} Cell={Cell} />;
};
