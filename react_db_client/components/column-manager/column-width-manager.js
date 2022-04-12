import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useMemo } from 'react';

const ColumnManagerStyles = styled.div`

  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  ** {
    box-sizing: border-box;

  }

  .columnWidthManager {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
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


export const ColumnWidthManager = ({
  // columnCount,
  columnWidths,
  setColumnWidths,
  minWidth,
  maxWidth,
  showEdges,
  liveDragging,
}) => {
  const Ref = useRef(null);

  const [currentColumnn, setCurrentColumnn] = useState(-1);
  const [resizingColumn, setResizingColumn] = useState(false);
  const lastMousePosRef = useRef(0);
  const columnWidthOverrideRef = useRef(columnWidths);
  const [handlePosition, setHandlePosition] = useState(-1);
  const [liveColumnWidths, setLiveColumnWidths] = useState(columnWidths);

  // Use offset column positions to determine
  let widthSum = 0;


  const columnEdgePositions = useMemo(
    () =>
      liveColumnWidths.map((cwidth) => {
        widthSum += cwidth;
        return widthSum;
      }),
    [liveColumnWidths]
  );

  // called on mouse move over resize overlay when dragging
  const resizeColumn = (e) => {
    const newWidths = [...columnWidthOverrideRef.current];
    const newWidth = newWidths[currentColumnn] + e.clientX - lastMousePosRef.current;
    // TODO: Limit by max width
    // if less than min width set as min width
    newWidths[currentColumnn] = newWidth > minWidth ? newWidth : minWidth;
    if (liveDragging) setColumnWidths(newWidths);
    setLiveColumnWidths(newWidths);
    setHandlePosition(e.clientX);
    columnWidthOverrideRef.current = [...newWidths];
    lastMousePosRef.current = e.clientX;
  };

  const endDragging = () => {
    setColumnWidths(columnWidthOverrideRef.current);
    setLiveColumnWidths(columnWidthOverrideRef.current);
    setResizingColumn(false);
    setCurrentColumnn(-1);
    setHandlePosition(-1);
    lastMousePosRef.current = 0;
  };

  const mouseOverEdge = (i) => {
    setCurrentColumnn(i);
    setHandlePosition(columnEdgePositions[currentColumnn]);
  };

  const onMouseDownResizeHandle = (e) => {
    setResizingColumn(true);
    lastMousePosRef.current = e.clientX;
    columnWidthOverrideRef.current = [...liveColumnWidths];
    window.addEventListener('mouseup', () => {
      window.removeEventListener('mouseup', this);
      setResizingColumn(false);
      setCurrentColumnn(-1);
      setHandlePosition(-1);
      lastMousePosRef.current = 0;
      endDragging();
    });
  };

  return (
    <ColumnManagerStyles>
      <div
        ref={Ref}
        className="columnWidthManager"
        style={{
          pointerEvents: resizingColumn ? 'all' : 'none',
        }}
      >
        {columnEdgePositions.map((cw, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              width: 2,
              bottom: 0,
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
  columnWidths: PropTypes.arrayOf(PropTypes.number).isRequired,
  setColumnWidths: PropTypes.func.isRequired,
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number,
  showEdges: PropTypes.bool,
  liveDragging: PropTypes.bool,
};

ColumnWidthManager.defaultProps = {
  minWidth: 50,
  maxWidth: 300,
  showEdges: false,
  liveDragging: false,
};
