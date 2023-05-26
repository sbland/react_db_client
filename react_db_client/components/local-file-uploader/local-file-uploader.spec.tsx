import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ILocalFileUploaderProps, LocalFileUploader } from './local-file-uploader';

const defaultProps: ILocalFileUploaderProps = {
  label: 'Example',
  onAccept: jest.fn(),
  onChange: jest.fn(),
  mapToHeadings: [],
  showAcceptButton: true,
};

describe('Local File Uploader', () => {
  it('should render the component', () => {
    render(<LocalFileUploader {...defaultProps} />);
    expect(screen.getByText('Upload local file')).toBeInTheDocument();
  });

  it('should call the onChange function when a file is uploaded', () => {
    const onChange = jest.fn();
    render(<LocalFileUploader {...defaultProps} onChange={onChange} />);
    const input = screen.getByLabelText('Upload local file');
    userEvent.upload(input, new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
