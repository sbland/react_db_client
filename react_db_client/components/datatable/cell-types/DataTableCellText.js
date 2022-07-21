import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  DefaultCellInnerStyle,
  DefaultInputStyle,
  DefaultTextAreaStyle,
  Text,
  FocusedText,
  FocusedTextLong,
} from './style';

export const DataTableCellText = ({
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
    console.log('RESETTING');
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
    console.log('obblur');
    acceptValueLocal();
    // setIgnoreNextBlur(false);
  };

  const classNames = [
    type === 'textLong' ? 'dataTableCellData-textLong' : 'dataTableCellData-text',
  ].join(' ');

  const showTextEditor = focused && editMode && type === 'text';
  const showTextAreaEditor = focused && editMode && type === 'textLong';

  return (
    <DefaultCellInnerStyle className={`dataTableCellData ${classNames}`} focused={focused}>
      {type === 'text' && (
        <DefaultInputStyle
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
      )}
      {type === 'textLong' && (
        <DefaultTextAreaStyle
          style={{
            display: showTextAreaEditor ? 'block' : 'none',
          }}
          role="input"
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
      )}
      {!focused && <Text className={`dataTableCellData_text ${classNames}`}>{cellData}</Text>}
      {!editMode && focused && type === 'text' && (
        <FocusedText className={`dataTableCellData_text ${classNames}`}>{cellData}</FocusedText>
      )}
      {/* Make text resize to fit content on focus */}
      {!editMode && focused && type === 'textLong' && (
        <FocusedTextLong className={`dataTableCellData_text focusedtextCell ${classNames}`}>
          {cellData}
        </FocusedTextLong>
      )}
    </DefaultCellInnerStyle>
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
