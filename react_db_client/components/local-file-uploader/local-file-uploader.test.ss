import React from 'react';
import { shallow, mount } from 'enzyme';
import { MockReactC } from '@react_db_client/testing.utils';
// eslint-disable-next-line import/order
import CSVReader from 'react-csv-reader';

import LocalFileUploader from './LocalFileUploader';
import DataTableSimple from '../DataTable/DataTableSimple';
import HeadingsMapper from './HeadingsMapper';
import filterTypes from '../../GenericConstants/filterTypes';

jest.mock('react-csv-reader', () => MockReactC('CSVReader'));

const demoHeadings = ['a', 'b', 'c'];
const demoData = [demoHeadings, [1, 2, 3], [4, 5, 6]];
const demoDataWithBlankLines = [[], demoHeadings, [1, 2, 3], [4, 5, 6]];

const demoAltHeadings = ['fo', 'ba', 'ro'];

const demoDataFormattedNoHeader = [
  {
    0: 'a',
    1: 'b',
    2: 'c',
    uid: 0,
  },
  {
    0: 1,
    1: 2,
    2: 3,
    uid: 1,
  },
  {
    0: 4,
    1: 5,
    2: 6,
    uid: 2,
  },
];

const demoDataFormattedHeader = [
  {
    a: 1,
    b: 2,
    c: 3,
    uid: 0,
  },
  {
    a: 4,
    b: 5,
    c: 6,
    uid: 1,
  },
];

const demoDataFormattedHeaderAlt = [
  {
    fo: 1,
    ba: 2,
    ro: 3,
    uid: 0,
  },
  {
    fo: 4,
    ba: 5,
    ro: 6,
    uid: 1,
  },
];

const onChange = jest.fn();
const onAccept = jest.fn();

const mapToHeadings = [
  { uid: 'a', label: 'A' },
  { uid: 'b', label: 'B' },
  { uid: 'fo', label: 'Foo' },
];
const defaultProps = {
  label: 'label',
  onAccept,
  onChange,
  mapToHeadings,
  showAcceptButton: true,
};

