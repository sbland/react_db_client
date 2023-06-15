import React, { useState } from 'react';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';
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
const DEMO_OPTIONS_LONG = [...Array(30)].map((v, i) => ({ uid: i, label: String(i) }));

export const Basic = () => {
  return (
    <CompositionWrapDefault height="8rem" width="12rem">
      <CustomSelectDropdown
        options={DEMO_OPTIONS}
        handleSelect={(uid) => {}}
        isOpen
        handleClose={() => {}}
        firstItemRef={{ current: {} as HTMLElement }}
        goBackToSearchField={() => {}}
      />
    </CompositionWrapDefault>
  );
};

export const Interactive = () => {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<string | null>(null);
  return (
    <CompositionWrapDefault height="8rem" width="12rem">
      <div style={{ width: '10rem' }}>
        <p data-testid="curSel">{selection || 'Nothing Selected'}</p>
        <input
          data-testid="testInput"
          type="text"
          onFocus={() => setOpen(true)}
          style={{ width: '100%' }}
        />
        <CustomSelectDropdown
          options={DEMO_OPTIONS}
          handleSelect={(uid) => setSelection(uid)}
          isOpen={open}
          handleClose={() => setOpen(false)}
          firstItemRef={{ current: {} as HTMLElement }}
          goBackToSearchField={() => {}}
        />
        <div style={{ width: '300px', height: '300px', background: 'red' }} />
      </div>
    </CompositionWrapDefault>
  );
};

export const LongList = () => {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<string | null>(null);
  return (
    <CompositionWrapDefault height="8rem" width="12rem">
      <div style={{ width: '10rem' }}>
        {selection || 'Nothing Selected'}
        <input type="text" onFocus={() => setOpen(true)} style={{ width: '100%' }} />
        <CustomSelectDropdown
          options={DEMO_OPTIONS_LONG}
          handleSelect={(uid) => setSelection(uid)}
          isOpen={open}
          handleClose={() => setOpen(false)}
          firstItemRef={{ current: {} as HTMLElement }}
          goBackToSearchField={() => {}}
        />
        <div style={{ width: '300px', height: '300px', background: 'red' }} />
      </div>
    </CompositionWrapDefault>
  );
};

export const OverflowHidden = () => {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<string | null>(null);
  // TODO: This is currently not working
  return (
    <CompositionWrapDefault height="8rem" width="12rem">
      <div
        style={{
          width: '10rem',
          height: '5rem',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <p data-testid="curSel">{selection || 'Nothing Selected'}</p>
        <input type="text" onFocus={() => setOpen(true)} style={{ width: '100%' }} />
        <div style={{ position: 'absolute', zIndex: 99 }}>
          <CustomSelectDropdown
            options={DEMO_OPTIONS_LONG}
            handleSelect={(uid) => setSelection(uid)}
            isOpen={open}
            handleClose={() => setOpen(false)}
            firstItemRef={{ current: {} as HTMLElement }}
            goBackToSearchField={() => {}}
          />
        </div>
        <div style={{ width: '300px', height: '300px', background: 'red' }} />
      </div>
    </CompositionWrapDefault>
  );
};

export const OverflowHiddenFixed = () => {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<string | null>(null);
  const containerRef = React.useRef(null);
  const targetRef = React.useRef<HTMLDivElement>(null);
  const [rerender, setRerender] = React.useState(0);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    setRerender(1);
    if (targetRef.current) {
      setPosition({
        top: targetRef.current?.offsetTop,
        left: targetRef.current?.offsetLeft,
      });
    }
  }, [targetRef.current]);

  // TODO: This is currently not working
  return (
    <CompositionWrapDefault height="8rem" width="12rem">
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
            firstItemRef={{ current: {} as HTMLElement }}
            position="absolute"
            absolutePosition={position}
            containerRef={containerRef.current}
            goBackToSearchField={() => {}}
          />
        </div>
        <div style={{ width: '300px', height: '300px', background: 'red' }} />
      </div>
      <div
        style={{ position: 'absolute', left: 0, top: 0, background: undefined }}
        ref={containerRef}
      >
        {' '}
      </div>
    </CompositionWrapDefault>
  );
};

export const BasicMenuAbsolutePosition = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const targetRef = React.useRef(null);
  const [rerender, setRerender] = React.useState(0);

  React.useEffect(() => {
    setRerender(1);
  }, []);

  return (
    <CompositionWrapDefault height="8rem" width="12rem">
      {(rerender && containerRef.current && (
        <CustomSelectDropdown
          options={DEMO_OPTIONS}
          handleSelect={(uid) => {}}
          isOpen
          handleClose={() => {}}
          firstItemRef={{ current: {} as HTMLElement }}
          goBackToSearchField={() => {}}
          containerRef={containerRef.current}
          position="absolute"
          absolutePosition={{ left: 50, top: 50 }}
        />
      )) || <>""</>}
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
    </CompositionWrapDefault>
  );
};
