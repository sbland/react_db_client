import React, { useState } from 'react';
import { MultiSelectDropdown } from './multi-select-dropdown';

export const demoOptions = [
  {
    uid: 'a',
    label: 'A',
  },
  {
    uid: 'b',
    label: 'B',
  },
  {
    uid: 'c',
    label: 'C',
  },
  {
    uid: 'd',
    label: 'D',
  },
  {
    uid: 'e',
    label: 'E',
  },
];

export const BasicMultiSelectDropdown = () => (
  <MultiSelectDropdown
    activeSelection={[]}
    updateActiveSelection={(newVal) => {}}
    options={demoOptions}
    required
  />
);

export const MultiSelectDropdownInteractive = () => {
  const [activeSelection, setActiveSelection] = useState(['a', 'b', 'e']);
  return (
    <MultiSelectDropdown
      activeSelection={activeSelection}
      options={demoOptions}
      updateActiveSelection={setActiveSelection}
    />
  );
};
