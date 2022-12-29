import React from 'react';
import { screen, render, within } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import * as compositions from './custom-select-dropdown.composition';

const DEMO_OPTIONS = [
  { uid: 1, label: '01' },
  { uid: 2, label: '02' },
  { uid: 3, label: '03' },
  { uid: 4, label: '04' },
  { uid: 5, label: '05' },
  { uid: 6, label: '06' },
  { uid: 7, label: '07' },
];

describe('Custom select dropdown', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(`${name}`, async () => {
        render(<Composition />);
        // @ts-ignore
        if (Composition.waitForReady) await Composition.waitForReady();
      });
    });
  });
  describe('showing items', () => {
    test('should show a list of dropdown items', async () => {
      render(<compositions.Interactive />);
      const testInput = screen.getByTestId('testInput');
      await UserEvent.click(testInput);
      const dropdownItemsList = await screen.findByRole('list');
      const drowdownItems = await within(dropdownItemsList).findAllByRole('listitem');
      expect(drowdownItems.length).toEqual(DEMO_OPTIONS.length);
    });
  });
  describe('selecting items', () => {
    test('should call handle select when one of the dropdown items is selected', async () => {
      render(<compositions.Interactive />);
      const testInput = screen.getByTestId('testInput');
      await UserEvent.click(testInput);
      const dropdownItemsList = await screen.findByRole('list');
      const drowdownItems = await within(dropdownItemsList).findAllByRole('listitem');

      const item = within(drowdownItems[0]).getByRole('button');
      await UserEvent.click(item);
      const currentSelection = screen.getByTestId('curSel').textContent;
      expect(currentSelection).toEqual(String(DEMO_OPTIONS[0].uid));
    });
  });
  describe('Navigating items', () => {
    test('should pass is focused prop to drop down item', async () => {
      render(<compositions.Interactive />);
      const testInput = screen.getByTestId('testInput');
      await UserEvent.click(testInput);
      const dropdownItemsList = await screen.findByRole('list');
      const drowdownItems = await within(dropdownItemsList).findAllByRole('listitem');
      await UserEvent.keyboard('{tab}');
      const item = within(drowdownItems[0]).getByRole('button');
      expect(item).toHaveFocus();
    });

    test('should allow scrolling through items with the up and down arrows', async () => {
      render(<compositions.Interactive />);
      const testInput = screen.getByTestId('testInput');
      await UserEvent.click(testInput);
      const dropdownItemsList = await screen.findByRole('list');
      const drowdownItems = await within(dropdownItemsList).findAllByRole('listitem');
      await UserEvent.keyboard('{tab}');
      const firstItem = within(drowdownItems[0]).getByRole('button');
      const secondItem = within(drowdownItems[1]).getByRole('button');
      expect(firstItem).toHaveFocus();
      expect(secondItem).not.toHaveFocus();
      await UserEvent.keyboard('{ArrowDown}');
      expect(firstItem).not.toHaveFocus();
      expect(secondItem).toHaveFocus();
    });
  });
});
