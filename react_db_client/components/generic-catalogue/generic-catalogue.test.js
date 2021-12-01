import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { mount } from 'enzyme';
import { render, fireEvent, within, act } from '@testing-library/react';
import { MockReactC } from '@samnbuk/react_db_client.helpers.testing';
import { BasicGenericCatalogue } from './generic-catalogue.composition';

// jest.mock('@samnbuk/react_db_client.components.search-and-select', () =>
//   MockReactC('SearchAndSelect', ['SearchAndSelect'])
// );

const defaultProps = {};

describe('CertificateCatalogue', () => {
  it('Renders', () => {
    mount(<BasicGenericCatalogue />);
  });
  it('Matches Snapshot', () => {
    const component = mount(<BasicGenericCatalogue />);
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
  describe('Functional tests', () => {
    test('should render list of results', async () => {
      const component = render(<BasicGenericCatalogue />);
      const searchInput = component.getByLabelText('search');
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: 'demo' } });
        await new Promise((resolve) => setTimeout(resolve));
      });
      const resultsList = component.getByRole('list');
      const { getAllByRole } = within(resultsList);
      const items = getAllByRole('listitem');
      expect(items.length).toBeGreaterThan(0);
      expect(items.length).toBe(5);
    });
  });
});
