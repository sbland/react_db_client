import React from 'react';
import PropTypes from 'prop-types';
import {Emoji} from '@samnbuk/react_db_client.components.emoji';
// import { formatForView } from '../../helpers/formatDates';

// TODO: Add date formatter.
const formatForView = (a) => a;

export const ViewObjectTopMenuItem = ({ emoji, text, className, handleOnClick, highlight }) => {
  return (
    <>
      <li className={`${className} viewObjectTopMenu_listItem`}>
        <button
          className={`${className} button_reset viewObjectTopMenu_listItemLink${
            highlight ? '-highlight' : ''
          }`}
          type="button"
          onClick={handleOnClick}
        >
          <Emoji emoj={emoji} label={text}/> <span>{text}</span>
        </button>
      </li>
    </>
  );
}
ViewObjectTopMenuItem.propTypes = {
  emoji: PropTypes.string,
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  handleOnClick: PropTypes.func.isRequired,
  highlight: PropTypes.bool,
};

ViewObjectTopMenuItem.defaultProps = {
  // handleOnClick: () => {},
  emoji: '',
  className: '',
  highlight: false,
};

export function ViewObjectTopMenuItemToggle({ emoji, text, altText, val, handleOnClick }) {
  const active = val ? 'active' : 'inActive';
  return (
    <>
      <li className="viewObjectTopMenu_listItem">
        <button
          className={`button_reset viewObjectTopMenu_listItemLink-${active}`}
          type="button"
          onClick={handleOnClick}
        >
          <Emoji emoj={emoji} />{' '}
          <span>
            {val && altText}
            {!val && text}
          </span>
        </button>
      </li>
    </>
  );
}
ViewObjectTopMenuItemToggle.propTypes = {
  emoji: PropTypes.string,
  text: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
  val: PropTypes.bool.isRequired,
  handleOnClick: PropTypes.func.isRequired,
};

ViewObjectTopMenuItemToggle.defaultProps = {
  emoji: '',
};

// Top menu bar that contains view mode switch, save/edit button and settings
const ViewModeMenu = ({
  viewSwitchFtn,
  handleSaveView,
  handleCancelEdit,
  handleDuplicateObject,
  handleDeleteObject,
  viewMode,
  unsavedChanges,
}) => {
  switch (viewMode) {
    case 'view':
      return (
        <>
          <li className="viewObjectTopMenu_listItem">
            <button
              className="button_reset viewObjectTopMenu_listItemLink"
              type="button"
              onClick={viewSwitchFtn}
            >
              {/* <Emoji emoj="📝" /> */} Edit View
            </button>
          </li>
          <li className="DISABLED viewObjectTopMenu_listItem">
            <button
              className="DISABLED button_reset viewObjectTopMenu_listItemLink"
              disabled
              type="button"
              onClick={handleDuplicateObject}
            >
              {/* <Emoji emoj="📋" /> */} Duplicate
            </button>
          </li>
          <li className="viewObjectTopMenu_listItem">
            <button
              className="button_reset viewObjectTopMenu_listItemLink"
              type="button"
              onClick={handleDeleteObject}
            >
              {/* <Emoji emoj="🗑️" /> */} Delete
            </button>
          </li>
        </>
      );
    case 'create':
    case 'edit':
      return (
        <>
          <li className="viewObjectTopMenu_listItem">
            <button
              className={`button_reset viewObjectTopMenu_listItemLink${
                unsavedChanges ? '-highlight' : ''
              }`}
              type="button"
              onClick={() => {
                viewSwitchFtn();
                handleSaveView();
              }}
            >
              <Emoji emoj="✔️" label="tick"/> Save
            </button>
          </li>
          <li className="viewObjectTopMenu_listItem">
            <button
              className="button_reset viewObjectTopMenu_listItemLink"
              type="button"
              onClick={() => {
                handleCancelEdit();
              }}
            >
              <Emoji emoj="❌" label="cross" /> Cancel
            </button>
          </li>
        </>
      );
    default:
      return 'Invalid view type';
  }
};

