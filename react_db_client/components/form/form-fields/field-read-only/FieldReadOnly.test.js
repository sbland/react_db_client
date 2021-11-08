// import React from 'react';
// import { mount, shallow } from 'enzyme';

// import FieldReadOnly from './FieldReadOnly';
// import filterTypes from '../../../GenericConstants/filterTypes';

// const defaultProps = {
//   unit: 'unit',
//   value: 'a',
//   type: filterTypes.text,
//   options: undefined,
// };

// describe('FieldReadOnly', () => {
//   beforeEach(() => {});
//   test('Renders', () => {
//     shallow(<FieldReadOnly {...defaultProps} />);
//   });
//   describe('shallow renders', () => {
//     test('Matches Snapshot', () => {
//       const component = shallow(<FieldReadOnly {...defaultProps} />);
//       const tree = component.debug();
//       expect(tree).toMatchSnapshot();
//     });
//   });
//   describe('Unit tests', () => {
//     let component;
//     beforeEach(() => {
//       component = mount(<FieldReadOnly {...defaultProps} />);
//     });
//     test('should show value in span', () => {
//       expect(component.text()).toEqual(`${defaultProps.value} ${defaultProps.unit}`);
//     });
//     test('should show option label if type is select', () => {
//       const label = 'A';
//       component = mount(
//         <FieldReadOnly
//           {...defaultProps}
//           type={filterTypes.select}
//           options={[{ uid: 'a', label }]}
//         />
//       );
//       expect(component.text()).toEqual(`${label} ${defaultProps.unit}`);
//     });
//   });
// });
