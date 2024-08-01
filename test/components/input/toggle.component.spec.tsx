import React, { createRef } from 'react';
import { Platform } from 'react-native';
import {
  render,
  fireEvent,
  waitFor,
  cleanup,
  act,
} from '@testing-library/react-native';
import MockDate from 'mockdate';
import WmToggle from '@wavemaker/app-rn-runtime/components/input/toggle/toggle.component';
import * as accessibilityUtils from '@wavemaker/app-rn-runtime/core/accessibility';
import { defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';


// const frameTime = 100;
// const timeTravel = (time = frameTime) => {
//   const tickTravel = () => {
//     const now = Date.now();
//     MockDate.set(new Date(now + frameTime));
//     // Run the timers forward
//     act(() => {
//       jest.advanceTimersByTime(frameTime);
//     });
//   };
//   // Step through each of the frames
//   const frames = time / frameTime;
//   for (let i = 0; i < frames; i++) {
//     tickTravel();
//   }
// };

const hexToArgbValue = (hex) => {
  let hexCode = hex.substr(1);
  if (hexCode === 3) {
    hexCode = '' + hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  hexCode = '0xff' + hexCode;

  return parseInt(hexCode, 16);
};

const invokeEventCallbackMock = jest.spyOn(WmToggle.prototype, 'invokeEventCallback');

describe('Test Toggle component', () => {
  beforeAll(() => {
    jest
      .spyOn(accessibilityUtils, 'isScreenReaderEnabled')
      .mockReturnValue(false);

    const DEFAULT_CLASS = 'app-toggle';
    BASE_THEME.registerStyle((themeVariables, addStyle) => {
      const defaultStyles = defineStyles({
        root: {
          width: 52,
          height: 32,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 18,
        },
        text: {},
        handle: {
          width: 16,
          height: 16,
          borderRadius: 18,
          marginLeft: 8,
          marginRight: 0,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundImage: 'linear-gradient(45deg, #4c669f, #3b5998)',
        },
      });
      addStyle(DEFAULT_CLASS, '', defaultStyles);
      addStyle(DEFAULT_CLASS + '-on', '', {
        root : {
          backgroundColor: '#000000',
        },
        handle: {
          backgroundColor: '#367BA7',
        }
      });
      addStyle(DEFAULT_CLASS + '-off', '', {
        root : {
          backgroundColor: '#ffffff',
          borderColor: '#000000',
          borderWidth: 2
        },
        handle: {
          backgroundColor: '#E9EDEF',
        }
      });
      addStyle(DEFAULT_CLASS + '-rtl', '', {});
      addStyle(DEFAULT_CLASS + '-disabled', '', {
          root : {}
      });
    });
  });

  beforeEach(()=> {
    MockDate.set(0);
  });

  afterEach(() => {
    (Platform as any).OS = 'ios';
    cleanup();
    MockDate.reset();
  });

  const baseProps = {
    id: 'wm-toggle',
    name: 'toggle-switch',
    checkedvalue: true,
    uncheckedvalue: false,
    datavalue: false,
    readonly: false,
    onFieldChange: jest.fn(),
    accessibilitylabel: 'wm-toggle-switch',
    hint: 'Toggle switch hint',
    accessibilityrole: 'togglebutton',
  };

  test('should render WmToggle component', async () => {
    const tree = render(<WmToggle {...baseProps} />);

    await waitFor(() => {
      expect(tree.getByTestId('wm-toggle_a')).toBeDefined();
      expect(tree.getByTestId('wm-expo-linear-gradient')).toBeDefined();
      expect(tree.getByTestId('wm-expo-linear-gradient').props.colors).toEqual([
        hexToArgbValue('#4c669f'),
        hexToArgbValue('#3b5998')
      ])
      expect(tree).toMatchSnapshot();
    });
  });

  test('should toggle the switch', async () => {
    const { getByTestId } = render(<WmToggle {...baseProps} />);
    const toggleComponent = getByTestId('wm-toggle_a');

    expect(toggleComponent.props.accessibilityState.selected).toBe(false);

    fireEvent.press(toggleComponent);

    await waitFor(() => {
      expect(toggleComponent.props.accessibilityState.selected).toBe(true);
    });
  });

  test('should not toggle if disabled in native platform', async () => {
    const props = {
      ...baseProps,
      disabled: true,
    };
    const tree = render(<WmToggle {...props} />);
    const toggleComponent = tree.getByTestId('wm-toggle_a');

    expect(toggleComponent.props.accessibilityState.selected).toBe(false);

    fireEvent(toggleComponent, 'press');

    await waitFor(() => {
      expect(toggleComponent.props.accessibilityState.selected).not.toBe(true);
      expect(toggleComponent.props.accessibilityState.selected).toBe(false);
      expect(tree).toMatchSnapshot();
    });
  });

  test('should not toggle if disabled in web platform', async () => {
    (Platform as any).OS = 'web';
    const props = {
      ...baseProps,
      disabled: true,
    };
    const toggleSwitchMock = jest.spyOn(WmToggle.prototype, 'onToggleSwitch');
    const tree = render(<WmToggle {...props} />);
    const toggleComponent = tree.getByTestId('wm-toggle_a');

    fireEvent(toggleComponent, 'press');

    await waitFor(() => {
      expect(toggleSwitchMock).not.toHaveBeenCalled();
    });
  });

  test('should call invoke event callback on press toggle when readonly', async () => {
    const props = {
      ...baseProps,
      readonly: true,
    };
    const customRef = createRef();
    const tree = render(<WmToggle {...props} ref={customRef}/>);
    const toggleComponent = tree.getByTestId('wm-toggle_a');

    expect(toggleComponent.props.accessibilityState.selected).toBe(false);

    act(()=>{
      fireEvent(toggleComponent, 'press');
    })

    await waitFor(() => {
      expect(toggleComponent.props.accessibilityState.selected).toBe(true);
      expect(invokeEventCallbackMock).toHaveBeenCalledWith('onTap', expect.arrayContaining([null]))
    });
  });

  test('should call invoke event callback with onChange on press toggle when onFieldChange prop is falsy', async () => {
    const props = {
      ...baseProps,
      onFieldChange: null
    };
    const customRef = createRef();
    const tree = render(<WmToggle {...props} ref={customRef}/>);
    const toggleComponent = tree.getByTestId('wm-toggle_a');

    expect(toggleComponent.props.accessibilityState.selected).toBe(false);

    act(()=>{
      fireEvent(toggleComponent, 'press');
    });

    await waitFor(() => {
      expect(toggleComponent.props.accessibilityState.selected).toBe(true);
      expect(invokeEventCallbackMock).toHaveBeenCalledWith('onChange', expect.arrayContaining([null, true, false]))
    });
  });

  test('should call onFieldChange when toggled', async () => {
    const { getByTestId } = render(<WmToggle {...baseProps} />);
    const toggleComponent = getByTestId('wm-toggle_a');
    fireEvent.press(toggleComponent);

    await waitFor(()=>{
      expect(baseProps.onFieldChange).toHaveBeenCalledWith(
        'datavalue',
        true,
        false
      );
    })
  });

  test('should validate on property change', async () => {
    const { getByTestId, rerender } = render(<WmToggle {...baseProps} />);
    const toggleComponent = getByTestId('wm-toggle_a');

    rerender(<WmToggle {...baseProps} datavalue={true} />);

    await waitFor(()=>{
      expect(toggleComponent.props.accessibilityState.selected).toBe(true);
    })

    rerender(<WmToggle {...baseProps} datavalue={false}/>);

    await waitFor(()=>{
      expect(toggleComponent.props.accessibilityState.selected).toBe(false);
    })
  });

  test('should render with different styles based on state', async () => {
    const tree = render(<WmToggle {...baseProps} />);
    const { getByTestId, rerender } = tree;
    let toggleComponent = getByTestId('wm-toggle_a');
    let animatedViewStyleArr = (toggleComponent.children[1] as any).props.style;
    let animatedViewStyle = {};
    animatedViewStyleArr.forEach(item => {
      if(!item) return;

      Object.keys(item).forEach(key => {
        animatedViewStyle[key] = item[key];
      })
    });

    await waitFor(()=>{
      expect(toggleComponent.props.style).toMatchObject({
        backgroundColor: '#ffffff',
        borderColor: '#000000',
        borderWidth: 2
      });
      expect(animatedViewStyle).toMatchObject({
        backgroundColor: "#E9EDEF"
      })
    })

    fireEvent.press(toggleComponent);

    await waitFor(()=>{
      expect(toggleComponent.props.accessibilityState.selected).toBe(true);
    })

    toggleComponent = getByTestId('wm-toggle_a');
    animatedViewStyleArr = (toggleComponent.children[1] as any).props.style;
    animatedViewStyle = {};

    animatedViewStyleArr.forEach(item => {
      if(!item) return;

      Object.keys(item).forEach(key => {
        animatedViewStyle[key] = item[key];
      })
    })

    await waitFor(()=>{
      expect(toggleComponent.props.style).toMatchObject({
        backgroundColor: '#000000',
      });
      expect(animatedViewStyle).toMatchObject({
        backgroundColor: "#367BA7"
      })
    })
  });

  // test('should apply animations correctly', async () => {
  //   jest.useFakeTimers();

  //   const viewWidth = 30;
  //   const tree = render(<WmToggle {...baseProps} viewWidth={viewWidth}/>);
  //   const { getByTestId, rerender } = tree;

  //   timeTravel(600);
  //   await waitFor(()=>{
  //     expect(getByTestId('wm-toggle_a').props.accessibilityState.selected).toBe(false);
  //   })

  //   let toggleComponent = getByTestId('wm-toggle_a');

  //   console.log('style: ', toggleComponent.children[1].props.style[1].transform);

  //   let animatedViewStyleArr = (toggleComponent.children[1] as any).props.style;
  //   let animatedViewStyle = {};
  //   animatedViewStyleArr.forEach(item => {
  //     if(!item) return;

  //     Object.keys(item).forEach(key => {
  //       animatedViewStyle[key] = item[key];
  //     })
  //   });

  //   let style = {};
  //   animatedViewStyle.transform.forEach(item => {
  //     if(!item) return;
  //     Object.keys(item).forEach(key => {
  //       style[key] = item[key];
  //     })
  //   })

  //   await waitFor(()=>{
  //     expect(style).toMatchObject({
  //       translateX: 0, scale: 1,
  //     })
  //   })

  //   fireEvent.press(toggleComponent);

  //   await waitFor(()=>{
  //     expect(toggleComponent.props.accessibilityState.selected).toBe(true);
  //   });

  //   toggleComponent = getByTestId('wm-toggle_a');
  //   animatedViewStyleArr = (toggleComponent.children[1] as any).props.style;
  //   animatedViewStyle = {};
  //   animatedViewStyleArr.forEach(item => {
  //     if(!item) return;

  //     Object.keys(item).forEach(key => {
  //       animatedViewStyle[key] = item[key];
  //     })
  //   })

  //   await waitFor(()=>{
  //     expect(animatedViewStyle).toMatchObject({
  //       transform: [
  //         {translateX: viewWidth - ( 16 + 18)}, // 16 is styles.handle.width defined in beforeAll
  //         {scale: 1.5}
  //       ], 
  //     })
  //   })

  //   jest.useRealTimers();
  // })
});
