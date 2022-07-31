import React, { useState } from 'react';
import { CustomSelectDropdown } from './custom-select-dropdown';

const DEMO_OPTIONS = [
  { uid: 1, label: '01' },
  { uid: 2, label: '02' },
  { uid: 3, label: '0ssdfsadfasdfd ldj ldjlkd jldjk 3' },
  { uid: 4, label: '04' },
  { uid: 5, label: '0asdfsf5' },
  { uid: 6, label: '06' },
  { uid: 7, label: '07' },
];
const DEMO_OPTIONS_LONG = [...Array(30)].map((v, i) => ({ uid: i, label: i }));

export const Basic = () => {
  return (
    <CustomSelectDropdown
      options={DEMO_OPTIONS}
      handleSelect={(uid) => {}}
      isOpen
      handleClose={() => {}}
      firstItemRef={{ current: {} }}
      goBackToSearchField={() => {}}
    />
  );
};

export const Interactive = () => {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState(null);
  return (
    <div style={{ width: '10rem' }}>
      {selection || 'Nothing selected'}
      <input type="text" onFocus={() => setOpen(true)} style={{ width: '100%' }} />
      <CustomSelectDropdown
        options={DEMO_OPTIONS}
        handleSelect={(uid) => setSelection(uid)}
        isOpen={open}
        handleClose={() => setOpen(false)}
        firstItemRef={{ current: {} }}
      />
      <div style={{ width: '300px', height: '300px', background: 'red' }} />
    </div>
  );
};

export const LongList = () => {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState(null);
  return (
    <div style={{ width: '10rem' }}>
      {selection || 'Nothing Selected'}
      <input type="text" onFocus={() => setOpen(true)} style={{ width: '100%' }} />
      <CustomSelectDropdown
        options={DEMO_OPTIONS_LONG}
        handleSelect={(uid) => setSelection(uid)}
        isOpen={open}
        handleClose={() => setOpen(false)}
        firstItemRef={{ current: {} }}
      />
      <div style={{ width: '300px', height: '300px', background: 'red' }} />
    </div>
  );
};

export const OverflowHidden = () => {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState(null);
  // TODO: This is currently not working
  return (
    <div
      style={{
        width: '10rem',
        height: '5rem',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {selection || 'Nothing Selected'}
      <input type="text" onFocus={() => setOpen(true)} style={{ width: '100%' }} />
      <div style={{ position: 'absolute', zIndex: 99 }}>
        <CustomSelectDropdown
          options={DEMO_OPTIONS_LONG}
          handleSelect={(uid) => setSelection(uid)}
          isOpen={open}
          handleClose={() => setOpen(false)}
          firstItemRef={{ current: {} }}
        />
      </div>
      <div style={{ width: '300px', height: '300px', background: 'red' }} />
    </div>
  );
};

export const OverflowHiddenFixed = () => {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState(null);
  const containerRef = React.useRef(null);
  const targetRef = React.useRef(null);
  const [rerender, setRerender] = React.useState(0);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    setRerender(1);
    if (targetRef.current) {
      setPosition({
        top: targetRef.current.offsetTop,
        left: targetRef.current.offsetLeft,
      });
    }
  }, [targetRef.current]);

  // TODO: This is currently not working
  return (
    <>
      <div
        style={{
          width: '10rem',
          height: '5rem',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {selection || 'Nothing Selected'}
        <input type="text" onFocus={() => setOpen(true)} style={{ width: '100%' }} />
        <div style={{ position: 'absolute', zIndex: 99 }} ref={targetRef}>
          <CustomSelectDropdown
            options={DEMO_OPTIONS_LONG}
            handleSelect={(uid) => setSelection(uid)}
            isOpen={open}
            handleClose={() => setOpen(false)}
            firstItemRef={{ current: {} }}
            position="absolute"
            absolutePosition={position}
            containerRef={containerRef.current}
          />
        </div>
        <div style={{ width: '300px', height: '300px', background: 'red' }} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, background: null }} ref={containerRef}>
        {' '}
      </div>
    </>
  );
};

export const BasicMenuAbsolutePosition = () => {
  const containerRef = React.useRef(null);
  const targetRef = React.useRef(null);
  const [rerender, setRerender] = React.useState(0);

  React.useEffect(() => {
    setRerender(1);
  }, []);

  return (
    <>
      {rerender && containerRef.current && (
        <CustomSelectDropdown
          options={DEMO_OPTIONS}
          handleSelect={(uid) => {}}
          isOpen
          handleClose={() => {}}
          firstItemRef={{ current: {} }}
          goBackToSearchField={() => {}}
          containerRef={containerRef.current}
          position="absolute"
          absolutePosition={{ left: 50, top: 50 }}
        />
      )}
      <div
        style={{ position: 'absolute', left: 10, top: 400, background: 'red' }}
        ref={containerRef}
      >
        Here!
      </div>

      <div
        style={{ position: 'absolute', left: 100, top: 400, background: 'green' }}
        ref={targetRef}
      >
        Here!
      </div>
    </>
  );
};
