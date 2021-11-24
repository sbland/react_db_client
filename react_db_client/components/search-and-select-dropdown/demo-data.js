export const demoHeadingsData = [
    {
      type: 'text',
      uid: 'uid',
      label: 'UID',
    },
    {
      type: 'text',
      uid: 'type',
      label: 'Type',
    },
    {
      type: 'text',
      uid: 'name',
      label: 'Name',
    },
  ];

  export const demoPreviewHeadingsData = [
    {
      type: 'text',
      uid: 'uid',
      label: 'UID',
    },
    {
      type: 'text',
      uid: 'type',
      label: 'Type',
    },
    {
      type: 'text',
      uid: 'name',
      label: 'Name',
    },
    {
      type: 'textLong',
      uid: 'description',
      label: 'Description',
    },
  ];

  export const demoResultData = [
    {
      uid: '1',
      label: 'Result 1',
      type: 'text',
      name: 'This thing 1',
    },
    {
      uid: '2',
      label: 'Result 2',
      type: 'text',
      name: 'This thing 2',
    },
    {
      uid: '3',
      label: 'Result 3',
      type: 'text',
      name: 'This thing 3',
    },
  ];

  export const demoResultsDataMany = Array.from(Array(30).keys()).map(
    (i) => demoResultData[i % demoResultData.length]
  );