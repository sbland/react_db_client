import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export const DataTableCellLink = ({
  columnData: { to },
  cellData,
  updateData,
  acceptValue,
  resetValue,
  // columnData,
  focused,
  editMode,
}) => {
  const toLink = `${to}/${cellData}`;
  const refText = useRef(null);
  // const [ignoreNextBlur, setIgnoreNextBlur] = useState(false);

  useEffect(() => {
    if (focused && editMode) refText.current.select();
  }, [focused, refText, editMode]);

  const acceptValueLocal = () => {
    acceptValue(cellData);
  };

  const rejectValue = () => {
    resetValue();
  };

  const handleInputChange = (e) => {
    updateData(e.target.value);
  };
  const onKeyPress = (e) => {
    // setIgnoreNextBlur(true);
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      acceptValueLocal();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      rejectValue();
    }
  };

  const onBlur = () => {
    // if (!ignoreNextBlur) acceptValueLocal();
    acceptValueLocal();
    // setIgnoreNextBlur(false);
  };

  return (
    <div className="dataTableCellData dataTableCellData-link">
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        ref={refText}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        type="text"
        onChange={handleInputChange}
        value={cellData}
        onBlur={onBlur}
        onKeyDown={onKeyPress}
      />
      {/* TODO: Move this to  */}
      {!editMode && <Link to={toLink}>{cellData}</Link>}
    </div>
  );
};

DataTableCellLink.propTypes = {
  cellData: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  columnData: PropTypes.shape({
    to: PropTypes.string,
  }).isRequired,
  updateData: PropTypes.func.isRequired,
  acceptValue: PropTypes.func.isRequired,
  resetValue: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
};

DataTableCellLink.defaultProps = {
  cellData: '',
};

export default DataTableCellLink;
