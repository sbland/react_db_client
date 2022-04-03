import React from 'react';
import PropTypes from 'prop-types';

export const CellNavigationCellWrap = ({
  children,
  cellWrapNavBtnRef,
  classNames,
  onClick,
  onKeyDown,
  columnIndex,
  rowIndex,
}) => {
  return (
    <div
      ref={cellWrapNavBtnRef}
      type="button"
      className={`${classNames} navigationButton cellWrapBtn button-reset`}
      onClick={onClick}
      style={{ width: '100%' }}
      onKeyDown={onKeyDown}
      role="presentation"
      tabIndex={`${columnIndex + rowIndex * 10}`}
    >
      {children}
    </div>
  );
};

const refPropType = PropTypes.oneOfType([
  // Either a function
  PropTypes.func,
  // Or the instance of a DOM native element (see the note about SSR)
  PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
]);
const childrenPropType = PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]);

CellNavigationCellWrap.propTypes = {
  children: childrenPropType.isRequired,
  cellWrapNavBtnRef: refPropType.isRequired,
  classNames: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  columnIndex: PropTypes.number.isRequired,
  rowIndex: PropTypes.number.isRequired,
};
