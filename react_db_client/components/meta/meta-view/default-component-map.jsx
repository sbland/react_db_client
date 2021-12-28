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

const viewModeWrap = (Component) => (props) =>
  props.viewMode === 'edit' ? <Component {...props} /> : <FieldReadOnly {...props} />;

const NotImplemented = ({ type }) => <div>NOT IMPLEMENTED {type}</div>;

// TODO: add other field types
// TODO: Check image and file types work

export const defaultComponentMap = ({ asyncGetDocuments, fileServerUrl } = {}) => ({
  [filterTypes.text]: () => viewModeWrap(readOnlyWrap(FieldText)),
  [filterTypes.select]: () => viewModeWrap(readOnlyWrap(FieldSelect)),
  [filterTypes.selectMulti]: () => viewModeWrap(readOnlyWrap(FieldMultiSelect)),
  // [filterTypes.fileMultiple]: () => viewModeWrap(readOnlyWrap(FieldFile)),
  [filterTypes.file]: () =>
    viewModeWrap(
      readOnlyWrap((props) => (
        <FieldFile {...props} fileServerUrl={fileServerUrl} asyncGetDocuments={asyncGetDocuments} />
      ))
    ),
  // [filterTypes.image]: () => viewModeWrap(readOnlyWrap(FieldFile)),
  [filterTypes.textLong]: () => viewModeWrap(readOnlyWrap(FieldTextArea)),
  [filterTypes.number]: () => viewModeWrap(readOnlyWrap(FieldNumber)),
  [filterTypes.date]: () => viewModeWrap(readOnlyWrap(FieldDate)),
  [filterTypes.bool]: () => viewModeWrap(readOnlyWrap(FieldBool)),
  [filterTypes.toggle]: () => viewModeWrap(readOnlyWrap(FieldBool)),
  [filterTypes.selectSearch]: () => viewModeWrap(readOnlyWrap(FieldSelectSearch)),
  [filterTypes.reference]: () =>
    viewModeWrap(
      readOnlyWrap((props) => <FieldObjectRef {...props} asyncGetDocuments={asyncGetDocuments} />)
    ),
  [filterTypes.video]: () => NotImplemented,
  'related': () => NotImplemented,
});


/* Old Field Types */
// export const getFieldComponent = (fieldName) => {
//   switch (fieldName) {
//     // TODO: Manage array types
//     case 'arrayTable': return FieldValueArrayTable;
//     case 'date': return FieldValueDate;
//     case 'files':
//     case 'document': return FieldValueDocumentMultiple;
//     case 'image': return FieldValueImage;
//     case 'locationCoordinates':
//     case 'location': return FieldValueLocation;
//     case 'float':
//     case 'integer':
//     case 'number': return FieldValueNumber;
//     case 'link': return FieldValueObjectArray;
//     case 'select': return FieldValueSelect;
//     // case 'string': return FieldValueShortText;
//     case 'text': return FieldValueShortText;
//     case 'bool': return FieldValueToggle;
//     case 'video-embed': return FieldValueVideoEmbed;
//     case 'longText': return FieldValueWysiwyg;
//     case 'childObjects':
//     case 'searchRelated':
//     case 'search': return FieldValueSearch;
//     default: return null;
//   }
// };
