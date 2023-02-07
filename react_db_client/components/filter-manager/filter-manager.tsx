import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  EComparisons,
  FilterObjectClass,
  FilterOption,
} from '@react_db_client/constants.client-types';
import { useAutoHidePanel } from '@react_db_client/hooks.use-auto-hide-panel-hook';

import { FiltersList } from './FiltersList';
import { AddFilterButton } from './add-filter-button';
import { FilterId, TFilterFunc, IFilterComponentProps } from './lib';

export interface IFilterPanelProps {
  filters: FilterObjectClass[];
  addFilter: (filter: FilterObjectClass) => void;
  deleteFilter: (filterId: FilterId) => void;
  updateFilter: (filterId: FilterId, newFilterData: FilterObjectClass) => void;
  clearFilters: () => void;
  updateFieldTarget: (filterId: FilterId, fieldId: string | number) => void;
  updateOperator: (filterId: FilterId, newOperator: EComparisons) => void;
  showPanelOverride?: boolean;
  fieldsData: { [key: string]: FilterOption };
  floating?: boolean;
  autoOpenPanel?: boolean;
  customFilters?: { [key: string]: TFilterFunc };
  customFiltersComponents?: { [key: string]: React.FC<IFilterComponentProps<any, true>> };
}

/**
 * Filter Manager Panel React Component
 *
 * @param {*} {
 *   filterData,
 *   addFilter, (filterData) => {}
 *   deleteFilter, (index) => {}
 *   updateFilter, (index, newData) => {}
 *   clearFilters, () => {}
 *   showPanelOverride,
 *   fieldsData,
 *   floating,
 *   autoOpenPanel,
 * }
 */
export const FilterPanel = ({
  filters: filterData,
  addFilter,
  deleteFilter,
  updateFilter,
  clearFilters,
  updateFieldTarget,
  updateOperator,
  showPanelOverride,
  fieldsData,
  floating,
  autoOpenPanel,
  customFilters,
  customFiltersComponents,
}: IFilterPanelProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showPanel, setShowPanel] = useAutoHidePanel(menuRef, floating, showPanelOverride);
  // Auto show panel if values change
  useEffect(() => {
    if (filterData && Object.keys(filterData).length > 0) {
      // TODO: Stop if is search string
      if (autoOpenPanel) setShowPanel(true);
    }
  }, [filterData, autoOpenPanel, setShowPanel]);

  const panelClassName = ['filterPanel_panel', floating ? 'floating' : ''].join(' ');
  return (
    <div className="filterManager" data-testid="rdc-filterManger">
      <button
        type="button"
        className="button-one openFiltersButton"
        onClick={() => setShowPanel(!showPanel)}
      >
        Filters
      </button>
      <div
        className={panelClassName}
        ref={menuRef}
        style={{
          display: showPanel ? 'block' : 'none',
        }}
      >
        <FiltersList
          filterData={filterData}
          deleteFilter={(filterIndex) => deleteFilter(filterIndex)}
          updateFilter={(filterIndex, newFilterData) => updateFilter(filterIndex, newFilterData)}
          fieldsData={fieldsData}
          // customFilters={customFilters}
          customFiltersComponents={customFiltersComponents}
          updateFieldTarget={updateFieldTarget}
          updateOperator={updateOperator}
        />
        <button
          type="button"
          className="button-one"
          onClick={() => {
            clearFilters();
            setShowPanel(false);
          }}
        >
          Clear Filters
        </button>
        <AddFilterButton
          fieldsData={fieldsData}
          returnNewFilter={(newFilterObj) => {
            addFilter(newFilterObj);
          }}
          customFilters={customFilters}
        />
      </div>
    </div>
  );
};

FilterPanel.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.instanceOf(FilterObjectClass)).isRequired,
  addFilter: PropTypes.func.isRequired,
  deleteFilter: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  showPanelOverride: PropTypes.bool,
  fieldsData: PropTypes.objectOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  floating: PropTypes.bool,
  autoOpenPanel: PropTypes.bool,
  customFilters: PropTypes.objectOf(PropTypes.func),
  customFiltersComponents: PropTypes.objectOf(PropTypes.elementType),
};

FilterPanel.defaultProps = {
  showPanelOverride: false,
  floating: false,
  autoOpenPanel: false,
  customFilters: {},
  customFiltersComponents: {},
};

export default FilterPanel;
