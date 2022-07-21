/* Data Table config component
 * A HOC that contains the config state of the datatable
 * This allows us to store this config in one place and pass to subcomponents
 * without having to manually pass to each component
 *
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

export const dataTableDefaultConfig = {
  allowRowDelete: true,
  allowFilters: true,
  allowSortBy: true,
  allowHiddenColumns: true,
  allowRowEditPanel: false,
  allowEditRow: true,
  allowAddRow: true,
  showSaveBtns: true,
  calculateTotals: true,
  showTotals: true,
  theme: 'default',
  limitHeight: 0,
  maxWidth: 2000,
  minWidth: 50,
  showTable: true,
  showTopMenu: true,
  showBottomMenu: true,
  allowSelection: false,
  hasBtnsColumn: true,
  autoSaveOnNewRow: false,
  showHeadings: true,
  allowColumnResize: true,
  allowCellFocus: true,
  allowSelectionPreview: false,
  autoShowPreview: false,
  speedUpScrolling: false,
};

export const DataTableContext = React.createContext(dataTableDefaultConfig);

export const DataTableConfigConnector = (defaults) => (Component) => {
  const DataTableConfigManager = (props) => {
    const { config: configIn } = props;

    // TODO: clone here
    const config = { ...dataTableDefaultConfig, ...defaults, ...configIn };
    const hasBtnsColumn =
      config.allowSelection ||
      (config.allowEditRow && (config.allowRowDelete || config.allowRowEditPanel));

    config.hasBtnsColumn = hasBtnsColumn;

    return (
      <DataTableContext.Provider value={config}>
        <Component {...props} />
      </DataTableContext.Provider>
    );
  };

  DataTableConfigManager.propTypes = {
    config: PropTypes.shape({
      allowRowDelete: PropTypes.bool,
      allowFilters: PropTypes.bool,
      allowSortBy: PropTypes.bool,
      allowHiddenColumns: PropTypes.bool,
      allowRowEditPanel: PropTypes.bool,
      allowEditRow: PropTypes.bool,
      allowAddRow: PropTypes.bool,
      calculateTotals: PropTypes.bool,
      showTotals: PropTypes.bool,
      theme: PropTypes.oneOf(['default', 'condensed']),
      limitHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      showTable: PropTypes.bool,
      showTopMenu: PropTypes.bool,
      showBottomMenu: PropTypes.bool,
      allowSelection: PropTypes.bool,
      hasBtnsColumn: PropTypes.bool,
      autoSaveOnNewRow: PropTypes.bool,
      allowCellFocus: PropTypes.bool,
      speedUpScrolling: PropTypes.bool,
    }),
  };
  DataTableConfigManager.defaultProps = {
    config: dataTableDefaultConfig,
  };
  return DataTableConfigManager;
};
