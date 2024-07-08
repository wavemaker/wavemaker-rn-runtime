import React from 'react';
import { Text } from 'react-native';
import {
  render,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react-native';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';
import { TestIdPrefixProvider } from '@wavemaker/app-rn-runtime/core/testid.provider';

const renderComponent = (props) => {
  const loadAsset = (path) => path;

  return render(
    <TestIdPrefixProvider value={'unit-test'}>
      <AssetProvider value={loadAsset}>
        <WmIcon
          iconposition={'left'}
          accessibilitylabel="wm-icon"
          name={'wm-icon'}
          {...props}
        />
      </AssetProvider>
    </TestIdPrefixProvider>
  );
};

describe('WmIcon Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders the icon with the correct icon class', () => {
    const tree = renderComponent({
      iconclass: 'fa fa-edit',
    });

    const iconComponent = tree.getByText('edit');

    expect(iconComponent).toBeTruthy();
    expect(iconComponent).toHaveProperty('children', ['edit']);
    expect(iconComponent.type).toBe('Text');
    expect(tree).toMatchSnapshot();
  });

  test('renders the icon with waveicon class', () => {
    const tree = renderComponent({
      iconclass: 'wi wi-edit',
    });

    const iconComponent = tree.getByText('edit');

    expect(iconComponent).toBeTruthy();
    expect(iconComponent).toHaveProperty('children', ['edit']);
    expect(iconComponent.type).toBe('Text');
    expect(tree).toMatchSnapshot();
  });

  test('renders the icon with stream line light icon class', () => {
    const tree = renderComponent({
      iconclass: 'wm-sl-l sl-edit',
    });

    const iconComponent = tree.getByText('edit');

    expect(iconComponent).toBeTruthy();
    expect(iconComponent).toHaveProperty('children', ['edit']);
    expect(iconComponent.type).toBe('Text');
    expect(tree).toMatchSnapshot();
  });

  test('renders the icon with stream line regular icon class', () => {
    const tree = renderComponent({
      iconclass: 'wm-sl-r sl-edit',
    });

    const iconComponent = tree.getByText('edit');

    expect(iconComponent).toBeTruthy();
    expect(iconComponent).toHaveProperty('children', ['edit']);
    expect(iconComponent.type).toBe('Text');
    expect(tree).toMatchSnapshot();
  });

  test('clicking the icon triggers the expected action', () => {
    const mockOnClick = jest.fn();

    const tree = renderComponent({
      iconclass: 'fa fa-edit',
      onTap: mockOnClick,
    });

    expect(tree).toMatchSnapshot();
    fireEvent(tree.getByLabelText('wm-icon'), 'press');
    waitFor(() => {
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  test('icon size changes correctly when iconsize prop is provided', async () => {
    const tree = renderComponent({
      iconsize: 40,
      iconclass: 'fa fa-edit',
    });

    expect(tree).toMatchSnapshot();
    expect(tree.getByText('edit').props.size).toBe(40);
  });

  test('external icon should load when url is given', () => {
    const iconUrl = 'https://docs.wavemaker.com/learn/img/WM_blue_logo.png';

    const tree = renderComponent({
      iconurl: { iconUrl },
    });

    expect(tree).toMatchSnapshot();
    expect(
      tree.getByTestId('unit-test_wm-icon_icon').props.source.iconUrl
    ).toBe(iconUrl);
  });

  test('caption should display next to the icon when caption prop is provided', () => {
    const tree = renderComponent({
      iconclass: 'fa fa-edit',
      iconposition: 'left',
      accessibilitylabel: 'icon',
      caption: 'test-button',
    });

    expect(tree.getByText('test-button')).toBeTruthy();
    expect(tree.getByText('test-button')).toBeDefined();
    expect(tree).toMatchSnapshot();
  });

  test('caption should display left to the icon when iconposition is "right"', () => {
    const tree = renderComponent({
      iconclass: 'fa fa-edit',
      iconposition: 'right',
      accessibilitylabel: 'icon',
      caption: 'test-button',
    });

    expect(tree.getByText('test-button')).toBeTruthy();
    expect(tree.getByText('test-button')).toBeDefined();
    expect(tree).toMatchSnapshot();
  });

  test('icon should component should get type or value as empty string or falsy value when iconclass dose not have icon name of fontaswom icons', () => {
    const tree = renderComponent({
      iconclass: 'fa',
      iconposition: 'right',
      accessibilitylabel: 'icon',
      name: "test-wm",
    });

    expect(tree).toMatchSnapshot();
    expect(tree.UNSAFE_queryByType(Text).props.children).toBeFalsy();
  });

  test('icon should component should get type or value as empty string or falsy value when iconclass dose not have icon name of wavicon icons', () => {
    const tree = renderComponent({
      iconclass: 'wi',
      iconposition: 'right',
      accessibilitylabel: 'icon',
      name: "test-wm",
    });

    expect(tree).toMatchSnapshot();
    expect(tree.UNSAFE_queryByType(Text).props.children).toBeFalsy();
  });

  test('icon should component should get type or value as empty string or falsy value when iconclass dose not have icon name of streamline-regular-icon icons', () => {
    const tree = renderComponent({
      iconclass: 'wm-sl-r',
      iconposition: 'right',
      accessibilitylabel: 'icon',
      name: "test-wm",
    });

    expect(tree).toMatchSnapshot();
    expect(tree.UNSAFE_queryByType(Text).props.children).toBeFalsy();
  });

  test('icon should component should get type or value as empty string or falsy value when iconclass dose not have icon name of streamline-light-icon icons', () => {
    const tree = renderComponent({
      iconclass: 'wm-sl-l',
      iconposition: 'right',
      accessibilitylabel: 'icon',
      name: "test-wm",
    });

    expect(tree).toMatchSnapshot();
    expect(tree.UNSAFE_queryByType(Text).props.children).toBeFalsy();
  });

  test('only caption should display when iconposition prop is not provided or the value is falsy', () => {
    const tree = renderComponent({
      iconclass: 'fa fa-edit',
      accessibilitylabel: 'icon',
      iconposition: '',
      caption: 'test-button',
    });
    expect(tree).toMatchSnapshot();

    expect(tree.getByText('test-button')).toBeTruthy();
    expect(tree.getByText('test-button')).toBeDefined();
    expect(tree.queryByText('edit')).toBeNull();
  });

  test('accessibility label as "test-label" should be present when accessibilitylabel prop is set to "test-label"', () => {
    const tree = renderComponent({
      iconclass: 'fa fa-edit',
      accessibilitylabel: 'test-label',
      onTap: () => {},
    });

    expect(tree).toMatchSnapshot();
    expect(tree.getByLabelText('test-label')).toBeTruthy();
  });

  test('should not render icon when iconclass is falsy ', () => {
    const tree = renderComponent({
      iconclass: '',
      accessibilitylabel: 'test-label',
      onTap: () => {},
    });

    expect(tree).toMatchSnapshot();
    expect(tree.UNSAFE_queryByType(Text)).toBeNull();
  })

  test('should render icon with accessibilityrole when accessibilityrole is passed in props', () => {
    const tree = renderComponent({
      iconclass: 'fa fa-edit',
      accessibilitylabel: 'test-label',
      accessibilityrole: 'wm-icon-ar',
      caption: 'icon-caption',
      onTap: () => {},
    });

    expect(tree).toMatchSnapshot();
  });

  test('should render only caption when iconclass is falsy and caption is has value', () => {
    const tree = renderComponent({
      iconclass: '',
      accessibilitylabel: 'test-label',
      accessibilityrole: 'wm-icon-ar',
      caption: 'icon-caption',
      onTap: () => {},
    });

    expect(tree).toMatchSnapshot();
  })
});

// Add more test cases as needed
// Test that the icon rotates to the correct angle when animation is set to 'spin'.
// Test that the icon pulses with the correct opacity when animation is set to 'pulse'.
