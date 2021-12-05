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

export const defaultComponentMap = {
  [filterTypes.text]: () => FieldText,
  [filterTypes.select]: () => FieldSelect,
  [filterTypes.selectMulti]: () => FieldMultiSelect,
  // [filterTypes.fileMultiple]: () => FieldFile,
  // [filterTypes.file]: () => FieldFile,
  // [filterTypes.image]: () => FieldFile,
  [filterTypes.textLong]: () => FieldTextArea,
  [filterTypes.number]: () => FieldNumber,
  [filterTypes.date]: () => FieldDate,
  [filterTypes.bool]: () => FieldBool,
  [filterTypes.toggle]: () => FieldBool,
  [filterTypes.selectSearch]: () => FieldSelectSearch,
  // [filterTypes.reference]: () => FieldObjectRef,
};
