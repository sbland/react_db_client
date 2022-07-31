import React from 'react';
import { mount, shallow } from 'enzyme';
import HiddenColumnsPanel from './HiddenColumnsPanel';

const hiddenColumnIds = ['abc', 'def'];
const headings = [
  {uid: 'abc', label: 'ABC'},
  {uid: 'def', label: 'DEF'},
]

describe('Data Table - HiddenColumn Panel', () => {
  test('Snapshot', () => {
    const component = shallow(
      <HiddenColumnsPanel
      headings={headings}
        hiddenColumnIds={hiddenColumnIds}
        setHiddenColumnIds={() => {}}
        showPanelOverride
      />
    );
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
  const wrapper = mount(
    <HiddenColumnsPanel
    headings={headings}
      hiddenColumnIds={hiddenColumnIds}
      setHiddenColumnIds={() => {}}
      showPanelOverride
    />
  );

  const hiddenList = wrapper.find('.hiddenPanel_hiddenList');
  it('Shows a Row for each hidden item', () => {
    const hiddenCount = hiddenColumnIds.length;
    expect(hiddenList.find('li').length).toEqual(hiddenCount);
  });
});
