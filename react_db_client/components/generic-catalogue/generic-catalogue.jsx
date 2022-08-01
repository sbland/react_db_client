import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { SearchAndSelect } from '@react_db_client/components.search-and-select';
import { AreYouSureBtn } from '@react_db_client/components.are-you-sure-btn';
import { ItemEditor as _ItemEditor } from '@react_db_client/components.item-editor';
import { useAsyncRequest } from '@react_db_client/async-hooks.use-async-request';
import { Emoji } from '@react_db_client/components.emoji';
import { generateUid } from '@react_db_client/helpers.generate-uid';

/**
 * Generic catalogue wrapper for searching and editing documents from the api
 * @param id
 * @param itemName
 * @param collection
 * @param additionalFilters
 * @param customSort
 * @param resultsHeadings
 * @param editorHeadings
 * @param additionalSaveData
 * @param availableFilters
 * @param ItemEditor
 * @param errorCallback
 * @param PopupPanel
 * @param notificationDispatch
 * @param customParsers
 * @param previewHeadings
 * @param componentMap Map of field component for item editor
 * @param {async function} asyncGetDocument async function to get a document
 * - @argument { string } collection target database collection
 * - @argument { string } uid id of document
 * - @argument { Array[string] } schema fields to request from db
 * - @argument { bool } populate if true populate nested docs
 * @param {async function} asyncGetDocuments async function to search for multiple documents
 * - @argument { string } collection target database collection
 * - @argument { List[FilterObjectClass] } filters list of filters to apply to search
 * - @argument { List[string] } schema list of fields to request
 * - @argument { string } sortBy Field to sort by
 * - @argument { string } textsearch string to use for text(Keyword) searching
 * - @argument { bool } reverseSort if true reverse sorting
 * - @argument { bool } populate if true populate nested docs
 * @param {async function} asyncPutDocument async function to update a document
 * - @argument { string } collection target database collection
 * - @argument { string } uid id of document
 * - @argument { object } data data to upload
 * @param {async function} asyncPostDocument async function to add a new document
 * - @argument { string } collection target database collection
 * - @argument { string } uid id of document
 * - @argument { object } data data to upload
 * @param {async function} asyncDeleteDocument async function to delete a document
 * - @argument { string } collection target database collection
 * - @argument { string } uid id of document
 * @param {async function} asyncCopyDocument async function to copy a document
 * - @argument { string } fromCollection db collection to copy from
 * - @argument { string } fromUid db uid to copy
 * - @argument { string } toCollection db collection to copy to
 * - @argument { string } toUid new document id
 * - @argument { object } additionalData additional data to add to copied doc
 * @returns
 */
