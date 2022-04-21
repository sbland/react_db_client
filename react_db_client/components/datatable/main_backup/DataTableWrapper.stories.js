/* eslint-disable react/prop-types */
import React, { useState } from 'react';

// // eslint-disable-next-line import/no-extraneous-dependencies
// import { storiesOf } from '@storybook/react';
// import {
//   demoTableData,
//   demoHeadingsData,
//   demoTableDataSimple,
//   demoHeadingsDataSimple,
//   demoTableDataLong,
//   CustomField,
//   customFilter,
// } from './demoData';
// import DataTableWrapper from './DataTableWrapper';
// import { dataTableDefaultConfig } from './DataTableConfig/DataTableConfig';
// import FilterNumber from '../FilterManager/FilterTypes/FilterNumber';
// import DataTableCellNumber from './CellTypes/DataTableCellNumber';

// const DEMO_TABLE_DATA = Object.values(demoTableData);

// const DEMO_CONFIG = { ...dataTableDefaultConfig, allowSelection: true };
// const DEMO_SORT_BY = { heading: 'count', direction: 1, map: null };

// const DEMO_HEADINGS = demoHeadingsData;
// const customFieldComponents = {
//   custom: CustomField,
//   customeval: DataTableCellNumber,
// };
// const customFilters = {
//   custom: customFilter,
// };
// const customFiltersComponents = { custom: FilterNumber };

// const defaultProps = {
//   data: DEMO_TABLE_DATA,
//   headings: DEMO_HEADINGS,
//   config: DEMO_CONFIG,
//   sortByOverride: DEMO_SORT_BY,
//   saveData: console.log,
//   calculateTotals: true,
//   styleOverride: { background: 'green' },
//   errorStyleOverride: { DUPLICATE: { background: 'red' }, MISSING: { background: 'orange' } },
//   onSelectionChange: (newSelection) => {
//     // alert('Selection changed');
//     console.log(newSelection);
//   },
//   customFieldComponents,
//   customFilters,
//   customFiltersComponents,
//   maxTableHeight: 2000,
// };

// storiesOf('Data Table Wrapper - Default Theme', module)
//   .add('Default', () => <DataTableWrapper {...defaultProps} />)
//   .add('style rule', () => <DataTableWrapper {...defaultProps} styleRule="$count<5" />)
//   .add('Big Data', () => (
//     <DataTableWrapper {...defaultProps} data={Object.values(demoTableDataLong)} />
//   ))
//   .add('Big Data-simple', () => (
//     <DataTableWrapper
//       {...defaultProps}
//       data={Object.values(demoTableDataLong)}
//       headings={demoHeadingsDataSimple}
//     />
//   ))
//   .add('Simple', () => {
//     const [data, setData] = useState(Object.values(demoTableDataSimple));
//     return (
//       <>
//         <DataTableWrapper
//           {...defaultProps}
//           data={data}
//           headings={demoHeadingsDataSimple}
//           saveData={setData}
//         />
//         <div>{JSON.stringify(data)}</div>
//       </>
//     );
//   })

//   .add('CustomComponents', () => {
//     const [data, setData] = useState(Object.values(demoTableDataSimple));
//     return (
//       <>
//         <DataTableWrapper
//           {...defaultProps}
//           data={data}
//           headings={DEMO_HEADINGS.filter((h) => h.isCustom)}
//           saveData={setData}
//         />
//         <div>{JSON.stringify(data)}</div>
//       </>
//     );
//   })
//   .add('Selection Preview', () => {
//     const [data, setData] = useState(Object.values(demoTableDataSimple));
//     return (
//       <>
//         <DataTableWrapper
//           {...defaultProps}
//           data={data}
//           headings={demoHeadingsDataSimple}
//           saveData={setData}
//           config={{
//             ...defaultProps.config,
//             allowSelectionPreview: true,
//           }}
//           previewHeadings={demoHeadingsDataSimple}
//         />
//         <div>{JSON.stringify(data)}</div>
//       </>
//     );
//   })
//   .add('Simple autosave', () => {
//     const [data, setData] = useState(Object.values(demoTableDataSimple));
//     const handleSave = (newData) => {
//       console.log('saving');
//       setData(newData);
//     };
//     return (
//       <>
//         <DataTableWrapper
//           data={data}
//           headings={demoHeadingsDataSimple}
//           config={DEMO_CONFIG}
//           sortByOverride={DEMO_SORT_BY}
//           saveData={handleSave}
//           calculateTotals
//           autoSave
//         />
//         <div>{JSON.stringify(data)}</div>
//       </>
//     );
//   })
//   .add('Scroll test', () => {
//     const wrapperStyle = {
//       height: '30rem',
//     };
//     const rowStyle = {
//       display: 'flex',
//     };
//     const cellStyle = {
//       background: 'grey',
//       border: '1px solid red',
//       width: '30px',
//     };
//     return (
//       <div style={wrapperStyle}>
//         {Array(100)
//           .fill(0)
//           .map((a, i) => (
//             <div key={a} style={rowStyle}>
//               {Array(8)
//                 .fill(0)
//                 .map((b, j) => (
//                   <div key={b} style={cellStyle}>
//                     {i}-{j}
//                   </div>
//                 ))}
//             </div>
//           ))}
//       </div>
//     );
//   });
// // .add('Default-with state wrapper', () => {
// //   const [tableData, setTableData] = useState(DEMO_TABLE_DATA);
// //   const updateValue = (newVal, rowId, rowIndex, columnId) => {
// //     setTableData((prev) => {
// //       const dataCopy = cloneDeep(prev);
// //       dataCopy[rowIndex][columnId] = newVal;
// //       return dataCopy;
// //     });
// //   };
// //   return (
// //     <DataTableWrapper
// //       tableData={tableData}
// //       headingsData={demoHeadingsData}
// //       updateValue={updateValue}
// //       acceptValue={updateValue}
// //     />
// //   );
// // });
