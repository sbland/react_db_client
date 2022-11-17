import React, { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useAsyncObjectManager } from '@react_db_client/async-hooks.use-async-object-manager';
import { Form, FormField } from '@form-extendable/component';
import { mapFields } from './field-mapper';

/**
 *  A form component wrapper that manages item state updates and api calls
 */
export const ItemEditor = ({
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
}) => {
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
    <div className="itemEditor_wrap">
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
