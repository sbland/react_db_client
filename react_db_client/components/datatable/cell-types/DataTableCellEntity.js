import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PopupPanel } from '@react_db_client/components.popup-panel';
import { SearchAndSelect } from '@react_db_client/components.search-and-select';
import { filterTypes } from '@react_db_client/constants.client-types';
import { DefaultCellInnerStyle } from './style';
// TODO: Make sure apiGetDocuments is passes to this component
// import { apiGetDocuments } from '../../../Api/Api';

export const SelectEntityPanel = ({
  apiGetDocuments,
  currentSelection,
  collection,
  headings,
  handleSubmit,
}) => (
  <DefaultCellInnerStyle className="entitySelector">
    <SearchAndSelect
      searchFunction={(filters) => apiGetDocuments(collection, filters)}
      initialFilters={[
        {
          uid: 'searchphrase',
          field: 'searchPhrase',
          operator: 'contains',
          value: currentSelection || '',
        },
      ]}
      availableFilters={{
        searchPhrase: {
          uid: 'searchPhrase',
          label: 'Search Phrase',
          type: 'text',
        },
        ...headings,
      }}
      handleSelect={handleSubmit}
      headings={
        headings || [
          {
            uid: 'uid',
            label: 'UID',
            type: filterTypes.text,
          },
          {
            uid: 'type',
            label: 'Type',
            type: filterTypes.text,
          },
          {
            uid: 'name',
            label: 'Name',
            type: filterTypes.text,
          },
        ]
      }
    />
  </DefaultCellInnerStyle>
);

SelectEntityPanel.propTypes = {
  currentSelection: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
  headings: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.keys(filterTypes)).isRequired,
    value: PropTypes.any,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

/**
 * Data Cell Entity
 *
 * @param {*} {
 *   cellData,
 *   updateData,
 * }
 * @returns
 */
export const DataTableCellEntity = ({
  columnData: { collection, headings },
  cellData,
  updateData,
}) => {
  const [editMode, setEditMode] = useState(false);
  return (
    <div className="dataTableCellData dataTableCellData-select">
      {editMode && (
        <PopupPanel isOpen={editMode} handleClose={() => setEditMode(false)}>
          <SelectEntityPanel
            currentSelection={cellData}
            collection={collection}
            headings={headings}
            handleSubmit={updateData}
          />
        </PopupPanel>
      )}
      {!editMode && (
        <button type="button" className="button-reset" onClick={() => setEditMode(true)}>
          {cellData}
        </button>
      )}
    </div>
  );
};

DataTableCellEntity.propTypes = {
  cellData: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateData: PropTypes.func.isRequired,
  columnData: PropTypes.shape({
    collection: PropTypes.string.isRequired,
    headings: PropTypes.objectOf(
      PropTypes.shape({
        uid: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.oneOf(Object.keys(filterTypes)).isRequired,
      })
    ),
  }).isRequired,
};

DataTableCellEntity.defaultProps = {
  cellData: 0,
};
