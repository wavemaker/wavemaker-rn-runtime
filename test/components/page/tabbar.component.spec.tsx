import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import AppModalService from '@wavemaker/app-rn-runtime/runtime/services/app-modal.service';
import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';
import WmTabbar from '@wavemaker/app-rn-runtime/components/page/tabbar/tabbar.component';
import WmTabbarProps from '@wavemaker/app-rn-runtime/components/page/tabbar/tabbar.props';

const renderComponent = (props: WmTabbarProps = {}) => {
  AppModalService.modalsOpened = [];
  return render(
    <ModalProvider value={AppModalService}>
      <WmTabbar name="test_Popover" {...props} />
    </ModalProvider>
  );
};



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

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });


const moreItems = [{
    'label' : 'Home',
    'icon'  : 'wm-sl-r sl-home'
  },{
    'label' : 'Analytics',
    'icon'  : 'wm-sl-r sl-graph-ascend'
  },{
    'label' : 'Alerts',
    'icon'  : 'wm-sl-r sl-alarm-bell'
  },{
    'label' : 'Favorites',
    'icon'  : 'wm-sl-r sl-settings'
  },{
    'label' : 'Profile',
    'icon'  : 'wm-sl-r sl-settings'
  },{
    'label' : 'Settings',
    'icon'  : 'wm-sl-r sl-settings'
  }];

describe('Test Tabbar component', () => {
  
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('should render the Tabbar component', () => {
    const tree = renderComponent();
    expect(tree).toBeDefined();
    expect(tree).not.toBeNull();
    expect(tree).toMatchSnapshot();
  });

  it('should render the Clipped Tabbar component', () => {
    const dataset = [{
      'label' : 'Home',
      'icon'  : 'wm-sl-r sl-home'
    },{
      'label' : 'Analytics',
      'icon'  : 'wm-sl-r sl-graph-ascend'
    },{
      'label' : 'Alerts',
      'icon'  : 'wm-sl-r sl-alarm-bell'
    }];
    const tree = renderComponent({
      classname: 'clipped-tabbar',
      dataset: dataset
    });
    expect(tree).toBeDefined();
    expect(tree).not.toBeNull();
  });

  it('should have 4 tab items by default', () => {
    const tree = renderComponent();
    const itemLabels = ['Home', 'Analytics', 'Alerts', 'Settings']
      .map(s => tree.getByText(s));
    expect(itemLabels.length).toBe(4);
  });

  it('should have called isActive function for each tab item', () => {
    const labelsToCheck = ['Home', 'Analytics', 'Alerts', 'Settings'];
    const isActiveFnMock = jest.fn((item) => {
      expect(item.label).toBeDefined();
      expect(item.icon).toBeDefined();
      expect(labelsToCheck.includes(item.label)).toBeTruthy();
      return false;
    });
    renderComponent({
      isActive: isActiveFnMock
    });
    expect(isActiveFnMock).toHaveBeenCalledTimes(4);
  });

  it('should have Home as active tab item', () => {
    const isActiveFnMock = jest.fn((item) => {
      return item.label === 'Home';
    });
    const tree = renderComponent({
      isActive: isActiveFnMock
    });
    expect(tree.getByText('Home')).toHaveStyle({"color": "#4263eb"});
    expect(tree.getByText('Analytics')).toHaveStyle({"color": "#d8d8d8"});
    expect(tree.getByText('Settings')).toHaveStyle({"color": "#d8d8d8"});
    expect(tree.getByText('Alerts')).toHaveStyle({"color": "#d8d8d8"});
  });

  it('should have called onSelect function', async () => {
    const onSelect = jest.fn();
    const tree = renderComponent({
      onSelect: onSelect
    });
    const analyticsItem = tree.getByText('Analytics');
    expect(onSelect).toHaveBeenCalledTimes(0);
    fireEvent(analyticsItem, 'press');
    await timer(200);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('should not have a more button if there are less or equal to 5 tab items', async () => {
    const tree = renderComponent();
    expect(tree.queryByText('more')).toBeNull();
  });

  it('should have a more button if there are more than 5 tab items', async () => {
    const tree = renderComponent({dataset: moreItems});
    expect(tree.queryByText('more')).not.toBeNull();
  });

  it('should show extra menu only when menu is pressed', async () => {
    const tree = renderComponent({dataset: moreItems});
    const moreItem = tree.getByText('more');
    expect(tree.queryByText('Profile')).toBeNull();
    expect(tree.queryByText('Settings')).toBeNull();
    fireEvent(moreItem, 'press');
    await timer(200);
    const renderOptions = AppModalService.modalsOpened[0];
    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const contentTree = render(<Content />);
    fireEvent(moreItem, 'press');
    await timer(200)
    expect(contentTree.queryByText('Profile')).not.toBeNull();
    expect(contentTree.queryByText('Settings')).not.toBeNull();
  });

  it('should use TestMore as label of more button', async () => {
    const tree = renderComponent({dataset: moreItems, morebuttonlabel: 'TestMore'});
    expect(tree.queryByText('more')).toBeNull();
    expect(tree.queryByText('TestMore')).toBeDefined();
  });

  it('should have called onSelect function when an item in the extra menu is pressed', async () => {
    const onSelect = jest.fn();
    const tree = renderComponent({
      dataset: moreItems,
      onSelect: onSelect
    });
    const moreItem = tree.getByText('more');
    expect(tree.queryByText('Profile')).toBeNull();
    fireEvent(moreItem, 'press');
    await timer(300);
    const renderOptions = AppModalService.modalsOpened[0];
    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const contentTree = render(<Content />);
    expect(contentTree.queryByText('Profile')).not.toBeNull();
    const profileIns = contentTree.getByText('Profile');
    expect(onSelect).toHaveBeenCalledTimes(0);
    fireEvent(profileIns, 'press');
    await timer(300);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

});