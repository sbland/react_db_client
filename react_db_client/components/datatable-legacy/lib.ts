import { EFilterType, Uid, ILabelled, EComparisons } from '@react_db_client/constants.client-types';

export interface IHeading {
  uid: Uid;
  label: string;
  type: EFilterType | string;
  natural?: boolean;
  readOnly?: boolean;
  showTotals?: boolean;
  isCustomType?: boolean;
  styleRule?: string;
  unique?: boolean;
  required?: boolean;
  hidden?: boolean;
  defaultValue?: any;
  field?: Uid;
  validationRules?: (string | ((value: any, tableData: IRow) => [boolean, string]))[];
  validationMessage?: string;
  validationType?: EValidationType;
}

export interface IHeadingNumber extends IHeading {
  max?: number;
  min?: number;
  step?: number;
  type: EFilterType.number;
}

export interface IHeadingButton extends IHeading {
  type: EFilterType.button;
  btnLabel?: string;
  action: (rowId: Uid, cellData: any, rowData: IRow) => void;
}

export interface IHeadingEvaluate extends IHeading {
  type: EFilterType.number;
  evaluateType: EFilterType.number | EFilterType.text;
  expression: string;
  expressionReversed: string;
  operator: EComparisons;
  target: Uid;
  field: Uid;
  invert?: boolean;
}

export interface IHeadingSelect extends IHeading {
  type: EFilterType.select;
  options?: ILabelled[];
}

export interface IHeadingReference extends IHeading {
  type: EFilterType.reference;
  collection: string;
}

export interface IHeadingValidate extends IHeading {
  type: EFilterType.bool;
  evaluateType: EFilterType.number | EFilterType.text;
}

export interface IHeadingLink extends IHeading {
  type: 'link';
  to: string;
}

export interface IHeadingCustom extends IHeading {
  isCustomType: true;
  type: any;
}

export interface IHeadingCustomExample extends IHeadingCustom {
  expression: string;
}

export type THeading<T extends IHeadingCustom = never> =
  | IHeading
  | IHeadingNumber
  | IHeadingButton
  | IHeadingEvaluate
  | IHeadingValidate
  | IHeadingReference
  | IHeadingSelect
  | IHeadingLink
  | T;

export interface IRow {
  uid: Uid;
}

export interface ISortBy {
  heading: Uid;
  direction: boolean | 1 | -1;
  natural?: boolean; // if true uses natural string sorting. I.e 9,10,11 instead of 10,11,9
  map?: Uid[]; // custom sort order as list of ids in order
  type?: EFilterType;
}

export interface ICellProps<HeadingType extends IHeading> {
  columnData: HeadingType;
  updateData: (value: any, rowId: Uid, columnId: Uid) => void;
  rowId: Uid;
  rowIndex: number;
  classNames?: string;
  focused: boolean;
  editMode: boolean;
  cellData: any;
  rowData: IRow;
  acceptValue: (value: any) => void;
  resetValue: () => void;
  columnId: Uid;
  cellDataBtnRef: React.RefObject<HTMLButtonElement>;
  customFieldComponents?: { [key: string]: (props: ICellProps<HeadingType>) => JSX.Element };
  isDisabled?: boolean;
  // accept;
}

export interface ICellData<RowType extends IRow = IRow, HeadingType extends IHeading = THeading> {
  className: string;
  tableData: RowType[];
  headingsData: HeadingType[];
  handleValueAccept: (value: any, rowId: Uid, rowIndex: number, columnId: Uid) => void;
  handleValueChange: (value: any, rowId: Uid, rowIndex: number, columnId: Uid) => void;
  handleValueReset: (rowId: Uid, rowIndex: number, columnId: Uid) => void;
  handleDeleteRow: (rowId: Uid, rowIndex: number) => void;
  handleMoveFocusToTargetRow: (rowIndex: number, columnIndex: number) => void;
  handleEditPanelBtnClick: (rowId: Uid, columnId: Uid) => void;
  handleRemoveFromSelection: (rowId: Uid, rowIndex: number) => void;
  handleAddToSelection: (rowId: Uid, rowIndex: number) => void;
  rowSelectionState: boolean[];
  currentFocusedRow: Uid;
  currentFocusedColumn: Uid;
  navigationMode: boolean;
  setNavigationMode: (value: boolean) => void;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  customFieldComponents: { [key: string]: (props: ICellProps<HeadingType>) => JSX.Element };
  disabled: boolean;
  invalidRowsMessages: { text: string }[];
}

export enum EValidationType {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
}

export enum ESaveAction {
  ROW_CHANGED = 'rowChanged',
  ROW_DELETED = 'rowDeleted',
  SAVE_BTN_CLICKED = 'saveBtnClicked',
  ROW_ADDED = 'rowAdded',
}

export const SAVE_ACTIONS = {
  ROW_CHANGED: 'rowChanged',
  ROW_DELETED: 'rowDeleted',
  SAVE_BTN_CLICKED: 'saveBtnClicked',
  ROW_ADDED: 'rowAdded',
};
