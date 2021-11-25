import React, { useState } from 'react';
import { MultiSelectDropdown } from './multi-select-dropdown';
import { demoOptions } from './demo-data';

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
