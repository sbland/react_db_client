import React from 'react';
import { screen, render, within } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';

import * as compositions from './bubble-selector.composition';
import { demoItems } from './demo-data';

describe('Bubble selector', () => {
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
    test('should show buttons for each selected item', () => {
      render(<compositions.BasicBubbleSelector />);
      const bubbleButtons = screen.getAllByRole('button');
      expect(bubbleButtons.length).toEqual(demoItems.length);
    });
    test('should remove item from selection', async () => {
      render(<compositions.BasicBubbleSelectorGrouped />);
      const selectedList = screen.getByTestId('bubbleSelector_list-selected');
      const unselectedList = screen.getByTestId('bubbleSelector_list-notselected');
      expect(within(selectedList).getAllByRole('button').length).toEqual(2);
      expect(within(unselectedList).getAllByRole('button').length).toEqual(2);
      const selectedItemBtn = within(selectedList).getAllByRole('button')[0];
      await UserEvent.click(selectedItemBtn);
      expect(within(selectedList).getAllByRole('button').length).toEqual(1);
      expect(within(unselectedList).getAllByRole('button').length).toEqual(3);
    });
    test('should add to selection', async () => {
      render(<compositions.BasicBubbleSelectorGrouped />);
      const selectedList = screen.getByTestId('bubbleSelector_list-selected');
      const unselectedList = screen.getByTestId('bubbleSelector_list-notselected');
      expect(within(selectedList).getAllByRole('button').length).toEqual(2);
      expect(within(unselectedList).getAllByRole('button').length).toEqual(2);
      const unselectedItemBtn = within(unselectedList).getAllByRole('button')[0];
      await UserEvent.click(unselectedItemBtn);
      expect(within(selectedList).getAllByRole('button').length).toEqual(3);
      expect(within(unselectedList).getAllByRole('button').length).toEqual(1);
    });
  });
  describe('Adding custom entry', () => {
    test('allows selections outside of option set', () => {
      render(<compositions.BasicBubbleSelectorCustomElement />);
      const selectedList = screen.getByTestId('bubbleSelector_list');
      expect(within(selectedList).getAllByRole('button').length).toEqual(5);
    });
    // it('adds a selection on entering into text field and pressing enter', () => {
    //   // const textField =
    // });
  });
});