ViewModeMenu.propTypes = {
  viewSwitchFtn: PropTypes.func.isRequired,
  handleSaveView: PropTypes.func.isRequired,
  handleCancelEdit: PropTypes.func.isRequired,
  handleDuplicateObject: PropTypes.func.isRequired,
  handleDeleteObject: PropTypes.func.isRequired,
  viewMode: PropTypes.string.isRequired,
  unsavedChanges: PropTypes.bool.isRequired,
};

export const TopMenu = ({
  modifiedby,
  modifiedat,
  viewSwitchFtn,
  handleSaveView,
  handleEditTitleBtn,
  handleCancelEdit,
  handleDuplicateObject,
  handleDeleteObject,
  handleShowRawDataPanel,
  handleHideMissing,
  hideMissing,
  viewMode,
  unsavedChanges,
  // showErrors,
  // handleShowErrorsToggle,
}) => (
  <>
    <div className="viewObjectTopMenu">
      <p className="viewObjectTopMenu_modInfo">
        Modified By:{' '}
        <span className={(modifiedby === 'Old KPedia' && 'viewObject_KpediaWarning') || ''}>
          {modifiedby}
        </span>{' '}
        {formatForView(modifiedat)}
      </p>
      <ul className="viewObjectTopMenu_list">
        <li className="viewObjectTopMenu_listItem">
          <button
            className="button_reset viewObjectTopMenu_listItemLink"
            type="button"
            onClick={handleEditTitleBtn}
          >
            {/* <Emoji emoj="📝" /> */} Edit Title
          </button>
        </li>
        <ViewModeMenu
          unsavedChanges={unsavedChanges}
          viewSwitchFtn={viewSwitchFtn}
          viewMode={viewMode}
          handleCancelEdit={handleCancelEdit}
          handleDuplicateObject={handleDuplicateObject}
          handleDeleteObject={handleDeleteObject}
          handleSaveView={handleSaveView}
        />
        {/* <ViewObjectTopMenuItemToggle
          // emoji="⚠️"
          text="Hide Missing"
          altText="Hiding Missing"
          val={hideMissing}
          handleOnClick={handleHideMissing}
        /> */}
        <ViewObjectTopMenuItem
          // emoji="+🛒"
          text="Add to Basket"
          className="DISABLED"
          handleOnClick={() => {}}
        />
        <ViewObjectTopMenuItem
          // emoji="+🛒"
          text="Show Raw Data"
          handleOnClick={handleShowRawDataPanel}
        />
        <ViewObjectTopMenuItem
          // emoji="🕒"
          text="Change log"
          className="DISABLED"
          handleOnClick={() => {}}
        />
        <ViewObjectTopMenuItem
          // emoji="🧩"
          text="Settings"
          className="DISABLED"
          handleOnClick={() => {}}
        />
      </ul>
    </div>
  </>
);

TopMenu.propTypes = {
  modifiedby: PropTypes.string,
  modifiedat: PropTypes.string,
  viewSwitchFtn: PropTypes.func.isRequired,
  handleEditTitleBtn: PropTypes.func.isRequired,
  handleSaveView: PropTypes.func.isRequired,
  handleCancelEdit: PropTypes.func.isRequired,
  handleDuplicateObject: PropTypes.func.isRequired,
  handleDeleteObject: PropTypes.func.isRequired,
  handleShowRawDataPanel: PropTypes.func.isRequired,
  handleHideMissing: PropTypes.func.isRequired,
  hideMissing: PropTypes.bool.isRequired,
  viewMode: PropTypes.string.isRequired,
  unsavedChanges: PropTypes.bool.isRequired,
  // showErrors: PropTypes.bool.isRequired,
  // handleShowErrorsToggle: PropTypes.func.isRequired,
};

TopMenu.defaultProps = {
  modifiedby: 'Unknown',
  modifiedat: 'Unknown',
};
