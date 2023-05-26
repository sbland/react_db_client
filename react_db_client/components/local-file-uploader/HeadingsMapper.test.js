// TODO: Convert enzyme tests to react-testing-library

import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeadingsMapper from './HeadingsMapper';

test('renders without errors', () => {
  render(
    <HeadingsMapper
      headings={[]}
      mapToHeadings={[]}
      handleAccept={() => {}}
      errorCallback={() => {}}
    />
  );
});

// describe('HeadingsMapper', () => {
//   test('renders without errors', () => {
//     render(
//       <HeadingsMapper
//         headings={[]}
//         mapToHeadings={[]}
//         handleAccept={() => {}}
//         errorCallback={() => {}}
//       />
//     );
//   });

//   test('calls handleAccept prop when Accept Headings Mapping button is clicked', () => {
//     const handleAcceptMock = jest.fn();
//     const { getByText } = render(
//       <HeadingsMapper
//         headings={[]}
//         mapToHeadings={[]}
//         handleAccept={handleAcceptMock}
//         errorCallback={() => {}}
//       />
//     );

//     const acceptButton = getByText('Accept Headings Mapping');
//     userEvent.click(acceptButton);

//     expect(handleAcceptMock).toHaveBeenCalled();
//   });

//   test('renders the provided headings', () => {
//     const headings = ['Heading 1', 'Heading 2', 'Heading 3'];
//     const { getAllByLabelText } = render(
//       <HeadingsMapper
//         headings={headings}
//         mapToHeadings={[]}
//         handleAccept={() => {}}
//         errorCallback={() => {}}
//       />
//     );

//     const headingLabels = getAllByLabelText(
//       (content, element) => element.tagName.toLowerCase() === 'label'
//     );
//     expect(headingLabels).toHaveLength(headings.length);

//     headingLabels.forEach((label, index) => {
//       expect(label).toHaveTextContent(headings[index]);
//     });
//   });

//   test('calls handleChange prop when selecting an option', () => {
//     const handleChangeMock = jest.fn();
//     const { getByLabelText } = render(
//       <HeadingsMapper
//         headings={['Heading 1']}
//         mapToHeadings={[{ uid: 1, label: 'Mapped Heading 1' }]}
//         handleAccept={() => {}}
//         errorCallback={() => {}}
//       />
//     );

//     const selectInput = getByLabelText('Heading 1');
//     userEvent.selectOptions(selectInput, '1');

//     expect(handleChangeMock).toHaveBeenCalledWith('Heading 1', '1');
//   });

//   // Add more tests as needed
// });

// import React from 'react';
// import { shallow, mount } from 'enzyme';

// import HeadingsMapper from './HeadingsMapper';

// jest.spyOn(window, 'alert').mockImplementation(() => {});

// const demoHeadings = ['HeadImport1', 'HeadImport2', 'HeadImport3', 'a'];
// const updatedHeadings = ['b', 'HeadImport2', 'HeadImport3', 'a'];

// const demoMapToHeadings = [
//   { uid: 'a', label: 'A' },
//   { uid: 'b', label: 'B' },
//   { uid: 'c', label: 'C' },
// ];

// const handleAccept = jest.fn();
// const errorCallback = jest.fn();
// const defaultProps = {
//   headings: demoHeadings,
//   mapToHeadings: demoMapToHeadings,
//   handleAccept,
//   errorCallback,
// };

// describe('HeadingsMapper', () => {
//   it('Renders', () => {
//     shallow(<HeadingsMapper {...defaultProps} />);
//   });
//   it('Matches Snapshot - no file', () => {
//     const component = shallow(<HeadingsMapper {...defaultProps} />);
//     const tree = component.debug();
//     expect(tree).toMatchSnapshot();
//   });

//   describe('Mapping Fields', () => {
//     let component;
//     beforeEach(() => {
//       handleAccept.mockClear();
//       window.alert.mockClear();
//       component = mount(<HeadingsMapper {...defaultProps} />);
//     });
//     test('should map input headings', () => {
//       const headingsMapped = component.find('.headingsMapper_heading');
//       expect(headingsMapped.length).toEqual(demoHeadings.length);
//       expect(headingsMapped.map((h) => h.find('label').text())).toEqual(demoHeadings);
//     });
//     test('should have a dropdown select input for each heading', () => {
//       const headingsMapped = component.find('.headingsMapper_heading');
//       const selectInputs = headingsMapped.map((h) => h.find('select'));
//       const selectInputValues = selectInputs.map((sel) => sel.props().value);
//       // values should match headings mapped against mapToHeadings
//       expect(selectInputValues).toEqual(['', '', '', 'a']);
//     });
//     test('should update select values when we change a selection', () => {
//       let headingsMapped = component.find('.headingsMapper_heading');
//       let selectInputs = headingsMapped.map((h) => h.find('select'));
//       const selectedHeading = demoMapToHeadings[1].uid;
//       selectInputs[0].simulate('change', { target: { value: selectedHeading } });
//       component.update();
//       headingsMapped = component.find('.headingsMapper_heading');
//       selectInputs = headingsMapped.map((h) => h.find('select'));
//       const selectInputValues = selectInputs.map((sel) => sel.props().value);
//       // // values should match headings mapped against mapToHeadings
//       expect(selectInputValues).toEqual([selectedHeading, '', '', 'a']);
//     });
//     test('should call handleAccept when we click accept headings button', () => {
//       const acceptButton = component.find('.headingsAcceptButton');
//       acceptButton.simulate('click');
//       component.update();
//       expect(handleAccept).toHaveBeenCalledWith(demoHeadings);
//     });
//     test('should call handleAccept with updated headings when we click accept headings button', () => {
//       const headingsMapped = component.find('.headingsMapper_heading');
//       const selectInputs = headingsMapped.map((h) => h.find('select'));
//       const selectedHeading = demoMapToHeadings[1].uid;
//       selectInputs[0].simulate('change', { target: { value: selectedHeading } });
//       component.update();
//       const acceptButton = component.find('.headingsAcceptButton');
//       acceptButton.simulate('click');
//       component.update();
//       expect(handleAccept).toHaveBeenCalledWith(updatedHeadings);
//     });

//     test('should reject a mapping that repeats targets', () => {
//       const headingsMapped = component.find('.headingsMapper_heading');
//       const selectInputs = headingsMapped.map((h) => h.find('select'));
//       const selectedHeading = demoMapToHeadings[0].uid;
//       selectInputs[0].simulate('change', { target: { value: selectedHeading } });
//       const acceptButton = component.find('.headingsAcceptButton');
//       acceptButton.simulate('click');
//       component.update();
//       expect(errorCallback).toHaveBeenCalledWith('Mappings must be unique');
//     });
//     // test('should return new headings on accept', () => {});
//   });
// });
