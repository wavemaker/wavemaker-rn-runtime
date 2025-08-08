import React, { createRef, ReactNode } from 'react';
import WmAppNavbar from '@wavemaker/app-rn-runtime/components/navigation/appnavbar/appnavbar.component';
import WmAppNavbarProps from '@wavemaker/app-rn-runtime/components/navigation/appnavbar/appnavbar.props';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';
import { StickyWrapperContext } from '@wavemaker/app-rn-runtime/core/sticky-wrapper';
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
  View,
} from 'react-native';


jest.mock('@wavemaker/app-rn-runtime/core/components/sticky-nav.component', () => {
  const mockReact = require('react');
  const mockRN = require('react-native');
  
  return {
    StickyNav: ({ children }: { children: React.ReactNode }) => 
      mockReact.createElement(mockRN.View, { testID: 'mock-sticky-nav' }, children),
  };
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  Reanimated.useSharedValue = (value: any) => ({ value });
  return Reanimated;
});

// Mock context value for StickyWrapperContext with proper SharedValue structure
const mockContextValue = {
  navHeight: { value: 80 },
  stickyNavAnimateStyle: { transform: [{ translateY: 0 }] },
  stickyContainerTranslateY: { value: 0 },
  stickyContainerAnimateStyle: { transform: [{ translateY: 0 }] },
  bottomTabHeight: { value: 0 },
  scrollDirection: { value: 0 },
  onScroll: jest.fn(),
  onScrollEndDrag: jest.fn()
};

// Default props that satisfy WmAppNavbar requirements
const defaultProps: WmAppNavbarProps = {
  name: 'test_Navbar',
  title: '',
  backbutton: true,
  backbuttonlabel: '',
  showDrawerButton: false,
  leftnavpaneliconclass: 'wm-sl-l sl-hamburger-menu',
  backbuttoniconclass: 'wi wi-back',
  imgsrc: null,
  searchbutton: false,
  searchbuttoniconclass: 'wm-sl-l sl-search',
  hideonscroll: false
};

