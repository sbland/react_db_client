import React, { useState } from 'react';
import { BubbleSelector } from './bubble-selector';
import { demoItems } from './demo-data';

export const BasicBubbleSelector = () => {
  const [activeSelection, setActiveSelection] = useState(['a', 'b']);
  return (
    <BubbleSelector
      activeSelection={activeSelection}
      options={demoItems}
      updateActiveSelection={setActiveSelection}
    />
  );
};


export const BasicBubbleSelectorCustomElement = () => {
  const [activeSelection, setActiveSelection] = useState(['a', 'b', 'e']);
  return (
    <BubbleSelector
      activeSelection={activeSelection}
      options={demoItems}
      updateActiveSelection={setActiveSelection}
    />
  );
};

export const BasicBubbleSelectorGrouped = () => {
  const [activeSelection, setActiveSelection] = useState(['a', 'b']);
  return (
    <BubbleSelector
      activeSelection={activeSelection}
      options={demoItems}
      updateActiveSelection={setActiveSelection}
      groupSelected
      // hideUnselected
    />
  );
};

export const BubbleSelectorManualInput = () => {
  const [activeSelection, setActiveSelection] = useState(['a', 'b', 'e']);
  return (
    <BubbleSelector
      activeSelection={activeSelection}
      options={demoItems}
      updateActiveSelection={setActiveSelection}
      allowManualInput
    />
  );
};
