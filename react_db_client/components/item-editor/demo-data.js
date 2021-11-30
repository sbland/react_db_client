import { filterTypes } from '@samnbuk/react_db_client.constants.client-types';

export const demoParams = [
  {
    uid: 'choice',
    label: 'Choice',
    type: filterTypes.select,
    options: [
      { uid: 'choicea', label: 'Choice A' },
      { uid: 'choiceb', label: 'Choice B' },
    ],
    required: true,
    group: 0,
  },
  {
    uid: 'cost',
    label: 'Cost',
    type: filterTypes.number,
    required: true,
    group: 1,
  },
  {
    uid: 'code',
    label: 'Code',
    type: filterTypes.text,
    required: true,
    group: 2,
  },
  {
    uid: 'description',
    label: 'Description',
    type: filterTypes.textLong,
    group: 2,
  },
  {
    uid: 'images',
    label: 'Images',
    multiple: true,
    type: filterTypes.image,
    group: 3,
  },
  {
    uid: 'val',
    label: 'Value',
    type: filterTypes.number,
    group: 5,
  },
  {
    uid: 'documentation',
    label: 'Documentation',
    type: filterTypes.file,
    fileType: 'document',
    multiple: true,
    group: 6,
  },
  {
    uid: 'thumbnail',
    label: 'Thumbnail',
    type: filterTypes.file,
    fileType: 'image',
    group: 7,
  },
];

export const demoData = {
  uid: 'demoid',
  choice: 'choicea',
  cost: 10,
  code: 'Code',
  description: 'A long description',
  images: [],
  val: 9,
  documentation: 'doc.pdf',
  thumbnail: 'thumbnail.jpg',
};
