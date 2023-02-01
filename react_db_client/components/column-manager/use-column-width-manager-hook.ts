import React from 'react';

export interface IUseColumnWidthManagerArgs {
  columnWidths: number[];
  setColumnWidths: (newWidths: number[]) => void;
  minWidth?: number;
  maxWidth?: number;
  liveDragging?: boolean;
  minTableWidth?: number;
}

export interface IUseColumnWidthManagerReturn {
  resizeColumn: (e: React.MouseEvent<HTMLDivElement>) => void;
  resizingColumn: boolean;
  liveColumnWidths: number[];
  columnEdgePositions: number[];
  onMouseDownResizeHandle: (e: React.MouseEvent<HTMLDivElement>) => void;
  mouseOverEdge: (i: number) => void;
  endDragging: () => void;
  handlePosition: number;
}

export const useColumnWidthManager = ({
  columnWidths,
  setColumnWidths,
  minWidth = 10,
  minTableWidth = 0,
  maxWidth = 99999999,
  liveDragging = false,
}: IUseColumnWidthManagerArgs): IUseColumnWidthManagerReturn => {
  const [currentColumnn, setCurrentColumnn] = React.useState(-1);
  const [resizingColumn, setResizingColumn] = React.useState(false);
  const lastMousePosRef = React.useRef(0);
  const columnWidthOverrideRef = React.useRef(columnWidths);
  const [handlePosition, setHandlePosition] = React.useState(-1);
  const [liveColumnWidths, setLiveColumnWidths] = React.useState(columnWidths);

  // Use offset column positions to determine

  const columnEdgePositions = React.useMemo(() => {
    let widthSum = 0;

    return liveColumnWidths.map((cwidth) => {
      widthSum += cwidth;
      return widthSum;
    });
  }, [liveColumnWidths]);

  // called on mouse move over resize overlay when dragging
  const resizeColumn = (e: React.MouseEvent<HTMLDivElement>) => {
    const newWidths = [...columnWidthOverrideRef.current];
    const boundaryWidth = 99999; //containerRef.current?.parentElement?.clientWidth || 0;
    const isOutsideBoundary = e.clientX < 0 || e.clientX > boundaryWidth;
    const moveToPoint = isOutsideBoundary ? boundaryWidth : e.clientX;
    const newWidth = newWidths[currentColumnn] + moveToPoint - lastMousePosRef.current;
    newWidths[currentColumnn] = Math.min(maxWidth, Math.max(minWidth, newWidth));
    if (liveDragging) setColumnWidths(newWidths);
    setLiveColumnWidths(newWidths);
    setHandlePosition(moveToPoint);
    columnWidthOverrideRef.current = [...newWidths];
    lastMousePosRef.current = moveToPoint;
  };

  const endDragging = () => {
    const newWidths = [...columnWidthOverrideRef.current];

    // Catch if full width is smaller than min width
    if (minTableWidth) {
      const newTableWidth = newWidths.reduce((acc, v) => acc + v);
      if (newTableWidth < minTableWidth) {
        const otherColumnsWidth = [...newWidths]
          .slice(0, newWidths.length - 1)
          .reduce((acc, v) => acc + v);
        const lastColumnWidth = minTableWidth - otherColumnsWidth;
        newWidths[newWidths.length - 1] = lastColumnWidth;
      }
    }

    setColumnWidths(newWidths);
    setLiveColumnWidths(newWidths);
    columnWidthOverrideRef.current = [...newWidths];

    setResizingColumn(false);
    setCurrentColumnn(-1);
    setHandlePosition(-1);
    lastMousePosRef.current = 0;
  };

  const mouseOverEdge = (i: number) => {
    setCurrentColumnn(i);
    setHandlePosition(columnEdgePositions[currentColumnn]);
  };

  const onMouseDownResizeHandle = (e: React.MouseEvent<HTMLDivElement>) => {
    setResizingColumn(true);
    lastMousePosRef.current = e.clientX;
    columnWidthOverrideRef.current = [...liveColumnWidths];
    let event: EventListener = () => {};
    event = () => {
      window.removeEventListener('mouseup', event);
      setResizingColumn(false);
      setCurrentColumnn(-1);
      setHandlePosition(-1);
      lastMousePosRef.current = 0;
      endDragging();
    };
    window.addEventListener('mouseup', event);
  };

  React.useEffect(() => {
    setLiveColumnWidths(columnWidths);
  }, [columnWidths]);

  return {
    resizeColumn,
    resizingColumn,
    liveColumnWidths,
    columnEdgePositions,
    onMouseDownResizeHandle,
    mouseOverEdge,
    endDragging,
    handlePosition,
  };
};
