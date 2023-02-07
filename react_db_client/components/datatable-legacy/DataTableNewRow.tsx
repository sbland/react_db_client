// import React, { useState } from 'react';
// import PropTypes from 'prop-types';
// import { Emoji } from '@react_db_client/components.emoji';
// import { headingDataShape } from './inputDataShapes';
// import { DataTableCellHoverWrap, DataTableCell } from './DataTableCell';

// const DataTableNewRow = ({
//   headingsDataList,
//   setaddingNewRow,
//   handleAddNewRow,
//   uidList,
//   columnWidths,
//   tableWidth,
// }) => {
//   const [formData, setFormData] = useState({});

//   const insideWrapStyleOverride = {
//     width: `${tableWidth}px`,
//   };

//   const handleUpdateForm = (newVal, key) => {
//     const newFormData = { ...formData };
//     newFormData[key] = newVal;
//     setFormData(newFormData);
//   };

//   /**
//    * Handle Submit New Row
//    * Validates then sends the data to the data table
//    */
//   const handleSubmitNewRow = () => {
//     handleAddNewRow(formData);
//     // Below now handled by data manager
//     // const { uid } = formData;
//     // // Check valid UID
//     // if (uid !== null && uid !== undefined && uid !== '') {
//     //   // Check UID is unique
//     //   if (uidList.indexOf(uid) !== -1) {
//     //     alert('UID must be unique');
//     //   } else {
//     //     handleAddNewRow(formData);
//     //   }
//     // } else {
//     //   alert('Missing UID');
//     // }
//   };

//   const mapNewRow = headingsDataList.map((headingData, i) => (
//     <DataTableCellHoverWrap key={headingData.uid} columnWidth={columnWidths[i + 1]}>
//       {headingData.uid !== 'uid' && (
//         <DataTableCell
//           key={headingData.uid}
//           data={formData[headingData.uid] || ''}
//           columnData={headingData}
//           updateData={(newVal) => handleUpdateForm(newVal, headingData.uid)}
//         />
//       )}
//       {headingData.uid === 'uid' && (
//         <input
//           type="text"
//           value={formData[headingData.uid] || ''}
//           onChange={(e) => handleUpdateForm(e.target.value, headingData.uid)}
//         />
//       )}
//     </DataTableCellHoverWrap>
//   ));
//   mapNewRow.unshift(
//     <DataTableCellHoverWrap key="buttons" columnWidth={columnWidths[0]}>
//       <button type="button" onClick={() => setaddingNewRow(false)}>
//         <Emoji emoj="❌" />
//       </button>
//       <button
//         type="button"
//         // TODO: Implement accept new row
//         onClick={handleSubmitNewRow}
//       >
//         <Emoji emoj="✔️" />
//       </button>
//     </DataTableCellHoverWrap>
//   );

//   return (
//     <div className="dataTable_newRowOutsideWrap">
//       <div className="dataTable_newRowInsideWrap" style={insideWrapStyleOverride}>
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleSubmitNewRow();
//           }}
//           style={{
//             // Added to make cells match table div layout
//             display: 'inherit',
//           }}
//         >
//           {mapNewRow}
//         </form>
//       </div>
//     </div>
//   );
// };

// DataTableNewRow.propTypes = {
//   headingsDataList: PropTypes.arrayOf(PropTypes.shape(headingDataShape)).isRequired,
//   setaddingNewRow: PropTypes.func.isRequired,
//   handleAddNewRow: PropTypes.func.isRequired,
//   uidList: PropTypes.arrayOf(PropTypes.string).isRequired,
//   columnWidths: PropTypes.arrayOf(PropTypes.number).isRequired,
//   tableWidth: PropTypes.number.isRequired,
// };

// export default DataTableNewRow;
