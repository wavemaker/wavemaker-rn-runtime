import React from 'react';
import { render } from '@testing-library/react-native';
import WmButtongroupProps from '@wavemaker/app-rn-runtime/components/basic/buttongroup/buttongroup.props';
import WmButtongroup from '@wavemaker/app-rn-runtime/components/basic/buttongroup/buttongroup.component';
import { ThemeProvider } from '@wavemaker/app-rn-runtime/styles/theme';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import { Text } from 'react-native';

// Mock theme
const mockTheme = {
  buttonGrpBorderColor: '#000000',
  buttonGrpBgColor: '#ffffff',
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider value={mockTheme}>{component}</ThemeProvider>);
};

describe('WmButtongroup', () => {
  it('renders correctly with default props', () => {
    const props = {
      vertical: false,
      name: 'buttongroup1',
    };
    const tree = render(<WmButtongroup {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders with `vertical` prop set to true', () => {
    const props = {
      vertical: true,
    };
    const tree = render(<WmButtongroup {...props} />);
    const buttonGroupRoot = tree.root;

    expect(buttonGroupRoot.props.style).toContainEqual({
      flexDirection: 'column',
    });
  });

  it('renders skeleton when `showskeleton` is true', () => {
    const props = {
      vertical: false,
      showskeleton: true,
      skeletonwidth: 90,
      skeletonheight: 40,
      children: <Text>Child Element</Text>,
    };
    const tree = render(<WmButtongroup {...props} />);
    expect(tree.queryByText('Child Element')).toBeNull();
    expect(tree).toMatchSnapshot();
    expect(tree.root.props.style.height).toBe(props.skeletonheight);
    expect(tree.root.props.style.width).toBe(props.skeletonwidth);
  });

  it('should render skeleton with root width and height when skeleton width and height are not provided', () => {
    const width = 50;
    const height = 70;
    const props = {
      showskeleton: true,
      styles: {
        root: {
          width: width,
          height: height,
        },
      },
    };
    const tree = render(<WmButtongroup {...props} />);
    expect(tree).toMatchSnapshot();
    expect(tree.root.props.style.height).toBe(height);
    expect(tree.root.props.style.width).toBe(width);
  });

  it('should have width and height to be 0 when show is false', () => {
    const props = {
      vertical: false,
      show: false,
    };
    const tree = render(<WmButtongroup {...props} />);
    const buttonGroupRoot = tree.root;

    expect(buttonGroupRoot.props.style[0].width).toBe(0);
    expect(buttonGroupRoot.props.style[0].height).toBe(0);
  });

  it('renders with given width', () => {
    const width = 70;
    const props = {
      vertical: false,
      styles: {
        root: {
          width: width,
        },
      },
    };

    const tree = render(<WmButtongroup {...props} />);
    const buttonGroupRoot = tree.root;
    expect(buttonGroupRoot.props.style[0].width).toBe(width);
  });

  it('renders children correctly', () => {
    const props = {
      vertical: false,
    };
    const { getByText } = render(
      <WmButtongroup {...props}>
        <WmButton caption="Button1" />
        <WmButton caption="Button2" />
      </WmButtongroup>
    );

    expect(getByText('Button1')).toBeTruthy();
    expect(getByText('Button2')).toBeTruthy();
  });

  it('should render custom styles with properly', () => {
    const bgColor = '#234555';
    const props = {
      styles: {
        root: {
          backgroundColor: bgColor,
        },
      },
    };

    const tree = render(<WmButtongroup {...props} />);
    const buttonGroupRoot = tree.root;
    expect(buttonGroupRoot.props.style[0].backgroundColor).toBe(bgColor);
  });

  xit('applies styles correctly based on props and themes', () => {
    const props = {
      vertical: false,
      children: <></>,
    };

    const tree = render(<WmButtongroup {...props} />);
    const buttonGroupRoot = tree.root;

    expect(buttonGroupRoot.props.style).toContainEqual({
      borderColor: mockTheme.buttonGrpBorderColor,
      backgroundColor: mockTheme.buttonGrpBgColor,
    });
  });
});
