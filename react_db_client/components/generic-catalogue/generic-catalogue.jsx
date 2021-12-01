import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { SearchAndSelect } from '@samnbuk/react_db_client.components.search-and-select';
import { AreYouSureBtn } from '@samnbuk/react_db_client.components.are-you-sure-btn';
import { ItemEditor as _ItemEditor } from '@samnbuk/react_db_client.components.item-editor';
import { Emoji } from '@samnbuk/react_db_client.components.emoji';


export const GenericCatalogue = ({
  itemName,
  collection,
  additionalFilters,
  resultsHeadings,
  editorHeadings,
  additionalSaveData,
  availableFilters,
  ItemEditor,
  errorCallback,
  apiGetDocuments,
  apiDeleteDocument,
  PopupPanel,
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedUid, setSelectedUid] = useState(null);
  const [reloadDatakey, setReloadDataKey] = useState(0);
  const [handleDelete, setHandleDelete] = useState(false);

  // const { call: copySet } = useAsyncRequest({
  //   args: [],
  //   callFn: apiCopyDocument,
  //   callOnInit: false,
  //   callback: () => {
  //     setReloadDataKey((prev) => prev + 1);
  //     alert('Successfully Copied Set');
  //   },
  // });

  useEffect(() => {
    if (handleDelete) {
      setHandleDelete(false);
      apiDeleteDocument(collection, selectedUid)
        .then(() => {
          setReloadDataKey((prev) => prev + 1);
        })
        .catch(() => {
          errorCallback(`Error deleting ${itemName}`, 'error');
        });
    }
  }, [handleDelete, selectedUid, errorCallback, collection, itemName]);

  // TODO: Implement duplicate
  // const handleDuplicate = (uid) => {
  //   const fromCollection = COLLECTION;
  //   const fromUid = uid;
  //   const toCollection = COLLECTION;
  //   const toUid = generateUid(COLLECTION);
  //   const additionalData = { label: toUid };
  //   copySet([fromCollection, fromUid, toCollection, toUid, additionalData]);
  // };

  const searchFn = useCallback(
    async (filters, sortBy, searchString) => {
      const filtersModified = [...additionalFilters, ...filters];
      const sortByA = sortBy || 'label';
      const docs = await apiGetDocuments(
        collection,
        filtersModified,
        // TODO: Filter preview only headings out
        resultsHeadings.map((item) => item.uid),
        sortByA,
        searchString,
        false,
        'all'
      );
      return docs;
    },
    [collection, additionalFilters, resultsHeadings]
  );

  return (
    <>
      {showEditor && (
        <ItemEditor
          inputUid={selectedUid}
          isNew={!selectedUid && true}
          additionalData={additionalSaveData}
          params={editorHeadings}
          collection={collection}
          onSubmitCallback={(uid) => {
            notificationDispatch(openMessage(`${itemName} saved`));
            setSelectedUid(uid);
            setShowEditor(false);
            setReloadDataKey(reloadDatakey + 1);
          }}
        />
      )}
      <div className="GenericCatalogueFunc_Wrap sectionWrapper">
        <section>
          <button
            type="button"
            className="button-two"
            onClick={() => {
              setSelectedUid(null);
              setShowEditor(true);
            }}
          >
            Create New {itemName}
          </button>
        </section>
        <section style={{ width: '100%' }}>
          <p>
            <b>Adjust the filters below to search for {itemName}s</b>
          </p>
          <SearchAndSelect
            key={reloadDatakey}
            searchFunction={searchFn}
            initialFilters={additionalFilters}
            availableFilters={availableFilters}
            handleSelect={setSelectedUid}
            // TODO: Filter preview only headings
            headings={resultsHeadings}
            previewHeadings={resultsHeadings}
            autoWidth={false}
            autoUpdate
            showRefreshBtn
            showSearchField
            loadOnInit={false}
            noEmptySearch
            allowSelectionPreview
          />
          <div>
            <button
              type="button"
              onClick={() => setShowEditor(true)}
              disabled={selectedUid === null}
            >
              Edit Selected {itemName}
            </button>
            <AreYouSureBtn
              onConfirmed={() => {
                setHandleDelete(true);
              }}
              message={`Delete ${itemName}`}
              disabled={selectedUid === null}
              btnText={<Emoji emoj="🗑️" label="Delete" />}
              PopupPanel={PopupPanel}
            />
          </div>
        </section>
      </div>
    </>
  );
};

GenericCatalogue.propTypes = {
  itemName: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
  additionalFilters: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
      operator: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  resultsHeadings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  editorHeadings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  additionalSaveData: PropTypes.shape({}),
  availableFilters: PropTypes.objectOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      required: PropTypes.bool,
      group: PropTypes.number,
    })
  ).isRequired,
  ItemEditor: PropTypes.elementType,
  apiGetDocuments: PropTypes.func.isRequired,
  apiDeleteDocuments: PropTypes.func.isRequired,
  PopupPanel: PropTypes.elementType,
};

GenericCatalogue.defaultProps = {
  additionalFilters: [],
  additionalSaveData: {},
  ItemEditor: _ItemEditor,
  PopupPanel: () => {},
};
