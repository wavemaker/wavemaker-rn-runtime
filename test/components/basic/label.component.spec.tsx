import React, { ReactNode } from 'react';
import { Text, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

//import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';

import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import WmLabelProps from '@wavemaker/app-rn-runtime/components/basic/label/label.props';

import { NavigationService } from '@wavemaker/app-rn-runtime/core/navigation.service';
import { BaseComponent, ParentContext } from '../../../src/core/base.component';
import { AccessibilityInfo } from 'react-native';

import ThemeVariables from '../../../src/styles/theme.variables';
import { NavigationServiceProvider } from '../../../src/core/navigation.service';
import mockNavigationService from '../../__mocks__/navigation.service';
import {
  NamedStyles,
  Theme,
  ThemeEvent,
  ThemeProvider,
  styleGeneratorFn,
} from '../../../src/styles/theme';
import EventNotifier from '../../../src/core/event-notifier';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
jest.mock('@react-native-masked-view/masked-view', () => 'MaskedView');
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient'
}));

const defaultProps: WmLabelProps = {
  caption: 'Test Label',
  required: false,
  isValid: true,
  wrap: true,
  nooflines: undefined,
  accessibilityrole: 'text',
  //onTap: jest.fn(),
};

const renderComponent = (props = {}) =>
  render(<WmLabel {...defaultProps} {...props} />);

const styles = StyleSheet.create({
  appLabel: {
    backgroundColor: '#678742',
    color: '#257489',
  },
});
const theme1 = Theme.BASE;
const theme: Theme = {
  name: '',
  eventNotifer: new EventNotifier(),
  children: [],
  styles: {
    appLabel: {
      root: { backgroundColor: '#678742' },
      text: { color: '#257489' },
    },
  },
  cache: {},
  traceEnabled: false,
  styleGenerators: [],
  parent: null,
  subscribe: jest.fn(),
  notify: jest.fn(),
  replaceVariables: jest.fn(),
  clearCache: jest.fn(),
  registerStyle: jest.fn(),
  checkStyleProperties: jest.fn(),
  addStyle: jest.fn(),
  addTrace: jest.fn(),
  flatten: jest.fn(),
  mergeStyle: jest.fn(),
  cleanseStyleProperties: jest.fn(),
  getStyle: jest.fn(),
  $new: jest.fn(),
  destroy: jest.fn(),
  getTextStyle: jest.fn(),
  reset: jest.fn(),
};

