/* A react hook to manage data for the data table
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { i } from 'mathjs';

const getColumnWidth = (
  itemData,
  autoWidth,
  containerRef,
  headingsDataList,
  unit,
  extraWidth,
  defaultColumnWidth
) => {
  if (autoWidth) {
    // We assume a container width of 1080 if the container hasn't yet loaded
    const containerWidth = containerRef.current ? containerRef.current.clientWidth : 1080;
    return containerWidth / headingsDataList.length;
  }
  if (itemData.columnWidth) return itemData.columnWidth * unit + extraWidth;
  if (itemData.label) return itemData.label.length * unit + extraWidth;
  return defaultColumnWidth;
};

const resetColumnWidths = (
  cols,
  btnColumnBtnCount,
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
  (btnColumnBtnCount > 0 ? [btnColumnBtnCount * 40] : []).concat([
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
      .map((width, i) => (columnWidthOverride && columnWidthOverride[i] ? columnWidthOverride[i] : width))
      .map((width) => (width > minWidth ? width : minWidth))
      .map((width) => (width < maxWidth ? width : maxWidth)),
  ]);
/* 1. Manage the column widths

  */
const useColumnManager = ({
  headingsDataList,
  defaultColumnWidth = 200,
  unit = 10,
  extraWidth = 10,
  minWidth = 30,
  maxWidth = 2000,
  btnColumnBtnCount = 0,
  autoWidth = false,
  containerRef = null,
}) => {
  const error = null;
  const [columnCount, setColumnCount] = React.useState(null);
  const [columnWidthOverride, setColumnWidthOverride] = React.useState([]);

  // -- Column widths state
  // const [columnWidths, setColumnWidths] = useState(() => resetColumnWidths(headingsDataList));

  // useEffect(() => {
  //   if (headingsDataList.length !== columnCount) {
  //     setColumnCount(headingsDataList.length);
  //     setColumnWidths(resetColumnWidths(headingsDataList));
  //   }
  // }, [headingsDataList, resetColumnWidths, columnCount]);
  // const tableWidth = columnWidths.reduce((a, b) => a + b) + columnWidths.length - 1;

  const columnWidths = React.useMemo(
    () => resetColumnWidths(headingsDataList, btnColumnBtnCount, minWidth, maxWidth, autoWidth, containerRef, headingsDataList, unit, extraWidth, defaultColumnWidth, columnWidthOverride),
    [headingsDataList, btnColumnBtnCount, minWidth, maxWidth, autoWidth, containerRef, headingsDataList, unit, extraWidth, defaultColumnWidth, columnWidthOverride]
  );
  const tableWidth = React.useMemo(() => columnWidths.reduce((a, b) => a + b) + columnWidths.length - 1, [columnWidths]);

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
