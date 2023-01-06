import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { TComponentMap, THeading } from '@form-extendable/lib';
import {
  CustomParser,
  ISearchAndSelectProps,
  SearchAndSelect,
} from '@react_db_client/components.search-and-select';
import { AreYouSureBtn } from '@react_db_client/components.are-you-sure-btn';
import {
  FilterObjectClass,
  FilterOption,
  IDocument,
  TAsyncCopyDocument,
  TAsyncDeleteDocument,
  TAsyncGetDocument,
  TAsyncGetDocuments,
  TAsyncPostDocument,
  TAsyncPutDocument,
  Uid,
} from '@react_db_client/constants.client-types';
import {
  IItemEditorProps,
  ItemEditor as ItemEditorDefault,
} from '@react_db_client/components.item-editor';
import { AsyncRequestError, useAsyncRequest } from '@react_db_client/async-hooks.use-async-request';
import { Emoji } from '@react_db_client/components.emoji';
import { generateUid } from '@react_db_client/helpers.generate-uid';
import { IHeading as StyledSelectListHeading } from '@react_db_client/components.styled-select-list';
import { GenericCatalogueError } from './error-handling';

export type TResultHeading<V> = THeading<V> & StyledSelectListHeading;

export interface IGenericCatalogueProps<ResultType extends IDocument> {
  id: Uid;
  itemName: string;
  collection: string;
  additionalFilters?: FilterObjectClass[];
  customSort?: (a: ResultType, b: ResultType) => -1 | 0 | 1;
  resultsHeadings: TResultHeading<unknown>[];
  editorHeadings: THeading<unknown>[];
  additionalSaveData?: Partial<ResultType>;
  availableFilters: { [key: string]: FilterOption<any, boolean> };
  ItemEditor: React.FC<IItemEditorProps<ResultType>>;
  errorCallback?: (e: AsyncRequestError | GenericCatalogueError) => void;
  notificationDispatch: (message: string) => void;
  customParsers?: { [k: string]: CustomParser };
  previewHeadings?: THeading<unknown>[];
  asyncGetDocument: TAsyncGetDocument<ResultType>;
  asyncPutDocument: TAsyncPutDocument<ResultType>;
  asyncPostDocument: TAsyncPostDocument<ResultType>;
  asyncGetDocuments: TAsyncGetDocuments<ResultType>;
  asyncDeleteDocument: TAsyncDeleteDocument;
  asyncCopyDocument: TAsyncCopyDocument<ResultType>;
  componentMap: TComponentMap;
  closePopupOnItemSave?: boolean;
  sasProps?: Partial<ISearchAndSelectProps<ResultType>>;
}

/**
 * Generic catalogue wrapper for searching and editing documents from the api
 */
export const GenericCatalogue = <ResultType extends IDocument>({
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
  sasProps,
}: IGenericCatalogueProps<ResultType>) => {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedUid, setSelectedUid] = useState<Uid | null>(null);
  const [reloadDatakey, setReloadDataKey] = useState(0);
  const [handleDelete, setHandleDelete] = useState(false);

  /* Handle Delete */
  useEffect(() => {
    if (handleDelete && selectedUid) {
      setHandleDelete(false);
      asyncDeleteDocument(collection, selectedUid)
        .then(() => {
          setReloadDataKey((prev) => prev + 1);
        })
        .catch((e) => {
          if (errorCallback)
            errorCallback(new GenericCatalogueError(`Error deleting ${itemName}`, e));
        });
    }
  }, [handleDelete, selectedUid, errorCallback, collection, itemName]);

  const handleSasSelect = useCallback((data?: ResultType | null) => {
    if (data) setSelectedUid(data.uid);
    else setSelectedUid(null);
  }, []);

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
  const { call: copyItem } = useAsyncRequest<void, any[]>({
    args: [],
    callFn: asyncCopyDocument as any,
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
    (data: ResultType) => {
      notificationDispatch(`${itemName} saved`);
      setSelectedUid(data.uid);
      if (closePopupOnItemSave) setShowEditor(false);
      setReloadDataKey((prev) => prev + 1);
    },
    [itemName]
  );

  const handleCloseItemEditor = React.useCallback(() => {
    setShowEditor(false);
  }, []);

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
          onCancel={handleCloseItemEditor}
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
            handleSelect={handleSasSelect}
            headings={resultsHeadings}
            previewHeadings={previewHeadings || resultsHeadings}
            customParsers={customParsers}
            autoUpdate
            showRefreshBtn
            showSearchField
            loadOnInit={false}
            noEmptySearch
            allowSelectionPreview
            {...sasProps}
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
              confirmMessage={`Delete ${itemName}`}
              disabled={selectedUid === null}
              btnText={<Emoji emoj="🗑️" label="Delete" />}
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
  // asyncDeleteDocuments: PropTypes.func.isRequired,
  asyncGetDocument: PropTypes.func.isRequired,
  asyncPutDocument: PropTypes.func.isRequired,
  asyncPostDocument: PropTypes.func.isRequired,
  asyncDeleteDocument: PropTypes.func.isRequired,
  componentMap: PropTypes.objectOf(PropTypes.elementType).isRequired,
  errorCallback: PropTypes.func,
  closePopupOnItemSave: PropTypes.bool,
};

GenericCatalogue.defaultProps = {
  additionalFilters: [],
  additionalSaveData: {},
  customSort: null,
  previewHeadings: [],
  customParsers: {},
  ItemEditor: ItemEditorDefault,
  PopupPanel: () => {},
  notificationDispatch: alert,
  errorCallback: () => {},
  closePopupOnItemSave: false,
};
