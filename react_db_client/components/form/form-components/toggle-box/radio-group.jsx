import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '@samnbuk/react_db_client.constants.style';

export const ToggleBoxRadioGroup = ({
    selected: selectedIn,
    className,
    children,
    onChange,
    allowDeselect,
  }) => {
    const [currentSelection, setCurrentSelection] = useState(selectedIn);

    const updateSelection = (i, id) => {
      if (!allowDeselect && i === -1) return;
      if (onChange) {
        setCurrentSelection(i);
        onChange(i, id);
      } else {
        setCurrentSelection(i);
      }
    };

    const fullClassName = [className, 'list-reset'].join(' ');

    return (
      <div className="toggleBoxRadioGroup_wrap">
        <ul className={fullClassName}>
          {children.map((child, i) => {
            const newProps = {
              onChange: (j, v) => updateSelection(j ? i : -1, v),
              stateIn: i === currentSelection,
              id: child.props.id,
            };
            const newChild = React.cloneElement(child, {
              ...newProps,
            });
            return <li key={child.props.id}>{newChild}</li>;
          })}
        </ul>
      </div>
    );
  };

  ToggleBoxRadioGroup.propTypes = {
    selected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    allowDeselect: PropTypes.bool,
  };

  ToggleBoxRadioGroup.defaultProps = {
    className: '',
    allowDeselect: false,
  };
