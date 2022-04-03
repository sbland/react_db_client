import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { shallow, mount } from 'enzyme';

import { RightClickWrapper } from './popup-menu';

describe('ItemList', () => {
  it('renders', () => {
    shallow(
      <RightClickWrapper
        items={[
          { uid: 'A', label: 'Item A', onClick: () => {} },
          { uid: 'B', label: 'Item B', onClick: () => {} },
        ]}
      >
        <div
          id="box"
          style={{
            // position: 'relative',
            width: '100px',
            height: '100px',
            background: 'red',
            position: 'absolute',
            transform: 'translate(400px, 400px)',
          }}
        />
      </RightClickWrapper>
    );
  });
  it('matches snapshot', () => {
    const out = mount(
      <RightClickWrapper
        items={[
          { uid: 'A', label: 'Item A', onClick: () => {} },
          { uid: 'B', label: 'Item B', onClick: () => {} },
        ]}
        popupRoot="root"
      >
        <div
          id="box"
          style={{
            // position: 'relative',
            width: '100px',
            height: '100px',
            background: 'red',
            position: 'absolute',
            transform: 'translate(400px, 400px)',
          }}
        />
      </RightClickWrapper>
    );
    expect(out.debug()).toMatchSnapshot();
  });
});
