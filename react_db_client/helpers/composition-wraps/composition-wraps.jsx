import React, { useState } from 'react';

const setDim = (diff) => (prev) => {
  const prevDim = parseInt(prev.replace('rem', '')) + diff;
  return `${prevDim}rem`;
};

export function CompositionWrapDefault({
  children,
  width = null,
  height = null,
}) {
  const [heightActive, setHeightActive] = useState(
    height == null ? 'auto' : height
  );
  const [widthActive, setWidthActive] = useState(
    width == null ? 'auto' : width
  );
  const [allowOverflow, setAllowOverflow] = useState(false);

  const styleOuter = {
    outline: '1px solid red',
    margin: 0,
    padding: '1rem',
    height: heightActive,
    width: widthActive,
    overflow: allowOverflow ? 'auto' : 'hidden',
  };
  const styleInner = {
    outline: '1px solid green',
    margin: 0,
    padding: 0,
    width: '100%',
    height: '100%',
    overflow: allowOverflow ? 'visable' : 'hidden',
  };

  const btnStyle = (isOn) => ({
    background: isOn ? 'green' : 'red',
  })

  return (
    <div>
      <button onClick={() => setHeightActive(setDim(5))}>+5 Height</button>
      <button onClick={() => setWidthActive(setDim(5))}>+5 Width</button>
      <button onClick={() => setHeightActive(setDim(-5))}>-5 Height</button>
      <button onClick={() => setWidthActive(setDim(-5))}>-5 Width</button>
      <button style={btnStyle(allowOverflow)} onClick={() => setAllowOverflow((prev) => !prev)}>Overflow</button>

      <div style={styleOuter}>
        <div style={styleInner}>{children}</div>
      </div>
    </div>
  );
}
