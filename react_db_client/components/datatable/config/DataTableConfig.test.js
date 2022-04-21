import React, { useContext } from 'react';
import { mount } from 'enzyme';

import DataTableConfigConnector, {
  DataTableContext,
  dataTableDefaultConfig,
} from './DataTableConfig';

// SETUP

const DemoSubComponent = () => {
  const config = useContext(DataTableContext);
  return <div className="config">{JSON.stringify(config)}</div>;
};

const DemoComponentFunc = () => (
  <div className="Master Component">
    <DemoSubComponent />
  </div>
);

const customDefaults = {};

const DemoComponent = DataTableConfigConnector(customDefaults)(DemoComponentFunc);

describe('DataTable Config Manager', () => {
  test('Snapshot', () => {
    const component = mount(<DemoComponent />);
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

  it('Shows default context in demo sub component', () => {
    const component = mount(<DemoComponent />);
    const configPassedThrough = component.find('.config').text();
    expect(configPassedThrough).toEqual(JSON.stringify(dataTableDefaultConfig));
  });

  // Removed test as just testing context functionality
  // it('Injects config context into demo sub component', () => {
  //   const config = {
  //     allowRowDelete: false,
  //     allowFilters: true,
  //     allowSortBy: true,
  //     allowHiddenColumns: true,
  //     allowRowEditPanel: false,
  //     allowEditRow: true,
  //     theme: 'default',
  //     limitHeight: 0,
  //     maxWidth: 2000,
  //     minWidth: 50,
  //   };

  //   const component = mount(<DemoComponent config={config} />);
  //   const configPassedThrough = component.find('.config').text();
  //   expect(configPassedThrough).toEqual(JSON.stringify(config));
  // });
});
