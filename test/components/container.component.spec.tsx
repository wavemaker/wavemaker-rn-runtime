import React, { Children, ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmContainer from '@wavemaker/app-rn-runtime/components//container/container.component';
import WmContainerProps from '@wavemaker/app-rn-runtime/components/container/container.props';
import {
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react-native';
import { ScrollView } from 'react-native-gesture-handler';

const renderComponent = (props = {}) => {
  return render(<WmContainer name="test_Container" {...props} />);
};

describe('Test Container component', () => {
  const defaultProps: WmContainerProps = {
    onLoad: jest.fn(),
  };

  test('Check validity of sample component', () => {
    const tree = render(
      <WmContainer name="test_Container" {...defaultProps} />
    );
    expect(screen).toMatchSnapshot();
  });

  test('Check children are being rendered', () => {
    const tree = render(
      <WmContainer
        name="test_Container"
        {...{ children: <Text>children are rendered</Text> }}
        {...defaultProps}
      />
    );
    expect(tree.getByText('children are rendered')).toBeTruthy();
  });

  test('Check onTap is being called', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmContainer.prototype,
      'invokeEventCallback'
    );
    const onTapMock = jest.fn();
    const tree = render(
      <WmContainer
        name="test_Container"
        {...{ children: <Text>children</Text>, onTap: onTapMock }}
        {...defaultProps}
      />
    );
    fireEvent.press(tree.getByText('children'));
    await waitFor(() => {
      expect(onTapMock).toHaveBeenCalled();
      expect(invokeEventCallbackMock).toHaveBeenCalledWith(
        'onTap',
        expect.anything()
      );
    });
  });

  test('Check DoubleTap is being called', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmContainer.prototype,
      'invokeEventCallback'
    );
    const onDoubletapMock = jest.fn();
    const tree = render(
      <WmContainer
        name="test_Container"
        {...{ children: <Text>children</Text>, onDoubletap: onDoubletapMock }}
        {...defaultProps}
      />
    );
    fireEvent.press(tree.getByText('children'));
    fireEvent.press(tree.getByText('children'));
    await waitFor(() => {
      expect(onDoubletapMock).toHaveBeenCalled();
      expect(invokeEventCallbackMock).toHaveBeenCalledWith(
        'onDoubletap',
        expect.anything()
      );
    });
  });

  test('Check LongTap is being called', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmContainer.prototype,
      'invokeEventCallback'
    );
    const onLongTapMock = jest.fn();
    const tree = render(
      <WmContainer
        name="test_Container"
        {...{ children: <Text>children</Text>, onLongtap: onLongTapMock }}
        {...defaultProps}
      />
    );
    fireEvent(tree.getByText('children'), 'longPress');
    await waitFor(() => {
      expect(onLongTapMock).toHaveBeenCalled();
      expect(invokeEventCallbackMock).toHaveBeenCalledWith(
        'onLongtap',
        expect.anything()
      );
    });
  });

  xit('Check onTouchstart is being called', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmContainer.prototype,
      'invokeEventCallback'
    );
    const onTouchStartMock = jest.fn();
    const tree = render(
      <WmContainer
        name="test_Container"
        {...{ children: <Text>children</Text>, onTouchstart: onTouchStartMock }}
        {...defaultProps}
      />
    );
    fireEvent(tree.getByText('children'), 'press');
    await waitFor(() => {
      expect(onTouchStartMock).toHaveBeenCalled();
      expect(invokeEventCallbackMock).toHaveBeenCalledWith(
        'onTouchstart',
        expect.anything()
      );
    });
  });

  xit('Check onTouchend is being called', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmContainer.prototype,
      'invokeEventCallback'
    );
    const onTouchEndMock = jest.fn();
    const tree = render(
      <WmContainer
        name="test_Container"
        {...{ children: <Text>children</Text>, onTouchend: onTouchEndMock }}
        {...defaultProps}
      />
    );
    fireEvent(tree.getByText('children'), 'pressOut');
    await waitFor(() => {
      expect(onTouchEndMock).toHaveBeenCalled();
      expect(invokeEventCallbackMock).toHaveBeenCalledWith(
        'onTouchend',
        expect.anything()
      );
    });
  });

  test('Check if width height styles are being applied', () => {
    const tree = render(
      <WmContainer
        name="test_Container"
        {...{ styles: { root: { width: '100%', height: '100%' } } }}
        {...defaultProps}
      />
    );
    expect(screen.root.props.style.width).toBe('100%');
    expect(screen.root.props.style.height).toBe('100%');
  });

  test('render skeleton if showskeleton is true and showskeletonchildren is true', async () => {
    const renderSkeletonMock = jest.spyOn(
      WmContainer.prototype,
      'renderSkeleton'
    );

    const tree = render(
      <WmContainer
        name="test_Container"
        {...{
          children: <Text>hii</Text>,
          showskeleton: true,
          showskeletonchildren: true,
        }}
        {...defaultProps}
      />
    );
    expect(screen).toMatchSnapshot();

    expect(renderSkeletonMock).toHaveBeenCalled();
    const viewElement = tree.getByTestId('non_animatableView');
    expect(viewElement.props.style.backgroundColor).toBe('transparent');
    expect(viewElement.props.style.borderColor).toBe('transparent');
    expect(viewElement.props.style.shadowColor).toBe('transparent');
    renderSkeletonMock.mockRestore();
  });

  test('render skeleton if showskeleton is true and showskeletonchildren is false', async () => {
    const renderSkeletonMock = jest.spyOn(
      WmContainer.prototype,
      'renderSkeleton'
    );

    const tree = render(
      <WmContainer
        name="test_Container"
        {...{
          children: <Text>hii</Text>,
          showskeleton: true,
          showskeletonchildren: false,
        }}
        {...defaultProps}
      />
    );
    expect(screen).toMatchSnapshot();
    expect(renderSkeletonMock).toHaveBeenCalled();
    expect(screen.root.children[0].props.style[1].opacity).toBe(0);
    renderSkeletonMock.mockRestore();
  });

  test('should render partial content', async () => {
    const onLoadMock = jest.fn();

    const tree = render(
      <WmContainer
        name="test_Container"
        onLoad={onLoadMock()}
        {...{
          renderPartial: (props: any, onLoad: any) => {
            onLoad();
            return <Text>container partial content</Text>;
          },
        }}
        {...defaultProps}
      />
    );
    expect(screen.getByText('container partial content')).toBeTruthy();
    await waitFor(() => {
      expect(onLoadMock).toHaveBeenCalled();
    });
  });

  it('should render scrollView when scrollable prop is true', () => {
    renderComponent({ scrollable: true });
    const viewEle = screen.UNSAFE_queryByType(ScrollView);
    expect(viewEle).not.toBeNull();
    expect(viewEle).toBeDefined();
  });

  it('should not render scrollView when scrollable prop is false', () => {
    renderComponent({ scrollable: false });
    const viewEle = screen.UNSAFE_queryByType(ScrollView);
    expect(viewEle).toBeNull();
  });
});
