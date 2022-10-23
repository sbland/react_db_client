import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Uid } from '@react_db_client/constants.client-types';
import { IToggleBoxProps } from './toggle-box';

export interface IToggleBoxRadioGroupProps {
  selected: Uid;
  className: string;
  children: React.ReactElement<IToggleBoxProps>[];
  onChange: (i: number, uid: Uid) => void;
  allowDeselect?: boolean;
}

export const ToggleBoxRadioGroup = ({
  selected: selectedIn,
  className,
  children,
  onChange,
  allowDeselect,
}: IToggleBoxRadioGroupProps) => {
  const [currentSelection, setCurrentSelection] = useState<string | number>(selectedIn);

  const updateSelection = (i: number, id: string | number) => {
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
          const newProps: IToggleBoxProps = {
            onChange: (j, v) => updateSelection(j ? i : -1, v),
            stateIn: i === currentSelection,
            id: child?.props.id,
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
