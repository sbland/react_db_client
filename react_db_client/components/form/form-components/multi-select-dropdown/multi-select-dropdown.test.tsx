import React from 'react';
import { screen, render, within } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';

import * as compositions from './multi-select-dropdown.composition';

describe('Multi select dropdown ', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, async () => {
        render(<Composition />);
        // @ts-ignore
        if (Composition.waitForReady) await Composition.waitForReady();
      });
    });
  });
  describe('selecting', () => {
    test('should show buttons for each item', () => {
      render(<compositions.MultiSelectDropdownInteractive />);
      const selectedList = screen.getByTestId('multiSelectDropdown_list-selected');
      expect(within(selectedList).getAllByRole('button').length).toEqual(3);
    });
    test('should remove item from selection', async () => {
      render(<compositions.MultiSelectDropdownInteractive />);
      const selectedList = screen.getByTestId('multiSelectDropdown_list-selected');
      const showUnselectedBtn = screen.getByRole('button', { name: /DropDownMenu/ });
      await UserEvent.click(showUnselectedBtn);
      const unselectedList = screen.getByTestId('multiSelectDropdown_list-unselected');
      expect(within(selectedList).getAllByRole('button').length).toEqual(3);
      expect(within(unselectedList).getAllByRole('button').length).toEqual(2);
      const selectedItemBtn = within(selectedList).getAllByRole('button')[0];
      await UserEvent.click(selectedItemBtn);
      expect(within(selectedList).getAllByRole('button').length).toEqual(2);
      expect(within(unselectedList).getAllByRole('button').length).toEqual(2);
    });
    test('should add to selection', async () => {
      render(<compositions.MultiSelectDropdownInteractive />);
      const selectedList = screen.getByTestId('multiSelectDropdown_list-selected');
      const showUnselectedBtn = screen.getByRole('button', { name: /DropDownMenu/ });
      await UserEvent.click(showUnselectedBtn);
      const unselectedList = screen.getByTestId('multiSelectDropdown_list-unselected');
      expect(within(selectedList).getAllByRole('button').length).toEqual(3);
      expect(within(unselectedList).getAllByRole('button').length).toEqual(2);
      const unselectedItemBtn = within(unselectedList).getAllByRole('button')[0];
      await UserEvent.click(unselectedItemBtn);
      expect(within(selectedList).getAllByRole('button').length).toEqual(4);
      expect(within(unselectedList).getAllByRole('button').length).toEqual(1);
    });
  });
  describe('Adding custom entry', () => {
    test.todo('allows selections outside of option set');
    test.todo('should add a selection on entering into text field and pressing enter');
  });
  describe('sorts selection', () => {
    test.todo('should sort items');
    // test('should sort items', () => {
    // const dropDownBtn = multiSelectDropDown.find('.filterBtn');
    // dropDownBtn.simulate('click');
    // const multiSelectDropdown_menu = multiSelectDropDown.find('.multiSelectDropdown_menu');
    // const item = multiSelectDropdown_menu.find(MultiSelectDropdownItem);
    // const btn = item.at(0).find('button');
    // btn.simulate('click');
    // expect(updateActiveSelection).toHaveBeenCalledWith(['a', 'b', 'c']);
    // });
  });
});
