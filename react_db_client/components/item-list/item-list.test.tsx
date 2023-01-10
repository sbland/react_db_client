// import '@samnbuk/react_db_client.testing.enzyme-setup';
// import React from 'react';
// import { mount, shallow } from 'enzyme';

// import { IItemListProps, ItemList } from './item-list';
// import * as compositions from './item-list.composition';
// import { demoData } from './demo-data';
// import { OverlayButton } from './overlay-buttons';
// import { Item } from './item';
// import { EViewTypes, IOverlayButton } from './lib';

// const mockfn1 = jest.fn();
// const mockfn2 = jest.fn();
// const handleItemClick = jest.fn();

// const demoOverlayBtns: IOverlayButton[] = [
//   { onClick: mockfn1, label: 'btn 01', icon: 'f1' },
//   { onClick: mockfn2, label: 'btn 02', icon: 'f2' },
// ];

// const defaultProps: IItemListProps = {
//   viewType: EViewTypes.DEFAULT,
//   items: demoData.map((d) => ({ ...d, onClick: handleItemClick })),
//   overlayButtons: demoOverlayBtns,
//   handleItemClick,
// };

// describe('item-list', () => {
//   beforeEach(() => {
//     mockfn1.mockClear();
//     mockfn2.mockClear();
//     handleItemClick.mockClear();
//   });
//   test('Renders', () => {
//     shallow(<ItemList {...defaultProps} />);
//   });

//   describe('Compositions', () => {
//     Object.entries(compositions).forEach(([name, Composition]) => {
//       test(name, () => {
//         mount(<Composition />);
//       });
//     });
//   });
//   describe('shallow renders', () => {
//     test('Matches Snapshot', () => {
//       const component = shallow(<ItemList {...defaultProps} />);
//       const tree = component.debug();
//       expect(tree).toMatchSnapshot();
//     });
//   });
//   // describe('Unit Tests - Links', () => {
//   //   const wrapper = mount(<ItemList {...defaultProps} />);

//   //   it('Makes a list of 3 items', () => {
//   //     expect(wrapper.find('li').length).toEqual(3);
//   //   });

//   //   it('First item has link to /test/a', () => {
//   //     expect(wrapper.find('li').find('Link').first().props().to).toEqual('/test/a');
//   //   });
//   // });

//   describe('Clicking Items', () => {
//     const component = mount(<ItemList {...defaultProps} />);
//     const item = component.find(Item).first();
//     const {
//       data: { uid },
//     } = item.props();
//     const itemBtn = item.find('button');
//     itemBtn.simulate('click');
//     expect(handleItemClick).toHaveBeenCalledWith(uid);
//   });

//   describe('Unit Tests - Overlay', () => {
//     const component = mount(<ItemList {...defaultProps} />);

//     it('Makes a list of 3 items', () => {
//       expect(component.find('li').length).toEqual(3);
//     });

//     it('First item has overlay', () => {
//       expect(component.find('li').find(OverlayButton).first()).toBeTruthy();
//     });
//     it('Calls function on btn click', () => {
//       const btn = component.find('li').find(OverlayButton).first().find('button');
//       btn.simulate('click');
//       expect(mockfn1).toHaveBeenCalled();
//     });
//   });
// });
