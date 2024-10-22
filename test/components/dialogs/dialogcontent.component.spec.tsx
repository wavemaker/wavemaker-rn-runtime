import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import WmDialogcontent from '@wavemaker/app-rn-runtime/components/dialogs/dialogcontent/dialogcontent.component';

describe('Test Dialogcontent component', () => {
  test('should render component', () => {
    const tree = render(<WmDialogcontent name="test_Dialogcontent" />);

    expect(tree).toMatchSnapshot();
  });

  test('should render component with children', () => {
    const tree = render(
      <WmDialogcontent name="test_Dialogcontent">
        <Text>Test Children component</Text>
      </WmDialogcontent>
    );

    expect(tree.getByText('Test Children component')).toBeDefined();
    expect(tree).toMatchSnapshot();
  });

  xit('should render component with custom style', () => {
    const tree = render(
      <WmDialogcontent
        name="test_Dialogcontent"
        styles={{
          backgroundColor: '#040404',
          maxHeight: 400,
        }}
      >
        <Text>Test Children component</Text>
      </WmDialogcontent>
    );

    const containerStyleArray = tree.toJSON().props.contentContainerStyle;
    const containerStyle = {};
    containerStyleArray.forEach((item) => {
      if (!item) return;
      Object.keys(item).forEach((key) => {
        containerStyle[key] = item[key];
      });
    });

    expect(containerStyle).toMatchObject({
      backgroundColor: '#040404',
      maxHeight: 400,
    });
    expect(tree.toJSON().props.style).toMatchObject({ maxHeight: 400 });
    expect(tree).toMatchSnapshot();
  });

  test('should not show component when show is false', () => {
    const tree = render(
      <WmDialogcontent name="test_Dialogcontent" show={false}>
        <Text>Test Children component</Text>
      </WmDialogcontent>
    );
    const containerStyleArray = tree.toJSON().props.contentContainerStyle;
    const containerStyle = {};
    containerStyleArray.forEach((item) => {
      if (!item) return;
      Object.keys(item).forEach((key) => {
        containerStyle[key] = item[key];
      });
    });

    expect(containerStyle).toMatchObject({ height: 0, width: 0 });
    expect(tree).toMatchSnapshot();
  });

  test('should call notify method when component is scrolled', () => {
    const notifyMock = jest.spyOn(WmDialogcontent.prototype, 'notify');
    const tree = render(
      <WmDialogcontent name="test_Dialogcontent" show={false}>
        <Text>Test Children component</Text>
      </WmDialogcontent>
    );

    fireEvent(tree.root, 'scroll');

    expect(notifyMock).toHaveBeenCalled();
    expect(notifyMock).toHaveBeenCalledWith(
      'scroll',
      expect.arrayContaining([])
    );
  });
});
