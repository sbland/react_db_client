import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const DataTableColumnWidthManager = ({
  // columnCount,
  columnWidths,
  setColumnWidths,
  minWidth,
  maxWidth,
  tableWidth,
}) => {
  const dataTableRef = useRef<HTMLDivElement>(null);

  const [showColumnResizeTool, setshowColumnResizeTool] = useState(-1); // True if not -1
  const [resizingColumn, setresizingColumn] = useState(false);
  const columnWidthOverride = React.useRef(columnWidths);
  const lastMousePosRef = React.useRef(0);

  // Use offset column positions to determine
  let widthSum = 0;

  const columnEdgePositions = columnWidths.map((cwidth) => {
    widthSum += cwidth;
    return widthSum;
  });

  // called on mouse move over resize overlay when dragging
  const resizeColumn = (e) => {
    const newWidths = [...columnWidthOverride.current] as number[];
    const newWidth = newWidths[showColumnResizeTool] + e.clientX - lastMousePosRef.current;
    // TODO: Limit by max width
    // if less than min width set as min width
    newWidths[showColumnResizeTool] = newWidth > minWidth ? newWidth : minWidth;
    setColumnWidths(newWidths);
    columnWidthOverride.current = [...newWidths];
    lastMousePosRef.current = e.clientX;
  };

  const endDragging = () => {
    setresizingColumn(false);
    setshowColumnResizeTool(-1);
    lastMousePosRef.current = 0;
  };

  const onMouseMove = (e) => {
    if (!resizingColumn) {
      // On mouse move check if we are hovering over the edge of a column
      const offsetPosData = dataTableRef.current?.getBoundingClientRect() || { x: 0 };
      const mousePos = { x: e.clientX, y: e.clientY };
      const offsetColumnEdgePositions = columnEdgePositions.map((cpos) => cpos + offsetPosData.x);
      const mouseDistanceToColumnEdge = offsetColumnEdgePositions.map((cpos) => cpos - mousePos.x);
      const isMouseOverEdgeList = mouseDistanceToColumnEdge.map((cdist) => Math.abs(cdist) < 10);
      const columnEdgeIndex = isMouseOverEdgeList.indexOf(true);
      setshowColumnResizeTool(columnEdgeIndex);
    }
  };

  return (
    <div
      ref={dataTableRef}
      style={{ width: tableWidth }}
      className="DataTable_columnWidthManager"
      onMouseMove={onMouseMove}
      onMouseLeave={endDragging}
    >
      {resizingColumn && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/mouse-events-have-key-events
        <div
          className="dataTable_columnResizeCanvas"
          onMouseUp={() => {
            setresizingColumn(false);
            lastMousePosRef.current = 0;
          }}
          onMouseLeave={() => {
            setresizingColumn(false);
            lastMousePosRef.current = 0;
          }}
          onMouseMove={(e) => {
            if (resizingColumn) resizeColumn(e);
          }}
        />
      )}

      {showColumnResizeTool !== -1 && (
        // eslint-disable-next-line max-len
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/mouse-events-have-key-events
        <div
          className="dataTable_columnResizeHandle"
          style={{
            left: `${columnEdgePositions[showColumnResizeTool] - 5}px`,
            pointerEvents: `${resizingColumn ? 'none' : 'all'}`,
            // background: `${(resizingColumn) ? 'red' : 'blue'}`,
          }}
          onMouseDown={(e) => {
            setresizingColumn(true);
            lastMousePosRef.current = e.clientX;
            columnWidthOverride.current = [...columnWidths];
            window.addEventListener('mouseup', () => {
              window.removeEventListener('mouseup', this as any);
              setresizingColumn(false);
              setshowColumnResizeTool(-1);
              lastMousePosRef.current = 0;
            });
          }}
          onMouseUp={endDragging}
          // onMouseLeave={endDragging}
        />
      )}
    </div>
  );
};

DataTableColumnWidthManager.propTypes = {
  columnWidths: PropTypes.arrayOf(PropTypes.number).isRequired,
  setColumnWidths: PropTypes.func.isRequired,
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number,
  // columnCount: PropTypes.number.isRequired,
};

DataTableColumnWidthManager.defaultProps = {
  minWidth: 50,
  maxWidth: 300,
};

export default DataTableColumnWidthManager;
