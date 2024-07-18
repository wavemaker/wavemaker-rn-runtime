import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import WmDialogactions from '@wavemaker/app-rn-runtime/components/dialogs/dialogactions/dialogactions.component';

describe('Dialogactions component', () => {
  test('should render component', () => {
    const tree = render(<WmDialogactions name="test_Dialogactions" />);

    expect(tree).toMatchSnapshot();
  });

  test('should render component with children', () => {
    const tree = render(
      <WmDialogactions name="test_Dialogactions">
        <Text>Test children component</Text>
      </WmDialogactions>
    );

    expect(tree.getByText('Test children component')).toBeDefined();
    expect(tree).toMatchSnapshot();
  });

  test('should render component with custom style', () => {
    const tree = render(
      <WmDialogactions
        name="test_Dialogactions"
        styles={{
          root: {
            borderColor: '#404040',
          },
        }}
      >
        <Text>Test children component</Text>
      </WmDialogactions>
    );

    expect(tree.getByText('Test children component')).toBeDefined();
    expect(tree.toJSON().props.style).toMatchObject({ borderColor: '#404040' });
    expect(tree).toMatchSnapshot();
  });

  test('should not show component when show is false', () => {
    const tree = render(
      <WmDialogactions name="test_Dialogactions" show={false}>
        <Text>Test children component</Text>
      </WmDialogactions>
    );

    expect(tree.toJSON().props.style).toMatchObject({ height: 0, width: 0 });
    expect(tree).toMatchSnapshot();
  });
});
