import React from 'react';
import { render, screen, waitForElementToBeRemoved, within } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import * as compositions from './generic-catalogue.composition';

const searchForDocument = async (
  el: ReturnType<typeof within> | typeof screen,
  searchString: string
) => {
  const searchInput = el.getByLabelText('search');
  await UserEvent.click(searchInput);
  await UserEvent.keyboard(searchString);
  const resultsList = el.getByRole('list');
  const items = await within(resultsList).findAllByRole('listitem');
  return items;
};

const openExistingItemEditor = async (searchResult: HTMLElement) => {
  const firstResultButton = within(searchResult).getByRole('button');
  await UserEvent.click(firstResultButton);
  const editSelectedButton = screen.getByRole('button', { name: /Edit Selected Demo Item/ });
  await UserEvent.click(editSelectedButton);
  const itemEditor = await screen.findByTestId('rdc-itemEditor');
  return itemEditor;
};

describe('CertificateCatalogue', () => {
  describe('Compositions', () => {
    Object.entries(compositions)
      .filter(([name, Composition]) => (Composition as any).forTests)
      .forEach(([name, Composition]) => {
        test(name, async () => {
          render(<Composition />);
          // @ts-ignore
          if (Composition.waitForReady) await Composition.waitForReady();
        });
      });
  });
  describe('Functional tests', () => {
    test('should render list of results', async () => {
      render(<compositions.BasicGenericCatalogue />);
      const searchResults = await searchForDocument(screen, 'demo');
      expect(searchResults.length).toBeGreaterThan(0);
      expect(searchResults.length).toBe(5);
    });
    test('should open the item editor when selecting result and clicking edit selected', async () => {
      render(<compositions.BasicGenericCatalogue />);
      const searchResults = await searchForDocument(screen, 'demo');
      await openExistingItemEditor(searchResults[0]);
    });
    test.skip('should close item editor when pressing close button', async () => {
      render(<compositions.BasicGenericCatalogue />);
      const searchResults = await searchForDocument(screen, 'demo');
      const itemEditor = await openExistingItemEditor(searchResults[0]);
      const closeBtn = within(itemEditor).getByRole('button', { name: /X/ });
      await UserEvent.click(closeBtn);
      await screen.getByText('EDITOR HIDDEN');
      screen.debug(itemEditor);

      // TODO: Fix why editor not being removed
      await waitForElementToBeRemoved(itemEditor);
    });
  });
});
