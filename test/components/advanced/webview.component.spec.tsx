import React, { createRef } from 'react';
import { AccessibilityInfo, Platform, View } from 'react-native';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import WmWebview from '@wavemaker/app-rn-runtime/components/advanced/webview/webview.component';
import * as accessibilityUtils from '@wavemaker/app-rn-runtime/core/accessibility';

describe('Test Webview component', () => {
  const baseProps = {
    id: 'wm',
    name: 'webview-component',
    src: 'https://example.com',
    incognito: false,
    onLoad: jest.fn(),
  };

  const invokeEventCallbackMock = jest.spyOn(
    WmWebview.prototype,
    'invokeEventCallback'
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render WmWebview component with given src', async () => {
    const tree = render(<WmWebview {...baseProps} />);
    const webview = tree.getByTestId('wm_web_view');

    // await waitFor(()=>{
    //   expect(webview.props.source).toBeDefined();
    // })
    expect(tree).toMatchSnapshot();
  });

  test('should render component with accessibility props', async () => {
    const props = {
      ...baseProps,
      accessibilitylabel: 'wm-web-view',
      hint: 'this is a web view',
      accessibilityrole: 'web-view-wm',
    };
    const tree = render(<WmWebview {...props} />);

    expect(tree.getByTestId('wm_web_view')).toBeDefined();
    expect(tree.getByLabelText('wm-web-view')).toBeDefined();
    expect(tree.getByAccessibilityHint('this is a web view')).toBeDefined();
    expect(tree.getByTestId('wm_web_view').props.accessibilityRole).toBe(
      'web-view-wm'
    );
    expect(tree).toMatchSnapshot();
  });

  test('should handle onLoad callback when content is loaded', async () => {
    const tree = render(<WmWebview {...baseProps} />);
    const webview = tree.getByTestId('wm_web_view');

    const event = {
      nativeEvent: {
        title: 'Example Page',
        url: 'https://example.com',
      },
    };

    fireEvent(webview, 'onLoadEnd', event);

    await waitFor(() => {
      expect(baseProps.onLoad).toHaveBeenCalledWith(
        event,
        expect.any(WmWebview)
      );
      expect(tree).toMatchSnapshot();
    });
  });

  test('should inject JavaScript and handle result', async () => {
    const customRef = createRef<WmWebview>();
    render(<WmWebview {...baseProps} ref={customRef} />);

    const invokeScriptFn = jest.spyOn(
      customRef.current.webview,
      'injectJavaScript'
    );

    customRef.current.executeScript(`function(){console.log("hello world")}`);
    expect(invokeScriptFn).toHaveBeenCalled();
    expect(invokeScriptFn).toHaveBeenCalledWith(
      expect.stringContaining(`function(){console.log("hello world")}`)
    );
  });

  // test('should handle BackHandler for Android', () => {
  //   Platform.OS = 'android';
  //   const customRef = createRef<WmWebview>()

  //   // console.log(WmWebview.prototype);

  //   // const backHandlerSpy = jest.spyOn(
  //   //   WmWebview.prototype,
  //   //   'handleBackButtonPress'
  //   // );
  //   render(<WmWebview {...baseProps} ref={customRef}/>);

  //   // act(()=>{
  //   //   customRef.current
  //   // })
  //   hardwareBackPress
  //   console.log(customRef.current);

  //   expect(backHandlerSpy).toHaveBeenCalled();
  // });

  test('should use incognito mode if incognito prop is true', () => {
    const props = {
      ...baseProps,
      incognito: true,
    };

    const { getByTestId } = render(<WmWebview {...props} />);
    const webview = getByTestId('wm_web_view');

    expect(webview.props.incognito).toBe(true);
  });

  test('should handle onMessage callback when a message is received', () => {
    const parseResultMock = jest.spyOn(WmWebview.prototype, 'parseResult');
    const customRef = createRef<WmWebview>();
    const { getByTestId } = render(
      <WmWebview {...baseProps} ref={customRef} />
    );
    const webview = getByTestId('wm_web_view');

    const event = {
      nativeEvent: {
        data: 'test message',
      },
    };

    fireEvent(webview, 'onMessage', event);
    expect(invokeEventCallbackMock).toHaveBeenCalledWith('onMessage', [
      event,
      expect.anything(),
    ]);

    act(() => {
      customRef.current.invokeJSCallbacks = {
        1: (arg) => arg,
      };
    });

    event.nativeEvent = {
      data: 'afterInjectJavaScript:1:function()',
    };

    fireEvent(webview, 'onMessage', event);
    expect(parseResultMock).toHaveBeenCalled();
  });

  test('should parse the result correctly from executeScript', () => {
    const parseResultMock = jest.spyOn(WmWebview.prototype, 'parseResult');
    const customRef = createRef<WmWebview>();
    const { getByTestId } = render(
      <WmWebview {...baseProps} ref={customRef} />
    );
    const webview = getByTestId('wm_web_view');

    act(() => {
      customRef.current.invokeJSCallbacks = {
        1: (arg) => arg,
      };
    });

    const event = {
      nativeEvent: {
        data: 'afterInjectJavaScript:1:{value: "wm-web-view"}',
      },
    };

    fireEvent(webview, 'onMessage', event);
    expect(parseResultMock).toHaveBeenCalled();
    expect(parseResultMock).toHaveBeenCalledWith('{value: "wm-web-view"}')
  });

  test('should handle insertCSS correctly', async () => {
    const executeScriptMock = jest.spyOn(WmWebview.prototype, 'executeScript');
    const customRef = createRef();
    render(<WmWebview {...baseProps} ref={customRef}/>);
    let result;

    act(()=>{
      result = customRef.current.insertCSS(
        'body { background-color: red; }'
      );
    })

    expect(executeScriptMock).toHaveBeenCalled();
    await waitFor(()=>{
      expect(result).toMatchObject({})
    })
  });

  // test('should render iframe when Platform is web', () => {
  //   jest.mock(iframe, ()=><View/>)
  //   Platform.OS = 'web';
  //   const tree = render(<WmWebview {...baseProps}/>);

  //   expect(tree.UNSAFE_getByType(<iframe/>)).toBeDefined();
  // })
});
