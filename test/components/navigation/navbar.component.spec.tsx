import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import WmNavbar from '@wavemaker/app-rn-runtime/components/navigation/navbar/navbar.component';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import WmNavItem from '@wavemaker/app-rn-runtime/components/navigation/navitem/navitem.component';
import WmNavbarProps from '../../../src/components/navigation/navbar/navbar.props';
import { NavigationServiceProvider } from '../../../src/core/navigation.service';
import mockNavigationService from '../../__mocks__/navigation.service';

// jest.mock(
//   '@wavemaker/app-rn-runtime/components/navigation/navitem/navitem.component',
//   () => 'WmNavItem'
// );

describe('WmNavbar', () => {
  let defaultProps;
  let dataItems = [
    {
      key: '1',
      label: 'Home',
      link: '#home',
      icon: 'fa fa-home',
      itemchildren: [],
    },
    {
      key: '2',
      label: 'About',
      link: '#about',
      icon: 'fa fa-info',
      itemchildren: [],
    },
  ];

  beforeEach(() => {
    defaultProps = {
      dataset: dataItems,
      itemlabel: 'label',
      itemlink: 'link',
      itemicon: 'icon',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Check Rendering with Default Props
  it('renders correctly with default props', () => {
    render(<WmNavbar {...defaultProps} />);
    expect(screen.getByText('home')).toBeTruthy();
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('info')).toBeTruthy();
    expect(screen.getByText('About')).toBeTruthy();
  });

  // Dataset Handling
  it('handles dataset properly and renders items based on it', () => {
    render(<WmNavbar {...defaultProps} />);
    const items = screen.UNSAFE_getAllByType(WmNavItem);
    expect(items).toHaveLength(2);
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('About')).toBeTruthy();
  });

  // Prop Update Handling
  it('responds to prop updates correctly', async () => {
    const { rerender } = render(<WmNavbar {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeTruthy();
      expect(screen.getByText('About')).toBeTruthy();
    });

    const newDataset = [
      {
        key: '1',
        label: 'Contact',
        link: '#contact',
        icon: 'contact',
      },
      {
        key: '2',
        label: 'Blog',
        link: '#blog',
        icon: 'blog',
      },
    ];
    rerender(<WmNavbar {...defaultProps} dataset={newDataset} />);

    await waitFor(() => {
      expect(screen.getByText('Contact')).toBeTruthy();
      expect(screen.getByText('Blog')).toBeTruthy();
    });
  });

  // Rendering Child Components
  it('renders nested child components correctly', async () => {
    const nestedDataset = [
      {
        key: '1',
        label: 'Services',
        link: '#services',
        icon: 'services',
        itemchildren: [
          {
            key: '1-1',
            label: 'Consulting',
            link: '#consulting',
            icon: 'consulting',
          },
          {
            key: '1-2',
            label: 'Development',
            link: '#development',
            icon: 'development',
          },
        ],
      },
    ];
    const props = {
      ...defaultProps,
      dataset: nestedDataset,
      itemchildren: 'itemchildren',
    };
    render(<WmNavbar {...props} />);
    expect(screen.getByText('Services')).toBeTruthy();
    fireEvent.press(screen.getByText('sort-down'));
    await waitFor(() => {
      expect(screen.getByText('Consulting')).toBeTruthy();
      expect(screen.getByText('Development')).toBeTruthy();
    });
  });

  // Click Handling
  it('calls onSelect callback when an item is selected', async () => {
    const onSelectMock = jest.fn();
    const props = { ...defaultProps, onSelect: onSelectMock };

    render(
      <NavigationServiceProvider value={mockNavigationService}>
        <WmNavbar {...props} />
      </NavigationServiceProvider>
    );
    const anchor = screen.getByText('Home');
    fireEvent.press(anchor);
    await waitFor(() => {
      expect(onSelectMock).toHaveBeenCalled();
      expect(mockNavigationService.openUrl).toHaveBeenCalled();
    });
  });

  // Accessibility Props
  it('applies accessibility props correctly', () => {
    render(<WmNavbar {...defaultProps} />);
    expect(screen.getByLabelText('Home')).toBeTruthy();
    expect(screen.getByLabelText('About')).toBeTruthy();
  });

  // Edge Cases: Empty Dataset
  it('handles empty dataset gracefully', () => {
    const props = { ...defaultProps, dataset: [] };
    render(<WmNavbar {...props} />);
    expect(screen.queryByText('Home')).toBeNull();
    expect(screen.queryByText('About')).toBeNull();
  });

  // Test Indentation
  it('applies indentation styles correctly', () => {
    const props = { ...defaultProps, indent: 20 };
    render(<WmNavbar {...props} />);
    const navItems = screen.UNSAFE_getAllByType(WmNavItem);
    navItems.forEach((navItem) => {
      expect(navItem.props.styles.navAnchorItem.root.paddingLeft).toBe(20);
    });
  });

  // State Management
  it('correctly sets state and renders based on state', () => {
    const instance = new WmNavbar(defaultProps);
    instance.setDataItems(defaultProps.dataset);
    expect(instance.state.dataItems).toHaveLength(2);
  });
});
