// import React from 'react';

// // eslint-disable-next-line import/no-extraneous-dependencies
// import { storiesOf } from '@storybook/react';
// import { demoHeadingsData, demoFormData, demoAdditionalData } from './DemoData';
// import Form from './Form';
// import FormInputs from './FormInputs';
// import filterTypes from '../../GenericConstants/filterTypes';

// /* eslint-disable react/prop-types */
// /* eslint-disable no-unused-vars */
// const DemoFormComponent = ({ uid, label, updateFormData, value, required, additionalData }) => {
//   const { customFieldStyle } = additionalData;
//   return <div style={customFieldStyle}>Custom Form Component</div>;
// };

// storiesOf('Form', module)
//   .add('default', () => {
//     return (
//       <div className="sectionWrapper">
//         <Form
//           headings={demoHeadingsData}
//           formDataInitial={demoFormData}
//           onSubmit={(data) => console.log(data)}
//           additionalData={demoAdditionalData}
//           customFieldComponents={{ demoFieldType: DemoFormComponent }}
//         />
//       </div>
//     );
//   })
//   .add('fields only', () => {
//     return (
//       <FormInputs
//         headings={demoHeadingsData}
//         formData={demoFormData}
//         updateFormData={(uid, value) => console.log(`uid: ${uid} value: ${value}`)}
//       />
//     );
//   })
//   .add('Nested', () => {
//     return (
//       <FormInputs
//         headings={[
//           { uid: 'name', label: 'Name', type: filterTypes.text },

//           {
//             uid: 'embeddedb',
//             label: 'Embedded B',
//             type: filterTypes.embedded,
//             orientation: 'horiz',
//             children: [
//               { uid: 'embeddedtog1', label: 'Embedded Tog1', type: filterTypes.text },
//               { uid: 'embeddedtog2', label: 'Embedded Tog2', type: filterTypes.text },
//               { uid: 'embeddedtog3', label: 'Embedded Tog3', type: filterTypes.text },
//             ],
//           },
//           {
//             uid: 'embeddedb',
//             label: 'Embedded Horiz wrap',
//             type: filterTypes.embedded,
//             orientation: 'horiz',
//             children: [
//               {
//                 uid: 'embedded2',
//                 label: 'Embedded left',
//                 type: filterTypes.embedded,
//                 orientation: 'vert',
//                 children: [
//                   { uid: 'hello', label: 'Hello', type: filterTypes.text },
//                   { uid: 'foo', label: 'foo', type: filterTypes.text },
//                   { uid: 'bar', label: 'bar', type: filterTypes.text },
//                 ],
//               },
//               {
//                 uid: 'embedded2',
//                 label: 'Embedded right',
//                 type: filterTypes.embedded,
//                 orientation: 'vert',
//                 children: [
//                   { uid: 'hellob', label: 'Hello', type: filterTypes.text },
//                   { uid: 'foob', label: 'foo', type: filterTypes.text },
//                   { uid: 'barb', label: 'bar', type: filterTypes.text },
//                 ],
//               },
//             ],
//           },

//           {
//             uid: 'embedded2',
//             label: 'Embedded Vert',
//             type: filterTypes.embedded,
//             orientation: 'vert',
//             children: [
//               { uid: 'hello', label: 'Hello', type: filterTypes.text },
//               { uid: 'foo', label: 'foo', type: filterTypes.text },
//               { uid: 'bar', label: 'bar', type: filterTypes.text },
//             ],
//           },
//         ]}
//         formData={demoFormData}
//         updateFormData={(uid, value) => console.log(`uid: ${uid} value: ${value}`)}
//       />
//     );
//   });
