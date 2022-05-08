/* A react hook to manage data for the data table
 *
 */

import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

export type HeadingObject = {
  label?: string;
  columnWidth?: number;
};
export type UseColumnManagerProps = {
  headingsDataList: HeadingObject[];
  defaultColumnWidth: number;
  unit: number;
  extraWidth: number;
  minWidth: number;
  maxWidth: number;
  btnColumnBtnCount: number;
  autoWidth: boolean;
  containerRef?: React.RefObject<HTMLElement> | null;
};

/* 1. Manage the column widths

  */
export const useColumnManager = ({
  headingsDataList,
  defaultColumnWidth = 200,
  unit = 10,
  extraWidth = 10,
  minWidth = 30,
  maxWidth = 2000,
  btnColumnBtnCount = 0,
  autoWidth = false,
  containerRef = null,
}: UseColumnManagerProps) => {
  const error = null;
  const [columnCount, setColumnCount] = useState<number | null>(null);
  const getColumnWidth = useCallback(
    (itemData: HeadingObject) => {
      if (autoWidth) {
        // We assume a container width of 1080 if the container hasn't yet loaded
        const containerWidth = containerRef?.current
          ? containerRef.current.clientWidth
          : 1080;
        return containerWidth / headingsDataList.length;
      }
      if (itemData.columnWidth) return itemData.columnWidth * unit + extraWidth;
      if (itemData.label) return itemData.label.length * unit + extraWidth;
      return defaultColumnWidth;
    },
    [
      defaultColumnWidth,
      extraWidth,
      unit,
      containerRef,
      autoWidth,
      headingsDataList,
    ]
  );

  const resetColumnWidths = useCallback(
    (cols: HeadingObject[]) =>
      (btnColumnBtnCount > 0 ? [btnColumnBtnCount * 40] : []).concat([
        ...cols
          .map((item) => getColumnWidth(item))
          .map((width) => (width > minWidth ? width : minWidth))
          .map((width) => (width < maxWidth ? width : maxWidth)),
      ]),
    [getColumnWidth, btnColumnBtnCount, maxWidth, minWidth]
  );
  // -- Column widths state
  const [columnWidths, setColumnWidths] = useState(() =>
    resetColumnWidths(headingsDataList)
  );

  useEffect(() => {
    if (headingsDataList.length !== columnCount) {
      setColumnCount(headingsDataList.length);
      setColumnWidths(resetColumnWidths(headingsDataList));
    }
  }, [headingsDataList, resetColumnWidths, columnCount]);
  const tableWidth =
    columnWidths.reduce((a, b) => a + b) + columnWidths.length - 1;

  return {
    columnWidths,
    setColumnWidths,
    tableWidth,
    error,
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
