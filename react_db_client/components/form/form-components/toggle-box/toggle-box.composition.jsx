import React from 'react';
import { ToggleBox } from './toggle-box';
import { ToggleBoxRadioGroup } from './radio-group';


const defaultProps = {
  id:1,
  onChange: () => {},
  text: 'Tog',
}

export const defaultToggleBox = () => {
  return (
    <div className="sectionWrapper">
      <ToggleBox {...defaultProps}/>
    </div>
  );
};

export const radioGroup = () => {
  return (
    <ToggleBoxRadioGroup
      selected={0}
      onChange={(i, v) => console.log(i, v)}
      allowDeselect
    >
      <ToggleBox id={0} text="0" />
      <ToggleBox id={1} text="1" />
      <ToggleBox id={2} text="2" />
    </ToggleBoxRadioGroup>
  );
};

export const radioGroupNoDeselect = () => {
  return (
    <ToggleBoxRadioGroup selected={0} onChange={(i, v) => console.log(i, v)}>
      <ToggleBox id={0} text="0" />
      <ToggleBox id={1} text="1" />
      <ToggleBox id={2} text="2" />
    </ToggleBoxRadioGroup>
  );
};
