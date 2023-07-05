import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PopupPanel } from '@react_db_client/components.popup-panel';
import {
  SearchAndSelect,
  TSearchAndSelectSearchFunction,
} from '@react_db_client/components.search-and-select-v2';
import {
  EComparisons,
  EFilterType,
  FilterObjectClass,
  FilterOption,
  IDocument,
  Uid,
  filterTypes,
  filterTypesList,
} from '@react_db_client/constants.client-types';
import { ICellProps, IHeadingReference } from '../lib';

export interface ISelectEntityPanelProps<ResultType extends IDocument> {
  currentSelection: string;
  collection: string;
  headings: {
    uid: Uid;
    label: string;
    type: EFilterType;
    field?: Uid;
  }[];
  handleSubmit: (data: null | ResultType) => void | ((data: null | ResultType[]) => void);
  searchFunction: TSearchAndSelectSearchFunction<ResultType>;
}

export const SelectEntityPanel = <ResultType extends IDocument>({
  currentSelection,
  headings,
  handleSubmit,
  searchFunction,
}: ISelectEntityPanelProps<ResultType>) => (
  <div className="entitySelector">
    <SearchAndSelect
      id="entitySelector"
      autoUpdate
      previewHeadings={
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
            uid: 'label',
            label: 'Label',
            type: filterTypes.text,
          },
        ]
      }
      searchFunction={searchFunction}
      initialFilters={[
        new FilterObjectClass({
          uid: 'searchphrase',
          field: 'searchPhrase',
          operator: EComparisons.CONTAINS,
          value: currentSelection || '',
        }),
      ]}
      availableFilters={{
        searchPhrase: new FilterOption({
          uid: 'searchPhrase',
          label: 'Search Phrase',
          field: 'searchPhrase',
          type: 'text',
        }),
        ...(headings || [])
          .map((h) => new FilterOption({ ...h, uid: h.uid + '_filter', field: h.field || h.uid }))
          .reduce((acc, f) => {
            acc[f.uid] = f;
            return acc;
          }, {} as Record<string, FilterOption>),
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
            uid: 'label',
            label: 'Label',
            type: filterTypes.text,
          },
        ]
      }
    />
  </div>
);

SelectEntityPanel.propTypes = {
  currentSelection: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
  headings: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(Object.keys(filterTypes)).isRequired,
      value: PropTypes.any,
    })
  ).isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export interface IDataTableCellEntityProps<ResultType extends IDocument>
  extends ICellProps<IHeadingReference> {
  // cellData: string;
  // updateData: (data: null | ResultType) => void | ((data: null | ResultType[]) => void);
  columnData: {
    collection: string;
    type: EFilterType.reference;
    uid: Uid;
    label: string;
    headings: {
      uid: string;
      label: string;
      type: EFilterType;
    }[];
    searchFunction: TSearchAndSelectSearchFunction<ResultType>;
  };
}

/**
 * Data Cell Entity
 *
 * @param {*} {
 *   cellData,
 *   updateData,
 * }
 * @returns
 */
export const DataTableCellEntity = <ResultType extends IDocument = IDocument>({
  columnData: { collection, headings, searchFunction },
  cellData,
  updateData,
  rowId,
  columnId,
}: IDataTableCellEntityProps<ResultType>) => {
  const [editMode, setEditMode] = useState(false);

  const handleSelect = (data) => {
    updateData(data, rowId, columnId);
    setEditMode(false);
  };
  return (
    <div className="dataTableCellData dataTableCellData-select">
      {editMode && (
        <PopupPanel
          id="datatableCellPopup"
          title="Data Table Cell Popup"
          isOpen={editMode}
          handleClose={() => setEditMode(false)}
        >
          <SelectEntityPanel
            currentSelection={cellData}
            collection={collection}
            headings={headings}
            handleSubmit={handleSelect}
            searchFunction={searchFunction}
          />
        </PopupPanel>
      )}
      {!editMode && (
        <button type="button" className="button-reset" onClick={() => setEditMode(true)}>
          {cellData?.label}
        </button>
      )}
    </div>
  );
};

DataTableCellEntity.propTypes = {
  cellData: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.shape({
    // uid: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
  })]),
  updateData: PropTypes.func.isRequired,
  columnData: PropTypes.shape({
    collection: PropTypes.string.isRequired,
    headings: PropTypes.arrayOf(
      PropTypes.shape({
        uid: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.oneOf(filterTypesList).isRequired,
      })
    ),
  }).isRequired,
};

DataTableCellEntity.defaultProps = {
  cellData: 0,
};

export default DataTableCellEntity;
