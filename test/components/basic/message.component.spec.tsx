import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import WmMessage from '@wavemaker/app-rn-runtime/components/basic/message/message.component';
import WmMessageProps from '@wavemaker/app-rn-runtime/components/basic/message/message.props';
import { ThemeProvider } from '@wavemaker/app-rn-runtime/styles/theme';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';

// Mock Theme
const mockTheme = {
  getStyle: (styleName: string) => ({}), // Adjust based on required styles
  mergeStyle: (style1, style2) => ({ ...style1, ...style2 }),
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider value={mockTheme}>{component}</ThemeProvider>);
};

const DEFAULT_TITLE = {
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
  info: 'Info',
  loading: 'Processing',
} as any;

const MESSAGE_ICONS = {
  success: 'wm-sl-l sl-check',
  warning: 'wm-sl-l sl-alarm-bell',
  error: 'fa fa-times-circle',
  info: 'wi wi-info',
  loading: 'fa fa-spinner fa-spin',
};

describe('WmMessage', () => {
  it('renders correctly with default props', () => {
    const props: WmMessageProps = {};

    const tree = render(<WmMessage {...props} />);
    expect(tree).toMatchSnapshot();
    const defaultTitle = tree.getByText('Success'); // Default title for type 'success'
    const defaultCaption = tree.getByText('Message'); // Default caption

    expect(defaultTitle).toBeTruthy();
    expect(defaultCaption).toBeTruthy();
  });

  it('renders with different message types', () => {
    const types: WmMessageProps['type'][] = [
      'success',
      'warning',
      'error',
      'info',
      'loading',
    ];

    types.forEach((type) => {
      const props: WmMessageProps = { type };

      const { getByText } = render(<WmMessage {...props} />);
      const typeTitle = getByText(DEFAULT_TITLE[type]);

      expect(typeTitle).toBeTruthy();
    });
  });

  it('renders with custom title and caption', () => {
    const props: WmMessageProps = {
      title: 'Custom Title',
      caption: 'Custom Caption',
    };

    const { getByText } = render(<WmMessage {...props} />);
    const customTitle = getByText('Custom Title');
    const customCaption = getByText('Custom Caption');

    expect(customTitle).toBeTruthy();
    expect(customCaption).toBeTruthy();
  });

  it('renders the close button when `hideclose` is false', () => {
    const props: WmMessageProps = { hideclose: false };

    const { getByText } = render(<WmMessage {...props} />);
    const closeButton = getByText('close');

    expect(closeButton).toBeTruthy();
  });

  it('does not render the close button when `hideclose` is true', () => {
    const props: WmMessageProps = { hideclose: true };

    const { queryByText } = render(<WmMessage {...props} />);
    expect(queryByText('close')).toBeNull();
  });

  it('should have width and height to be 0 when show is false', () => {
    const props = {
      show: false,
    };
    const { getByTestId } = render(<WmMessage {...props} />);
    const buttonGroup = getByTestId('animatableView');

    expect(buttonGroup.props.style.width).toBe(0);
    expect(buttonGroup.props.style.height).toBe(0);
  });

  it('renders with given width and height', () => {
    const width = 70;
    const height = 100;
    const props = {
      styles: {
        root: {
          width: width,
          height: height,
        },
      },
    };
    const { getByTestId } = render(<WmMessage {...props} />);
    const buttonGroup = getByTestId('animatableView');

    expect(buttonGroup.props.style.width).toBe(width);
    expect(buttonGroup.props.style.height).toBe(height);
  });

  it('invokes `onClose` callback when the close button is tapped', async () => {
    const onCloseMock = jest.fn();
    const props: WmMessageProps = { onClose: onCloseMock };

    const { getByText } = render(<WmMessage {...props} />);
    const closeButton = getByText('close');

    fireEvent.press(closeButton);
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it('applies animation props correctly', () => {
    const props: WmMessageProps = { animation: 'fadeIn', animationdelay: 100 };

    const { getByTestId } = render(<WmMessage {...props} />);
    const animatedView = getByTestId('animatableView');

    expect(animatedView.props.animation).toBe('fadeIn');
    expect(animatedView.props.delay).toBe(100);
  });

  it('applies accessibility properties correctly', () => {
    const props: WmMessageProps = {
      accessibilitylabel: 'test-label',
      hint: 'test-hint',
      accessibilityrole: 'alert',
    };

    const { getAllByLabelText } = render(<WmMessage {...props} />);
    const elements = getAllByLabelText('test-label');
    elements.forEach((element) => {
      expect(element).toBeTruthy();
      expect(element.props.accessibilityRole).toBe('alert');
      expect(element.props.accessibilityLabel).toBe('test-label');
      expect(element.props.accessibilityHint).toBe('test-hint');
    });
  });

  it('should handle state changes', () => {
    const props = { show: true };

    const { getByText, rerender, getByTestId } = render(
      <WmMessage {...props} />
    );
    expect(getByText('Message')).toBeTruthy();

    rerender(<WmMessage {...props} show={false} />);

    const buttonGroup = getByTestId('animatableView');

    expect(buttonGroup.props.style.width).toBe(0);
    expect(buttonGroup.props.style.height).toBe(0);
  });

  it('renders correct icon for each message type', () => {
    const types = ['success', 'warning', 'error', 'info', 'loading'];

    types.forEach((type) => {
      const props: WmMessageProps = { type };

      const { getByText } = render(<WmMessage {...props} />);
      switch (type) {
        case 'success':
          expect(getByText('check')).toBeTruthy();
          break;
        case 'warning':
          expect(getByText('alarm-bell')).toBeTruthy();
          break;
        case 'error':
          expect(getByText('times-circle')).toBeTruthy();
          break;
        case 'info':
          expect(getByText('info')).toBeTruthy();
          break;
        case 'loading':
          expect(getByText('spinner')).toBeTruthy();
          break;
      }
    });
  });
});
