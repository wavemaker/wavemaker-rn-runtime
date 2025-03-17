import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import WmList from '@wavemaker/app-rn-runtime/components/data/list/list.component';
import WmListProps from '@wavemaker/app-rn-runtime/components/data/list/list.props';
import { render } from '@testing-library/react-native';
describe('Test List component', () => {
  interface ListItem {
    id: number;
    name: string;
    category?: string;
  }

  const mockData: ListItem[] = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  //test id
  const testID = "testList_flat_list"

  const createProps = (overrides?: Partial<WmListProps>): WmListProps => {
    const baseProps = new WmListProps();
    return {
      ...baseProps,
      name: 'testList',
      direction: 'horizontal',
      dataset: mockData,
      renderItem: (item: ListItem): JSX.Element => <div>{item.name}</div>,
      ...overrides
    };
  };
  test('Check validity of sample component', () => {
    const props = createProps();
    const tree = render(<WmList {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should show horizontal scrollbar by default', () => {
    const props = createProps();
    const { getByTestId } = render(<WmList {...props} />);
    const flatList = getByTestId(testID);
    expect(flatList.props.showsHorizontalScrollIndicator).toBe(true);
  });

  test('should hide horizontal scrollbar when hidehorizontalscrollbar is true', () => {
    const props = createProps({ hidehorizontalscrollbar: true });
    const { getByTestId } = render(<WmList {...props} />);
    const flatList = getByTestId(testID);
    expect(flatList.props.showsHorizontalScrollIndicator).toBe(false);
  });

  test('should show horizontal scrollbar when hidehorizontalscrollbar is false', () => {
    const props = createProps({ hidehorizontalscrollbar: false });
    const { getByTestId } = render(<WmList {...props} />);
    const flatList = getByTestId(testID);
    expect(flatList.props.showsHorizontalScrollIndicator).toBe(true);
  });

  test('should not affect vertical list scrollbar', () => {
    const props = createProps({
      direction: 'vertical',
      hidehorizontalscrollbar: true
    });

    const { getByTestId } = render(<WmList {...props} />);
    const flatList = getByTestId(testID);

    expect(flatList.props.showsHorizontalScrollIndicator).toBeUndefined();
  });
});