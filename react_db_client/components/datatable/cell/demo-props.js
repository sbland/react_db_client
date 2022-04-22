import { defaultComponentMap } from '@samnbuk/react_db_client.components.datatable.cell-types';
import {
  demoHeadingsData,
  demoTableData,
} from '@samnbuk/react_db_client.components.datatable.extras';

const DEMO_TABLE_DATA = Object.values(demoTableData);

export const handleValueAccept = () => console.log("handleValueAccept PLACEHOLDER");
export const handleValueChange = () => console.log("handleValueChange PLACEHOLDER");
export const handleValueReset = () => console.log("handleValueReset PLACEHOLDER");
// const handleDeleteRow = () => console.log("handleDeleteRow PLACEHOLDER");
export const handleMoveFocusToTargetCell = () => console.log("handleMoveFocusToTargetCell PLACEHOLDER");
// const handleEditPanelBtnClick = () => console.log("handleEditPanelBtnClick PLACEHOLDER");
// const handleAddToSelection = () => console.log("handleAddToSelection PLACEHOLDER");
// const handleRemoveFromSelection = () => console.log("handleRemoveFromSelection PLACEHOLDER");
export const setNavigationMode = () => console.log("setNavigationMode PLACEHOLDER");
export const setEditMode = () => console.log("setEditMode PLACEHOLDER");

export const placeholderMethods = {
  handleValueAccept,
  handleValueChange,
  handleValueReset,
  handleMoveFocusToTargetCell,
  setNavigationMode,
  setEditMode,
};

export const ROW_INDEX = 1;
export const COLUMN_INDEX = 1;
export const defaultProps = {
  columnIndex: COLUMN_INDEX,
  rowIndex: ROW_INDEX,
  style: {},
  className: '',
  headingsData: demoHeadingsData,
  methods: {
    handleValueAccept,
    handleValueChange,
    handleValueReset,
    // handleDeleteRow,
    handleMoveFocusToTargetCell,
    // handleEditPanelBtnClick,
    // handleAddToSelection,
    // handleRemoveFromSelection,
    setNavigationMode,
    setEditMode,
  },
  tableState: {
    tableData: DEMO_TABLE_DATA,
    currentFocusedRow: 0,
    currentFocusedColumn: 0,
    navigationMode: true,
    editMode: false,
  },
  // rowSelectionState: [],
  componentMap: defaultComponentMap(),
};
