import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';

import { mount } from 'enzyme';
import { TopMenu } from './top-menu';

const defaultProps = {
  modifiedby: '',
  modifiedat: '',
  viewSwitchFtn: () => {},
  handleSaveView: () => {},
  handleEditTitleBtn: () => {},
  handleCancelEdit: () => {},
  handleDuplicateObject: () => {},
  handleDeleteObject: () => {},
  handleShowRawDataPanel: () => {},
  handleHideMissing: () => {},
  hideMissing: false,
  viewMode: 'edit',
  unsavedChanges: false,
};

/* Tests */
describe('Meta View - Top Menu', () => {
  test('Renders', () => {
    mount(<TopMenu {...defaultProps} />);
  });
});
