/* A react hook to manage data for the data table
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { THeading } from '../lib';

const getColumnWidth = (
  itemData: THeading,
  autoWidth: boolean,
  containerRef: React.MutableRefObject<HTMLDivElement | null> | null,
  headingsDataList: THeading[],
  unit: number,
  extraWidth: number,
  defaultColumnWidth: number
) => {
  if (autoWidth) {
    // We assume a container width of 1080 if the container hasn't yet loaded
    const containerWidth = containerRef?.current ? containerRef.current.clientWidth : 1080;
    return containerWidth / headingsDataList.length;
  }
  if (itemData.columnWidth) return itemData.columnWidth * unit + extraWidth;
  if (itemData.label) return itemData.label.length * unit + extraWidth;
  return defaultColumnWidth;
};

const resetColumnWidths = (
  cols,
  minWidth,
  maxWidth,
  autoWidth,
  containerRef,
  headingsDataList,
  unit,
  extraWidth,
  defaultColumnWidth,
  columnWidthOverride
) =>
  ([] as number[]).concat([
    ...cols
      .map((item) =>
        getColumnWidth(
          item,
          autoWidth,
          containerRef,
          headingsDataList,
          unit,
          extraWidth,
          defaultColumnWidth
        )
      )
      .map((width, i) =>
        columnWidthOverride && columnWidthOverride[i] ? columnWidthOverride[i] : width
      )
      .map((width) => (width > minWidth ? width : minWidth))
      .map((width) => (width < maxWidth ? width : maxWidth)),
  ]);

export interface IUseColumnManagerArgs {
  headingsDataList: THeading[];
  defaultColumnWidth?: number;
  unit?: number;
  extraWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  autoWidth?: boolean;
  containerRef?: React.MutableRefObject<HTMLDivElement | null> | null;
}

const useColumnManager = ({
  headingsDataList,
  defaultColumnWidth = 200,
  unit = 10,
  extraWidth = 10,
  minWidth = 30,
  maxWidth = 2000,
  autoWidth = false,
  containerRef = null,
}: IUseColumnManagerArgs) => {
  const error = null;
  const [columnWidthOverride, setColumnWidthOverride] = React.useState([]);

  const columnWidths = React.useMemo(
    () =>
      resetColumnWidths(
        headingsDataList,
        minWidth,
        maxWidth,
        autoWidth,
        containerRef,
        headingsDataList,
        unit,
        extraWidth,
        defaultColumnWidth,
        columnWidthOverride
      ),
    [
      headingsDataList,
      minWidth,
      maxWidth,
      autoWidth,
      containerRef,
      headingsDataList,
      unit,
      extraWidth,
      defaultColumnWidth,
      columnWidthOverride,
    ]
  );
  const tableWidth = React.useMemo(
    () => columnWidths.reduce((a, b) => a + b) + columnWidths.length - 1,
    [columnWidths]
  );

  return {
    columnWidths,
    setColumnWidths: setColumnWidthOverride,
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

export default useColumnManager;
