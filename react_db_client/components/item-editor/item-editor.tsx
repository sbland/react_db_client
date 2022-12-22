import React, { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useAsyncObjectManager } from '@react_db_client/async-hooks.use-async-object-manager';
import { Form, FormField } from '@form-extendable/component';
import { TComponentMap, THeading } from '@form-extendable/lib';

import {
  IDocument,
  ILabelled,
  TAsyncDeleteDocument,
  TAsyncGetDocument,
  TAsyncPostDocument,
  TAsyncPutDocument,
  Uid,
} from '@react_db_client/constants.client-types';
import { mapFields } from './field-mapper';

export interface IParam extends ILabelled {}
export type TFieldComponent = unknown;

export interface IItemEditorProps<ResultType extends IDocument> {
  id: Uid;
  inputUid?: Uid | null;
  isNew: boolean;
  onSubmitCallback: (uid: Uid) => void;
  additionalData?: Partial<ResultType>;
  params: THeading<unknown>[];
  collection: string;
  asyncGetDocument: TAsyncGetDocument<ResultType>;
  asyncPutDocument: TAsyncPutDocument<ResultType>;
  asyncPostDocument: TAsyncPostDocument<ResultType>;
  asyncDeleteDocument: TAsyncDeleteDocument;
  componentMap: TComponentMap;
  saveErrorCallback?: (message: string, e: Error) => void;
  onCancel?: () => void;
}

/**
 *  A form component wrapper that manages item state updates and api calls
 */
export const ItemEditor = <ResultType extends IDocument>({
  // REACT
  id,
  inputUid,
  isNew,
  onSubmitCallback,
  additionalData,
  params,
  collection,
  asyncGetDocument,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
  componentMap,
  saveErrorCallback,
}: IItemEditorProps<ResultType>) => {
  const [overridenFields, setOverridenFields] = useState<string[]>([]);

  const {
    saveData,
    updateFormData: updateField,
    data,
    uid,
    initialData,
  } = useAsyncObjectManager({
    activeUid: inputUid,
    collection,
    isNew: !inputUid || isNew,
    inputAdditionalData: additionalData,
    onSavedCallback: onSubmitCallback,
    loadOnInit: true,
    asyncGetDocument,
    asyncPutDocument,
    asyncPostDocument,
    asyncDeleteDocument,
    // TODO: We should have all delete error callback
    saveErrorCallback,
  });

  const mappedFields = useMemo(
    () => mapFields(params, overridenFields, uid, collection),
    [params, overridenFields, uid, collection]
  );

  const handleUpdate = useCallback(
    (field, value) => {
      setOverridenFields((prev) => {
        const hasChanged =
          (value && !initialData) ||
          (value && !initialData[field]) ||
          (value && initialData && value !== initialData[field]) ||
          (!value && initialData[field]);
        const newSet = new Set([...prev, field]);
        if (!hasChanged) newSet.delete(field);
        return Array.from(newSet);
      });
      updateField(field, value);
    },
    [initialData, updateField]
  );

  const handleOnChange = useCallback(
    (field, value) => {
      handleUpdate(field, value);
    },
    [handleUpdate]
  );

  const classNames = [id].filter((f) => f).join(' ');

  return (
    <div className="itemEditor_wrap" data-testid="rdc-itemEditor">
      <div className={`sectionWrapper ${classNames}`}>
        <Form
          formDataInitial={data}
          headings={mappedFields}
          onSubmit={saveData}
          onChange={handleOnChange}
          showEndBtns
          submitBtnText="Save Item"
          componentMap={componentMap}
          FormField={FormField}
        />
      </div>
    </div>
  );
};

ItemEditor.propTypes = {
  id: PropTypes.string.isRequired,
  inputUid: PropTypes.string,
  onSubmitCallback: PropTypes.func.isRequired,
  isNew: PropTypes.bool,
  additionalData: PropTypes.shape({}),
  collection: PropTypes.string.isRequired,
  params: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      // type: PropTypes.oneOf(Object.keys(filterTypes)),
      required: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          uid: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  asyncGetDocument: PropTypes.func.isRequired, // Async func
  asyncPutDocument: PropTypes.func.isRequired, // Async func
  asyncPostDocument: PropTypes.func.isRequired, // Async func
  asyncDeleteDocument: PropTypes.func.isRequired, // Async func
  componentMap: PropTypes.objectOf(PropTypes.elementType).isRequired,
  saveErrorCallback: PropTypes.func,
};

ItemEditor.defaultProps = {
  inputUid: null,
  additionalData: {},
  isNew: false,
  componentMap: {},
  saveErrorCallback: () => {},
};