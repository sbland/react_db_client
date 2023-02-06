import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useColumnWidthManager } from './use-column-width-manager-hook';

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
  overflow-x: visible;
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
    width: 110%; // Overflow allows draggingcolumnResizeCanvas
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
  minTableWidth?: number;
  fillContainer?: boolean;
  showEdges?: boolean;
  liveDragging?: boolean;
  innerRef?: React.RefObject<HTMLDivElement>;
  widthPadding?: number;
  debug?: boolean;
}

export interface IColumnWidthManagerRenderProps {
  resizeColumn: (e: React.MouseEvent<HTMLDivElement>) => void;
  resizingColumn: boolean;
  liveColumnWidths: number[];
  columnEdgePositions: number[];
  onMouseDownResizeHandle: (e: React.MouseEvent<HTMLDivElement>) => void;
  mouseOverEdge: (i: number) => void;
  endDragging: () => void;
  handlePosition: number;
  tableWidth: number;
  liveDragging?: boolean;
  showEdges?: boolean;
  widthPadding?: number;
  debug?: boolean;
}

const EDGE_WIDTH = 10;
const COLUMN_RESIZE_CANVAS_PADDING = 10;

export const ColumnWidthManagerRender = ({
  resizeColumn,
  resizingColumn,
  liveColumnWidths,
  columnEdgePositions,
  onMouseDownResizeHandle,
  mouseOverEdge,
  endDragging,
  handlePosition,
  tableWidth,
  showEdges = false,
  liveDragging = false,
  // innerRef,
  widthPadding = 100,
  debug = false,
}: IColumnWidthManagerRenderProps) => {
  // TODO: Can we remove container ref
  const containerRef: React.RefObject<HTMLObjectElement> = React.useRef(null);
  const containerWidth = liveColumnWidths.reduce((acc, v) => acc + v, 0) + widthPadding;
  return (
    <ColumnManagerStyles
      className="columnWidthManager_styles"
      // ref={innerRef}
      style={{
        width: tableWidth,
        outline: debug ? '1px solid purple' : 'none',
      }}
    >
      <div
        className="columnWidthManager"
        style={{
          pointerEvents: resizingColumn ? 'all' : 'none',
          width: containerWidth,
          outline: debug ? '1px solid yellow' : 'none',
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
              width: EDGE_WIDTH,
              left: `${columnEdgePositions[i] - EDGE_WIDTH / 2}px`,
              pointerEvents: resizingColumn ? 'none' : 'all',
              cursor: 'crosshair',
            }}
            onMouseDown={onMouseDownResizeHandle}
            onMouseEnter={(e) => mouseOverEdge(i)}
          >
            <div
              style={{
                width: 2,
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '50%',
                background: 'black',
                zIndex: 1000,
                pointerEvents: 'none',
                display: showEdges || resizingColumn ? 'inherit' : 'none',
              }}
            >
              {debug && i}
            </div>
          </div>
        ))}
        {/* // eslint-disable-next-line jsx-a11y/no-static-element-interactions,
        jsx-a11y/mouse-events-have-key-events */}
        <div
          className="columnResizeCanvas"
          style={{
            display: resizingColumn || debug ? 'inherit' : 'none',
            background:
              (debug && 'rgba(100,100,0,0.2)') || (liveDragging ? 'none' : 'rgba(255,255,255,0.7)'),
            outline: debug ? '1px solid grey' : 'none',
            width: `${tableWidth + COLUMN_RESIZE_CANVAS_PADDING}px`,
          }}
          onMouseUp={() => {
            endDragging();
          }}
          onMouseLeave={() => {
            endDragging();
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
            left: `${handlePosition - EDGE_WIDTH / 2}px`,
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

export const ColumnWidthManager: React.FC<IColumnManagerProps> = ({
  tableWidth,
  columnWidths,
  setColumnWidths,
  minWidth = 10,
  maxWidth = 99999999,
  showEdges = false,
  liveDragging = false,
  minTableWidth = 0,
  // innerRef,
  widthPadding = 100,
  debug = false,
}) => {
  const {
    resizeColumn,
    resizingColumn,
    liveColumnWidths,
    columnEdgePositions,
    onMouseDownResizeHandle,
    mouseOverEdge,
    endDragging,
    handlePosition,
  } = useColumnWidthManager({
    columnWidths,
    setColumnWidths,
    minTableWidth,
    minWidth,
    maxWidth,
    liveDragging,
  });

  return (
    <ColumnWidthManagerRender
      resizeColumn={resizeColumn}
      resizingColumn={resizingColumn}
      liveColumnWidths={liveColumnWidths}
      columnEdgePositions={columnEdgePositions}
      onMouseDownResizeHandle={onMouseDownResizeHandle}
      mouseOverEdge={mouseOverEdge}
      endDragging={endDragging}
      handlePosition={handlePosition}
      tableWidth={tableWidth}
      showEdges={showEdges}
      // innerRef={innerRef}
      widthPadding={widthPadding}
      debug={debug}
    />
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