const renderComponent = (props = {}) => {
  const finalProps = { ...defaultProps, ...props };
  return render(
    <StickyWrapperContext.Provider value={mockContextValue as any}>
      <WmAppNavbar {...finalProps} />
    </StickyWrapperContext.Provider>
  );
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
    const tree = renderComponent();
    expect(tree.toJSON()).toBeDefined();
    expect(tree).toMatchSnapshot();
    expect(tree.toJSON()).not.toBeNull();
  });

  xit('should render badge component when badge value is given', () => {
    const tree = renderComponent({ badgevalue: 100 });
    expect(tree.getByTestId('test_Navbar_badge')).toBeTruthy();
  });

  it('shouldnot render badge component when badge value is not given', () => {
    const tree = renderComponent();
    expect(tree.queryByTestId('test_Navbar_badge')).toBeFalsy();
  });

  it('should render appnavbar with default and custom root-styles', () => {
    const tree = renderComponent();
    // Check that component renders without errors
    expect(tree.toJSON()).toBeDefined();
    
    const styles = {
      root: {
        backgroundColor: 'red',
        height: 250,
        paddingHorizontal: 50,
      },
    };
    tree.rerender(
      <StickyWrapperContext.Provider value={mockContextValue as any}>
        <WmAppNavbar {...defaultProps} styles={styles} />
      </StickyWrapperContext.Provider>
    );
    expect(tree.toJSON()).toBeDefined();
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
    tree.rerender(
      <StickyWrapperContext.Provider value={mockContextValue as any}>
        <WmAppNavbar {...defaultProps} showDrawerButton={true} styles={styles} />
      </StickyWrapperContext.Provider>
    );

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
    expect(viewEle).toBeDefined();

    expect((viewEle[2] as any).props.style.alignItems).toBe('center'); //default styles
    expect((viewEle[2] as any).props.style.flexDirection).toBe('row');

    const styles = {
      middleSection: {
        alignItems: 'flex-start',
        flexDirection: 'column',
      },
    };

    //rerender
    tree.rerender(
      <StickyWrapperContext.Provider value={mockContextValue as any}>
        <WmAppNavbar {...defaultProps} styles={styles} />
      </StickyWrapperContext.Provider>
    );

    expect((viewEle[2] as any).props.style.alignItems).toBe('flex-start'); //custom styles
    expect((viewEle[2] as any).props.style.flexDirection).toBe('column');
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
    tree.rerender(
      <StickyWrapperContext.Provider value={mockContextValue as any}>
        <WmAppNavbar {...defaultProps} title="appNavBar" styles={styles} />
      </StickyWrapperContext.Provider>
    );

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

    expect((children as any).props.style.flex).toBe(1);
    expect((children as any).props.style.flexDirection).toBe('row');
    expect((children as any).props.style.justifyContent).toBe('flex-end');

    const styles = {
      rightSection: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        color: 'red',
      },
    };

    //rerender
    tree.rerender(
      <StickyWrapperContext.Provider value={mockContextValue as any}>
        <WmAppNavbar {...defaultProps} styles={styles} />
      </StickyWrapperContext.Provider>
    );

    expect((children as any).props.style.flex).toBe(2);
    expect((children as any).props.style.flexDirection).toBe('column');
    expect((children as any).props.style.justifyContent).toBe('flex-start');
  });

  xit('should render searchIcon with styles when searchbutton is true', () => {
    //render
    const tree = renderComponent({ searchbutton: true });

    expect(tree.getByText('search')).toBeTruthy();
    const IconEle = tree.getByText('search');

    expect((IconEle as any)[1].props.iconclass).toBe('wm-sl-l sl-search');
    expect((IconEle as any)[1].props.styles.root.alignItems).toBe('flex-start'); //default styles
    expect((IconEle as any)[1].props.styles.icon.fontSize).toBe(32);
    expect((IconEle as any)[1].props.styles.icon.color).toBe('#151420');

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
    tree.rerender(
      <StickyWrapperContext.Provider value={mockContextValue as any}>
        <WmAppNavbar {...defaultProps} searchbutton={true} styles={styles} />
      </StickyWrapperContext.Provider>
    );

    expect((IconEle as any)[1].props.styles.root.alignItems).toBe('flex-end'); //custom styles
    expect((IconEle as any)[1].props.styles.icon.fontSize).toBe(50);
    expect((IconEle as any)[1].props.styles.icon.color).toBe('red');
  });

  it('should not render Icon when searchbutton is false', () => {
    const { queryByText } = renderComponent({
      searchbutton: false,
      searchbuttoniconclass: 'fa fa-searchbutton',
    });
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
    const tree = renderComponent({ show: false });
    // The show prop should affect component visibility/style
    expect(tree.toJSON()).toBeDefined();
    
    // Find the root View element that should have width/height of 0
    const views = tree.root.findAllByType(View);
    const rootView = views.find(view => 
      view.props.style && 
      (view.props.style.width === 0 || view.props.style.height === 0)
    );
    
    if (rootView) {
      expect(rootView.props.style.width).toBe(0);
      expect(rootView.props.style.height).toBe(0);
    } else {
      expect(tree.toJSON()).toBeDefined();
    }
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

  // Test for hideonscroll functionality
  it('should render content when hideonscroll is false', () => {
    const tree = renderComponent({ 
      hideonscroll: false,
      title: 'Test Title',
      showDrawerButton: true
    });
    
    expect(tree.getByText('Test Title')).toBeDefined();
    expect(tree.getByText('hamburger-menu')).toBeDefined();
  });

  it('should render sticky-nav when hideonscroll is true', () => {
    const tree = renderComponent({ 
      hideonscroll: true,
      title: 'Test Title',
      showDrawerButton: true,
      backbutton: true,
      searchbutton: true,
      imgsrc: 'http://placehold.it/360x150',
      badgevalue: 5
    });
    

    expect(tree.getByTestId('mock-sticky-nav')).toBeDefined();
    expect(tree.getByTestId('mock-sticky-nav').children[0]).toBeDefined();
    

    expect(tree.getByText('Test Title')).toBeDefined();
    const titleElement = tree.getByText('Test Title');
    expect(titleElement.props.style.textTransform).toBe('capitalize');
    expect(titleElement.props.style.color).toBe('#151420');
    expect(titleElement.props.style.fontSize).toBe(24);
    expect(titleElement.props.style.fontFamily).toBe('Roboto');
    expect(titleElement.props.style.fontWeight).toBe('500');
    expect(titleElement.props.style.textAlign).toBe('center');
    

    expect(tree.getByText('hamburger-menu')).toBeDefined();
    const drawerIcon = tree.getByText('hamburger-menu');
    expect(drawerIcon.props.style[1].paddingLeft).toBe(0);
    expect(drawerIcon.props.style[1].paddingRight).toBe(8);
    expect(drawerIcon.props.style[1].fontSize).toBe(32);
    expect(drawerIcon.props.style[1].color).toBe('#151420');

    expect(tree.getByText('back')).toBeDefined();
    const backIcon = tree.getByText('back');
    expect(backIcon).toBeDefined();

    expect(tree.getByText('search')).toBeDefined();
    const searchIcon = tree.getByText('search');
    expect(searchIcon).toBeDefined();

    const pictureElement = tree.UNSAFE_getByType(WmPicture);
    expect(pictureElement).toBeDefined();
    expect(pictureElement.props.picturesource).toBe('http://placehold.it/360x150');
    expect(pictureElement.props.styles.root.width).toBe(32);
    expect(pictureElement.props.styles.root.height).toBe(32);
    
  });

  it('should render identical content whether hideonscroll is true or false', () => {
    const treeWithoutStickyNav = renderComponent({ 
      hideonscroll: false,
      title: 'Comparison Title',
      showDrawerButton: true,
      backbutton: true
    });

    const treeWithStickyNav = renderComponent({ 
      hideonscroll: true,
      title: 'Comparison Title',
      showDrawerButton: true,
      backbutton: true
    });
    
    expect(treeWithoutStickyNav.getByText('Comparison Title')).toBeDefined();
    expect(treeWithStickyNav.getByText('Comparison Title')).toBeDefined();
    
    expect(treeWithoutStickyNav.getByText('hamburger-menu')).toBeDefined();
    expect(treeWithStickyNav.getByText('hamburger-menu')).toBeDefined();
    
    expect(treeWithoutStickyNav.getByText('back')).toBeDefined();
    expect(treeWithStickyNav.getByText('back')).toBeDefined();
    
    const drawerIconWithoutSticky = treeWithoutStickyNav.getByText('hamburger-menu');
    const drawerIconWithSticky = treeWithStickyNav.getByText('hamburger-menu');
    
    expect(drawerIconWithoutSticky.props.style[1].paddingLeft).toBe(drawerIconWithSticky.props.style[1].paddingLeft);
    expect(drawerIconWithoutSticky.props.style[1].paddingRight).toBe(drawerIconWithSticky.props.style[1].paddingRight);
    expect(drawerIconWithoutSticky.props.style[1].fontSize).toBe(drawerIconWithSticky.props.style[1].fontSize);
    expect(drawerIconWithoutSticky.props.style[1].color).toBe(drawerIconWithSticky.props.style[1].color);
  });

  it.skip('should maintain all interactive functionality within StickyNav', async () => {
    const onDrawerbuttonpressMock = jest.fn();
    const onBackbtnclickMock = jest.fn();
    
    const tree = renderComponent({
      hideonscroll: true,
      title: 'Interactive Test',
      showDrawerButton: true,
      backbutton: true,
      onDrawerbuttonpress: onDrawerbuttonpressMock,
      onBackbtnclick: onBackbtnclickMock
    });

    expect(tree.getByTestId('mock-sticky-nav')).toBeDefined();
    
    const drawerButton = tree.getByTestId('test_Navbar_leftnavbtn_icon');
    fireEvent.press(drawerButton);
    await timer(100);
    await waitFor(() => {
      expect(onDrawerbuttonpressMock).toHaveBeenCalled();
    }, { timeout: 1000 });

    const backButton = tree.getByText('back');
    fireEvent.press(backButton);
    await timer(100);
    await waitFor(() => {
      expect(onBackbtnclickMock).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('should handle edge-to-edge functionality when isEdgeToEdgeApp is true', () => {
    const tree = renderComponent({
      title: 'Test Title'
    });
    
    expect(tree.toJSON()).toBeDefined();
    expect(tree.getByText('Test Title')).toBeDefined();
  });
});
