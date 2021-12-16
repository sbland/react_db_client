import React from 'react';
import { filterTypes } from '@samnbuk/react_db_client.constants.client-types';

import { FieldText } from '@samnbuk/react_db_client.components.form.form-fields.field-text';
import { FieldTextArea } from '@samnbuk/react_db_client.components.form.form-fields.field-text-area';
import { FieldBool } from '@samnbuk/react_db_client.components.form.form-fields.field-bool';
import { FieldDate } from '@samnbuk/react_db_client.components.form.form-fields.field-date';
import { FieldNumber } from '@samnbuk/react_db_client.components.form.form-fields.field-number';
import { FieldObjectRef } from '@samnbuk/react_db_client.components.form.form-fields.field-object-ref';
import { FieldMultiSelect } from '@samnbuk/react_db_client.components.form.form-fields.field-multi-select';
import { FieldSelect } from '@samnbuk/react_db_client.components.form.form-fields.field-select';
import { FieldSelectSearch } from '@samnbuk/react_db_client.components.form.form-fields.field-select-search';
import { FieldFile } from '@samnbuk/react_db_client.components.form.form-fields.field-file';
import { FieldReadOnly } from '@samnbuk/react_db_client.components.form.form-fields.field-read-only';

const readOnlyWrap = (Component) => (props) =>
  props.readOnly ? <FieldReadOnly {...props} /> : <Component {...props} />;

export const defaultComponentMap = ({ asyncGetDocuments, fileServerUrl } = {}) => ({
  [filterTypes.text]: () => readOnlyWrap(FieldText),
  [filterTypes.select]: () => readOnlyWrap(FieldSelect),
  [filterTypes.selectMulti]: () => readOnlyWrap(FieldMultiSelect),
  // [filterTypes.fileMultiple]: () => readOnlyWrap(FieldFile),
  [filterTypes.file]: () =>
    readOnlyWrap((props) => (
      <FieldFile {...props} fileServerUrl={fileServerUrl} asyncGetDocuments={asyncGetDocuments} />
    )),
  // [filterTypes.image]: () => readOnlyWrap(FieldFile),
  [filterTypes.textLong]: () => readOnlyWrap(FieldTextArea),
  [filterTypes.number]: () => readOnlyWrap(FieldNumber),
  [filterTypes.date]: () => readOnlyWrap(FieldDate),
  [filterTypes.bool]: () => readOnlyWrap(FieldBool),
  [filterTypes.toggle]: () => readOnlyWrap(FieldBool),
  [filterTypes.selectSearch]: () => readOnlyWrap(FieldSelectSearch),
  [filterTypes.reference]: () =>
    readOnlyWrap((props) => <FieldObjectRef {...props} asyncGetDocuments={asyncGetDocuments} />),
});
