import React from 'react';
import { filterTypes } from '@samnbuk/react_db_client.constants.client-types';

import {
  DataTableCellText,
  DataTableCellNumber,
  DataTableCellLink,
  DataTableCellButton,
  DataTableCellSelect,
  DataTableCellToggle,
  DataTableCellReadOnly,
} from '@samnbuk/react_db_client.components.datatable.cell-types';

// TODO: Implement readonlywrap
// const readOnlyWrap = (Component) => (props) =>
//   props.readOnly ? <FieldReadOnly {...props} /> : <Component {...props} />;

export const defaultComponentMap = ({ asyncGetDocuments, fileServerUrl } = {}) => ({
  [filterTypes.textLong]: () => (props) => <DataTableCellText {...props} />,
  [filterTypes.text]: () => (props) => <DataTableCellText {...props} />,
  [filterTypes.number]: () => (props) => <DataTableCellNumber {...props} />,
  [filterTypes.link]: () => (props) => <DataTableCellLink {...props} />,
  [filterTypes.button]: () => (props) => <DataTableCellButton {...props} />,
  // TODO: Reimplement popup cell type
  // popup: () => (props) => <DataTableCellPopup {...props} />,
  // TODO: SelectMulti
  [filterTypes.select]: () => (props) => <DataTableCellSelect {...props} />,
  // TODO: Reimplement entity cell type
  // entity: () => (props) => <DataTableCellEntity {...props} />,
  [filterTypes.toggle]: () => (props) => <DataTableCellToggle {...props} />,
  [filterTypes.bool]: () => (props) => <DataTableCellToggle {...props} />,
});
