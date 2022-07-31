import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FilterManager } from '@react_db_client/components.filter-manager';
import { FilterObjectClass } from '@react_db_client/constants.client-types';

import { arrayToObj } from '../Helpers/objectArrayHelpers';
import HiddenColumnsPanel from '../HiddenColumnsPanel/HiddenColumnsPanel';
import { DataTableContext } from '../DataTableConfig/DataTableConfig';

const DataTableTopMenu = ({
  hiddenColumnIds,
  addFilter,
  deleteFilter,
  updateFilter,
  clearFilters,
  setAutoFilter,
  setAutoSort,
  handleHideColumn,
  filterData,
  headings,
  autoFilter,
  autoSort,
  clearSelection,
  selectAll,
  customFilters,
  customFiltersComponents,
  invalidRowsMessages,
}) => {
  const { allowFilters, allowHiddenColumns, allowSelection } = useContext(DataTableContext);

  return (
    <div className="dataTableWrap_optionsBar">
      {/* FILTERS */}
      {allowFilters && (
        <>
          {/* TODO: This should be popup panel */}
          <FilterManager
            filterData={filterData}
            clearFilters={clearFilters}
            addFilter={(newFilterData) => addFilter(newFilterData)}
            deleteFilter={(filterId) => deleteFilter(filterId)}
            updateFilter={(filterId, newFilterData) => updateFilter(filterId, newFilterData)}
            fieldsData={arrayToObj(headings, 'uid')}
            customFilters={customFilters}
            customFiltersComponents={customFiltersComponents}
            floating
          />
          <div className="">
            <button
              type="button"
              className={autoFilter ? 'button-two' : 'button-one'}
              onClick={() => setAutoFilter((prev) => !prev)}
            >
              {autoFilter ? 'Filters On' : 'Filters Off'}
            </button>
          </div>
          <div className="">
            <button
              type="button"
              className={autoSort ? 'button-two' : 'button-one'}
              onClick={() => setAutoSort((prev) => !prev)}
            >
              {autoSort ? 'Sorting On' : 'Sorting Off'}
            </button>
          </div>
          {allowSelection && (
            <>
              <div className="">
                <button
                  type="button"
                  className="button-one selectAllBtn"
                  onClick={() => selectAll()}
                >
                  Select All
                </button>
              </div>
              <div className="">
                <button
                  type="button"
                  className="button-one clearSelectionBtn"
                  onClick={() => clearSelection()}
                >
                  Clear Selection
                </button>
              </div>
            </>
          )}
        </>
      )}

      {allowHiddenColumns && (
        <>
          <HiddenColumnsPanel
            headings={headings}
            hiddenColumnIds={hiddenColumnIds}
            handleUnhideColumn={handleHideColumn}
          />
        </>
      )}
      {invalidRowsMessages.some((r) => r) && (
        <div className="error_message">
          Table Contains Errors: {invalidRowsMessages.filter((r) => r)[0].text}
        </div>
      )}
    </div>
  );
};

DataTableTopMenu.propTypes = {
  hiddenColumnIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  addFilter: PropTypes.func.isRequired,
  deleteFilter: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  setAutoFilter: PropTypes.func.isRequired,
  setAutoSort: PropTypes.func.isRequired,
  handleHideColumn: PropTypes.func.isRequired,
  filterData: PropTypes.arrayOf(PropTypes.instanceOf(FilterObjectClass)).isRequired,
  headings: PropTypes.arrayOf(
    PropTypes.shape({
      // TODO: Add headings shape
    })
  ).isRequired,
  autoFilter: PropTypes.bool.isRequired,
  autoSort: PropTypes.bool.isRequired,
  clearSelection: PropTypes.func.isRequired,
  selectAll: PropTypes.func.isRequired,
  customFilters: PropTypes.objectOf(PropTypes.func),
  customFiltersComponents: PropTypes.objectOf(PropTypes.elementType),
  invalidRowsMessages: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
    })
  ),
};

DataTableTopMenu.defaultProps = {
  customFilters: {},
  customFiltersComponents: {},
  invalidRowsMessages: [],
};

export default DataTableTopMenu;
