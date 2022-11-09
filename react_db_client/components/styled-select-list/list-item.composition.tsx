import React from 'react';
import { ListItem } from './list-item';

import { demoListInputData, demoHeadingsData } from './dummy-data';

export const ListItemDefault = () => (
  <ListItem
    tableWidth={demoHeadingsData.reduce((acc, _) => acc + 100, 0)}
    data={demoListInputData[0]}
    handleSelect={alert}
    headings={demoHeadingsData}
    columnWidths={demoHeadingsData.map(() => 100)}
    customParsers={{}}
  />
);
export const ListItemDefaultSelected = () => (
  <ListItem
    tableWidth={demoHeadingsData.reduce((acc, _) => acc + 100, 0)}
    data={demoListInputData[0]}
    handleSelect={alert}
    headings={demoHeadingsData}
    columnWidths={demoHeadingsData.map(() => 100)}
    customParsers={{}}
    isSelected
  />
);
