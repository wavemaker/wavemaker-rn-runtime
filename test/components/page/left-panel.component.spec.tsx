import React, { createRef, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import WmLeftPanel from '@wavemaker/app-rn-runtime/components/page/left-panel/left-panel.component';
import {
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react-native';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';

const renderComponent = (props = {}) => {
  return render(<WmLeftPanel name="test_LeftPanel" {...props} />);
};

describe('Test LeftPanel component', () => {
  it('should render the left-panel component', () => {
    const tree = renderComponent().toJSON();
    expect(tree).not.toBeNull();
    expect(tree).toBeDefined();
    expect(tree).toMatchSnapshot();
  });

  //styles
  it('should render scrollView with default and custom rootStyles', () => {
    const tree = renderComponent();
    const rootElement = screen.root.props;

    expect(rootElement.contentContainerStyle[0].minHeight).toBe('100%');
    expect(rootElement.contentContainerStyle[0].backgroundColor).toBe(
      '#ffffff'
    );
    expect(rootElement.contentContainerStyle[0].elevation).toBe(1);
    expect(rootElement.contentContainerStyle[0].borderTopRightRadius).toBe(16);
    expect(rootElement.contentContainerStyle[0].borderBottomRightRadius).toBe(
      16
    );
    expect(rootElement.contentContainerStyle[1].maxWidth).toBe('100%');

    const styles = {
      root: {
        minHeight: '100%',
        backgroundColor: 'red',
        elevation: 2,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 25,
        maxWidth: 380,
      },
    };

    //rerender
    tree.rerender(<WmLeftPanel name="test_LeftPanel" styles={styles} />);

    expect(screen.root.props.contentContainerStyle[0].minHeight).toBe('100%');
    expect(screen.root.props.contentContainerStyle[0].backgroundColor).toBe(
      'red'
    );
    expect(screen.root.props.contentContainerStyle[0].elevation).toBe(2);
    expect(
      screen.root.props.contentContainerStyle[0].borderTopRightRadius
    ).toBe(20);
    expect(
      screen.root.props.contentContainerStyle[0].borderBottomRightRadius
    ).toBe(25);
    expect(screen.root.props.contentContainerStyle[0].maxWidth).toBe(380);
  });

  //onscroll event
  it('when ever user tries to scroll, then onscroll event should render and calls the notify method', () => {
    const notifyMock = jest.spyOn(WmLeftPanel.prototype, 'notify');

    //render
    renderComponent();

    fireEvent(screen.root, 'scroll');
    expect(notifyMock).toHaveBeenCalled();
  });

  //background Component
  it('should render background Component', () => {
    const tree = renderComponent();

    const viewEle = tree.UNSAFE_queryByType(BackgroundComponent);
    expect(viewEle).not.toBeNull();
    expect(viewEle).toBeDefined();
  });

  //if the children, having text means...this case should pass
  it('should return (children with text) when renderPartial prop is not given', () => {
    const ref = createRef();
    const tree = renderComponent({
      children: (
        <View>
          <Text>children</Text>
        </View>
      ),
      ref,
    });
    expect(tree.getByText('children')).toBeTruthy();
    expect(ref.current.state.isPartialLoaded).toBeFalsy();
  });

  //if that children, doesnot have text means.. this case should pass
  it('should return children when renderPartial prop is not given', () => {
    const renderContentMock = jest.spyOn(
      WmLeftPanel.prototype,
      'renderContent'
    );
    renderComponent({
      children: (
        <View>
          <View></View>
        </View>
      ),
    });
    expect(renderContentMock).toHaveReturnedWith(
      <View>
        <View></View>
      </View>
    );
  });

  it('should return renderPartial function when renderPartial prop is provided', async () => {
    const onPartialLoadMock = jest.spyOn(
      WmLeftPanel.prototype,
      'onPartialLoad'
    );

    const onLoadMock = jest.fn();
    const invokeEventCallbackMock = jest.spyOn(
      WmLeftPanel.prototype,
      'invokeEventCallback'
    );
    const renderPartial = (props: any, onPartialLoad: Function) => {
      onPartialLoad();
      return (
        <View>
          <Text>This is partial text</Text>
        </View>
      );
    };

    //render
    renderComponent({
      renderPartial: renderPartial,
      onLoad: onLoadMock,
    });

    await waitFor(() => {
      expect(invokeEventCallbackMock).toHaveBeenCalled();
      expect(onPartialLoadMock).toHaveBeenCalled();
      expect(onLoadMock).toHaveBeenCalled();
      expect(screen.getByText('This is partial text')).toBeTruthy();
    });
  });

  it('should update the state of isPartialLoaded to true', async () => {
    const ref = createRef<WmLeftPanel>();
    const updateStateMock = jest.spyOn(WmLeftPanel.prototype, 'updateState');
    const renderPartial = (props: any, onPartialLoad: Function) => {
      onPartialLoad();
    };

    //render
    const tree = renderComponent({
      renderPartial: renderPartial,
      ref: ref,
    });
    await waitFor(() => {
      expect(updateStateMock).toHaveBeenCalled();
      expect(ref.current.state.isPartialLoaded).toBe(true);
    });
  });
});