export const GenericCatalogue = ({
  id,
  itemName,
  collection,
  additionalFilters,
  customSort,
  resultsHeadings,
  editorHeadings,
  additionalSaveData,
  availableFilters,
  ItemEditor,
  errorCallback,
  PopupPanel,
  notificationDispatch,
  customParsers,
  previewHeadings,
  asyncGetDocument,
  asyncGetDocuments,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
  asyncCopyDocument,
  componentMap,
  closePopupOnItemSave,
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedUid, setSelectedUid] = useState(null);
  const [reloadDatakey, setReloadDataKey] = useState(0);
  const [handleDelete, setHandleDelete] = useState(false);

  /* Handle Delete */
  useEffect(() => {
    if (handleDelete) {
      setHandleDelete(false);
      asyncDeleteDocument(collection, selectedUid)
        .then(() => {
          setReloadDataKey((prev) => prev + 1);
        })
        .catch((e) => {
          errorCallback(`Error deleting ${itemName}`, e);
        });
    }
  }, [handleDelete, selectedUid, errorCallback, collection, itemName]);

  const duplicateCallback = useCallback(
    (_, [, , , toUid]) => {
      setReloadDataKey((prev) => prev + 1);
      notificationDispatch(`Successfully Copied ${itemName}`);
      setSelectedUid(toUid);
      setShowEditor(true);
    },
    [notificationDispatch, itemName]
  );

  /* Handle Duplicate */
  const { call: copyItem } = useAsyncRequest({
    args: [],
    callFn: asyncCopyDocument,
    callOnInit: false,
    callback: duplicateCallback,
  });

  const handleDuplicate = (uid) => {
    const fromCollection = collection;
    const fromUid = uid;
    const toCollection = collection;
    const toUid = generateUid(collection);
    const additionalData = { label: toUid };
    copyItem([fromCollection, fromUid, toCollection, toUid, additionalData]);
  };

  /* Handle Search */

  const searchFn = useCallback(
    async (filters, sortBy, searchString) => {
      const sortByA = sortBy || 'label';
      const docs = await asyncGetDocuments(
        collection,
        filters,
        // TODO: Filter preview only headings out
        resultsHeadings.map((item) => item.uid),
        sortByA,
        searchString,
        false,
        'all'
      );
      if (customSort) return docs.sort(customSort);
      return docs;
    },
    [collection, resultsHeadings]
  );

  const onSubmitCallback = useCallback(
    (uid) => {
      notificationDispatch(`${itemName} saved`);
      setSelectedUid(uid);
      if (closePopupOnItemSave) setShowEditor(false);
      setReloadDataKey((prev) => prev + 1);
    },
    [itemName]
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
          onSubmitCallback={onSubmitCallback}
          asyncGetDocument={asyncGetDocument}
          asyncPutDocument={asyncPutDocument}
          asyncPostDocument={asyncPostDocument}
          asyncDeleteDocument={asyncDeleteDocument}
          componentMap={componentMap}
          saveErrorCallback={errorCallback}
          onCancel={() => setShowEditor(false)}
          id={`item_editor_${id}`}
        />
      )}
      <div className={`genericCatalogueFunc_Wrap sectionWrapper genericCatalogue_${id}`}>
        <section>
          <button
            type="button"
            className="button-two genericCatalogue_createNewBtn"
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
            headings={resultsHeadings}
            previewHeadings={previewHeadings || resultsHeadings}
            customParsers={customParsers}
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
              className="button-two genericCatalogue_editSelectedBtn"
              onClick={() => setShowEditor(true)}
              disabled={selectedUid === null}
            >
              Edit Selected {itemName}
            </button>
            <button
              type="button"
              className="button-one genericCatalogue_duplicateSelectedBtn"
              onClick={() => handleDuplicate(selectedUid)}
              disabled={selectedUid === null}
            >
              Duplicate Selected {itemName}
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
  id: PropTypes.string.isRequired,
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
  customSort: PropTypes.func,
  customParsers: PropTypes.objectOf(PropTypes.func),
  resultsHeadings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  editorHeadings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  previewHeadings: PropTypes.arrayOf(PropTypes.shape({})),
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
  PopupPanel: PropTypes.elementType,
  notificationDispatch: PropTypes.func,
  asyncGetDocuments: PropTypes.func.isRequired,
  asyncDeleteDocuments: PropTypes.func.isRequired,
  asyncGetDocument: PropTypes.func.isRequired,
  asyncGetDocuments: PropTypes.func.isRequired,
  asyncPutDocument: PropTypes.func.isRequired,
  asyncPostDocument: PropTypes.func.isRequired,
  asyncDeleteDocument: PropTypes.func.isRequired,
  componentMap: PropTypes.objectOf(PropTypes.elementType),
  errorCallback: PropTypes.func,
  closePopupOnItemSave: PropTypes.bool,
};

GenericCatalogue.defaultProps = {
  additionalFilters: [],
  additionalSaveData: {},
  customSort: null,
  previewHeadings: [],
  customParsers: {},
  ItemEditor: _ItemEditor,
  PopupPanel: () => {},
  notificationDispatch: alert,
  componentMap: {},
  errorCallback: () => {},
  closePopupOnItemSave: false,
};
