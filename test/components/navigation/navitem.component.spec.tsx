import React, { ReactNode } from 'react';
import WmNavItem from '@wavemaker/app-rn-runtime/components/navigation/navitem/navitem.component';
import WmNavItemProps from '@wavemaker/app-rn-runtime/components/navigation/navitem/navitem.props';

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import WmAnchor from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { TouchableOpacity, View } from 'react-native';
import { NavigationServiceProvider } from '../../../src/core/navigation.service';
import mockNavigationService from '../../__mocks__/navigation.service';

// jest.mock(
//   '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.component',
//   () => 'WmAnchor'
// );
// jest.mock(
//   '@wavemaker/app-rn-runtime/components/basic/icon/icon.component',
//   () => 'WmIcon'
// );
let defaultProps;

describe('WmNavItem', () => {
  beforeEach(() => {
    defaultProps = {
      item: {
        label: 'Home',
        link: '#',
        badge: '1',
        icon: 'fa fa-check',
      },
      accessibilitylabel: 'nav_item',
      hint: 'nav_item',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // View Prop Variations
  it('renders correctly with view = "anchor" ', () => {
    const props = { ...defaultProps, view: 'anchor' };
    render(<WmNavItem {...props} />);
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('check')).toBeTruthy();
  });

  it('renders correctly with view="dropdown"', () => {
    const props = { ...defaultProps, view: 'dropdown' };
    render(<WmNavItem {...props} />);
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('check')).toBeTruthy();
  });

  // Item Selection
  it('calls onSelect callback when an item is selected', async () => {
    const onSelectMock = jest.fn();
    const onSelectItemMock = jest.spyOn(WmNavItem.prototype, 'onSelectItem');
    const props = { ...defaultProps, view: 'anchor', onSelect: onSelectMock };
    render(
      <NavigationServiceProvider value={mockNavigationService}>
        <WmNavItem {...props} />
      </NavigationServiceProvider>
    );
    const anchor = screen.getByText('Home');
    fireEvent.press(anchor);

    await waitFor(() => {
      expect(onSelectItemMock).toHaveBeenCalled();
      expect(mockNavigationService.openUrl).toHaveBeenCalled();
    });
  });

  // Toggle Collapse State
  it('toggles collapsed state when dropdown is clicked', async () => {
    const props = { ...defaultProps, view: 'dropdown', name: 'test' };
    const { rerender } = render(<WmNavItem {...props} />);

    const touchable = screen.UNSAFE_getByType(TouchableOpacity);
    fireEvent.press(touchable);
    rerender(<WmNavItem {...props} />);
    await waitFor(() => {
      expect(screen.queryByText('sort-down')).toBe(null);
      expect(screen.queryByText('sort-up')).toBeTruthy();
    });
  });

  // Children Elements
  it('renders children elements when provided', () => {
    const props = {
      ...defaultProps,
      children: <View testID="child-element" />,
    };
    render(<WmNavItem {...props} />);
    expect(screen.getByTestId('child-element')).toBeTruthy();
  });

  // Handling undefined or null props
  it('handles undefined or null item, caption or view gracefully', () => {
    const props = { ...defaultProps, item: null, caption: null, view: null };
    render(<WmNavItem {...props} />);
    expect(screen.queryByText('Home')).toBeFalsy();
  });

  it('handles accessibility props correctly', () => {
    const props = { ...defaultProps, view: 'dropdown' };
    render(<WmNavItem {...props} />);
    expect(screen.getByRole('link')).toBeTruthy();
    expect(screen.getByLabelText(defaultProps.item.label)).toBeTruthy();
    // expect(screen.getByA11yHint(defaultProps.hint)).toBeTruthy();
  });

  it('handles show property correctly', () => {
    const props = { ...defaultProps, show: false, view: 'anchor' };
    render(<WmNavItem {...props} />);
    const rootElement = screen.root;
    expect(rootElement.props.style.width).toBe(0);
    expect(rootElement.props.style.height).toBe(0);
  });

  it('calls displayexpression function if provided', () => {
    const getDisplayExpressionMock = jest.fn();
    const props = {
      ...defaultProps,
      getDisplayExpression: getDisplayExpressionMock,
      view: 'anchor',
    };
    render(<WmNavItem {...props} />);
    expect(getDisplayExpressionMock).toHaveBeenCalled();
  });
});
