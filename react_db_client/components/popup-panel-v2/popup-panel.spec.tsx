// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import UserEvent from '@testing-library/user-event';
// import { BasicPopupPanel } from './popup-panel.composition';

// it('should not render popup when not open', () => {
//   expect(screen.queryByText('hello world!')).not.toBeInTheDocument();
// });

// it('should render with the correct text', async () => {
//   render(<BasicPopupPanel />);
//   const openBtn = screen.getByRole('button');
//   await UserEvent.click(openBtn);
//   const rendered = await screen.findByText('hello world!');
//   expect(rendered).toBeTruthy();
// });

import React from 'react';
import { render, screen } from '@testing-library/react';
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
      render(<compositions.BasicPopupPanel />);
      const rootEl = document.getElementById('popupRoot');
      expect(rootEl).toBeInTheDocument();
    });
    test('should remove root element on unmount if created', async () => {
      render(<compositions.PopupPanelUnmountOnHide />);
      const openPopupButton = screen.getByRole('button');
      await UserEvent.click(openPopupButton);
      const rootEl = document.getElementById('popupRoot');
      expect(rootEl).toBeInTheDocument();
      await UserEvent.click(openPopupButton);
      const rootElNone = document.getElementById('popupRoot');
      expect(rootElNone).not.toBeInTheDocument();
    });
    test.todo('should show new popup panels on top of old popup panels');
    test('should call onCloseCallback when popup closed', async () => {
      render(<compositions.BasicPopupPanel />);
      const openPopup = screen.getByRole('button', { name: /Open/ });
      await UserEvent.click(openPopup);
      await screen.findByText("Hello I'm open!");
      const closeBtn = await screen.findByRole('button', { name: /Close popup/ });
      await UserEvent.click(closeBtn);
      await screen.findByText('Has been closed');
    });
    test.skip('should be able to close and re open a popup', async () => {
      // TODO: Fix this broken test!
      render(<compositions.BasicPopupPanel />);
      const openPopup = screen.getByRole('button', { name: /Open/ });
      await UserEvent.click(openPopup);
      await screen.findByText("Hello I'm open!");
      const closeBtn = await screen.findByRole('button', { name: /Close popup/ });
      await UserEvent.click(closeBtn);
      await screen.findByText('Has been closed');
      await screen.getByRole('button', { name: /Open/ });
      await UserEvent.click(openPopup);
      screen.debug();
      const popupPanel = await screen.findByTestId('popupid_popupRoot_content');
      await screen.findByRole('button', { name: /Close popup/ }, { timeout: 3000 });
      await screen.findByText("Hello I'm open!");
      // await UserEvent.click(closeBtn);
      // await screen.findByText('Has been closed');
    });
  });
});
