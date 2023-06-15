import React from 'react';
import { screen, render, within, waitFor } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import * as compositions from './search-and-select-dropdown.composition';
import { demoResultData } from './demo-data';

describe('SearchAndSelect', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, () => {
        render(<Composition />);
      });
    });
  });
  describe('loading results', () => {
    test('should not do anything when we focus on search field', async () => {
      render(<compositions.DemoData />);
      const searchField = screen.getByRole('textbox');
      await UserEvent.click(searchField);
      const resultList = screen.queryByRole('list');
      expect(resultList).not.toBeInTheDocument();
    });
    test('should get list of items when allow empty is true', async () => {
      render(<compositions.DemoDataAllowEmptyInstant />);
      const searchField = screen.getByRole('textbox');
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
      await UserEvent.click(searchField);
      const resultList = await screen.findByRole('list', {}, { timeout: 3000 });
      const resultItems = await within(resultList).findAllByRole('listitem');
      expect(resultItems.length).toBeGreaterThan(0);
    });
    test('should get list of items when changing input', async () => {
      render(<compositions.DemoData />);
      const searchField = screen.getByRole('textbox');
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
      await UserEvent.click(searchField);
      await UserEvent.keyboard('A');
      await screen.findByTestId('loadingIcon');
      const resultList = await screen.findByRole('list', {}, { timeout: 3000 });
      const resultItems = await within(resultList).findAllByRole('listitem');
      expect(resultItems.length).toBeGreaterThan(0);
    });
    test('should call show results when focused', async () => {
      render(<compositions.DemoData />);
      const searchField = screen.getByRole('textbox');
      await UserEvent.click(searchField);
      await UserEvent.keyboard('A');
      await screen.findByRole('list', {}, { timeout: 3000 });
      await UserEvent.click(document.body);
      await waitFor(() => expect(screen.queryByRole('list')).not.toBeInTheDocument());
      const dropdownBtn = screen.getByRole('button', { name: /Show Results/ });
      await UserEvent.click(dropdownBtn);
      const resultList = await screen.findByRole('list', {}, { timeout: 3000 });
      expect(resultList).toBeInTheDocument();
    });
  });
  describe('selecting result', () => {
    test('should set selection on click', async () => {
      render(<compositions.DemoDataAllowEmptyInstant />);
      const searchField = screen.getByRole('textbox');
      await UserEvent.click(searchField);
      const resultList = await screen.findByRole('list', {}, { timeout: 3000 });
      const resultItems = await within(resultList).findAllByRole('listitem');
      const firstItemBtn = within(resultItems[0]).getByRole('button');
      await UserEvent.click(firstItemBtn);
      expect(screen.getByTestId('curSel').textContent).toEqual(demoResultData[0].uid);
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });
    test('should set the search value to match the selected items label field', async () => {
      render(<compositions.DemoDataAllowEmptyInstant />);
      const searchField = screen.getByRole('textbox');
      await UserEvent.click(searchField);
      const resultList = await screen.findByRole('list', {}, { timeout: 3000 });
      const resultItems = await within(resultList).findAllByRole('listitem');
      const firstItemBtn = within(resultItems[0]).getByRole('button');
      await UserEvent.click(firstItemBtn);
      const searchInput: HTMLInputElement = screen.getByRole('textbox');
      expect(searchInput.value).toEqual(demoResultData[0].label);
    });
    test('should clear input if change focus and nothing selected', async () => {
      render(<compositions.DemoData />);
      const searchField: HTMLInputElement = screen.getByRole('textbox');
      await waitFor(() => expect(searchField.value).toEqual(''));
      await UserEvent.click(searchField);
      await UserEvent.clear(searchField);
      await waitFor(() => expect(searchField.value).toEqual(''));
      await UserEvent.keyboard('A');
      await waitFor(() => expect(searchField.value).toEqual('A'));
      const resultList = await screen.findByRole('list', {}, { timeout: 3000 });
      await within(resultList).findAllByRole('listitem');
      await UserEvent.click(searchField.parentElement as HTMLElement);
      await waitFor(() => expect(searchField.value).toEqual(''));
    });
    test('should keep the selected value when we click off the search field', async () => {
      render(<compositions.DemoData />);
      const searchField: HTMLInputElement = screen.getByRole('textbox');
      await waitFor(() => expect(searchField.value).toEqual(''));
      await UserEvent.click(searchField);
      await UserEvent.clear(searchField);
      await waitFor(() => expect(searchField.value).toEqual(''));
      await UserEvent.keyboard('A');
      await waitFor(() => expect(searchField.value).toEqual('A'));
      const resultList = await screen.findByRole('list', {}, { timeout: 3000 });
      const resultItems = await within(resultList).findAllByRole('listitem');
      const firstItemBtn = within(resultItems[0]).getByRole('button');
      await UserEvent.click(firstItemBtn);
      expect(searchField.value).toEqual(demoResultData[0].label);
      await UserEvent.click(searchField.parentElement as HTMLElement);
      await waitFor(() => expect(searchField.value).toEqual(demoResultData[0].label));
    });
  });
  describe('Additional buttons', () => {
    describe('Add new button', () => {
      test.todo('should show add new button when allowAddNew is true');
      test.todo('should not show add new button when allowAddNew is false');
      test.todo('should call add new callback when add new button is clicked');
    });
  });
  describe('forward ref', () => {
    test.todo('should pass ref to input');
  });
  describe('input validation', () => {
    test.todo('should show error when has input but nothing selected');
  });
});
