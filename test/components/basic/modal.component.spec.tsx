import React from 'react';
import { Modal, Text } from 'react-native';
import WmModal from '@wavemaker/app-rn-runtime/components/basic/modal/modal.component';
import { render } from '@testing-library/react-native';
import { TestIdPrefixProvider } from '@wavemaker/app-rn-runtime/core/testid.provider';

const renderComponent = (props = {}) => {
  const defaultProps = {
    id: 'test-modal',
    show: true,
    animationType: 'slide',
    styles: {
      root: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
      content: { borderColor: 'red', borderWidth: 2 },
    },
    children: <Text>Modal Content</Text>,
  };
  return render(
    <TestIdPrefixProvider value={'unit-test'}>
      <WmModal {...defaultProps} {...props} />
    </TestIdPrefixProvider>
  );
};

describe('Modal component', () => {
  test('renders the WmModal with given props', () => {
    const tree = renderComponent();

    expect(tree.getByText('Modal Content')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  test('applies the correct animation type', () => {
    const tree = renderComponent({ animationType: 'fade' });

    expect(tree.UNSAFE_getByType(Modal).props.animationType).toBe('fade');
    expect(tree).toMatchSnapshot();
  });

  test('applies styles correctly from props', () => {
    const tree = renderComponent();
    const rootStyle = tree.toJSON().props.style;
    const contentStyle = tree.toJSON().children[0].props.style;

    expect(rootStyle).toEqual(
      expect.objectContaining({ backgroundColor: 'rgba(0, 0, 0, 0.5)' })
    );
    expect(contentStyle).toEqual(
      expect.objectContaining({ borderColor: 'red', borderWidth: 2 })
    );
    expect(tree).toMatchSnapshot();
  });

  test('applies default styles if no custom styles provided', () => {
    const tree = renderComponent({ styles: {} });
    const rootStyle = tree.toJSON().props.style;
    const contentStyle = tree.toJSON().children[0].props.style;

    expect(rootStyle).not.toEqual(undefined);
    expect(contentStyle).not.toEqual(undefined);
    expect(tree).toMatchSnapshot();
  });

  test('renders children correctly', () => {
    const tree = renderComponent({
      children: <Text>Custom Modal Content</Text>,
    });

    expect(tree.getByText('Custom Modal Content')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  xit('renders correctly when modal is hidden', () => {
    const tree = renderComponent({ show: false });

    expect(tree.queryByText('Modal Content')).toBeNull();
    expect(tree).toMatchSnapshot();
  });

  test('renders centered modal when centered styles are applied', () => {
    const tree = renderComponent({
      styles: {
        root: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          alignSelf: 'center',
          borderColor: 'blue',
          borderWidth: 2,
        },
      },
    });

    const rootStyle = tree.toJSON().props.style;
    const contentStyle = tree.toJSON().children[0].props.style;

    expect(rootStyle).toEqual(
      expect.objectContaining({
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      })
    );
    expect(contentStyle).toEqual(
      expect.objectContaining({
        alignSelf: 'center',
        borderColor: 'blue',
        borderWidth: 2,
      })
    );
    expect(tree).toMatchSnapshot();
  });
});
