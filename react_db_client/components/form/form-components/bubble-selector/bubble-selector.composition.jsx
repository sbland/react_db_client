import React, { useState } from 'react';
import { BubbleSelector } from './bubble-selector';



export const BasicBubbleSelector = () => {
  const [activeSelection, setActiveSelection] = useState(['a', 'b', 'e']);
  return (
    <BubbleSelector
      activeSelection={activeSelection}
      options={[
        { uid: 'a', label: 'a' },
        { uid: 'b', label: 'b' },
        { uid: 'c', label: 'c' },
        { uid: 'd', label: 'd' },
      ]}
      updateActiveSelection={setActiveSelection}
    />
  );
};

export const BubbleSelectorManualInput = () => {
  const [activeSelection, setActiveSelection] = useState(['a', 'b', 'e']);
  return (
    <BubbleSelector
      activeSelection={activeSelection}
      options={[
        { uid: 'a', label: 'a' },
        { uid: 'b', label: 'b' },
        { uid: 'c', label: 'c' },
        { uid: 'd', label: 'd' },
      ]}
      updateActiveSelection={setActiveSelection}
      allowManualInput
    />
  );
};
