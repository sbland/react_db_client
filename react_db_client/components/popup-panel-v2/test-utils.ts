import { within, screen, waitFor } from '@testing-library/react';

export const getPopupContentByTitle = async (title) => {
  await waitFor(() => {
    screen.getAllByTestId('rdc-popupPanel');
    expect(
      screen
        .getAllByTestId('rdc-popupPanel')
        .find((p) => within(p).queryByText(title))
    ).toBeInTheDocument();
  });
  return screen
    .getAllByTestId('rdc-popupPanel')
    .find((p) => within(p).queryByText(title));
};
