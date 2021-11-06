import React, { useRef, useState } from 'react';
import { ColumnWidthManager } from './column-width-manager';
import { useColumnManager } from './column-manager-hook';

export const BasicColumnManager = () => {
  const [columnWidths, setColumnWidths] = useState([1, 2, 3]);
  return (
    // "hello"
    <ColumnWidthManager
      columnWidths={columnWidths}
      setColumnWidths={setColumnWidths}
      minWidth={100}
    />
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
}