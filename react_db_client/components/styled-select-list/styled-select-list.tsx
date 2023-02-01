import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  useColumnManager,
  useColumnWidthManager,
  ColumnWidthManagerRender,
} from '@react_db_client/components.column-manager';
import { Uid } from '@react_db_client/constants.client-types';
import { ListItem } from './list-item';
import {
  StyledListHeadingStyle,
  StyledListItems,
  StyledListStyle,
  StyledSelectListHeadingStyle,
} from './styles';
import { IHeading, IItem } from './lib';

export interface IStyledSelectListProps<ItemType extends IItem> {
  listInput: IItem[];
  headings: IHeading[];
  handleSelect: (uid: Uid, data: ItemType) => void;
  currentSelection: Uid[];
  limitHeight?: number;
  selectionField: string;
  autoWidth?: boolean;
  minWidth?: number;
  maxWidth?: number;
  customParsers: { [k: string]: (valIn: any) => any };
  liveColumnWidthDragging?: boolean;
}

/**
 * Styled select list
 */
export const StyledSelectList = <ItemType extends IItem>({
  listInput,
  headings,
  handleSelect: handleSelectTop,
  currentSelection,
  limitHeight,
  selectionField,
  autoWidth,
  maxWidth = 1000,
  minWidth = 100,
  customParsers,
  liveColumnWidthDragging,
}: IStyledSelectListProps<ItemType>) => {
  const containerRef = useRef(null);
  const { columnWidths, setColumnWidths, tableWidth } = useColumnManager({
    headingsDataList: headings,
    minWidth,
    maxWidth,
    autoWidth,
    containerRef,
  });

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
    minWidth,
    maxWidth,
    liveDragging: liveColumnWidthDragging,
  });

  const handleSelect = (selectedUid, selectedData) =>
    handleSelectTop(selectedUid, selectedData);

  const mapHeadings = headings.map((heading, i) => (
    <StyledSelectListHeadingStyle
      key={heading.uid}
      style={{
        width: columnWidths[i],
      }}
    >
      {heading.label}
    </StyledSelectListHeadingStyle>
  ));
  const mapItems = useMemo(
    () =>
      listInput.map((item) => (
        <ListItem
          data={item}
          handleSelect={handleSelect}
          headings={headings}
          columnWidths={columnWidths}
          tableWidth={tableWidth}
          customParsers={customParsers}
          isSelected={
            (currentSelection &&
              currentSelection.indexOf(item[selectionField]) >= 0) ||
            false
          }
          key={item.uid}
        />
      )),
    [
      headings,
      columnWidths,
      currentSelection,
      selectionField,
      handleSelect,
      listInput,
      customParsers,
    ]
  );

  return (
    <StyledListStyle
      style={{
        ...(limitHeight ? { maxHeight: `${limitHeight}rem` } : {}),
      }}
      ref={containerRef}
      data-testid="styledSelectList"
    >
      <StyledListHeadingStyle style={{ width: tableWidth }}>
        {mapHeadings}
      </StyledListHeadingStyle>
      <StyledListItems
        limitHeight={limitHeight ? true : false}
        style={{ zIndex: 10, width: tableWidth }}
      >
        {mapItems}
      </StyledListItems>
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
      />
    </StyledListStyle>
  );
};

StyledSelectList.propTypes = {
  /** list of objects to display */
  listInput: PropTypes.arrayOf(
    PropTypes.shape({
      /** Uid for list item */
      uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  /** headings for list table */
  headings: PropTypes.arrayOf(
    PropTypes.shape({
      /** Heading uid matches field in list items */
      uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      /** Heading label to display on table */
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    })
  ).isRequired,
  /** func to handle selecting an item (selectedUid, selectedData) => {} */
  handleSelect: PropTypes.func.isRequired,
  /** override current selection */
  currentSelection: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  /** Limit the list height */
  limitHeight: PropTypes.number,
  /** Field to return on selection */
  selectionField: PropTypes.string,
  /** If true column widths are calculated */
  autoWidth: PropTypes.bool,
  /** custom parsers for field types */
  customParsers: PropTypes.objectOf(PropTypes.func),
  /** liveColumnWidthDragging */
  liveColumnWidthDragging: PropTypes.bool,
};

StyledSelectList.defaultProps = {
  currentSelection: null,
  limitHeight: 0,
  autoWidth: true,
  customParsers: {},
  selectionField: 'uid',
  liveColumnWidthDragging: false,
};
