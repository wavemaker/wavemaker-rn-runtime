import React from 'react';
import { Platform, Text } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import WmPanel from '@wavemaker/app-rn-runtime/components/container/panel/panel.component';
import WmPanelProps from '@wavemaker/app-rn-runtime/components/container/panel/panel.props';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';

const fireEventLayoutFun = (component: any) => {
  return fireEvent(component.root, 'layout', {
    nativeEvent: {
      layout: {
        x: 100,
        y: 100,
        px: 100,
        py: 100,
        width: 200,
        height: 200,
      },
    },
  });
};

const renderComponent = (props?: Partial<WmPanelProps> | any) => {
  const defaultProps = {
    id: 'panel',
    name: 'panel',
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

    expect(tree.getByTestId('panel')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  test('renders children components', () => {
    const tree = renderComponent();

    expect(tree.getByText('Panel Content')).toBeTruthy();
  });

  test('renders the panel title and subheading properly', () => {
    const tree = renderComponent();

    const title = tree.getByText('Panel Title');
    expect(title).toBeTruthy();

    const subheading = tree.getByText('Panel Subheading');
    expect(subheading).toBeTruthy();
  });

  // Add this test for conditional title rendering
  test('conditionally renders title based on provided prop', () => {
    // Test with title not provided
    const treeUntitled = renderComponent({
      title: undefined
    });
    
    // Title should not exist
    const missingTitle = treeUntitled.queryByTestId('panel_header_title');
    expect(missingTitle).toBeNull();
  });

  // Add this test for conditional subheading rendering
  test('conditionally renders subheading based on provided prop', () => {
    // Test without subheading
    const treeWithoutSubheading = renderComponent({
      subheading: undefined
    });
    
    // Subheading should not exist
    const missingSubheading = treeWithoutSubheading.queryByTestId('panel_subheader');
    expect(missingSubheading).toBeNull();
  });

  // Add this test to check both title and subheading together
  test('renders both title and subheading when both props are provided', () => {
    const customTitle = 'Custom Title';
    const customSubheading = 'Custom Subheading';
    const tree = renderComponent({
      title: customTitle,
      subheading: customSubheading
    });
    
    // Both should be rendered
    const titleElement = tree.getByTestId('panel_header_title');
    expect(titleElement).toBeTruthy();
    expect(titleElement.props.children).toBe(customTitle);
    
    const subheadingElement = tree.getByTestId('panel_subheader');
    expect(subheadingElement).toBeTruthy();
    expect(subheadingElement.props.children).toBe(customSubheading);
  });

  test('handles collapse functionality', async () => {
    const onCollapse = jest.fn();
    const props = {
      collapsible: true,
      expanded: true,
      onCollapse,
    };
    const tree = renderComponent(props);
    const header = tree.getByTestId('panel_header');

    fireEvent.press(header);
    expect(onCollapse).toHaveBeenCalled();
    expect(tree.getByText('chevron-up')).toBeTruthy();
  });

  test('handles expand functionality', async () => {
    const onExpand = jest.fn();
    const props = {
      collapsible: true,
      expanded: false,
      onExpand,
    };
    const tree = renderComponent(props);
    const header = tree.getByTestId('panel_header');

    fireEvent.press(header);
    expect(onExpand).toHaveBeenCalled();
    expect(tree.getByText('chevron-down')).toBeTruthy();
  });

  it('does not toggle expanded state, when not collapsible', () => {
    const onExpand = jest.fn();
    const onCollapse = jest.fn();
    const tree = renderComponent({ collapsible: false });

    fireEvent.press(tree.getByTestId('panel_header'));
    expect(onExpand).not.toHaveBeenCalled();
    expect(onCollapse).not.toHaveBeenCalled();
  });

  it('should invoke onLoad callback when panel content is loaded', async () => {
    const onLoadMock = jest.fn();

    const tree = renderComponent({
      onLoad: onLoadMock,
      renderPartial: (props: any, onLoad: any) => {
        onLoad();
      },
    });

    fireEventLayoutFun(tree);
    await waitFor(() => {
      expect(onLoadMock).toHaveBeenCalled();
    });
  });

  test('displays the badge correctly', () => {
    const tree = renderComponent();
    const badge = tree.getByTestId('panel_badge');
    expect(badge).toBeTruthy();
    expect(badge.props.children).toBe('99+');
  });

  test('displays the icon correctly', () => {
    const tree = renderComponent({
      iconclass: 'wi wi-edit',
    });

    expect(tree.getByText('edit')).toBeTruthy();
  });

  it('collapsible pane works properly', () => {
    Platform.OS = 'ios';

    const tree = renderComponent({
      styles: {
        header: {
          display: 'block',
        },
      },
      children: <Text>Collapsible Pane Content</Text>,
    });

    expect(tree.getByText('Collapsible Pane Content')).toBeTruthy();
  });

  it('should render a skeleton with given width and height', () => {
    const tree = renderComponent({
      showskeleton: true,
      skeletonheight: '100',
      skeletonwidth: '50',
    });

    expect(tree).toMatchSnapshot();
  });

  test('renders title with skeleton when showskeleton is true', () => {
    const tree = renderComponent({
      showskeleton: true,
      title: 'Skeleton Title',
      subheading: undefined
    });
    
    // Find the WmLabel component
    const titleElement = tree.UNSAFE_getByType(WmLabel);
    expect(titleElement).toBeTruthy();
    expect(titleElement.props.showskeleton).toBe(true);
    expect(titleElement.props.caption).toBe('Skeleton Title');
    
  });

  test('renders title with custom styles', () => {
    const customStyles = {
      text: {
        color: 'red',
        fontSize: 20
      },
      heading: {
        fontWeight: 'bold'
      }
    };
    
    const tree = renderComponent({
      title: 'Styled Title',
      styles: customStyles
    });
    
    const titleElement = tree.getByText('Styled Title');
    expect(titleElement).toBeTruthy();
    
    // Check that the style array contains our custom styles
    const styleArray = titleElement.props.style;
    expect(styleArray).toBeInstanceOf(Array);
    
    // Find the text style object in the array
    const textStyle = styleArray.find((style: { color?: string; fontSize?: number }) => 
      style.color === 'red' && style.fontSize === 20
    );
    expect(textStyle).toBeTruthy();
    
    // Find the heading style object in the array
    const headingStyle = styleArray.find((style: { fontWeight?: string }) => 
      style.fontWeight === 'bold'
    );
    expect(headingStyle).toBeTruthy();
  });

  test('does not render title when title prop is not provided', () => {
    const tree = renderComponent({
      title: undefined
    });
    
    // Title should not be rendered at all
    const titleElement = tree.queryByText('Title');
    expect(titleElement).toBeNull();
  });

  test('renders title with correct test props', () => {
    const tree = renderComponent({
      title: 'Test Title'
    });
    
    const titleElement = tree.getByText('Test Title');
    expect(titleElement).toBeTruthy();
    // Verify the test props are applied through getTestPropsForAction
    expect(titleElement.props.testID).toBe('panel_header_title');
  });
});
