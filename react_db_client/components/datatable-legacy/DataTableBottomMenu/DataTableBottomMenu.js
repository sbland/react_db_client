import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Emoji } from '@react_db_client/components.emoji';

import { DataTableContext } from '../DataTableConfig/DataTableConfig';

const DataTableBottomMenu = ({
  unsavedChanges,
  handleSaveBtnClick,
  handleResetBtnClick,
  handleAddRowBtnClick,
  handleShowPreviewBtnClick,
  previewShown,
}) => {
  const { allowAddRow, allowSelectionPreview, showSaveBtns } = useContext(DataTableContext);
  return (
    <div className="dataTableBottomMenu">
      {showSaveBtns && (
        <>
          <button
            type="button"
            disabled={!unsavedChanges}
            className="button-two saveBtn"
            onClick={handleSaveBtnClick}
            style={{ width: '2rem' }}
          >
            <Emoji emoj="💾" label="Save" />
          </button>
          <button
            type="button"
            disabled={!unsavedChanges}
            className="button-one resetBtn"
            onClick={handleResetBtnClick}
            style={{ width: '2rem' }}
          >
            <Emoji emoj="❌" label="Reset" />
          </button>
        </>
      )}
      {allowAddRow && (
        <button type="button" className="button-one addRowBtn" onClick={handleAddRowBtnClick}>
          Add row
        </button>
      )}
      {allowSelectionPreview && (
        <button
          type="button"
          className={previewShown ? 'button-two' : 'button-one'}
          onClick={handleShowPreviewBtnClick}
        >
          Show Preview
        </button>
      )}
    </div>
  );
};

DataTableBottomMenu.propTypes = {
  unsavedChanges: PropTypes.bool.isRequired,
  handleSaveBtnClick: PropTypes.func.isRequired,
  handleResetBtnClick: PropTypes.func.isRequired,
  handleAddRowBtnClick: PropTypes.func.isRequired,
  handleShowPreviewBtnClick: PropTypes.func.isRequired,
  previewShown: PropTypes.bool.isRequired,
};

export default DataTableBottomMenu;
