import React from 'react';
import { ListItem } from './list-item';

import { demoListInputData, demoHeadingsData, demoListInputDataLong } from './inputDataShapes';
import altStyles from './customStyles.module.scss'

export const ListItemDefault = () => (
    <ListItem
        data={demoListInputData[0]}
        // currentSelection={currentSelection}
        selectionField={demoHeadingsData[0].uid}
        handleSelect={alert}
        headings={demoHeadingsData}
        columnWidths={demoHeadingsData.map(() => 100)}
        customParsers={{}}
        // isSelected={
        // currentSelection &&
        // currentSelection.indexOf(item[selectionField]) >= 0
        // }
        // key={item.uid}
    />
);


export const ListItemCustomClasses = () => (
    <ListItem
        data={demoListInputData[0]}
        selectionField={demoHeadingsData[0].uid}
        handleSelect={alert}
        headings={demoHeadingsData}
        columnWidths={demoHeadingsData.map(() => 100)}
        customParsers={{}}
        classes={{
            /* We can override each style here */
            styledList_itemBtn: altStyles.alt,
        }}
    />
);