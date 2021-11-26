import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useColumnManager } from '@samnbuk/react_db_client.components.column-manager';
import { ListItem } from './list-item';

import styles from './StyledSelectList.module.scss';

/**
 * Styled select list
 */
export const StyledSelectList = ({
  listInput,
  headings,
  handleSelect: handleSelectTop,
  currentSelection,
  limitHeight,
  selectionField,
  autoWidth,
  customParsers,
}) => {
  const containerRef = useRef(null);
  const {
    columnWidths,
    // setColumnWidths,
    // tableWidth
  } = useColumnManager({
    headingsDataList: headings,
    minWidth: 100,
    maxWidth: 1000,
    autoWidth,
    containerRef,
  });

  const handleSelect = (selectedUid, selectedData) => handleSelectTop(selectedUid, selectedData);

  const mapHeadings = headings.map((heading, i) => (
    <div
      key={heading.uid}
      // className='styledList_heading'
      className={styles.styledList_heading}
      style={{
        width: columnWidths[i],
      }}
    >
      {heading.label}
    </div>
  ));
  const mapItems = useMemo(
    () =>
      listInput.map((item) => (
        <ListItem
          data={item}
          currentSelection={currentSelection}
          selectionField={selectionField}
          handleSelect={handleSelect}
          headings={headings}
          columnWidths={columnWidths}
          customParsers={customParsers}
          isSelected={currentSelection && currentSelection.indexOf(item[selectionField]) >= 0}
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
  const itemListClassName = [
    styles.styledList_items,
    limitHeight ? styles['styledList_items-limitHeight'] : '',
  ].join(' ');

  return (
    <div
      className={styles.styledList}
      style={{
        position: 'relative',
        ...(limitHeight ? { maxHeight: `${limitHeight}rem` } : {}),
      }}
      ref={containerRef}
    >
      {/* TODO: This is causing a memory leak! */}
      {/* <DataTableColumnWidthManager
        setColumnWidths={setColumnWidths}
        columnWidths={columnWidths}
        minWidth={100}
        maxWidth={1000}
      /> */}
      <div style={{ zIndex: 10 }} className={styles.styledList_headings}>
        {mapHeadings}
      </div>
      <div style={{ zIndex: 10 }} className={itemListClassName}>
        {mapItems}
      </div>
    </div>
  );
};

StyledSelectList.propTypes = {
  /** list of objects to display */
  listInput: PropTypes.arrayOf(
    PropTypes.shape({
      /** Uid for list item */
      uid: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** headings for list table */
  headings: PropTypes.arrayOf(
    PropTypes.shape({
      /** Heading uid matches field in list items */
      uid: PropTypes.string.isRequired,
      /** Heading label to display on table */
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    })
  ).isRequired,
  /** func to handle selecting an item (selectedUid, selectedData) => {} */
  handleSelect: PropTypes.func.isRequired,
  /** override current selection */
  currentSelection: PropTypes.arrayOf(PropTypes.string),
  /** Limit the list height */
  limitHeight: PropTypes.number,
  /** Field to return on selection */
  selectionField: PropTypes.string,
  /** If true column widths are calculated */
  autoWidth: PropTypes.bool,
  /** custom parsers for field types */
  customParsers: PropTypes.objectOf(PropTypes.func),
};

StyledSelectList.defaultProps = {
  currentSelection: null,
  limitHeight: 0,
  autoWidth: true,
  customParsers: {},
  selectionField: 'uid',
};
