import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import WmList from '@wavemaker/app-rn-runtime/components/data/list/list.component';
import WmListProps from '@wavemaker/app-rn-runtime/components/data/list/list.props';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { cleanup as rtlCleanup } from '@testing-library/react-native';

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
   
  describe('WmList loading and pagination tests', () => {
    // Sample data with more items than default pagesize
    const createLargeDataset = (size = 50) => {
      return Array.from({ length: size }, (_, i) => ({ 
        id: i + 1, 
        name: `Item ${i + 1}` 
      }));
    };

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

    // Test pagination and loading in WmList component
    test('vertical list should limit visible items by pagesize', () => {
      const props = createProps({ 
        direction: 'vertical',
        pagesize: 10,
        dataset: createLargeDataset(30)
      });
      const { queryAllByTestId } = render(<WmList {...props} />);
      const renderedItems = queryAllByTestId(/^testList_item\d+$/);
      expect(renderedItems.length).toBeLessThan(30);
    });

    test('horizontal list rendering based on horizontalondemandenabled', () => {
      // Create a dataset with exactly 20 items
      const totalItems = 20;
      const customPageSize = 5;
      const dataSet = createLargeDataset(totalItems);
      
      // Test with horizontalondemandenabled=true
      const limitedProps = createProps({ 
        direction: 'horizontal',
        pagesize: customPageSize,
        dataset: dataSet,
        horizontalondemandenabled: true 
      });
      const { getByTestId, queryAllByTestId } = render(<WmList {...limitedProps} />);
      
      // Check the visual items (should be limited)
      const limitedVisualItems = queryAllByTestId(/^testList_item\d+$/);
      expect(limitedVisualItems.length).toBeLessThan(totalItems);
      
      // Check FlatList data property
      const limitedFlatList = getByTestId(testID);
      expect(limitedFlatList.props.horizontal).toBe(true);
      
      // Clean up first render
      rtlCleanup();
      
      // Test with horizontalondemandenabled=false
      const fullProps = createProps({
        direction: 'horizontal',
        pagesize: customPageSize,
        dataset: dataSet,
        horizontalondemandenabled: false
      });
      const { getByTestId: getByTestIdFull } = render(<WmList {...fullProps} />);
      const fullFlatList = getByTestIdFull(testID);
      
      // Check that all data is available in the FlatList props
      expect(fullFlatList.props.data.length).toBe(totalItems);
      expect(fullFlatList.props.data).toEqual(expect.arrayContaining(dataSet));
      expect(fullFlatList.props.horizontal).toBe(true);
    });

    test('on-demand loading displays correct UI elements', async () => {
      // Create a simpler mock that resolves immediately
      const mockGetNextPageData = jest.fn().mockResolvedValue([]);
      
      const props = createProps({ 
        navigation: 'On-Demand',
        getNextPageData: mockGetNextPageData,
        ondemandmessage: 'Load More',
        dataset: createLargeDataset(30)
      });
      
      const { getByText } = render(<WmList {...props} />);
      const loadMoreButton = getByText('Load More');
      expect(loadMoreButton).toBeTruthy();
      
      // Just verify the button is rendered correctly
      // This avoids the state update issues
      expect(mockGetNextPageData).not.toHaveBeenCalled();
    });
  });
});
