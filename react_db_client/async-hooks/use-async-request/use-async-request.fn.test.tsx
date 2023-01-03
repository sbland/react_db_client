import React from 'react';
import { screen, render, within } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import * as compositions from './use-async-request.composition';

describe('Use async request hook', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, async () => {
        render(<Composition />);
        // @ts-ignore
        if (Composition.waitForReady) await Composition.waitForReady();
      });
    });
  });
  describe('Call func on press', () => {
    test('should call func and change response message', async () => {
      render(<compositions.BasicdemoHook />);
      expect(screen.queryByText('world')).not.toBeInTheDocument();
      const callBtn = screen.getByRole('button', { name: 'Call', exact: true });
      await UserEvent.click(callBtn);
      await screen.findByText('world');
    });
    test.todo('should show loading message');
  });
  describe('Call func on load', () => {
    test('should call func with input args on mount', async () => {
      render(<compositions.LoadOnMount />);
      await screen.findByText('world');
      await screen.findByText('Call count: 1');
    });
    test('should recall func when pressing call btn', async () => {
      render(<compositions.LoadOnMount />);
      await screen.findByText('Call count: 1');
      const callBtn = screen.getByRole('button', { name: 'Call', exact: true });
      await UserEvent.click(callBtn);
      await screen.findByText('world');
      await screen.findByText('Call count: 2');
    });
    test('should recall func and override args when pressing call override btn', async () => {
      render(<compositions.LoadOnMount />);
      await screen.findByText('Call count: 1');
      const callOverrideBtn = screen.getByRole('button', { name: 'Call override', exact: true });
      await UserEvent.click(callOverrideBtn);
      await screen.findByText('sun');
      await screen.findByText('Call count: 2');
    });
    test('should recall func with default args after calling override and pressing call btn', async () => {
      render(<compositions.LoadOnMount />);
      await screen.findByText('Call count: 1');
      const callOverrideBtn = screen.getByRole('button', { name: 'Call override', exact: true });
      await UserEvent.click(callOverrideBtn);
      await screen.findByText('sun');
      await screen.findByText('Call count: 2');
      const callBtn = screen.getByRole('button', { name: 'Call', exact: true });
      await UserEvent.click(callBtn);
      await screen.findByText('world');
      await screen.findByText('Call count: 3');
    });
  });
});
