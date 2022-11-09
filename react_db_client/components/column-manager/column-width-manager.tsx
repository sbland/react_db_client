import React, { useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ColumnManagerStyles = styled.div`

  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  ** {
    box-sizing: border-box;
  }

  pointer-events: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  overflow-x: auto;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */

  .columnWidthManager {
      position: relative;
      height: 100%;
      overflow-x: hidden; // Must be set to stop any overflows causing scroll sync issues
      -ms-overflow-style: none; /* for Internet Explorer, Edge */
      scrollbar-width: none; /* for Firefox */
  }

  // TODO: Move these to correct location
  .columnResizeHandle {
    content: '';
    position: absolute;
    width: 10px;
    height: 100%;
    z-index: $resizerZindex;
    top: 0,
    bottom: 0,
    border-bottom: 1px $primaryColour solid;
    border-top: 1px $primaryColour solid;

    &:hover {
      cursor: e-resize;
      background: rgba(0,0,0,0.2);
    }

    &:after {
      content: '';
      position: absolute;
      width: 2px;
      background: $primaryColour;
      height: 100%;
      z-index: $resizerZindex;
      left: 4px;
    }
  }

  .columnResizeCanvas {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 11;
    border: 1px $primaryColour solid;
    border-radius: $tableBorderRadius;
    overflow: hidden;
  }
`;

export interface IColumnManagerProps {
  tableWidth: number;
  columnWidths: number[];
  setColumnWidths: (newWidths: number[]) => void;
  minWidth?: number;
  maxWidth?: number;
  showEdges?: boolean;
  liveDragging?: boolean;
  innerRef?: React.RefObject<HTMLDivElement>;
  widthPadding?: number;
}

export const ColumnWidthManager: React.FC<IColumnManagerProps> = ({
  tableWidth,
  columnWidths,
  setColumnWidths,
  minWidth = 10,
  maxWidth = 99999999,
  showEdges = false,
  liveDragging = false,
  innerRef,
  widthPadding = 100,
}) => {
  const [currentColumnn, setCurrentColumnn] = useState(-1);
  const [resizingColumn, setResizingColumn] = useState(false);
  const lastMousePosRef = useRef(0);
  const columnWidthOverrideRef = useRef(columnWidths);
  const [handlePosition, setHandlePosition] = useState(-1);
  const [liveColumnWidths, setLiveColumnWidths] = useState(columnWidths);
  const containerRef: React.RefObject<HTMLObjectElement> = React.useRef(null);

  // Use offset column positions to determine

  const columnEdgePositions = useMemo(() => {
    let widthSum = 0;

    return liveColumnWidths.map((cwidth) => {
      widthSum += cwidth;
      return widthSum;
    });
  }, [liveColumnWidths]);

  // called on mouse move over resize overlay when dragging
  const resizeColumn = (e: React.MouseEvent<HTMLDivElement>) => {
    const newWidths = [...columnWidthOverrideRef.current];
    const boundaryWidth = containerRef.current?.parentElement?.clientWidth || 0;
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
    setColumnWidths(columnWidthOverrideRef.current);
    setLiveColumnWidths(columnWidthOverrideRef.current);
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

  return (
    <ColumnManagerStyles
      className="columnWidthManager_styles"
      ref={innerRef}
      style={{ width: tableWidth }}
    >
      <div
        className="columnWidthManager"
        style={{
          pointerEvents: resizingColumn ? 'all' : 'none',
          width: liveColumnWidths.reduce((acc, v) => acc + v, 0) + widthPadding,
        }}
        ref={containerRef}
      >
        {columnEdgePositions.map((cw, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              zIndex: 1000,
              width: 10,
              left: `${columnEdgePositions[i] - 5}px`,
              pointerEvents: resizingColumn ? 'none' : 'all',
              cursor: 'crosshair',
            }}
            onMouseDown={onMouseDownResizeHandle}
            onMouseEnter={(e) => mouseOverEdge(i)}
          >
            <div
              style={{
                width: 1,
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '50%',
                background: 'black',
                zIndex: 1000,
                pointerEvents: 'none',
                display: showEdges || resizingColumn ? 'inherit' : 'none',
              }}
            />
          </div>
        ))}
        {/* // eslint-disable-next-line jsx-a11y/no-static-element-interactions,
        jsx-a11y/mouse-events-have-key-events */}
        <div
          className="columnResizeCanvas"
          style={{
            display: resizingColumn ? 'inherit' : 'none',
            background: liveDragging ? 'none' : 'rgba(255,255,255,0.7)',
          }}
          onMouseUp={() => {
            setResizingColumn(false);
            lastMousePosRef.current = 0;
          }}
          onMouseLeave={() => {
            setResizingColumn(false);
            lastMousePosRef.current = 0;
          }}
          onMouseMove={(e) => {
            if (resizingColumn) resizeColumn(e);
          }}
        />
        {/* // eslint-disable-next-line max-len
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/mouse-events-have-key-events */}
        <div
          className="columnResizeHandle"
          style={{
            left: `${handlePosition - 5}px`,
            pointerEvents: `${resizingColumn ? 'none' : 'all'}`,
            cursor: 'crosshair',
          }}
          onMouseDown={onMouseDownResizeHandle}
          onMouseUp={endDragging}
        />
      </div>
    </ColumnManagerStyles>
  );
};

ColumnWidthManager.propTypes = {
  columnWidths: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  setColumnWidths: PropTypes.func.isRequired,
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number,
  showEdges: PropTypes.bool,
  liveDragging: PropTypes.bool,
  widthPadding: PropTypes.number,
};

ColumnWidthManager.defaultProps = {
  minWidth: 50,
  maxWidth: 300,
  showEdges: false,
  liveDragging: false,
  widthPadding: 100,
};
