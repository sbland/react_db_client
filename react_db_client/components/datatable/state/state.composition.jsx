import React from 'react';
import ReactJson from 'react-json-view';

import {
  demoHeadingsData,
  demoTableData,
} from '@samnbuk/react_db_client.components.datatable.extras';

import { useHandleTableState } from './use-handle-table-state';

const initialData = Object.values(demoTableData);

export const DemoStateSetup = () => {
  const [tableData, setTableData] = React.useState(initialData);
  const tableState = useHandleTableState({
    columns: demoHeadingsData,
    initialData: tableData,
  });
  const renderCount = React.useRef(0);
  renderCount.current += 1;

  const { onCellKeyPress, currentFocusedColumn } = tableState;

  return (
    <div>
      <button
        type="button"
        className="button-one"
        onClick={() =>
          onCellKeyPress({ key: 'ArrowRight', preventDefault: () => {} }, 0, currentFocusedColumn)
        }
      >
        Move
      </button>
      <button type="button" className="button-one" onClick={() => {}}>
        Navmode
      </button>

      <button
        type="button"
        className="button-one"
        onClick={() => setTableData((prev) => [...prev, {}])}
      >
        Add Row
      </button>
      <p>Render Count: {renderCount.current}</p>
      <ReactJson src={tableState} />
    </div>
  );
};
