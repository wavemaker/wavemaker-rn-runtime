import React, { ReactNode } from 'react';
import { AccessibilityInfo, Text, TouchableOpacity } from 'react-native';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import {
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react-native';
import WmButtonProps from '@wavemaker/app-rn-runtime/components/basic/button/button.props';
import { forEach } from 'lodash-es';
import { FontAwesome } from '@expo/vector-icons';

const defaultProps: WmButtonProps = {
  //animation: 'fadeIn',
  // animationdelay: 200,
  caption: 'Test Button',
  skeletonheight: undefined,
  skeletonwidth: undefined,
  accessibilityrole: 'button',
  accessibilitylabel: 'test button',
  hint: 'test button',
  //badgevalue: '2',
  //iconclass: 'fa fa-edit',
  //iconposition: 'left',
  //iconurl: 'https://wavemaker.com',
  //iconheight: 20,
  //iconwidth: 20,
  //iconmargin: 2,
  //onTap: jest.fn(),
};

jest.mock('@expo/vector-icons', () => {
  const { View, Text } = require('react-native');
  return {
    FontAwesome: jest.fn().mockImplementation(({ name, ...props }) => {
      return (
        <View>
          <Text {...props}>{name}</Text>
        </View>
      );
    }),
  };
});

const renderComponent = (props = {}) =>
  render(<WmButton {...defaultProps} {...props} name="test_button" />);

/// properties binding tests
describe('Button component property binding tests', () => {
  it('should render correctly with default props', () => {
    const tree = renderComponent();
    expect(tree).toMatchSnapshot();
    expect(tree.getByText('Test Button')).toBeTruthy();
  });

  it('should render with a given caption', () => {
    const { getByText } = renderComponent({ caption: 'ButtonCaption' });
    expect(getByText('ButtonCaption')).toBeTruthy();
  });

  it('should update parts when caption prop changes', () => {
    const { getByText, rerender } = renderComponent();
    expect(getByText('Test Button')).toBeTruthy();

    rerender(<WmButton {...defaultProps} caption="New Caption" />);
    expect(getByText('New Caption')).toBeTruthy();
  });

  it('should apply accessibility props correctly', async () => {
    const { getByRole, getByLabelText, getByA11yHint } = renderComponent({
      name: 'testButton',
      accessibilitylabel: 'Button',
      accessibilityrole: 'Button',
      hint: 'test button',
      onTap: jest.fn(), // accessiibility props are also in tappable..
    });
    expect(getByLabelText('Button')).toBeTruthy();
    expect(getByRole('Button')).toBeTruthy();
    expect(getByA11yHint('test button')).toBeTruthy();
  });

  it('should handle animation props', () => {
    const tree = renderComponent({
      animation: 'fadeIn',
      animationdelay: 500,
      caption: 'Animated Button',
      name: 'WmButton',
    });

    const animatedButton = tree.getByTestId('animatableView');
    expect(animatedButton).toBeTruthy();
    expect(animatedButton.props.animation).toBe('fadeIn');
    expect(animatedButton.props.delay).toBe(500);
  });

  it('should trigger onTap callback', async () => {
    const onTapMock = jest.fn();
    const tree = render(<WmButton onTap={onTapMock} caption="Tap" />);

    fireEvent(tree.getByText('Tap'), 'press');

    await waitFor(() => {
      expect(onTapMock).toHaveBeenCalled();
      const callArg = onTapMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmButton);
    });
  });

  it('should trigger onDoubleTap callback', async () => {
    const onDoubleTapMock = jest.fn();
    const tree = render(
      <WmButton onDoubletap={onDoubleTapMock} caption="DoubleTap" />
    );

    fireEvent(tree.getByText('DoubleTap'), 'press');
    fireEvent(tree.getByText('DoubleTap'), 'press');

    await waitFor(() => {
      expect(onDoubleTapMock).toHaveBeenCalled();
      expect(onDoubleTapMock).toHaveBeenCalledTimes(1);
      const callArg = onDoubleTapMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmButton);
    });
  });

  it('should trigger onLongTap callback', async () => {
    const onLongTapMock = jest.fn();
    const tree = render(
      <WmButton onLongtap={onLongTapMock} caption="LongTap" />
    );

    fireEvent(tree.getByText('LongTap'), 'longPress');

    await waitFor(() => {
      expect(onLongTapMock).toHaveBeenCalled();
      const callArg = onLongTapMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmButton);
    });
  });

  xit('should trigger onTouchStart callback', async () => {
    // const onTapMock = jest.fn();
    const onTouchStartMock = jest.fn();
    const tree = render(
      <WmButton
        // onTap={onTapMock}
        onTouchstart={onTouchStartMock}
        caption="Touchstart"
      />
    );

    fireEvent(tree.getByText('Touchstart'), 'press');

    await waitFor(() => {
      expect(onTouchStartMock).toHaveBeenCalled();
      const callArg = onTouchStartMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmButton);
    });
  });

  xit('should trigger onTouchEnd callback', async () => {
    // const onTapMock = jest.fn(); // in tappable onTouchEnd is not added in the if condition , hence had to add onTap as well
    const onTouchEndMock = jest.fn();
    const tree = render(
      <WmButton
        // onTap={onTapMock}
        onTouchend={onTouchEndMock}
        caption="Touchend"
      />
    );

    fireEvent(tree.getByText('Touchend'), 'pressOut');

    await waitFor(() => {
      expect(onTouchEndMock).toHaveBeenCalled();
      const callArg = onTouchEndMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmButton);
    });
  });

  it('should handle empty or null caption gracefully', () => {
    const { rerender, queryByTestId } = renderComponent();

    rerender(<WmButton {...defaultProps} caption="" />);
    expect(queryByTestId('test_button_caption')).toBeNull();

    rerender(<WmButton {...defaultProps} caption={null} />);
    expect(queryByTestId('test_button_caption')).toBeNull();
  });

  it('should render with a given badge value', () => {
    const { getByText } = renderComponent({ badgevalue: 8 });
    expect(getByText('8')).toBeTruthy();
  });

  it('should render width and height', () => {
    const width = 50;
    const height = 70;
    const { getByTestId } = renderComponent({
      styles: {
        root: {
          width: width,
          height: height,
        },
      },
    });
    const viewEle = getByTestId('non_animatableView');
    expect(viewEle.props.style[0].width).toBe(width);
    expect(viewEle.props.style[0].height).toBe(height);
  });

  it('should have width and height to be 0 when show is false', () => {
    const { getByTestId } = renderComponent({ show: false });

    const viewEle = getByTestId('non_animatableView');
    expect(viewEle.props.style[0].width).toBe(0);
    expect(viewEle.props.style[0].height).toBe(0);
  });

  it('should render a skeleton with given width and height', () => {
    const tree = renderComponent({
      showskeleton: true,
      skeletonheight: '100',
      skeletonwidth: '50',
    });
    expect(tree).toMatchSnapshot();
  });

  it('should render skeleton with root width and height when skeleton width and height are not provided', () => {
    const width = 50;
    const height = 70;
    const tree = renderComponent({
      showskeleton: true,
      styles: {
        root: {
          width: width,
          height: height,
        },
      },
    });

    expect(tree).toMatchSnapshot();
  });

  it('should render a disabled button', async () => {
    const onTapMock = jest.fn();
    const tree = renderComponent({
      disabled: true,
      onTap: onTapMock,
      caption: 'Tap',
    });
    const viewEle = tree.getByTestId('non_animatableView');
    expect(viewEle.props.style[0].opacity).toBe(0.5);

    fireEvent(tree.getByText('Tap'), 'press');

    await waitFor(() => {
      expect(onTapMock).not.toHaveBeenCalled();
    });
  });

  it('should render custom styles with properly', () => {
    const bgColor = '#234555';
    const txtColor = '#325623';
    const tree = renderComponent({
      name: 'button',
      caption: 'Test_button',
      styles: {
        root: {
          backgroundColor: bgColor,
        },
        text: {
          color: txtColor,
        },
      },
    });
    const viewEle = tree.getByTestId('non_animatableView');
    const textEle = tree.getByText('Test_button');
    expect(viewEle.props.style[0].backgroundColor).toBe(bgColor);
    expect(textEle.props.style.color).toBe(txtColor);
  });

  it('should render with a icon properly', async () => {
    const iconProps = {
      iconclass: 'fa fa-edit',
      iconposition: 'left',
      iconheight: 20,
      iconwidth: 20,
      iconmargin: 2,
    };

    const prepareIcon = jest.spyOn(WmButton.prototype, 'prepareIcon');
    const tree = renderComponent({ ...iconProps });

    await waitFor(() => {
      expect(prepareIcon).toHaveBeenCalledTimes(1);
    });

    expect(tree.getByText('edit')).toBeTruthy();
  });
});
