import React, { createRef } from 'react';
import {
  render,
  fireEvent,
  cleanup,
  screen,
} from '@testing-library/react-native';
import AppModalService from '@wavemaker/app-rn-runtime/runtime/services/app-modal.service';
import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';
import WmTabbar from '@wavemaker/app-rn-runtime/components/page/tabbar/tabbar.component';
import WmTabbarProps from '@wavemaker/app-rn-runtime/components/page/tabbar/tabbar.props';
import { NavigationServiceProvider } from '../../../src/core/navigation.service';
import mockNavigationService from '../../__mocks__/navigation.service';
import { View } from 'react-native';

const renderComponent = (props: WmTabbarProps = {}) => {
  AppModalService.modalsOpened = [];
  return render(
    <NavigationServiceProvider value={mockNavigationService}>
      <ModalProvider value={AppModalService}>
        <WmTabbar name="test_Popover" {...props} />
      </ModalProvider>
    </NavigationServiceProvider>
  );
};

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

const moreItems = [
  {
    label: 'Home',
    icon: 'wm-sl-r sl-home',
    link: 'www.wavemaker.com/home',
  },
  {
    label: 'Analytics',
    icon: 'wm-sl-r sl-graph-ascend',
    link: 'www.wavemaker.com/analytics',
  },
  {
    label: 'Alerts',
    icon: 'wm-sl-r sl-alarm-bell',
    link: 'www.wavemaker.com/alerts',
  },
  {
    label: 'Favorites',
    icon: 'wm-sl-r sl-settings',
    link: 'www.wavemaker.com/favorites',
  },
  {
    label: 'Profile',
    icon: 'wm-sl-r sl-settings',
    link: 'www.wavemaker.com/profile',
  },
  {
    label: 'Settings',
    icon: 'wm-sl-r sl-settings',
    link: 'www.wavemaker.com/settings',
  },
];

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

  it('should handle layout change event', () => {
    const ref = createRef();
    const tree = render(
      <ModalProvider value={AppModalService}>
        <WmTabbar name="test_Popover" ref={ref} />
      </ModalProvider>
    );

    const viewEle = tree.UNSAFE_getAllByType(View)[2];
    fireEvent(viewEle, 'layout', {
      nativeEvent: {
        layout: {
          width: 100,
          height: 100,
        },
      },
    });

    expect(ref.current.proxy.tabbarHeight).toBe(100);
  });

  it('should render the Clipped Tabbar component', () => {
    const dataset = [
      {
        label: 'Home',
        icon: 'wm-sl-r sl-home',
      },
      {
        label: 'Analytics',
        icon: 'wm-sl-r sl-graph-ascend',
      },
      {
        label: 'Alerts',
        icon: 'wm-sl-r sl-alarm-bell',
      },
    ];
    const tree = renderComponent({
      classname: 'clipped-tabbar',
      dataset: dataset,
    });
    expect(tree).toBeDefined();
    expect(tree).not.toBeNull();
  });

  it('should have 4 tab items by default', () => {
    const tree = renderComponent();
    const itemLabels = ['Home', 'Analytics', 'Alerts', 'Settings'].map((s) =>
      tree.getByText(s)
    );
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
      isActive: isActiveFnMock,
    });
    expect(isActiveFnMock).toHaveBeenCalledTimes(4);
  });

  it('should have Home as active tab item', () => {
    const isActiveFnMock = jest.fn((item) => {
      return item.label === 'Home';
    });
    const tree = renderComponent({
      isActive: isActiveFnMock,
    });
    expect(tree.getByText('Home')).toHaveStyle({ color: '#4263eb' });
    expect(tree.getByText('Analytics')).toHaveStyle({ color: '#d8d8d8' });
    expect(tree.getByText('Settings')).toHaveStyle({ color: '#d8d8d8' });
    expect(tree.getByText('Alerts')).toHaveStyle({ color: '#d8d8d8' });
  });

  it('should have called onSelect function', async () => {
    const onSelect = jest.fn();
    const tree = renderComponent({
      dataset: moreItems,
      onSelect: onSelect,
    });
    const analyticsItem = tree.getByText('Analytics');
    expect(onSelect).toHaveBeenCalledTimes(0);
    fireEvent(analyticsItem, 'press');
    await timer(200);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(mockNavigationService.openUrl).toHaveBeenCalledWith(
      'www.wavemaker.com/analytics'
    );
  });

  it('should not have a more button if there are less or equal to 5 tab items', async () => {
    const tree = renderComponent();
    expect(tree.queryByText('more')).toBeNull();
  });

  it('should have a more button if there are more than 5 tab items', async () => {
    const tree = renderComponent({ dataset: moreItems });
    expect(tree.queryByText('more')).not.toBeNull();
  });

  it('should show extra menu only when menu is pressed', async () => {
    const tree = renderComponent({ dataset: moreItems });
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

    expect(contentTree.queryByText('Profile')).not.toBeNull();
    expect(contentTree.queryByText('Settings')).not.toBeNull();
  });

  it('should use TestMore as label of more button', async () => {
    const tree = renderComponent({
      dataset: moreItems,
      morebuttonlabel: 'TestMore',
    });
    expect(tree.queryByText('more')).toBeNull();
    expect(tree.queryByText('TestMore')).toBeDefined();
  });

  it('should have called onSelect function when an item in the extra menu is pressed', async () => {
    const onSelect = jest.fn();
    const tree = renderComponent({
      dataset: moreItems,
      onSelect: onSelect,
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
    expect(mockNavigationService.openUrl).toHaveBeenCalledWith(
      'www.wavemaker.com/profile'
    );
  });

  it('handles show property correctly', async () => {
    const ref = createRef();
    const tree = render(
      <ModalProvider value={AppModalService}>
        <WmTabbar name="test_Popover" show={true} ref={ref} />
      </ModalProvider>
    );

    expect(tree.toJSON()[1].props.style.width).not.toBe(0);
    expect(tree.toJSON()[1].props.style.height).not.toBe(0);

    ref.current.proxy.show = false;

    await timer(300);
    expect(tree.toJSON()[1].props.style.width).toBe(0);
    expect(tree.toJSON()[1].props.style.height).toBe(0);
  });

  xit('should hide the modal when an item in the extra menu is selected', async () => {
    const onSelect = jest.fn();
    const tree = renderComponent({
      dataset: moreItems,
      onSelect: onSelect,
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

    expect(screen.queryByText('Profile')).toBeNull();
  });
});
