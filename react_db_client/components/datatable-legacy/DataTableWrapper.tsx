import React, { useCallback, useContext, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { FilterOption, Uid } from '@react_db_client/constants.client-types';
import { useManageFilters } from '@react_db_client/components.filter-manager';
import { wrapWithErrorBoundary } from '@react_db_client/helpers.error-handling';
import { FilterObjectClass } from '@react_db_client/constants.client-types';
import { SelectionPreview } from '@react_db_client/components.selection-preview';

import useColumnVisabilityManager from './TableColumnManager/ColumnVisabilityManager';
import DataTableUi from './DataTableUi';
import { useDataManager } from './DataManager';
import DataTableConfigConnector, {
  DataTableContext,
  IDataTableConfig,
} from './DataTableConfig/DataTableConfig';
import { DataTableTopMenu } from './DataTableTopMenu/DataTableTopMenu';
import { DataTableBottomMenu } from './DataTableBottomMenu/DataTableBottomMenu';
import useConditionalStylingManager from './ConditionalStylingManager/ConditionalStylingManager';
import { useSelectionManager } from './SelectionManagerHook';
import { RowErrors } from './errorTypes';
import { IRow, ISortBy, THeading } from './lib';

export interface IDataTableWrapperProps {
  id: Uid;
  data: IRow[];
  headings: THeading[];
  previewHeadings?: THeading[];
  sortByOverride?: null | ISortBy;
  availableFilters?: { [k: string]: FilterOption };
  filterOverride?: FilterObjectClass[];
  saveData: (data, action: string, newData?, rowId?: Uid, colIds?: Uid[]) => void;
  updateTotals?: (totals) => void;
  updatedDataHook?: (row: Uid, column: Uid, field: Uid) => void;
  autoSave?: boolean;
  styleRule?;
  styleOverride?;
  baseStyle?: React.CSSProperties;
  errorStyleOverride?;
  maxTableHeight?: number;
  maxTableWidth?: number;
  bottomMenuRefOverride?: HTMLDivElement;
  onSelectionChange?;
  selectionOverride?;
  customFieldComponents?;
  customFilters?;
  customFiltersComponents?;
  customPreviewParsers?;
  disableEditing?: boolean;
  isControlled?: boolean;
}

export const DataTableWrapperFunc: React.FC<IDataTableWrapperProps> = ({
  id,
  data,
  headings,
  availableFilters,
  previewHeadings,
  sortByOverride,
  filterOverride,
  saveData,
  updateTotals,
  updatedDataHook, // A function that is called with field changes (row, column, value)
  autoSave,
  isControlled,
  styleRule,
  styleOverride,
  baseStyle,
  errorStyleOverride,
  maxTableHeight,
  maxTableWidth,
  bottomMenuRefOverride, // a react ref to a container to place the save buttons
  onSelectionChange, // Called when we make a row selection
  selectionOverride,
  customFieldComponents,
  customFilters,
  customFiltersComponents,
  customPreviewParsers,
  disableEditing,
}) => {
  const {
    showTable,
    calculateTotals,
    showTopMenu,
    showBottomMenu,
    theme,
    autoSaveOnNewRow,
    autoShowPreview,
  } = useContext(DataTableContext);

  const [sortBy, setSortBy] = useState(sortByOverride);
  const [autoFilter, setAutoFilter] = useState(true);
  const [autoSort, setAutoSort] = useState(true);
  const [bottomMenuRef, setBottomMenuRef] = useState<HTMLDivElement | null>(null);
  const [showSelectionPreview, setShowSelectionPreview] = useState(autoShowPreview);

  const filterManager = useManageFilters({
    fieldsData: availableFilters || {},
    initialFilterData: filterOverride || [],
    customFilters,
  });
  const { filters, addFilter } = filterManager;

  const {
    // dataUnProcessed,
    dataProcessed,
    totals,
    unsavedChanges,
    // updateRowData,
    handleValueChange,
    handleValueAccept,
    handleValueReset,
    handleAddRow,
    handleDeleteRow,
    resetData,
    handleSaveData,
    invalidRowsMessages,
  } = useDataManager({
    data,
    headings,
    filters,
    sortBy,
    calculateTotals,
    autoSave,
    isControlled,
    autoSaveOnNewRow,
    autoSaveCallback: saveData,
    autoSort,
    autoFilter,
    saveTotalsCallback: updateTotals,
    updatedDataHook,
    customFilters,
  });

  const { currentSelectionIds, addToSelection, removeFromSelection, clearSelection, selectAll } =
    useSelectionManager({ onSelectionChange, data, dataProcessed, selectionOverride });

  const { handleHideColumn, visableColumns, hiddenColumnIds } =
    useColumnVisabilityManager(headings);
  const className = ['DataTableWrapper', theme].join(' ');

  const { rowStyles } = useConditionalStylingManager({
    rowErrors: invalidRowsMessages,
    data: dataProcessed,
    styleRule,
    baseStyle,
    styleOverride /* This is the override for style rules */,
    errorStyleOverride,
  });

  // handle update sort by
  const updateSortBy = useCallback(
    (headingToSortBy: Uid) => {
      const headingData = headings.find((h) => h.uid === headingToSortBy);
      const newSortByData = {
        heading: headingToSortBy,
        direction: sortBy?.heading === headingToSortBy ? !sortBy?.direction : true,
        natural: headingData?.natural,
      };
      setSortBy(newSortByData);
    },
    [sortBy, headings]
  );

  // First selection
  const currentSelection = useMemo(() => {
    if (currentSelectionIds && currentSelectionIds.length > 0) {
      return data.find((item) => item.uid === currentSelectionIds[currentSelectionIds.length - 1]);
    }
    return {};
  }, [currentSelectionIds, data]);

  return (
    <div className={className} data-testid={`dataTableWrapper-${id}`}>
      {showTopMenu && (
        <DataTableTopMenu
          hiddenColumnIds={hiddenColumnIds}
          filterManager={filterManager}
          setAutoFilter={setAutoFilter}
          setAutoSort={setAutoSort}
          handleHideColumn={handleHideColumn}
          headings={headings}
          autoFilter={autoFilter}
          autoSort={autoSort}
          clearSelection={clearSelection}
          selectAll={selectAll}
          customFilters={customFilters}
          customFiltersComponents={customFiltersComponents}
          invalidRowsMessages={invalidRowsMessages}
        />
      )}
      {showTable && (
        <DataTableUi
          headingsData={visableColumns}
          tableData={dataProcessed}
          totalsData={totals}
          updateSortBy={updateSortBy}
          addFilter={addFilter}
          updateValue={handleValueChange}
          acceptValue={handleValueAccept}
          resetValue={handleValueReset}
          deleteRow={handleDeleteRow}
          handleHideColumn={handleHideColumn}
          rowStyles={rowStyles}
          maxTableHeight={maxTableHeight}
          maxTableWidth={maxTableWidth}
          currentSelectionIds={currentSelectionIds}
          addToSelection={addToSelection}
          removeFromSelection={removeFromSelection}
          handleAddRow={handleAddRow}
          customFieldComponents={customFieldComponents}
          disabled={disableEditing}
          invalidRowsMessages={invalidRowsMessages}
        />
      )}
      <div ref={(ref) => setBottomMenuRef(ref)} />
      {showBottomMenu &&
        bottomMenuRef &&
        ReactDOM.createPortal(
          <DataTableBottomMenu
            unsavedChanges={unsavedChanges}
            handleSaveBtnClick={handleSaveData}
            handleResetBtnClick={resetData}
            handleAddRowBtnClick={handleAddRow}
            handleShowPreviewBtnClick={() => setShowSelectionPreview((prev) => !prev)}
            previewShown={showSelectionPreview}
          />,
          bottomMenuRefOverride || bottomMenuRef
        )}
      {showSelectionPreview && (
        <SelectionPreview
          headings={previewHeadings || headings}
          currentSelectionData={currentSelection}
          customParsers={customPreviewParsers}
        />
      )}
    </div>
  );
};

DataTableWrapperFunc.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  headings: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      action: PropTypes.func,
      to: PropTypes.string,
      hidden: PropTypes.bool,
      natural: PropTypes.bool,
    })
  ).isRequired,
  previewHeadings: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      action: PropTypes.func,
      to: PropTypes.string,
      hidden: PropTypes.bool,
      natural: PropTypes.bool,
    })
  ),
  // @ts-ignore
  config: PropTypes.shape({}),
  sortByOverride: PropTypes.shape({
    heading: PropTypes.string.isRequired,
    direction: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
    map: PropTypes.arrayOf(PropTypes.string), // TODO: Check this is correct
    natural: PropTypes.bool,
  }),
  filterOverride: PropTypes.arrayOf(PropTypes.instanceOf(FilterObjectClass)),
  saveData: PropTypes.func,
  autoSave: PropTypes.bool,
  updateTotals: PropTypes.func,
  updatedDataHook: PropTypes.func,
  styleRule: PropTypes.string,
  styleOverride: PropTypes.shape({}),
  errorStyleOverride: PropTypes.shape({
    [RowErrors.DUPLICATE]: PropTypes.shape({ background: PropTypes.string }),
  }),
  maxTableHeight: PropTypes.number,
  maxTableWidth: PropTypes.number,
  bottomMenuRefOverride: PropTypes.any, // should be react ref
  onSelectionChange: PropTypes.func,
  selectionOverride: PropTypes.arrayOf(PropTypes.string),
  customFilters: PropTypes.objectOf(PropTypes.func),
  customFieldComponents: PropTypes.objectOf(PropTypes.elementType),
  customFiltersComponents: PropTypes.objectOf(PropTypes.elementType),
  customPreviewParsers: PropTypes.objectOf(PropTypes.func),
  disableEditing: PropTypes.bool,
};

