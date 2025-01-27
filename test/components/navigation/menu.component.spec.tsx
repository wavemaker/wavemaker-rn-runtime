import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import WmMenu from '@wavemaker/app-rn-runtime/components/navigation/menu/menu.component';
import AppModalService from '@wavemaker/app-rn-runtime/runtime/services/app-modal.service';
import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';

const timer = (time = 200) => new Promise((resolve: any, reject) => {setTimeout(()=>resolve(), time)})

const renderComponent = (props = {}) => {
  const defaultProps = {
    name: 'test',
    dataset: 'Menu Item 1, Menu Item 2, Menu Item 3'
  }

  AppModalService.modalsOpened = [];

  return render(
    <ModalProvider value={AppModalService}>
      <WmMenu {...defaultProps} {...props}/>
    </ModalProvider>
  )
}

describe('Test Menu component', () => {
  test('should render component', () => {
    renderComponent();
    expect(screen.getByTestId('test_menu_trigger_a')).toBeTruthy();
    expect(screen).toMatchSnapshot();
  });

  test('should render component with caption', () => {
    renderComponent({
      caption: 'wm-menu'
    });
    expect(screen.getByTestId('test_menu_trigger_a')).toBeTruthy();
    expect(screen.getByText('wm-menu')).toBeTruthy();
    expect(screen).toMatchSnapshot();
  })

  test('should show items on menu press', async () => {
    renderComponent();
    fireEvent(screen.getByTestId('test_menu_trigger_a'), 'press');
    await timer(300);

    const menuItemsComponent = AppModalService.modalOptions;
    const Component = () => {
      return (
        <>{menuItemsComponent.content}</>
      )
    }
    const tree = render(<Component/>)

    await waitFor(() => {
      expect(tree.getByText('Menu Item 1')).toBeTruthy();
      expect(tree.getByText('Menu Item 2')).toBeTruthy();
      expect(tree.getByText('Menu Item 3')).toBeTruthy();
      expect(tree).toMatchSnapshot();
    })
  });

  test('should close menu when menu item is pressed', async () => {
    renderComponent();
    fireEvent(screen.getByTestId('test_menu_trigger_a'), 'press');
    await timer(300);

    const menuItemsComponent = AppModalService.modalOptions;
    const Component = () => {
      return (
        <>{menuItemsComponent.content}</>
      )
    }
    const tree = render(<Component/>)

    const hideMock = jest.spyOn(AppModalService, 'hideModal');

    await waitFor(() => {
      expect(tree.getByText('Menu Item 1')).toBeTruthy();
      expect(tree.getByText('Menu Item 2')).toBeTruthy();
      expect(tree.getByText('Menu Item 3')).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });

    fireEvent(tree.getByText('Menu Item 1'), 'press');

    await waitFor(() => {
      expect(hideMock).toHaveBeenCalled();
      expect(AppModalService.modalsOpened.length).toBe(0);
      expect(Object.keys(AppModalService.modalOptions).length).toBe(0)
    })
  })

  test('should trigger onSelect function when menu item is pressed', async () => {
    const onSelectMock = jest.fn();
    renderComponent({
      onSelect: onSelectMock
    });
    fireEvent(screen.getByTestId('test_menu_trigger_a'), 'press');
    await timer(300);

    const menuItemsComponent = AppModalService.modalOptions;
    const Component = () => {
      return (
        <>{menuItemsComponent.content}</>
      )
    }
    const tree = render(<Component/>)

    const hideMock = jest.spyOn(AppModalService, 'hideModal');

    await waitFor(() => {
      expect(tree.getByText('Menu Item 1')).toBeTruthy();
      expect(tree.getByText('Menu Item 2')).toBeTruthy();
      expect(tree.getByText('Menu Item 3')).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });

    fireEvent(tree.getByText('Menu Item 1'), 'press');

    await waitFor(() => {
      expect(hideMock).toHaveBeenCalled();
      expect(AppModalService.modalsOpened.length).toBe(0);
      expect(Object.keys(AppModalService.modalOptions).length).toBe(0)
      expect(onSelectMock).toHaveBeenCalled();
    })
  });

  test('should render custom dataset', async () => {
    renderComponent({
      dataset: [
        {
          label: 'WM Item 1',
          icon: 'fa fa-edit'
        },
        {
          label: 'WM Item 2',
          icon: 'fa fa-create'
        },
        {
          label: 'WM Item 3',
          icon: 'fa fa-delete'
        }
      ]
    });
    fireEvent(screen.getByTestId('test_menu_trigger_a'), 'press');
    await timer(300);

    const menuItemsComponent = AppModalService.modalOptions;
    const Component = () => {
      return (
        <>{menuItemsComponent.content}</>
      )
    }
    const tree = render(<Component/>)

    await waitFor(() => {
      expect(tree.getByText('WM Item 1')).toBeTruthy();
      expect(tree.getByText('WM Item 2')).toBeTruthy();
      expect(tree.getByText('WM Item 3')).toBeTruthy();
      expect(tree.getByText('edit')).toBeTruthy();
      expect(tree.getByText('delete')).toBeTruthy();
      expect(tree.getByText('create')).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });
  })

  test('should apply custom styles ', () => {
    renderComponent({
      show: true, 
      styles: {
        root: {
          backgroundColor: 'red'
        }
      },
    });

    expect(screen.toJSON()?.[2].props.style).toMatchObject({
      backgroundColor: 'red'
    });
    expect(screen).toMatchSnapshot();
  })

  test('should not display when show is false', () => {
    renderComponent({
      show: false
    });

    expect(screen.toJSON()?.[2].props.style).toMatchObject({
      height: 0,
      width: 0
    });
    expect(screen).toMatchSnapshot();
  });
  
});
