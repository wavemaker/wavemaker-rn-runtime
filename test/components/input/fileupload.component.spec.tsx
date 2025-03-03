import React, { ReactNode, createRef } from 'react';
import WmFileupload from '@wavemaker/app-rn-runtime/components/input/fileupload/fileupload.component';
import WmFileuploadProps from '@wavemaker/app-rn-runtime/components/input/fileupload/fileupload.props';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';

jest.mock('expo-document-picker');

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

describe('WmFileupload', () => {
  let defaultProps: WmFileuploadProps;
  const mockDocumentPickerResult = {
    uri: 'file://document-uri',
    name: 'document.txt',
    size: 12345,
    type: 'success',
    mimeType: 'text/plain',
  };

  const mockDocumentPickerResponse = {
    assets: [{ mockDocumentPickerResult }],
    canceled: false,
    output: {},
  };
  const mockDocumentPickerResponseWeb = {
    assets: [{ file: mockDocumentPickerResult }],
    canceled: false,
    output: {},
  };

  beforeEach(() => {
    defaultProps = new WmFileuploadProps();
    defaultProps.caption = 'Upload';
    defaultProps.iconclass = 'wm-sl-l sl-cloud-upload';
    defaultProps.iconsize = 16;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Check Rendering with Default Props
  it('renders correctly with default props', () => {
    render(<WmFileupload {...defaultProps} />);
    expect(screen.getByText('Upload')).toBeTruthy();
  });

  // File Selection Handling
  it('handles file selection correctly', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue(
      mockDocumentPickerResponse
    );

    render(<WmFileupload {...defaultProps} />);
    const button = screen.getByText('Upload');
    fireEvent.press(button);

    await waitFor(() => {
      expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
      expect(screen.queryByText('Upload')).toBeTruthy();
    });
  });

  // Accessibility Props
  it('applies accessibility props correctly', () => {
    render(<WmFileupload {...defaultProps} accessibilitylabel="Upload File" />);
    expect(screen.getByLabelText('Upload File')).toBeTruthy();
  });

  // Invoke onBeforeselect and onSelect Callbacks
  it('invokes onBeforeselect and onSelect callbacks correctly', async () => {
    const onBeforeselect = jest.fn();
    const onSelect = jest.fn();
    const props = { ...defaultProps, onBeforeselect, onSelect };

    DocumentPicker.getDocumentAsync.mockResolvedValue(
      mockDocumentPickerResponse
    );

    render(<WmFileupload {...props} />);
    const button = screen.getByText('Upload');
    fireEvent.press(button);

    await waitFor(() => {
      expect(onBeforeselect).toHaveBeenCalled();
      expect(onSelect).toHaveBeenCalled();
    });
  });

  // Disabled State
  xit('does not allow file selection when disabled', async () => {
    const props = { ...defaultProps, disabled: true };
    render(<WmFileupload {...props} />);
    const button = screen.getByText('Upload');
    fireEvent.press(button);

    await timer(300);

    expect(DocumentPicker.getDocumentAsync).not.toHaveBeenCalled();
  });

  // some bug with expo-document-picker due to which the below case is not passing
  // it('handles document selection cancelled by user gracefully', async () => {
  //   const onSelect = jest.fn();
  //   const onBeforeselect = jest.fn();

  //   DocumentPicker.getDocumentAsync.mockResolvedValue({ type: 'cancel' });

  //   render(
  //     <WmFileupload
  //       {...defaultProps}
  //       onSelect={onSelect}
  //       onBeforeselect={onBeforeselect}
  //     />
  //   );
  //   const button = screen.getByText('Upload');
  //   fireEvent.press(button);
  //   await timer(300);
  //   await waitFor(() => {
  //     expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
  //     expect(onSelect).not.toHaveBeenCalled();
  //     expect(onBeforeselect).not.toHaveBeenCalled();
  //   });
  // });

  // Error Handling
  xit('handles errors during file selection', async () => {
    const error = new Error('File selection error');
    DocumentPicker.getDocumentAsync.mockRejectedValue(error);

    render(<WmFileupload {...defaultProps} />);
    const button = screen.getByText('Upload');
    fireEvent.press(button);

    await waitFor(() => {
      expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
      expect(screen.queryByText('Upload')).toBeTruthy();
    });
  });

  // Platform-specific Behavior
  it('handles platform-specific behavior for file selection', async () => {
    const originalPlatform = Platform.OS;
    Platform.OS = 'web';
    const onSelect = jest.fn();
    const onBeforeselect = jest.fn();
    DocumentPicker.getDocumentAsync.mockResolvedValue(
      mockDocumentPickerResponseWeb
    );

    render(
      <WmFileupload
        {...defaultProps}
        onSelect={onSelect}
        onBeforeselect={onBeforeselect}
      />
    );
    const button = screen.getByText('Upload');
    fireEvent.press(button);

    await waitFor(() => {
      expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
      expect(screen.queryByText('Upload')).toBeTruthy();
      expect(onBeforeselect).toHaveBeenCalled();
      expect(onSelect).toHaveBeenCalled();
    });

    Platform.OS = originalPlatform;
  });
});
