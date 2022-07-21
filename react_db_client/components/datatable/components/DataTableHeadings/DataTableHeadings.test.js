import React from 'react';
import { mount, shallow } from 'enzyme';
import { DataTableHeadings } from './DataTableHeadings';

import { demoHeadingsData } from '@react_db_client/components.datatable.extras';
import { DataTableContext, dataTableDefaultConfig } from '@react_db_client/components.datatable.logic';

describe('DataTableHeading', () => {
  it('Renders', () => {
    mount(
      <DataTableHeadings
        headingsDataList={demoHeadingsData}
        setsortBy={() => {}}
        handleHideColumn={() => {}}
        handleAddFilter={() => {}}
        columnWidths={[
          100, // append column width for edit btns
          ...demoHeadingsData.map(() => 110),
        ]}
      />
    );
  });
  it('Matches Snapshot', () => {
    const component = shallow(
      <DataTableContext.Provider value={dataTableDefaultConfig}>
        <DataTableHeadings
          headingsDataList={demoHeadingsData}
          setsortBy={() => {}}
          handleHideColumn={() => {}}
          handleAddFilter={() => {}}
          columnWidths={[
            100, // append column width for edit btns
            ...demoHeadingsData.map(() => 110),
          ]}
        />
      </DataTableContext.Provider>
    )
      .find(DataTableHeadings)
      .dive();
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
});
