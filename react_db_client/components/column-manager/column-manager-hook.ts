/* A react hook to manage data for the data table
 *
 */

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

export interface HeadingObject {
  label?: string | React.ReactNode;
  columnWidth?: number;
}
export interface UseColumnManagerProps {
  headingsDataList: HeadingObject[];
  defaultColumnWidth?: number;
  unit?: number;
  extraWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  autoWidth?: boolean;
  containerRef?: React.RefObject<HTMLElement> | null;
}

export interface IUseColumnManagerReturn {
  columnWidths: number[];
  setColumnWidths: (v: number[]) => void;
  tableWidth: number;
}

/* 1. Manage the column widths

  */
export const useColumnManager = ({
  headingsDataList,
  defaultColumnWidth = 200,
  unit = 10,
  extraWidth = 10,
  minWidth = 30,
  maxWidth = 2000,
  autoWidth = false,
  containerRef = null,
}: UseColumnManagerProps): IUseColumnManagerReturn => {
  const [columnCount, setColumnCount] = useState<number | null>(null);
  const getColumnWidth = useCallback(
    (itemData: HeadingObject) => {
      if (autoWidth) {
        // We assume a container width of 1080 if the container hasn't yet loaded
        const containerWidth = containerRef?.current ? containerRef.current.clientWidth : 1080;
        // TODO: we shouldn't need to include padding here
        return (containerWidth * 0.995) / headingsDataList.length;
      }
      if (itemData.columnWidth) return itemData.columnWidth * unit + extraWidth;
      if (itemData.label)
        return (
          (typeof itemData.label === 'string'
            ? itemData.label.length
            : itemData.columnWidth || minWidth) *
            unit +
          extraWidth
        );
      return defaultColumnWidth;
    },
    [defaultColumnWidth, extraWidth, unit, containerRef, autoWidth, headingsDataList]
  );

  const resetColumnWidths = useCallback(
    (cols: HeadingObject[]) => [
      ...cols
        .map((item) => getColumnWidth(item))
        .map((width) => (width > minWidth ? width : minWidth))
        .map((width) => (width < maxWidth ? width : maxWidth)),
    ],
    [getColumnWidth, maxWidth, minWidth]
  );

  // -- Column widths state
  const [columnWidths, setColumnWidths] = useState(() => resetColumnWidths(headingsDataList));

  React.useLayoutEffect(() => {
    if (autoWidth && containerRef?.current) {
      setColumnWidths(resetColumnWidths(headingsDataList));
    }
  }, [containerRef, autoWidth, resetColumnWidths]);

  useEffect(() => {
    if (headingsDataList.length !== columnCount) {
      setColumnCount(headingsDataList.length);
      setColumnWidths(resetColumnWidths(headingsDataList));
    }
  }, [headingsDataList, resetColumnWidths, columnCount]);

  const tableWidth = React.useMemo(
    () => columnWidths.reduce((a, b) => a + b) + columnWidths.length - 1,
    [columnWidths]
  );

  return {
    columnWidths,
    setColumnWidths,
    tableWidth,
  };
};

useColumnManager.propTypes = {
  headingsDataList: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      hidden: PropTypes.bool,
      columnWidth: PropTypes.number,
    })
  ).isRequired,
};