describe('WmLabel Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should render correctly with default props', () => {
    const tree = renderComponent();
    expect(tree).toMatchSnapshot();
    expect(tree.getByText('Test Label')).toBeTruthy();
  });

  it('should render width and height', () => {
    const width = 50;
    const height = 70;
    const tree = renderComponent({
      styles: {
        root: {
          width: width,
          height: height,
        },
      },
    });
    const viewEle = tree.getByTestId('non_animatableView');
    expect(viewEle.props.style.width).toBe(width);
    expect(viewEle.props.style.height).toBe(height);
  });

  it('should have width and height to be 0 when show is false', () => {
    const { getByTestId } = renderComponent({ show: false });

    const viewEle = getByTestId('non_animatableView');
    expect(viewEle.props.style.width).toBe(0);
    expect(viewEle.props.style.height).toBe(0);
  });

  it('should render custom styles with properly', () => {
    const bgColor = '#234555';
    const txtColor = '#325623';
    const tree = renderComponent({
      name: 'label',
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
    const textEle = tree.getByText('Test Label');
    expect(viewEle.props.style.backgroundColor).toBe(bgColor);
    expect(textEle.props.style.color).toBe(txtColor);
  });

  it('should render a skeleton with given width and height', () => {
    const tree = renderComponent({
      showskeleton: true,
      skeletonheight: '100',
      skeletonwidth: '50',
    });
    expect(tree).toMatchSnapshot();
  });

  it('should render a multiline skeleton', () => {
    const tree = renderComponent({
      showskeleton: true,
      skeletonheight: '100',
      skeletonwidth: '50',
      multilineskeleton: true,
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

  it('should render with caption as "Label" when no caption is passed', () => {
    const { getByText } = render(<WmLabel />);
    expect(getByText('Label')).toBeTruthy();
  });

  it('should render with a given caption', () => {
    const { getByText } = renderComponent({ caption: 'Caption' });
    expect(getByText('Caption')).toBeTruthy();
  });

  it('should render different parts correctly if caption contains links', () => {
    const caption = 'This is a [link](http://wavemaker.com)';
    const { getByText } = renderComponent({ caption });
    expect(getByText('This is a ')).toBeTruthy();
    expect(getByText('link')).toBeTruthy();
  });

  it('should update parts when caption prop changes', () => {
    const { getByText, rerender } = renderComponent();
    expect(getByText('Test Label')).toBeTruthy();

    rerender(<WmLabel {...defaultProps} caption="New Caption" />);
    expect(getByText('New Caption')).toBeTruthy();
  });

  it('should apply accessibility props correctly', async () => {
    const testprops = {
      name: 'testLabel',
      accessibilitylabel: 'label',
      hint: 'label widget',
    };
    const { getByA11yHint, getByLabelText, getByRole } = renderComponent({
      ...testprops,
    });

    await waitFor(() => {
      expect(getByRole('text')).toBeTruthy();
      expect(getByLabelText(testprops.accessibilitylabel)).toBeTruthy();
      expect(getByA11yHint(testprops.hint)).toBeTruthy();
    });
  });

  it('should apply numberOfLines prop correctly', async () => {
    const { getByText } = renderComponent({
      name: 'testLabel',
      nooflines: 3,
    });
    expect(getByText('Test Label').props.numberOfLines).toBe(3);
  });

  it('should handle animation and delay props', () => {
    const testprops = {
      animation: 'fadeIn',
      animationdelay: 500,
      caption: 'Animated Label',
      name: 'WmLabel',
    };
    const tree = renderComponent({
      ...testprops,
    });

    const animatedLabel = tree.getByTestId('animatableView');
    expect(animatedLabel).toBeTruthy();
    expect(animatedLabel.props.animation).toBe(testprops.animation);
    expect(animatedLabel.props.delay).toBe(testprops.animationdelay);
  });

  it('should trigger onTap callback with WmLabel instance as one of the arguments', async () => {
    const onTapMock = jest.fn();
    const tree = render(<WmLabel onTap={onTapMock} caption="Tap" />);

    fireEvent(tree.getByText('Tap'), 'press');

    await waitFor(() => {
      expect(onTapMock).toHaveBeenCalled();
      const callArg = onTapMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmLabel);
    });
  });
  
  it('should trigger onDoubleTap callback with WmLabel instance as one of the arguments', async () => {
    const onDoubleTapMock = jest.fn();
    const tree = render(
      <WmLabel onDoubletap={onDoubleTapMock} caption="DoubleTap" />
    );

    fireEvent(tree.getByText('DoubleTap'), 'press');
    fireEvent(tree.getByText('DoubleTap'), 'press');

    await waitFor(() => {
      expect(onDoubleTapMock).toHaveBeenCalled();
      const callArg = onDoubleTapMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmLabel);
    });
  });

  it('should trigger onLongTap callback with WmLabel instance as one of the arguments', async () => {
    const onLongTapMock = jest.fn();
    const tree = render(
      <WmLabel onLongtap={onLongTapMock} caption="LongTap" />
    );

    fireEvent(tree.getByText('LongTap'), 'longPress');

    await waitFor(() => {
      expect(onLongTapMock).toHaveBeenCalled();
      const callArg = onLongTapMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmLabel);
    });
  });

  xit('should trigger onTouchStart callback with WmLabel instance as one of the arguments', async () => {
    // const onTapMock = jest.fn();
    const onTouchStartMock = jest.fn();
    const tree = render(
      <WmLabel
        // onTap={onTapMock}
        onTouchstart={onTouchStartMock}
        caption="Touchstart"
      />
    );

    fireEvent(tree.getByText('Touchstart'), 'press');

    await waitFor(() => {
      expect(onTouchStartMock).toHaveBeenCalled();
      const callArg = onTouchStartMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmLabel);
    });
  });

  xit('should trigger onTouchEnd callback with WmLabel instance as one of the arguments', async () => {
    // const onTapMock = jest.fn();
    const onTouchEndMock = jest.fn();
    const tree = render(
      <WmLabel
        // onTap={onTapMock}
        onTouchend={onTouchEndMock}
        caption="Touchend"
      />
    );

    fireEvent(tree.getByText('Touchend'), 'pressOut');

    await waitFor(() => {
      expect(onTouchEndMock).toHaveBeenCalled();
      const callArg = onTouchEndMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmLabel);
    });
  });

  it('should handle link navigation when link is tapped', () => {
    const caption = 'Go to [Wavemaker](https://wavemaker.com)';
    const { getByText } = render(
      <NavigationServiceProvider value={mockNavigationService}>
        <WmLabel caption={caption} />
      </NavigationServiceProvider>
    );
    fireEvent.press(getByText('Wavemaker'));
    expect(mockNavigationService.openUrl).toHaveBeenCalledWith(
      'https://wavemaker.com',
      '_blank'
    );
  });

  it('should invoke JavaScript function for javascript link', () => {
    const caption = 'Run [Function](javascript:someFunction)';
    const { getByText } = renderComponent({
      caption,
    });
    const invokeEventCallback = jest.spyOn(
      WmLabel.prototype,
      'invokeEventCallback'
    );
    fireEvent.press(getByText('Function'));
    expect(invokeEventCallback).toHaveBeenCalledWith('someFunction', [
      null,
      expect.anything(),
    ]);
  });

  it('should render with required asterisk if required prop is true', async () => {
    const tree = renderComponent({ required: true });
    expect(tree.getByText('*')).toBeTruthy();
  });

  it('should render with required asterisk if required prop is true when caption has a link', async () => {
    const tree = renderComponent({
      required: true,
      caption: 'Go to [Wavemaker](https://wavemaker.com)',
    });
    expect(tree.getByText('*')).toBeTruthy();
  });

  ////////////////////tests with issues/////////////////////////

  xit('should handle isValid prop and render text with appropriate color', () => {
    const { getByText, rerender } = renderComponent({
      caption: 'Invalid label',
      isValid: false,
    });

    const tree = renderComponent({
      caption: 'Invalid label',
      name: 'invalid-label',
      isValid: false,
    });
    // const tree = render(
    //   <WmLabel caption="Invalid label" name="invalid-label" isValid={false} />
    // );

    //expect(tree).toMatchSnapshot();

    const textElement = getByText('Invalid label');
    expect(textElement.props.style.color).toBe('red');

    rerender(<WmLabel {...defaultProps} caption="Valid text" isValid={true} />);
    expect(textElement.props.style.color).not.toBe('red');
  });
   
  it('should render custom classes with properly', () => {
    const caption = 'custom label';

    const tree = render(
      //<ParentContext.Provider value={BaseComponent}>
      <ThemeProvider value={theme1}>
        <WmLabel caption={caption} />
      </ThemeProvider>
      // </ParentContext.Provider>
    );
    // expect(tree).toMatchSnapshot();
  });

  it('should render text with given gradient color', () => {
    const gradientColor = 'linear-gradient(90deg, rgba(255,0,0,1), rgba(0,0,255,1))';
    const { UNSAFE_getByType } = renderComponent({
      caption: 'Gradient Text',
      styles: {
        text: {
          color: gradientColor,
        },
      },
    });
    
    // Check if MaskedView is being used for the gradient
    const maskedView = UNSAFE_getByType(MaskedView);
    expect(maskedView).toBeTruthy();
    
    // Check if LinearGradient component is used with correct props
    const linearGradient = UNSAFE_getByType(LinearGradient);
    expect(linearGradient).toBeTruthy();
    expect(linearGradient.props.colors).toEqual(['rgba(255,0,0,1)', 'rgba(0,0,255,1)']);
    expect(linearGradient.props.start).toEqual({ x: 0, y: 0 });
    expect(linearGradient.props.end).toEqual({ x: 1, y: 0 });
  });
  it('should render bold text correctly', () => {
    const caption = 'This is **bold text** in label';
    const { getByText } = renderComponent({ caption });
    
    const boldTextElement = getByText('bold text');
    expect(boldTextElement.props.style).toContainEqual({ fontWeight: 'bold' });
  });
  
  it('should render mixed bold and normal text', () => {
    const caption = 'Normal text **bold text** more normal text';
    const { getByText } = renderComponent({ caption });
    
    expect(getByText('Normal text ')).toBeTruthy();
    expect(getByText('bold text')).toBeTruthy();
    expect(getByText(' more normal text')).toBeTruthy();
    
    const boldTextElement = getByText('bold text');
    expect(boldTextElement.props.style).toContainEqual({ fontWeight: 'bold' });
  });
  
  it('should render multiple bold sections', () => {
    const caption = '**First bold** normal **Second bold**';
    const { getByText } = renderComponent({ caption });
    
    const firstBold = getByText('First bold');
    const secondBold = getByText('Second bold');
    
    expect(firstBold.props.style).toContainEqual({ fontWeight: 'bold' });
    expect(secondBold.props.style).toContainEqual({ fontWeight: 'bold' });
  });
  
  it('should render bold links correctly', () => {
    const caption = '**[Bold Link](https://example.com)**';
    const { getByText } = renderComponent({ caption });
    
    const boldLinkElement = getByText('Bold Link');
    expect(boldLinkElement.props.style).toContainEqual({ fontWeight: 'bold' });
  });
  
  it('should render combination of bold text and links', () => {
    const caption = '**Bold text** and [normal link](https://example.com)';
    const { getByText } = renderComponent({ caption });
    
    const boldText = getByText('Bold text');
    const normalLink = getByText('normal link');
    
    expect(boldText.props.style).toContainEqual({ fontWeight: 'bold' });
    expect(normalLink.props.style).not.toContainEqual({ fontWeight: 'bold' });
  });
  
  it('should handle text without bold formatting', () => {
    const caption = 'Just normal text without any formatting';
    const { getByText } = renderComponent({ caption });
    
    const textElement = getByText(caption);
    expect(textElement.props.style).not.toContainEqual({ fontWeight: 'bold' });
  });

  it('should render bold link with empty URL', () => {
    const caption = '**[Basecamp]()**';
    const { getByText } = renderComponent({ caption });
    const boldLink = getByText('Basecamp');
    expect(boldLink.props.style).toContainEqual({ fontWeight: 'bold' });
    // Should still render as a link (even if URL is empty)
  });

  it('should render complex mixed caption with bold, link, and bold-link', () => {
    const caption = 'A **bold** and [link](url) and **[bold link](url2)** and normal.';
    const { getByText } = renderComponent({ caption });

    expect(getByText('A ')).toBeTruthy();
    expect(getByText('bold').props.style).toContainEqual({ fontWeight: 'bold' });
    expect(getByText('link')).toBeTruthy();
    expect(getByText('bold link').props.style).toContainEqual({ fontWeight: 'bold' });
    expect(getByText(' and normal.')).toBeTruthy();
  });

  it('should render consecutive bolds and links correctly', () => {
    const caption = '**Bold1****Bold2**[Link1](url1)[Link2](url2)';
    const { getByText } = renderComponent({ caption });

    expect(getByText('Bold1').props.style).toContainEqual({ fontWeight: 'bold' });
    expect(getByText('Bold2').props.style).toContainEqual({ fontWeight: 'bold' });
    expect(getByText('Link1')).toBeTruthy();
    expect(getByText('Link2')).toBeTruthy();
  });

  it('should render prompt example with bold, bold-link, and normal text', () => {
    const caption = 'A one-time code was sent to **exampleuser@gmail.com**. Please enter your one-time code (case sensitive). Your code is valid for **10 mins** from the time of request. For help, visit our **[support page](https://support.example.com)**. **[basecamp]()**.';
    const { getByText } = renderComponent({ caption });

    expect(getByText('exampleuser@gmail.com').props.style).toContainEqual({ fontWeight: 'bold' });
    expect(getByText('10 mins').props.style).toContainEqual({ fontWeight: 'bold' });
    expect(getByText('support page').props.style).toContainEqual({ fontWeight: 'bold' });
    expect(getByText('basecamp').props.style).toContainEqual({ fontWeight: 'bold' });
  });

  it('should render entire string as bold when wrapped in asterisks', () => {
    const caption = '**John Doe, please visit **';
    const { getByText } = renderComponent({ caption });
    
    const boldTextElement = getByText('John Doe, please visit ');
    expect(boldTextElement.props.style).toContainEqual({ fontWeight: 'bold' });
  });

  it('should render entire string as bold even with trailing spaces', () => {
    const caption = '**Welcome to our application, please continue**';
    const { getByText } = renderComponent({ caption });
    
    const boldTextElement = getByText('Welcome to our application, please continue');
    expect(boldTextElement.props.style).toContainEqual({ fontWeight: 'bold' });
  });

  it('should handle entire string bold with single asterisks inside', () => {
    const caption = '**Text with * asterisk inside**';
    const { getByText } = renderComponent({ caption });
    
    const boldTextElement = getByText('Text with * asterisk inside');
    expect(boldTextElement.props.style).toContainEqual({ fontWeight: 'bold' });
  });
});
