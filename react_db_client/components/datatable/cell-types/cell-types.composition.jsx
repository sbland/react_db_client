import React, { useState } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { DataTableCellText } from './DataTableCellText';
import { DataTableCellNumber } from './DataTableCellNumber';
import { DataTableCellEntity } from './DataTableCellEntity';
import { DataTableCellSelect } from './DataTableCellSelect';
import { filterTypes } from '@react_db_client/constants.client-types';

export const CellText = () => {
  const [data, setData] = useState('hello');
  return (
    <DataTableCellText
      columnData={{
        readOnly: false,
        type: 'text',
      }}
      cellData={data}
      updateData={setData}
      acceptValue={setData}
    />
  );
};

export const CellNumber = () => {
  const [data, setData] = useState('4.1234');
  return (
    <>
      <div>
        <DataTableCellNumber
          columnData={{
            defaultValue: 3.01,
            readOnly: false,
            min: 0,
            max: 30.3,
            step: 0.1,
            type: 'number',
          }}
          cellData={data}
          updateData={setData}
          acceptValue={setData}
          rowData={{}}
        />
      </div>
      <div>Cell data: {data}</div>
    </>
  );
};

export const CellSelect = () => {
  const [data, setData] = useState('a');
  return (
    <>
      <div>
        <DataTableCellSelect
          columnData={{
            type: 'select',
            options: [
              { uid: 'a', label: 'A' },
              { uid: 'b', label: 'B' },
              { uid: 'c', label: 'C' },
            ],
          }}
          cellData={data}
          updateData={setData}
          acceptValue={setData}
          rowData={{}}
        />
      </div>
      <div>Cell data: {data}</div>
    </>
  );
};

export const CellEntity = () => (
  <DataTableCellEntity
    columnData={{
      collection: 'products',
      headings: {
        a: { uid: 'a', label: 'A', type: filterTypes.text },
        b: { uid: 'b', label: 'B', type: filterTypes.number },
      },
    }}
    cellData="Foo"
    updateData={console.log}
  />
);
