import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import * as compositions from './popup-panel.composition';

describe('popup panel', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, async () => {
        render(<Composition />);
        // @ts-ignore
        if (Composition.waitForReady) await Composition.waitForReady();
      });
    });
  });
  describe('Functional Tests', () => {
    test('should hide popup when open is false', async () => {
      render(<compositions.BasicPopupPanel />);
      expect(screen.queryByText("Hello I'm open!")).not.toBeInTheDocument();
    });
    test('should show child elements in popup when open', async () => {
      render(<compositions.BasicPopupPanel />);
      const openPopupButton = screen.getByRole('button');
      await UserEvent.click(openPopupButton);
      await screen.findByText("Hello I'm open!");
      expect(screen.getByText("Hello I'm open!")).toBeInTheDocument();
    });
    test('should add root element if does not already exist', async () => {
      const rootElNone = document.getElementById('popupRoot');
      expect(rootElNone).not.toBeInTheDocument();
      render(<compositions.BasicPopupPanel />);
      const rootEl = document.getElementById('popupRoot');
      expect(rootEl).toBeInTheDocument();
    });
    test('should remove root element on unmount if created', async () => {
      render(<compositions.PopupPanelUnmountOnHide />);
      const openPopupButton = screen.getByRole('button');
      await UserEvent.click(openPopupButton);
      await screen.findByText("Hello I'm open!");
      const rootEl = document.getElementById('popupRoot');
      expect(rootEl).toBeInTheDocument();
      const closeBtn = screen.getByRole('button', { name: /X/ });
      await UserEvent.click(closeBtn);
      const rootElNone = document.getElementById('popupRoot');
      expect(rootElNone).not.toBeInTheDocument();
    });
    test('should show new popup panels on top of old popup panels', () => {

    });
  });
});