DataTableWrapperFunc.defaultProps = {
  previewHeadings: [],
  // @ts-ignore
  config: {},
  sortByOverride: null,
  filterOverride: [],
  saveData: () => {},
  // filterOverride: {},
  autoSave: false,
  updateTotals: () => {},
  updatedDataHook: () => {},
  styleRule: null,
  styleOverride: {},
  errorStyleOverride: {
    [RowErrors.DUPLICATE]: { background: 'tomato' },
    [RowErrors.MISSING]: { background: 'tomato' },
  },
  maxTableHeight: 2000,
  maxTableWidth: 2000,
  // @ts-ignore
  bottomMenuRefOverride: null,
  selectionOverride: [],
  onSelectionChange: () => {},
  customFilters: {},
  customFieldComponents: {},
  customFiltersComponents: {},
  customPreviewParsers: {},
  disableEditing: false,
};

export const DataTableWrapper: React.FC<
  IDataTableWrapperProps & { config: Partial<IDataTableConfig> }
> = DataTableConfigConnector({})(
  wrapWithErrorBoundary(
    DataTableWrapperFunc,
    'Data Table failed to render',
    () => {},
    null,
    null,
    null
  )
) as React.FC<IDataTableWrapperProps & { config: Partial<IDataTableConfig> }>;

export default DataTableWrapper;
