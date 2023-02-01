import React, { useRef, useState } from 'react';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';
import { ColumnWidthManager } from './column-width-manager';
import { useColumnManager } from './column-manager-hook';

export const ColumnManagerHandle = () => {
  const [columnWidths, setColumnWidths] = useState([10, 20, 30]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <CompositionWrapDefault width="16rem" height="16rem" horizontal ref={containerRef}>
        <ColumnWidthManager
          tableWidth={columnWidths.reduce((acc, v) => acc + v)}
          columnWidths={columnWidths}
          setColumnWidths={setColumnWidths}
          minWidth={5}
          showEdges
          debug
          // ref={ref}
        />
      </CompositionWrapDefault>
      {columnWidths.map((c, i) => (
        <div key={i} style={{ height: 10, width: c, border: '1px solid red' }} />
      ))}
      {columnWidths.reduce((acc, v) => acc + v)}
    </>
  );
};

export const ColumnManagerHandleAutoWidth = () => {
  const [columnWidths, setColumnWidths] = useState([10, 20, 30]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <CompositionWrapDefault width="16rem" height="16rem" horizontal ref={containerRef}>
        <ColumnWidthManager
          tableWidth={columnWidths.reduce((acc, v) => acc + v)}
          columnWidths={columnWidths}
          setColumnWidths={setColumnWidths}
          minWidth={5}
          showEdges
          debug
          // ref={ref}
        />
      </CompositionWrapDefault>
      {columnWidths.map((c, i) => (
        <div key={i} style={{ height: 10, width: c, border: '1px solid red' }} />
      ))}
      {columnWidths.reduce((acc, v) => acc + v)}
    </>
  );
};

export const ColumnManagerAutoHandle = () => {
  const [columnWidths, setColumnWidths] = useState([10, 20, 30]);
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <CompositionWrapDefault width="16rem" height="16rem" horizontal ref={ref}>
        <ColumnWidthManager
          columnWidths={columnWidths}
          tableWidth={columnWidths.reduce((acc, v) => acc + v)}
          setColumnWidths={setColumnWidths}
          minWidth={5}
          showEdges
          // ref={ref}
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
          tableWidth={columnWidths.reduce((acc, v) => acc + v)}
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
  const ref = useRef<HTMLDivElement| null>(null);
  const [useAutoWidth, setUseAutoWidth] = React.useState(false);
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
          uid: String(prev.length),
          label: String(prev.length),
          columnWidth: 3,
        },
      ];
    });
  };

  const { columnWidths, setColumnWidths, tableWidth } = useColumnManager({
    headingsDataList: headings,
    minWidth: 100,
    maxWidth: 1000,
    autoWidth: useAutoWidth,
    containerRef: ref,
  });

  return (
    <div>
      <div>
        <button onClick={addHeading}>add heading</button>
        <button onClick={() => setUseAutoWidth((prev) => !prev)}>
          {useAutoWidth ? 'AutoWidth on ' : 'AutoWidth off'}
        </button>
      </div>
      <div>
        Column widths:{' '}
        {columnWidths.map((w, i) => (
          <p key={i}>{w}</p>
        ))}
        Table Width: {columnWidths.reduce((acc, v) => acc + v)} or {tableWidth}
      </div>

      <CompositionWrapDefault width="20rem" height="16rem" horizontal ref={ref}>
        <ColumnWidthManager
          tableWidth={columnWidths.reduce((acc, v) => acc + v)}
          columnWidths={columnWidths}
          setColumnWidths={setColumnWidths}
          minWidth={5}
          minTableWidth={ref.current?.clientWidth|| 300}
          showEdges
          liveDragging
          debug
        />
      </CompositionWrapDefault>
    </div>
  );
};

// export const ColumnManagerVisibility = () => {
//   // TODO Complete this composition
// };