describe('LocalFileUploader', () => {
  test('Renders', () => {
    shallow(<LocalFileUploader {...defaultProps} />);
  });
  test('Matches Snapshot - no file', () => {
    const component = shallow(<LocalFileUploader showAcceptButton />);
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

  describe('Unit Testing', () => {
    let component;
    beforeEach(() => {
      component = mount(<LocalFileUploader {...defaultProps} />);
    });
    const clickHeaderCheckbox = (c) => {
      const headerCheckbox = c.find('.headerCheckbox');
      headerCheckbox.simulate('change', { target: { checked: true } });
      c.update();
    };
    const loadData = (c) => {
      const loadFileFunc = c.find(CSVReader).props().onFileLoaded;
      loadFileFunc(demoData, {});
      c.update();
    };
    describe('Loading data', () => {
      test('should return data to on change', () => {
        const loadFileFunc = component.find(CSVReader).props().onFileLoaded;
        loadFileFunc(demoData, {});
        component.update();
        expect(onChange).toHaveBeenCalledWith(demoDataFormattedNoHeader);
      });
    });

    describe('Formats Data', () => {
      test('Formats file data - without header', () => {
        const loadFileFunc = component.find(CSVReader).props().onFileLoaded;
        loadFileFunc(demoData, {});
        component.update();
        const dataTableSimple = component.find(DataTableSimple);
        expect(dataTableSimple).toBeTruthy();
        expect(dataTableSimple.props().tableData).toEqual(demoDataFormattedNoHeader);
        expect(component.find(HeadingsMapper).props().headings).toEqual([0, 1, 2]);
      });
      test('Formats file data - with header', () => {
        const headerCheckbox = component.find('.headerCheckbox');
        headerCheckbox.simulate('change', { target: { checked: true } });
        component.update();
        const loadFileFunc = component.find(CSVReader).props().onFileLoaded;
        loadFileFunc(demoData, {});
        component.update();
        const dataTableSimple = component.find(DataTableSimple);
        expect(dataTableSimple).toBeTruthy();
        expect(dataTableSimple.props().tableData).toEqual(demoDataFormattedHeader);
        expect(component.find(HeadingsMapper).props().headings).toEqual(demoHeadings);
      });
      test('Formats file data - with blank lines skip', () => {
        const skipRowsInput = component.find('.skipRowsInput');
        skipRowsInput.simulate('change', { target: { value: 1 } });
        component.update();
        const loadFileFunc = component.find(CSVReader).props().onFileLoaded;
        loadFileFunc(demoDataWithBlankLines, {});
        component.update();
        const dataTableSimple = component.find(DataTableSimple);
        expect(dataTableSimple).toBeTruthy();
        expect(dataTableSimple.props().tableData).toEqual(demoDataFormattedNoHeader);
        expect(component.find(HeadingsMapper).props().headings).toEqual([0, 1, 2]);
      });

      test('Formats file data - with blank lines no skip', () => {
        const loadFileFunc = component.find(CSVReader).props().onFileLoaded;
        loadFileFunc(demoDataWithBlankLines, {});
        component.update();
        const dataTableSimple = component.find(DataTableSimple);
        expect(dataTableSimple).toBeTruthy();
        const expectedOutput = [
          {},
          ...demoDataFormattedNoHeader.map((r) => ({ ...r, uid: r.uid + 1 })),
        ];
        expect(dataTableSimple.props().tableData).toEqual(expectedOutput);
        expect(component.find(HeadingsMapper).props().headings).toEqual([0, 1, 2]);
      });
    });

    describe('Mapping Fields', () => {
      test('shows correct headings editor', () => {
        clickHeaderCheckbox(component);
        loadData(component);
        expect(component.find('.localFileUploader_headingEditor').length).toEqual(0);
        expect(component.find('.localFileUploader_headingMapper').length).toEqual(1);
      });
      test('should pass data to headings mapper', () => {
        clickHeaderCheckbox(component);
        loadData(component);
        const headingsMapper = component.find(HeadingsMapper);
        expect(headingsMapper.props().headings).toEqual(demoData[0]);
        expect(headingsMapper.props().mapToHeadings).toEqual(mapToHeadings);
      });
      test('should set headings when we accept the headings mapper', () => {
        clickHeaderCheckbox(component);
        loadData(component);
        let headingsMapper = component.find(HeadingsMapper);
        headingsMapper.props().handleAccept(demoAltHeadings);
        component.update();
        headingsMapper = component.find(HeadingsMapper);
        expect(headingsMapper.props().mappedHeadings).toEqual(demoAltHeadings);
      });
      test('set the headings mapper headings if we click the has headings checkbox', () => {
        loadData(component);
        const headingsMapper = component.find(HeadingsMapper);
        expect(headingsMapper.props().headings).toEqual([0, 1, 2]);
        expect(headingsMapper.props().mapToHeadings).toEqual(mapToHeadings);
        clickHeaderCheckbox(component);
        const headingsMapperNext = component.find(HeadingsMapper);
        expect(headingsMapperNext.props().headings).toEqual(demoData[0]);
      });
    });
    describe('Previewing data', () => {
      test('should show preview of data in datatable', () => {
        clickHeaderCheckbox(component);
        loadData(component);
        const dataTable = component.find('#previewDataTable');
        const expectedHeadings = demoHeadings.map((h) => ({
          uid: h,
          label: mapToHeadings.find((mh) => mh.uid === h)?.label || h,
          type: filterTypes.text,
        }));
        expect(dataTable.props().headingsData).toEqual(expectedHeadings);
        expect(dataTable.props().tableData).toEqual(demoDataFormattedHeader);
      });
      test('should update preview when we update headers', () => {
        clickHeaderCheckbox(component);
        loadData(component);
        let headingsMapper = component.find(HeadingsMapper);
        headingsMapper.props().handleAccept(demoAltHeadings);
        component.update();
        headingsMapper = component.find(HeadingsMapper);

        const dataTable = component.find('#previewDataTable');
        const expectedHeadings = demoAltHeadings.map((h) => ({
          uid: h,
          label: mapToHeadings.find((mh) => mh.uid === h)?.label || h,
          type: filterTypes.text,
        }));
        expect(dataTable.props().headingsData).toEqual(expectedHeadings);
        expect(dataTable.props().tableData).toEqual(demoDataFormattedHeaderAlt);
      });
    });
  });
});
