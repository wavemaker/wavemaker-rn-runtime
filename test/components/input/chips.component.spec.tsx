import React, { ReactNode, createRef } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import WmChips from '@wavemaker/app-rn-runtime/components/input/chips/chips.component';
import WmChipsProps from '../../../src/components/input/chips/chips.props';

import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmSearch from '@wavemaker/app-rn-runtime/components/basic/search/search.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';

import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';
import AppModalService from '@wavemaker/app-rn-runtime/runtime/services/app-modal.service';

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

const appConfig = {
  app: {
    toastsOpened: 1,
  },
  refresh: () => {},
};
const loadAsset = (path) => path;

AppModalService.modalsOpened = [];

jest.mock('@wavemaker/app-rn-runtime/core/injector', () => {
  const actualInjector = jest.requireActual(
    '@wavemaker/app-rn-runtime/core/injector'
  );
  return {
    ...actualInjector,
    get: jest.fn().mockImplementation(() => {
      return appConfig;
    }),
    FOCUSED_ELEMENT: {
      get: jest.fn().mockImplementation(() => ({
        blur: jest.fn(),
      })),
    },
  };
});

describe('WmChips', () => {
  let defaultProps: WmChipsProps;
  let datasetProps;

  beforeEach(() => {
    defaultProps = new WmChipsProps();
    defaultProps.dataset = [
      {
        name: 'name0',
        dataValue: 'dataValue0',
      },
      {
        name: 'name1',
        dataValue: 'dataValue1',
      },
      {
        name: 'name2',
        dataValue: 'dataValue2',
      },
    ];
    defaultProps.searchable = true;
    defaultProps.placeholder = 'Search chips...';
    defaultProps.searchkey = 'name';

    datasetProps = {
      datafield: 'name',
      displayfield: 'name',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderComponentWithWrappers(props = {}) {
    const ref = createRef();
    return render(
      <ModalProvider value={AppModalService}>
        <AssetProvider value={loadAsset}>
          <WmChips {...defaultProps} {...datasetProps} {...props} />
        </AssetProvider>
      </ModalProvider>
    );
  }

  const invokeEventCallbackMock = jest.spyOn(
    WmChips.prototype,
    'invokeEventCallback'
  );

  // Check Rendering with Default Props
  it('renders correctly with default props and type as search', () => {
    render(<WmChips {...defaultProps} {...datasetProps} />);
    expect(screen.getByPlaceholderText('Search chips...')).toBeTruthy();
    let searchInput = screen.UNSAFE_getByType(WmSearch);
    expect(searchInput.props.type).toBe('search');
  });

  it('renders correctly with default props and type as autocomplete', async () => {
    render(<WmChips {...defaultProps} {...datasetProps} minchars={0} />);
    expect(screen.getByPlaceholderText('Search chips...')).toBeTruthy();
    let searchInput = screen.UNSAFE_getByType(WmSearch);
    expect(searchInput.props.type).toBe('autocomplete');
  });

  // Dataset Handling
  it('handles dataset properly and renders chips based on it', () => {
    render(
      <WmChips
        {...defaultProps}
        {...datasetProps}
        searchable={false}
        datavalue="name1"
      />
    );

    const selectedChip = screen.getByText('name1');
    expect(screen.getByText('name0')).toBeTruthy();
    expect(screen.getByText('name2')).toBeTruthy();
    expect(selectedChip).toBeTruthy();
    expect(selectedChip.parent?.parent?.props.accessibilityState.selected).toBe(
      true
    );

    // check selected color as well
  });

  // Prop Update Handling
  it('responds to prop updates correctly', async () => {
    const { rerender } = render(
      <WmChips {...defaultProps} {...datasetProps} />
    );
    const newDataset = [{ name: 'Chip 3', dataValue: 'chip3' }];
    rerender(
      <WmChips
        {...defaultProps}
        dataset={newDataset}
        {...datasetProps}
        searchable={false}
      />
    );
    await waitFor(() => {
      expect(screen.getByText('Chip 3')).toBeTruthy();
    });
  });

  // Item Addition
  it('adds chips correctly', async () => {
    // AppModalService.modalsOpened = [];

    const tree = renderComponentWithWrappers();
    const searchInput = tree.getByPlaceholderText('Search chips...');
    const search = tree.UNSAFE_getByType(WmSearch);
    search.instance.view = {
      measure: (callback: Function) => {
        callback(0, 0, 100, 50, 10, 20);
      },
    } as any;
    fireEvent(searchInput, 'onFocus');
    fireEvent.changeText(searchInput, 'name2');

    await timer(500);

    const renderOptions = AppModalService.modalOptions; //[0];
    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);

    const selectItem = subTree.getByText('name2');
    expect(selectItem).toBeTruthy();

    fireEvent.press(selectItem);
    await waitFor(() => {
      expect(tree.getByText('name2')).toBeTruthy();
    });
    // should not add same chip if selected again.
    fireEvent.press(selectItem);
    const resetSearchModelMock = jest.spyOn(
      WmChips.prototype,
      'resetSearchModel'
    );
    await waitFor(() => {
      expect(resetSearchModelMock).toHaveBeenCalled();
    });
  });

  // Item Removal
  it('removes chips correctly', async () => {
    render(<WmChips {...defaultProps} {...datasetProps} datavalue="name2" />);
    fireEvent.press(screen.getByText('clear'));
    const removeItemMock = jest.spyOn(WmChips.prototype, 'removeItem');
    await waitFor(() => {
      expect(removeItemMock).toHaveBeenCalled();
    });
    expect(screen.queryByText('name2')).toBeNull();
  });

  // Max Size Handling
  it('does not add more chips when max size is reached', async () => {
    // AppModalService.modalsOpened = [];
    const tree = renderComponentWithWrappers({
      maxsize: 1,
      datavalue: 'name2',
    });
    const searchInput = tree.getByPlaceholderText('Search chips...');
    const search = tree.UNSAFE_getByType(WmSearch);
    search.instance.view = {
      measure: (callback: Function) => {
        callback(0, 0, 100, 50, 10, 20);
      },
    } as any;
    fireEvent(searchInput, 'onFocus');
    fireEvent.changeText(searchInput, 'name');

    await timer(500);

    const renderOptions = AppModalService.modalOptions; //[0];
    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);
    fireEvent.press(subTree.getByText('name1'));
    await timer(300);
    await waitFor(() => {
      expect(tree.getByText('name2')).toBeTruthy();
      // expect(tree.getByText('name1')).toBeTruthy();
      expect(tree.queryByText('name1')).toBeNull();
    });
  });

  // Accessibility Props
  it('applies accessibility props correctly', async () => {
    const ref = createRef();
    render(
      <WmChips
        {...defaultProps}
        {...datasetProps}
        searchable={false}
        ref={ref}
        accessibilitylabel="Chips Component"
        hint="chips"
      />
    );

    await waitFor(() => {
      // expect(screen).toMatchSnapshot();
      expect(screen.getByLabelText('Chips Component')).toBeTruthy();
      expect(screen.getByAccessibilityHint('chips')).toBeTruthy();
    });
    // console.log('state.props ===', ref.current.state);
  });

  it('should be able to select chip when searchable is false', () => {
    const ref = createRef();
    render(
      <WmChips
        {...defaultProps}
        {...datasetProps}
        searchable={false}
        ref={ref}
      />
    );
    const selectChipMock = jest.spyOn(WmChips.prototype, 'selectChip');
    const setDatavalueMock = jest.spyOn(WmChips.prototype, 'setDatavalue');
    const chipItem = screen.getByText('name1');
    fireEvent.press(chipItem);
    expect(selectChipMock).toHaveBeenCalled();
    expect(setDatavalueMock).toHaveBeenCalled();
    expect(invokeEventCallbackMock).toHaveBeenCalled();
    expect(ref.current.state.dataItems[1].selected).toBe(true);
  });

  it('should handle readonly properly', async () => {
    render(
      <WmChips
        {...defaultProps}
        {...datasetProps}
        datavalue="name1"
        readonly={true}
      />
    );
    fireEvent.press(screen.getByText('clear'));
    await timer(300);
    await waitFor(() => {
      expect(screen.getByText('name1')).toBeTruthy();
    });

    render(
      <WmChips
        {...defaultProps}
        {...datasetProps}
        datavalue="name1"
        readonly={true}
        searchable={false}
      />
    );
    const defaultChip = screen.getByText('name1');
    fireEvent.press(defaultChip);
    await timer(300);
    expect(defaultChip.parent?.parent?.props.accessibilityState.selected).toBe(
      true
    );
  });

  it('should handle disabled properly', async () => {
    render(
      <WmChips
        {...defaultProps}
        {...datasetProps}
        datavalue="name1"
        disabled={true}
      />
    );
    expect(screen.queryByText('clear')).toBeNull();
    fireEvent.press(screen.getByText('name1'));

    await waitFor(() => {
      expect(screen.getByText('name1')).toBeTruthy();
    });
  });

  it('should not allow to select chips more than maxsize', async () => {
    render(
      <WmChips
        {...defaultProps}
        {...datasetProps}
        searchable={false}
        datavalue="name1"
        maxsize={1}
      />
    );
    const defaultChip = screen.getByText('name1');
    const selectedChip = screen.getByText('name2');
    fireEvent.press(selectedChip);
    expect(selectedChip.parent?.parent?.props.accessibilityState.selected).toBe(
      false
    );
    expect(defaultChip.parent?.parent?.props.accessibilityState.selected).toBe(
      true
    );

    fireEvent.press(defaultChip);
    await timer();
    fireEvent.press(selectedChip);

    await waitFor(() => {
      expect(
        selectedChip.parent?.parent?.props.accessibilityState.selected
      ).toBe(true);
    });
  });
});
