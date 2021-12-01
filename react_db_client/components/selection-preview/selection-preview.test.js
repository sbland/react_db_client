import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { createSerializer } from 'enzyme-to-json';

import { SelectionPreview } from './selection-preview';
import { defaultProps } from './demo-data';

expect.addSnapshotSerializer(createSerializer({ mode: 'deep' }));

describe('SelectionPreview', () => {
  beforeEach(() => {
    //
  });
  it('Renders', () => {
    shallow(<SelectionPreview {...defaultProps} />);
  });
  it('Matches Snapshot', () => {
    const component = shallow(<SelectionPreview {...defaultProps} />);
    expect(toJson(component)).toMatchSnapshot();
  });
  describe('Unit Testing', () => {
    let component;
    beforeEach(() => {
      component = mount(<SelectionPreview {...defaultProps} />);
    });
  });
});