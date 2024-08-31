import React, { createRef, ReactNode } from 'react';
import WmAppNavbar from '@wavemaker/app-rn-runtime/components/navigation/appnavbar/appnavbar.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';
import {
  fireEvent,
  render,
  waitFor,
  screen,
  act,
} from '@testing-library/react-native';
import {
  Platform,
  BackHandler as RNBackHandler,
  BackHandlerStatic as RNBackHandlerStatic,
} from 'react-native';

const renderComponent = (props = {}) => {
  return render(<WmAppNavbar name="test_Navbar" {...props} />);
};

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

interface BackHandlerStatic extends RNBackHandlerStatic {
  mockPressBack(): void;
}

jest.mock('react-native/Libraries/Utilities/BackHandler', () =>
  // eslint-disable-next-line jest/no-mocks-import
  require('react-native/Libraries/Utilities/__mocks__/BackHandler')
);

const BackHandler = RNBackHandler as BackHandlerStatic;

describe('Test Navbar component', () => {
  it('should render app-navbar component', () => {
    const tree = renderComponent().toJSON();
    expect(tree).toMatchSnapshot();
    expect(tree).not.toBeNull();
    expect(tree).toBeDefined();
  });

  it('should render badge component when badge value is given', () => {
    const tree = renderComponent({ badgevalue: 100 });
    expect(tree.getByTestId('test_Navbar_badge')).toBeTruthy();
  });

  it('shouldnot render badge component when badge value is not given', () => {
    const tree = renderComponent();
    expect(tree.queryByTestId('test_Navbar_badge')).toBeFalsy();
  });

  it('should render appnavbar with default and custom root-styles', () => {
    const tree = renderComponent();
    expect(screen.root.props.style.flexDirection).toBe('row');
    expect(screen.root.props.style.backgroundColor).toBe('#4263eb');
    expect(screen.root.props.style.alignItems).toBe('center');
    expect(screen.root.props.style.height).toBe(80);
    expect(screen.root.props.style.paddingHorizontal).toBe(12);
    const styles = {
      root: {
        backgroundColor: 'red',
        height: 250,
        paddingHorizontal: 50,
      },
    };
    tree.rerender(<WmAppNavbar name="test_Navbar" styles={styles} />);
    expect(screen.root.props.style.backgroundColor).toBe('red');
    expect(screen.root.props.style.height).toBe(250);
    expect(screen.root.props.style.paddingHorizontal).toBe(50);
  });

  it('should render DrawerButton icon when showDrawerButton is true with respect to default and custom styles', () => {
    const tree = renderComponent({
      showDrawerButton: true,
    });

    expect(tree.getByText('hamburger-menu')).toBeDefined();
    const IconEle = tree.getByText('hamburger-menu');

    expect(IconEle.props.style[1].paddingLeft).toBe(0); //default styles
    expect(IconEle.props.style[1].paddingRight).toBe(8);
    expect(IconEle.props.style[1].fontSize).toBe(32);
    expect(IconEle.props.style[1].color).toBe('#151420');

    const styles = {
      leftnavIcon: {
        root: {
          fontSize: 47,
          color: 'blue',
        },
        icon: {
          paddingLeft: 0,
          paddingRight: 15,
          fontSize: 40,
          color: 'red',
        },
      },
    };

    //rerender
    tree.rerender(<WmAppNavbar name="test_Navbar" styles={styles} />);

    expect(IconEle.props.style[1].paddingLeft).toBe(0); //custom styles
    expect(IconEle.props.style[1].paddingRight).toBe(15);
    expect(IconEle.props.style[1].fontSize).toBe(40);
    expect(IconEle.props.style[1].color).toBe('red');
    expect(IconEle.props.size).toBe(47);
  });

  it('should render Drawer button with provided icon when showDrawerButton is true', () => {
    const { getByText } = renderComponent({
      showDrawerButton: true,
      leftnavpaneliconclass: 'fa fa-DrawerButton',
    });
    expect(getByText('DrawerButton')).toBeTruthy();
  });

  it('should not render Drawer button when showDrawerButton is false', () => {
    const { queryByText } = renderComponent({
      showDrawerButton: false,
      leftnavpaneliconclass: 'fa fa-DrawerButton',
    });
    expect(queryByText('DrawerButton')).toBeNull();
  });

  it('should call onDrawerbuttonpress event when drawerbutton is pressed', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmAppNavbar.prototype,
      'invokeEventCallback'
    );
    const onDrawerbuttonpressMock = jest.fn();

    //render
    renderComponent({
      showDrawerButton: true,
      onDrawerbuttonpress: onDrawerbuttonpressMock,
    });

    const iconElement = screen.getByTestId('test_Navbar_leftnavbtn_icon');
    fireEvent.press(iconElement);
    await timer(500);
    await waitFor(() => {
      expect(onDrawerbuttonpressMock).toHaveBeenCalled();
      expect(invokeEventCallbackMock).toHaveBeenCalled();
    });
  });

  it('should render backButton icon when backButton is true', () => {
    const tree = renderComponent({
      backbutton: true,
      backbuttonlabel: 'caption',
    });

    expect(tree.getByText('back')).toBeTruthy();
  });

  it('should render backbutton with custom icon when backbutton is true', () => {
    const { getByText } = renderComponent({
      backbutton: true,
      backbuttoniconclass: 'fa fa-backbutton',
    });
    expect(getByText('backbutton')).toBeTruthy();
  });

  it('should not render backbutton when backbutton is false', () => {
    const { queryByText } = renderComponent({
      backbutton: false,
      backbuttoniconclass: 'fa fa-backbutton',
    });
    expect(queryByText('backbutton')).toBeNull();
  });

  it('should call onBackbtnclick event when backbutton is pressed', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmAppNavbar.prototype,
      'invokeEventCallback'
    );
    const onBackBtnPressMock = jest.fn();

    //render
    renderComponent({
      backbutton: true,
      backbuttoniconclass: 'fa fa-backbutton',
      onBackbtnclick: onBackBtnPressMock,
    });

    const iconElement = screen.getByText('backbutton');
    fireEvent.press(iconElement);
    await timer(500);
    await waitFor(() => {
      expect(onBackBtnPressMock).toHaveBeenCalled();
      expect(invokeEventCallbackMock).toHaveBeenCalled();
    });
  });

  it('should render appnavBar with default and custom middleSection-styles', () => {
    const tree = renderComponent();
    const viewEle = screen.root.children;

    expect(viewEle[2].props.style.alignItems).toBe('center'); //default styles
    expect(viewEle[2].props.style.flexDirection).toBe('row');

    const styles = {
      middleSection: {
        alignItems: 'flex-start',
        flexDirection: 'column',
      },
    };

    //rerender
    tree.rerender(<WmAppNavbar name="test_Navbar" styles={styles} />);

    expect(viewEle[2].props.style.alignItems).toBe('flex-start'); //custom styles
    expect(viewEle[2].props.style.flexDirection).toBe('column');
  });

  it('should render Picture when imgsrc prop is given', () => {
    const tree = renderComponent({ imgsrc: 'http://placehold.it/360x150' });
    const viewEle = tree.UNSAFE_getByType(WmPicture);
    expect(viewEle).toBeDefined();
    expect(viewEle.props.picturesource).toBe('http://placehold.it/360x150');
    expect(viewEle.props.styles.root.width).toBe(32); //default styles
    expect(viewEle.props.styles.root.height).toBe(32);
  });

  it('should not render Picture when imgsrc prop is not given', () => {
    const tree = renderComponent();
    expect(tree.UNSAFE_queryByType(WmPicture)).toBeNull();
  });

  it('should render appnavbar with text of default and custom styles', () => {
    //render
    const tree = renderComponent({ title: 'appNavBar' });
    const viewEle = tree.getByText('appNavBar');

    expect(viewEle).toBeTruthy();
    expect(viewEle.props.style.textTransform).toBe('capitalize'); //default styles
    expect(viewEle.props.style.color).toBe('#151420');
    expect(viewEle.props.style.fontSize).toBe(24);
    expect(viewEle.props.style.fontFamily).toBe('Roboto');
    expect(viewEle.props.style.fontWeight).toBe('500');
    expect(viewEle.props.style.textAlign).toBe('center');

    const styles = {
      content: {
        textTransform: 'capitalize',
        color: 'red',
        fontSize: 40,
        fontFamily: 'Georgia',
        fontWeight: '800',
      },
    };

    //rerender
    tree.rerender(<WmAppNavbar name="test_Navbar" styles={styles} />);

    expect(viewEle.props.style.textTransform).toBe('capitalize'); //custom styles
    expect(viewEle.props.style.color).toBe('red');
    expect(viewEle.props.style.fontSize).toBe(40);
    expect(viewEle.props.style.fontFamily).toBe('Georgia');
    expect(viewEle.props.style.fontWeight).toBe('800');
  });

  it('should render appnavBar with default and custom rightSection-styles', () => {
    //render
    const tree = renderComponent({});

    const children = screen.root.children[3];

    expect(children.props.style.flex).toBe(1);
    expect(children.props.style.flexDirection).toBe('row');
    expect(children.props.style.justifyContent).toBe('flex-end');

    const styles = {
      rightSection: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        color: 'red',
      },
    };

    //rerender
    tree.rerender(<WmAppNavbar name="test_Navbar" styles={styles} />);

    expect(children.props.style.flex).toBe(2);
    expect(children.props.style.flexDirection).toBe('column');
    expect(children.props.style.justifyContent).toBe('flex-start');
  });

  it('should render searchIcon with styles when searchbutton is true', () => {
    //render
    const tree = renderComponent({ searchbutton: true });

    expect(tree.getByText('search')).toBeTruthy();
    const IconEle = tree.getByText('search');

    expect(IconEle[1].props.iconclass).toBe('wm-sl-l sl-search');
    expect(IconEle[1].props.styles.root.alignItems).toBe('flex-start'); //default styles
    expect(IconEle[1].props.styles.icon.fontSize).toBe(32);
    expect(IconEle[1].props.styles.icon.color).toBe('#151420');

    const styles = {
      leftnavIcon: {
        root: {
          alignItems: 'flex-end',
        },
        icon: {
          fontSize: 50,
          color: 'red',
        },
      },
    };

    //rerender
    tree.rerender(<WmAppNavbar name="test_Navbar" styles={styles} />);

    expect(IconEle[1].props.styles.root.alignItems).toBe('flex-end'); //custom styles
    expect(IconEle[1].props.styles.icon.fontSize).toBe(50);
    expect(IconEle[1].props.styles.icon.color).toBe('red');
  });

  it('should not render Icon when searchbutton is false', () => {
    const { queryByText } = renderComponent({
      searchbutton: false,
      searchbuttoniconclass: 'fa fa-searchbutton',
    });
    expect(screen).toMatchSnapshot();
    expect(queryByText('searchbutton')).toBeNull();
  });

  it('should call onSearchbuttonpress event when searchIcon is pressed', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmAppNavbar.prototype,
      'invokeEventCallback'
    );
    const onSearchbuttonpressMock = jest.fn();

    //render
    const { getByText } = renderComponent({
      searchbutton: true,
      searchbuttoniconclass: 'fa fa-searchbutton',
      onSearchbuttonpress: onSearchbuttonpressMock,
    });

    const iconElement = screen.getByText('searchbutton');
    fireEvent.press(iconElement);
    await timer(500);
    await waitFor(() => {
      expect(onSearchbuttonpressMock).toHaveBeenCalled();
      expect(invokeEventCallbackMock).toHaveBeenCalled();
    });
  });

  //show
  it('when show is false width and height set to be zero', () => {
    renderComponent({ show: false });
    const rootElement = screen.root;
    expect(rootElement.props.style.width).toBe(0);
    expect(rootElement.props.style.height).toBe(0);
  });

  it('should handle hardwareBackButton press when platform is android ', async () => {
    jest.useFakeTimers();
    Platform.OS = 'android';
    const onBackBtnPressMock = jest.fn();
    renderComponent({
      onBackbtnclick: onBackBtnPressMock,
    });
    // act(() => {
    BackHandler.mockPressBack();
    jest.runAllTimers();
    // });
    await waitFor(() => {
      expect(onBackBtnPressMock).toHaveBeenCalled();
    });
  });
});
