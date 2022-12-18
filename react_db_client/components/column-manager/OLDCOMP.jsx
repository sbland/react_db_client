import React, { useRef, useState } from 'react';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';
import { ColumnWidthManager } from './column-width-manager';
import { useColumnManager } from './column-manager-hook';

export const ColumnManagerHandle = () => {
  const [columnWidths, setColumnWidths] = useState([10, 20, 30]);
  return (
    <>
      <CompositionWrapDefault width="16rem" height="16rem" horizontal>
        <ColumnWidthManager
          columnWidths={columnWidths}
          setColumnWidths={setColumnWidths}
          minWidth={5}
          showEdges
        />
      </CompositionWrapDefault>
      {columnWidths.map((c, i) => (
        <div key={i} style={{ height: 10, width: c, border: '1px solid red' }} />
      ))}
    </>
  );
};

export const ColumnManagerHandleLive = () => {
  const [columnWidths, setColumnWidths] = useState([10, 20, 30]);
  return (
    <>
      <CompositionWrapDefault width="16rem" height="16rem" horizontal>
        <ColumnWidthManager
          columnWidths={columnWidths}
          setColumnWidths={setColumnWidths}
          minWidth={5}
          showEdges
          liveDragging
        />
      </CompositionWrapDefault>
      {columnWidths.map((c, i) => (
        <div key={i} style={{ height: 10, width: c, border: '1px solid red' }} />
      ))}
    </>
  );
};

export const ColumnManagerHook = () => {
  const ref = useRef(null);
  const [headings, setHeadings] = useState([
    {
      uid: 'a',
      label: 'A',
    },
    {
      uid: 'b',
      label: 'B',
      columnWidth: 300,
    },
  ]);

  const addHeading = () => {
    setHeadings((prev) => {
      return [
        ...prev,
        {
          uid: prev.length,
          label: prev.length,
        },
      ];
    });
  };

  const {
    columnWidths,
    // setColumnWidths,
    // tableWidth
  } = useColumnManager({
    headingsDataList: headings,
    minWidth: 100,
    maxWidth: 1000,
    autoWidth: true,
    containerRef: ref,
  });

  return (
    <div>
      <div>
        <button onClick={addHeading}>add heading</button>
      </div>
      <div>
        Column widths:{' '}
        {columnWidths.map((w) => (
          <p>{w}</p>
        ))}
      </div>
    </div>
  );
};

export const ColumnManagerVisibility = () => {
  // TODO Complete this composition
};
