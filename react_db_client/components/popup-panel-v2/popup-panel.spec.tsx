import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import * as compositions from './popup-panel.composition';

const openPopup = async (id: string) => {
  const openPopupBtn = screen.getByRole('button', { name: /Open/ });
  await UserEvent.click(openPopupBtn);
  await screen.findByTestId(`popupPanel_${id}`);
  // await screen.findByText("Hello I'm open!");
};
const closePopupWithX = async (id) => {
  const closeBtn = await screen.findByRole('button', {
    name: 'Close popup',
  });
  expect(screen.getByTestId(`${id}_contentInner`)).toBeInTheDocument();
  await UserEvent.click(closeBtn);
  await waitFor(() =>
    expect(screen.queryByTestId(`${id}_contentInner`)).not.toBeInTheDocument()
  );
};
const closePopupWithCustom = async (id, buttonLabel?) => {
  const closeBtn = await screen.findByRole('button', {
    name: buttonLabel,
  });
  expect(screen.getByTestId(`${id}_contentInner`)).toBeInTheDocument();
  await UserEvent.click(closeBtn);
  await waitFor(() =>
    expect(screen.queryByTestId(`${id}_contentInner`)).not.toBeInTheDocument()
  );
};
const closePopupWithBackground = async (id: string) => {
  const closeBtn = await screen.findByRole('button', {
    name: /Close the popup/,
  });
  await UserEvent.click(closeBtn);
  await waitFor(() =>
    expect(screen.queryByTestId(`${id}_content`)).not.toBeInTheDocument()
  );
};

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
    describe('Basic Popup Panel', () => {
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
        const popupId = 'popupRootUnMountOnHide';
        const rootElNone = document.getElementById(popupId);
        expect(rootElNone).not.toBeInTheDocument();
        const mountBtn = screen.getByRole('button', { name: 'mount' });
        await UserEvent.click(mountBtn);
        expect(document.getElementById(popupId)).toBeInTheDocument();

        await openPopup(popupId);
        await screen.findByText("Hello I'm open!");
        await closePopupWithX(popupId);
        const unmountBtn = screen.getByRole('button', { name: 'unmount' });
        await UserEvent.click(unmountBtn);

        expect(document.getElementById(popupId)).not.toBeInTheDocument();
      });
      test.todo('should show new popup panels on top of old popup panels');
      test('should call onCloseCallback when popup closed', async () => {
        render(<compositions.BasicPopupPanel />);
        const openPopup = screen.getByRole('button', { name: /Open/ });
        await UserEvent.click(openPopup);
        await screen.findByText("Hello I'm open!");
        const closeBtn = await screen.findByRole('button', {
          name: /Close popup/,
        });
        await UserEvent.click(closeBtn);
        await screen.findByText('Has been closed');
      });
      test('should be able to close and re open a popup', async () => {
        render(<compositions.BasicPopupPanel />);
        const popupId = 'popupRoot';
        await openPopup(popupId);
        await screen.findByText("Hello I'm open!");
        await closePopupWithX(popupId);
        await screen.findByText('Has been closed');
        await openPopup(popupId);
        await closePopupWithX(popupId);
      });

      // test.skip('sho`uld be able to close and re open a popup using ext functions', async () => {
      //   render(<compositions.BasicPopupPanelExtFuncs />);
      //   const popupId = 'popupRootExtFuncs';
      //   await openPopup(popupId);
      //   await screen.findByText("Hello I'm open!");
      //   await closePopup(popupId);
      //   await openPopup(popupId);
      //   await closePopup(popupId);
      // });
      // test.skip('should not rerender all popups if popupRegister changes', async () => {
      //   render(<compositions.BasicPopupPanelExtFuncs />);
      //   expect(screen.getByTestId('counter_1').textContent).toEqual('1');
      //   const popupId = 'popupRootExtFuncs';
      //   await openPopup(popupId);
      //   await screen.findByText("Hello I'm open!");
      //   await closePopup(popupId);
      //   await openPopup(popupId);
      //   await screen.findByText("Hello I'm open!");
      //   await closePopup(popupId);
      //   await openPopup(popupId);
      //   await screen.findByText("Hello I'm open!");
      //   await closePopup(popupId);
      //   await openPopup(popupId);
      //   await screen.findByText("Hello I'm open!");
      //   await closePopup(popupId);
      //   expect(screen.getByTestId('counter_1').textContent).toEqual('1');
      // });`
      test.todo('should not remove root when closing popup');
      test('should be able to close and re open a popup that removes root on unmount', async () => {
        render(<compositions.PopupPanelUnmountOnHide />);
        const mountBtn = screen.getByRole('button', { name: 'mount' });
        await UserEvent.click(mountBtn);
        const popupId = 'popupRootUnMountOnHide';
        await openPopup(popupId);
        await screen.findByText("Hello I'm open!");
        await closePopupWithX(popupId);
        const unmountBtn = screen.getByRole('button', { name: 'unmount' });
        await UserEvent.click(unmountBtn);
        await UserEvent.click(mountBtn);
        await openPopup(popupId);
        await closePopupWithX(popupId);
      });
      test('should be able to close and re open a managed popup', async () => {
        render(<compositions.BasicPopupPanelManaged />);
        const popupId = 'popupRootManaged';
        await openPopup(popupId);
        await screen.findByText("Hello I'm open!");
        await closePopupWithX(popupId);
        await screen.findByText('Has been closed');
        await openPopup(popupId);
        await closePopupWithX(popupId);
      });
      test('should be able to close and re open a managed popup with background', async () => {
        render(<compositions.BasicPopupPanelManaged />);
        const popupId = 'popupRootManaged';
        await openPopup(popupId);
        await screen.findByText("Hello I'm open!");
        await closePopupWithBackground(popupId);
        await screen.findByText('Has been closed');
        await openPopup(popupId);
        await closePopupWithBackground(popupId);
      });
      test('should be able to close and re open a managed popup with external isopen prop change', async () => {
        render(<compositions.BasicPopupPanelManaged />);
        const popupId = 'popupRootManaged';
        await openPopup(popupId);
        await screen.findByText("Hello I'm open!");
        await closePopupWithCustom(popupId, 'Close Externally Button');
        await screen.findByText('Has been closed');
        await openPopup(popupId);
        await closePopupWithCustom(popupId, 'Close Externally Button');
      });
      // test('should be able to close and re open a managed popup alt', async () => {
      //   render(<compositions.BasicPopupPanelManagedB />);
      //   const popupId = 'popupRootManaged';
      //   await openPopup(popupId);
      //   await screen.findByText("Hello I'm open!");
      //   await closePopupWithX(popupId);
      //   await screen.findByText('Has been closed');
      //   await openPopup(popupId);
      //   await closePopupWithX(popupId);
      // });
      // test('should be able to close and re open a managed popup alt using close back panel', async () => {
      //   render(<compositions.BasicPopupPanelManagedB />);
      //   const popupId = 'popupRootManaged';
      //   await openPopup(popupId);
      //   await screen.findByText("Hello I'm open!");
      //   await closePopupWithBackground(popupId);
      //   await screen.findByText('Has been closed');
      //   await openPopup(popupId);
      //   await closePopupWithBackground(popupId);
      // });
    });
  });
});
