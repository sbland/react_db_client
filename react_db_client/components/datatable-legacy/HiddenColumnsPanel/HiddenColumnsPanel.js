import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

let hidePanelTimeout = null;
const HIDETIME = 300;

const HiddenColumnsPanel = ({
  headings,
  hiddenColumnIds,
  handleUnhideColumn,
  showPanelOverride,
}) => {
  const [showPanel, setShowPanel] = useState(showPanelOverride);
  const menuRef = useRef(null);

  function handleClickOutside(event) {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      hidePanelTimeout = setTimeout(() => setShowPanel(false), HIDETIME);
    } else {
      clearTimeout(hidePanelTimeout);
    }
  }
  useEffect(() => {
    document.addEventListener('mouseover', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      clearTimeout(hidePanelTimeout);
      document.removeEventListener('mouseover', handleClickOutside);
    };
  });

  const mapIds = hiddenColumnIds.map((id) => (
    <li key={id}>
      <button type="button" className="button-one" onClick={() => handleUnhideColumn(id)}>
        {headings.find((h) => h.uid === id)?.label || `Missing label for ${id}`}
      </button>
    </li>
  ));

  return (
    <div className="dataTable_hiddenPanel">
      <button
        type="button"
        className="button-one openHiddenButton"
        onClick={() => setShowPanel(!showPanel)}
      >
        Hidden Columns
      </button>
      {showPanel && (
        <ul className="hiddenPanel_hiddenList" ref={menuRef}>
          {showPanel && mapIds}
        </ul>
      )}
    </div>
  );
};

HiddenColumnsPanel.propTypes = {
  headings: PropTypes.objectOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  hiddenColumnIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleUnhideColumn: PropTypes.func.isRequired,
  showPanelOverride: PropTypes.bool,
};

HiddenColumnsPanel.defaultProps = {
  showPanelOverride: false,
};

export default HiddenColumnsPanel;
