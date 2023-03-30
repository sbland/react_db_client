// import { IDocument } from '@react_db_client/constants.client-types';
// import { renderHook, act } from '@testing-library/react-hooks';
// import { IUseSelectionManagerArgs, useSelectionManager } from './useSelectionManager';

// const handleSelect = jest.fn();
// describe.skip('Search and Select - Logic', () => {
//   const returnField = 'uid';
//   const labelField = 'name';
//   const defaultUseSelectionManagerInputs: IUseSelectionManagerArgs<IDocument> = {
//     results: [],
//     returnFieldOnSelect: returnField,
//     allowMultiple: false,
//     labelField,
//     selectionOverride: undefined,
//     handleSelect,
//   };

//   const demoResults: IDocument[] = [
//     { uid: 'demoid', label: 'demoname' },
//     { uid: 'demoid_02', label: 'demoname_02' },
//   ];

//   describe('Selecting', () => {
//     beforeEach(() => {
//       handleSelect.mockClear();
//     });

//     test('should handle select single', () => {
//       const { result } = renderHook(() =>
//         useSelectionManager({ ...defaultUseSelectionManagerInputs, results: demoResults })
//       );
//       expect(result.current.currentSelection).toEqual([]);
//       expect(typeof result.current.handleItemSelect).toEqual('function');
//       expect(typeof result.current.selectAll).toEqual('function');
//       expect(typeof result.current.clearSelection).toEqual('function');

//       expect(handleSelect).not.toHaveBeenCalled();

//       // First selection
//       act(() => {
//         result.current.handleItemSelect(demoResults[0].uid, 'uid');
//       });
//       expect(handleSelect).toHaveBeenCalledWith(demoResults[0]);
//       expect(result.current.currentSelection).toEqual([demoResults[0]]);

//       // Second selection
//       act(() => {
//         result.current.handleItemSelect(demoResults[1].uid, 'uid');
//       });
//       expect(handleSelect).toHaveBeenCalledWith(demoResults[1]);
//       expect(result.current.currentSelection).toEqual([demoResults[1]]);
//     });

//     test('should select multiple', () => {
//       const { result } = renderHook(() =>
//         useSelectionManager({
//           ...defaultUseSelectionManagerInputs,
//           results: demoResults,
//           allowMultiple: true,
//         })
//       );
//       expect(result.current.currentSelection).toEqual([]);
//       expect(typeof result.current.handleItemSelect).toEqual('function');
//       expect(typeof result.current.selectAll).toEqual('function');
//       expect(typeof result.current.clearSelection).toEqual('function');

//       expect(handleSelect).not.toHaveBeenCalled();

//       // First selection
//       const item1ToSelect = demoResults[0];
//       act(() => {
//         act(() => {
//           result.current.handleItemSelect(item1ToSelect.uid, 'uid');
//         });
//       });
//       expect(handleSelect).not.toHaveBeenCalled();
//       expect(result.current.currentSelection).toEqual([item1ToSelect]);

//       // Second selection
//       const item2ToSelect = demoResults[1];
//       act(() => {
//         result.current.handleItemSelect(item2ToSelect.uid, 'uid');
//       });
//       expect(result.current.currentSelection).toEqual([item1ToSelect, item2ToSelect]);
//     });

//     test('should remove from multiselect if already selected', () => {
//       const { result } = renderHook(() =>
//         useSelectionManager({
//           ...defaultUseSelectionManagerInputs,
//           results: demoResults,
//           allowMultiple: true,
//         })
//       );
//       expect(result.current.currentSelection).toEqual([]);
//       expect(typeof result.current.handleItemSelect).toEqual('function');
//       expect(typeof result.current.selectAll).toEqual('function');
//       expect(typeof result.current.clearSelection).toEqual('function');

//       expect(handleSelect).not.toHaveBeenCalled();

//       // First selection
//       const item1ToSelect = demoResults[0];
//       act(() => {
//         result.current.handleItemSelect(item1ToSelect.uid, 'uid');
//       });
//       expect(handleSelect).not.toHaveBeenCalled();
//       expect(result.current.currentSelection).toEqual([item1ToSelect]);

//       // Second selection
//       act(() => {
//         result.current.handleItemSelect(item1ToSelect.uid, 'uid');
//       });
//       expect(result.current.currentSelection).toEqual([]);
//     });
//     test('should select all items when selectAll is called', () => {
//       const { result } = renderHook(() =>
//         useSelectionManager({
//           ...defaultUseSelectionManagerInputs,
//           results: demoResults,
//           allowMultiple: true,
//         })
//       );
//       expect(result.current.currentSelection).toEqual([]);
//       expect(typeof result.current.handleItemSelect).toEqual('function');
//       expect(typeof result.current.selectAll).toEqual('function');
//       expect(typeof result.current.clearSelection).toEqual('function');

//       expect(handleSelect).not.toHaveBeenCalled();

//       act(() => {
//         result.current.selectAll();
//       });
//       expect(result.current.currentSelection).toEqual(demoResults);
//     });
//     test('should return current selection everytime it changes in liveUpdate mode', async () => {
//       const { result } = renderHook(() =>
//         useSelectionManager({
//           ...defaultUseSelectionManagerInputs,
//           results: demoResults,
//           allowMultiple: true,
//           liveUpdate: true,
//         })
//       );
//       expect(handleSelect).not.toHaveBeenCalled();
//       handleSelect.mockClear();
//       const itemToSelect = demoResults[0];
//       act(() => {
//         result.current.handleItemSelect(itemToSelect.uid, 'uid');
//       });

//       expect(handleSelect).toHaveBeenCalledWith([itemToSelect]);
//       handleSelect.mockClear();
//       const item2ToSelect = demoResults[1];
//       act(() => {
//         result.current.handleItemSelect(item2ToSelect.uid, 'uid');
//       });

//       expect(handleSelect).toHaveBeenCalledWith([itemToSelect, item2ToSelect]);
//     });
//     test('should return selection labels as well as ids', () => {
//       const { result } = renderHook(() =>
//         useSelectionManager({
//           ...defaultUseSelectionManagerInputs,
//           results: demoResults,
//           allowMultiple: true,
//         })
//       );

//       act(() => {
//         expect(result.current.currentSelection).toEqual([]);
//         result.current.selectAll();
//       });
//       expect(result.current.currentSelection).toEqual(demoResults);
//       expect(result.current.currentSelectionLabels).toEqual(
//         demoResults.map((item) => item[labelField])
//       );
//     });
//   });
// });
