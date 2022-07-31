import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const DataTableCellText = ({
  columnData: { type },
  cellData,
  updateData,
  acceptValue,
  resetValue,
  focused,
  editMode,
}) => {
  const refText = useRef(null);
  const refArea = useRef(null);
  // const [ignoreNextBlur, setIgnoreNextBlur] = useState(false);

  const handleInputChange = (e) => {
    updateData(e.target.value);
  };

  useEffect(() => {
    if (focused && editMode && type === 'text') {
      refText.current.focus();
      refText.current.select();
    }
    if (focused && editMode && type === 'textLong') {
      refArea.current.focus();
      refArea.current.select();
    }
  }, [focused, refText, refArea, type, editMode]);

  const acceptValueLocal = () => {
    acceptValue(cellData);
  };

  const rejectValue = () => {
    resetValue();
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

  const classNames = [
    type === 'textLong' ? 'dataTableCellData-textLong' : 'dataTableCellData-text',
  ].join(' ');

  const showTextEditor = focused && editMode && type === 'text';
  const showTextAreaEditor = focused && editMode && type === 'textLong';
  return (
    <div className={`dataTableCellData ${classNames}`}>
      <input
        style={{
          display: showTextEditor ? 'block' : 'none',
        }}
        className="cellInput-text"
        ref={refText}
        type="text"
        onChange={handleInputChange}
        value={cellData || ''}
        onBlur={onBlur}
        onKeyDown={onKeyPress}
      />
      {/* <input
        style={{
          display: showTextAreaEditor ? 'block' : 'none',
        }}
        className="cellInput-textarea"
        ref={refArea}
        type="text"
        onChange={handleInputChange}
        value={cellData || ''}
        onBlur={acceptValueLocal}
        onKeyDown={onKeyPress}
      /> */}
      {/* // Disabled text area as does not fit well */}
      <textarea
        style={{
          display: showTextAreaEditor ? 'block' : 'none',
          position: 'absolute',
          width: '100%',
          minHeight: '5rem',
          minWidth: '20rem',
          left: 0,
          top: 0,
          whiteSpace: 'normal',
          resize: 'none',
          zIndex: 10,
          overflow: 'hidden',
        }}
        className="cellInput-textarea"
        ref={refArea}
        type="text"
        onChange={handleInputChange}
        value={cellData || ''}
        onBlur={onBlur}
        onKeyDown={onKeyPress}
        wrap="hard"
        rows="10"
        cols="20"
      />
      {(!editMode || !focused) && (
        <div className={`dataTableCellData_text ${classNames}`}>{cellData}</div>
      )}
    </div>
  );
};

DataTableCellText.propTypes = {
  cellData: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  columnData: PropTypes.shape({
    defaultValue: PropTypes.string,
    type: PropTypes.oneOf(['text', 'textLong']).isRequired,
  }).isRequired,
  updateData: PropTypes.func.isRequired,
  acceptValue: PropTypes.func.isRequired,
  resetValue: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
};

DataTableCellText.defaultProps = {
  cellData: '',
};

export default DataTableCellText;
