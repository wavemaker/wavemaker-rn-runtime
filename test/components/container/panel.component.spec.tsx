import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import WmPanel from '@wavemaker/app-rn-runtime/components/container/panel/panel.component';
import WmPanelProps from '@wavemaker/app-rn-runtime/components/container/panel/panel.props';

const renderComponent = (props?: Partial<WmPanelProps>) => {
  const defaultProps = {
    id: 'test-panel',
    name: 'test-panel',
    title: 'Panel Title',
    subheading: 'Panel Subheading',
    collapsible: true,
    expanded: true,
    animation: '',
    iconclass: '',
    badgetype: 'default',
    badgevalue: '99+',
    children: <Text>Panel Content</Text>,
    show: true,
  };

  return render(
    <WmPanel {...defaultProps} {...props}>
    {props?.children || defaultProps?.children}
    </WmPanel>
  );
};

describe('Test Panel component', () => {
  test('renders panel properly', () => {
    const tree = renderComponent();

    expect(tree.getByTestId('wm-panel')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  test('renders children components', () => {
    const tree = renderComponent();

    expect(tree.getByText('Panel Content')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  test('renders the panel title and subheading properly', () => {
    const tree = renderComponent();

    const title = tree.getByText('Panel Title');
    expect(title).toBeTruthy();

    const subheading = tree.getByText('Panel Subheading');
    expect(subheading).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  test('handles collapse functionality', async () => {
    const onCollapse = jest.fn();
    const props = {
      collapsible: true,
      expanded: true,
      onCollapse,
    };
    const tree = renderComponent(props);
    const header = tree.getByTestId('test-panel_header');

    fireEvent.press(header);
    expect(onCollapse).toHaveBeenCalled();

    expect(tree).toMatchSnapshot();
  });

  test('handles expand functionality', async () => {
    const onExpand = jest.fn();
    const props = {
      collapsible: true,
      expanded: false,
      onExpand,
    };
    const tree = renderComponent(props);
    const header = tree.getByTestId('test-panel_header');

    fireEvent.press(header);
    expect(onExpand).toHaveBeenCalled();

    expect(tree).toMatchSnapshot();
  });

  it('does not toggle expanded state, when not collapsible', () => {
    const onExpand = jest.fn();
    const onCollapse = jest.fn();
    const tree = renderComponent({ collapsible: false });

    fireEvent.press(tree.getByTestId('test-panel_header'));
    expect(onExpand).not.toHaveBeenCalled();
    expect(onCollapse).not.toHaveBeenCalled();
    expect(tree).toMatchSnapshot();
  });

  test('displays the badge correctly', () => {
    const tree = renderComponent();
    const badge = tree.getByTestId('test-panel_badge');
    expect(badge).toBeTruthy();
    expect(badge.props.children).toBe('99+');
    expect(tree).toMatchSnapshot();
  });

  test('displays the icon correctly', () => {
    const tree = renderComponent({
      iconclass: 'wi wi-chevron-down',
    });

    const icon = tree.getByTestId('test-panel_collapseicon_icon');
    expect(icon).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });
});
