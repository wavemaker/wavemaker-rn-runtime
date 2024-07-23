import React, { createRef } from 'react';
import {
  render,
  fireEvent,
  waitFor,
  act,
  screen,
  cleanup,
} from '@testing-library/react-native';
import WmSearch, {
  WmSearchState,
} from '@wavemaker/app-rn-runtime/components/basic/search/search.component';
import WmSearchProps from '../../../src/components/basic/search/search.props';
import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';
import { TextInput } from 'react-native';
import { DataProvider } from '../../../src/components/basic/search/local-data-provider';
import AppModalService from '@wavemaker/app-rn-runtime/runtime/services/app-modal.service';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';
import { Platform } from 'react-native';

// Mock necessary modules and functions

// jest.mock('@wavemaker/app-rn-runtime/core/asset.provider', () => ({
//   AssetProvider: ({ children }: { children: React.ReactNode }) => children,
// }));

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

const dataItems = [
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

const defaultProps: WmSearchProps = {
  autofocus: false,
  query: '',
  searchkey: '',
  type: 'search',
  datacompletemsg: 'No more data to load',
  placeholder: 'Search',
  limit: 0,
  minchars: 0,
  imagewidth: 32,
  imageheight: 32,
  searchon: 'typing',
  onSubmit: jest.fn(),
  onChange: jest.fn(),
  result: [],
  showclear: false,
  showSearchIcon: true,
  invokeEvent: jest.fn(),
  formFieldInstance: undefined,
  accessibilitylabel: undefined,
  hint: undefined,
  accessibilityrole: 'search',
  renderitempartial: (item: any, index: number, partialName: string) =>
    React.ReactNode,
};

AppModalService.modalsOpened = [];

function renderComponentWithWrappers(props = {}) {
  return render(
    <ModalProvider value={AppModalService}>
      <AssetProvider value={loadAsset}>
        <WmSearch
          {...defaultProps}
          searchon="typing"
          dataset={dataItems}
          searchkey="name"
          datafield="name"
          displaylabel="name"
          // type="autocomplete"
          {...props}
        />
      </AssetProvider>
    </ModalProvider>
  );
}

describe('WmSearch Component', () => {
  const invokeEventCallback = jest.spyOn(
    WmSearch.prototype,
    'invokeEventCallback'
  );
  const updateState = jest.spyOn(WmSearch.prototype, 'updateState');

  beforeEach(() => {
    // AppModalService.modalsOpened = [];
  });

  afterEach(() => {
    // AppModalService.modalsOpened = [];
    jest.clearAllMocks();
    cleanup();
  });

  it('should render the component correctly', () => {
    const tree = render(<WmSearch {...defaultProps} />);
    expect(tree.getByPlaceholderText('Search')).toBeTruthy();
    expect(tree.getByText('search')).toBeTruthy();
  });

  it('should handle blur event', async () => {
    const { getByPlaceholderText } = render(
      <WmSearch
        {...defaultProps}
        dataset={dataItems}
        searchkey="name"
        datafield="dataValue"
        displaylabel="name"
      />
    );
    const searchInput = getByPlaceholderText('Search');
    // const onBlur = jest.spyOn(WmSearch.prototype, 'onBlur');

    fireEvent(searchInput, 'onBlur');
    await waitFor(() => {
      expect(invokeEventCallback).toHaveBeenCalled();
    });
    // expect(invokeEventCallback).toHaveBeenCalledWith('onBlur', [
    //   null,
    //   WmSearch,
    // ]);
    expect(invokeEventCallback).toHaveBeenCalledWith('onBlur', [
      null,
      expect.anything(),
    ]);
  });

  it('should handle focus event', async () => {
    const { getByPlaceholderText } = render(
      <WmSearch
        {...defaultProps}
        dataset={dataItems}
        searchkey="name"
        datafield="dataValue"
        displaylabel="name"
      />
    );
    const searchInput = getByPlaceholderText('Search');
    // const onFocus = jest.spyOn(WmSearch.prototype, 'onFocus');

    fireEvent(searchInput, 'onFocus');
    await waitFor(() => {
      expect(invokeEventCallback).toHaveBeenCalled();
    });
    // expect(invokeEventCallback).toHaveBeenCalledWith('onFocus', [
    //   null,
    //   WmSearch,
    // ]);
    expect(invokeEventCallback).toHaveBeenCalledWith('onFocus', [
      null,
      expect.anything(),
    ]);
  });

  it('should call respective callbacks when an item is selected', async () => {
    // AppModalService.modalsOpened = [];
    const ref = createRef();
    const onItemSelectMock = jest.spyOn(WmSearch.prototype, 'onItemSelect');
    const tree = renderComponentWithWrappers({
      type: 'search',
      ref,
    });
    ref.current.view = {
      measure: (callback: Function) => {
        callback(0, 0, 100, 50, 10, 20);
      },
    } as any;

    const searchInput = tree.getByPlaceholderText('Search');

    fireEvent(searchInput, 'onFocus');
    fireEvent.changeText(searchInput, 'name1');
    await act(async () => {
      await ref.current.computePosition();
    });

    await timer(500);

    const renderOptions = AppModalService.modalOptions;
    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);
    const selectItem = subTree.getByText('name1');
    fireEvent(selectItem, 'press');

    await timer(300);

    await waitFor(() => {
      expect(onItemSelectMock).toHaveBeenCalled();
      // expect(searchInput.props.defaultValue).toBe('name1');
    });
    // expect(invokeEventCallback).toHaveBeenCalledWith('onSubmit', [null, '']);
    expect(searchInput.props.defaultValue).toBe('name1');
  });

  it('should show all the data on focus when type is autocomplete', async () => {
    const ref = createRef();
    const { getByPlaceholderText } = render(
      <WmSearch
        ref={ref}
        {...defaultProps}
        dataset={dataItems}
        searchkey="name"
        datafield="dataValue"
        displaylabel="name"
        type="autocomplete"
      />
    );
    const updateFilteredDataMock = jest.spyOn(
      WmSearch.prototype,
      'updateFilteredData'
    );
    const searchInput = getByPlaceholderText('Search');

    fireEvent(searchInput, 'onFocus');
    await waitFor(() => {
      expect(updateFilteredDataMock).toHaveBeenCalledWith(defaultProps.query);
      expect(ref.current.state.data.length).toBe(dataItems.length);
    });
  });

  it('should handle text input change', async () => {
    const { getByPlaceholderText } = render(<WmSearch {...defaultProps} />);
    const searchInput = getByPlaceholderText('Search');
    // const onChangeText = jest.spyOn(WmSearch.prototype, 'invokeEventCallback');
    fireEvent.changeText(searchInput, 'test');
    await waitFor(() => {
      // expect(defaultProps.onChange).toHaveBeenCalledWith(
      //   undefined,
      //   expect.anything(),
      //   'test',
      //   ''
      // );
      expect(invokeEventCallback).toHaveBeenCalledWith('onChange', [
        undefined,
        expect.anything(),
        'test',
        '',
      ]);
    });
    expect(updateState).toHaveBeenCalled();
  });

  it('should handle clear search when type is search', async () => {
    const ref = createRef();
    const { getByPlaceholderText, getByText } = render(
      <WmSearch
        {...defaultProps}
        query="name"
        showclear={true}
        ref={ref}
        dataset={dataItems}
        searchkey="name"
        datafield="dataValue"
        displaylabel="name"
      />
    );
    const searchInput = getByPlaceholderText('Search');
    fireEvent.changeText(searchInput, 'name2');

    fireEvent.press(getByText('clear'));
    await waitFor(() => {
      expect(invokeEventCallback).toHaveBeenCalledWith('onClear', [
        null,
        expect.anything(),
      ]);
      // expect(ref.current.state.data.length).toBe(0);
    });
  });

  it('should handle clear search when type is autocomplete', async () => {
    const ref = createRef();
    const { getByPlaceholderText, getByText } = render(
      <WmSearch
        {...defaultProps}
        query="name"
        showclear={true}
        ref={ref}
        dataset={dataItems}
        searchkey="name"
        datafield="dataValue"
        displaylabel="name"
        type="autocomplete"
      />
    );
    const searchInput = getByPlaceholderText('Search');
    fireEvent.changeText(searchInput, 'name2');
    const updateFilteredDataMock = jest.spyOn(
      WmSearch.prototype,
      'updateFilteredData'
    );
    fireEvent.press(getByText('clear'));
    await waitFor(() => {
      expect(invokeEventCallback).toHaveBeenCalledWith('onClear', [
        null,
        expect.anything(),
      ]);
      expect(updateFilteredDataMock).toHaveBeenCalledWith('');
      expect(ref.current.state.data.length).toBe(dataItems.length);
    });
  });

  it('should handle search icon press and filter data when searchon = "onsearchiconclick"', async () => {
    const searchText = 'name2';
    const ref = createRef();
    const tree = render(
      <WmSearch
        ref={ref}
        {...defaultProps}
        searchon="onsearchiconclick"
        dataset={dataItems}
        searchkey="name"
        datafield="dataValue"
        displaylabel="name"
      />
    );
    const searchIconPress = jest.spyOn(WmSearch.prototype, 'searchIconPress');
    const searchInput = tree.getByPlaceholderText('Search');
    const updateFilteredDataMock = jest.spyOn(
      WmSearch.prototype,
      'updateFilteredData'
    );
    fireEvent.changeText(searchInput, searchText);
    fireEvent.press(tree.getByText('search'));
    await waitFor(() => {
      expect(searchIconPress).toHaveBeenCalled();
    });
    expect(updateState).toHaveBeenCalled();
    expect(updateFilteredDataMock).toHaveBeenCalled();
    expect(ref.current.state.data[0]).toMatchObject({
      displayfield: searchText,
    });
  });

  it('should handle search icon press and invoke itemselect events when searchon = "typing" ', async () => {
    const searchText = 'name2';
    const ref = createRef();
    const tree = render(
      <WmSearch
        ref={ref}
        {...defaultProps}
        searchon="typing"
        dataset={dataItems}
        searchkey="name"
        datafield="name"
        displaylabel="name"
      />
    );
    const onItemSelectMock = jest.spyOn(WmSearch.prototype, 'onItemSelect');
    const searchInput = tree.getByPlaceholderText('Search');
    fireEvent.changeText(searchInput, searchText);
    fireEvent.press(tree.getByText('search'));
    await waitFor(() => {
      expect(onItemSelectMock).toHaveBeenCalled();
      // expect(ref.current.state.props.datavalue).toBe(searchText);
    });
    expect(invokeEventCallback).toHaveBeenCalledWith('onSelect', [
      null,
      expect.anything(),
      searchText,
    ]);
    expect(invokeEventCallback).toHaveBeenCalledWith('onSubmit', [
      null,
      expect.anything(),
    ]);
  });

  it('should handle input change and filter data', async () => {
    const ref = createRef();
    const tree = render(
      <WmSearch
        ref={ref}
        {...defaultProps}
        searchon="typing"
        dataset={dataItems}
        searchkey="name"
        datafield="dataValue"
        displaylabel="name"
      />
    );
    const searchText = 'name1';
    const updateFilteredDataMock = jest.spyOn(
      WmSearch.prototype,
      'updateFilteredData'
    );
    const searchInput = tree.getByPlaceholderText('Search');
    fireEvent.changeText(searchInput, searchText);

    await waitFor(() => {
      expect(updateFilteredDataMock).toHaveBeenCalled();
      expect(ref.current.state.data[0]).toMatchObject({
        displayfield: searchText,
      });
    });
  });

  it('should filter data even without searchKey', async () => {
    const ref = createRef();
    const tree = render(
      <WmSearch
        ref={ref}
        {...defaultProps}
        searchon="typing"
        dataset={dataItems}
        datafield="dataValue"
        displaylabel="name"
      />
    );
    const searchText = 'name1';
    const updateFilteredDataMock = jest.spyOn(
      WmSearch.prototype,
      'updateFilteredData'
    );
    const searchInput = tree.getByPlaceholderText('Search');
    fireEvent.changeText(searchInput, searchText);

    await waitFor(() => {
      expect(updateFilteredDataMock).toHaveBeenCalled();
      expect(ref.current.state.data[0]).toMatchObject({
        displayfield: searchText,
      });
    });
  });

  it('should filter data when dataset is not an object array', async () => {
    const ref = createRef();
    const tree = render(
      <WmSearch
        ref={ref}
        {...defaultProps}
        searchon="typing"
        dataset={['name2', 'name3', 'name4', 'name5']}
      />
    );
    const searchText = 'name4';
    const updateFilteredDataMock = jest.spyOn(
      WmSearch.prototype,
      'updateFilteredData'
    );
    const searchInput = tree.getByPlaceholderText('Search');
    fireEvent.changeText(searchInput, searchText);

    await waitFor(() => {
      expect(updateFilteredDataMock).toHaveBeenCalled();
      expect(ref.current.state.data[0]).toMatchObject({
        displayfield: searchText,
      });
    });
  });

  it('should autofocus when autofocus property is true', async () => {
    const { getByPlaceholderText } = render(
      <WmSearch {...defaultProps} autofocus={true} />
    );
    const searchInput = getByPlaceholderText('Search');
    await waitFor(() => expect(searchInput.props.autoFocus).toBe(true));
  });

  it('should not filter data if minchars is not reached', async () => {
    const ref = createRef();
    const tree = render(
      <WmSearch
        ref={ref}
        {...defaultProps}
        searchon="typing"
        dataset={dataItems}
        searchkey="name"
        datafield="dataValue"
        displaylabel="name"
        minchars={5}
      />
    );
    const filterMock = jest.spyOn(DataProvider.prototype, 'filter');
    const searchInput = tree.getByPlaceholderText('Search');
    fireEvent.changeText(searchInput, 'name');

    await waitFor(() => {
      expect(filterMock).not.toHaveBeenCalled();
    });
    expect(ref.current.state.data.length).toBe(0);
  });

  it('should not filter data if search text is empty', async () => {
    const ref = createRef();
    const tree = render(
      <WmSearch
        ref={ref}
        {...defaultProps}
        searchon="typing"
        dataset={dataItems}
        searchkey="name"
        datafield="dataValue"
        displaylabel="name"
      />
    );
    const filterMock = jest.spyOn(DataProvider.prototype, 'filter');
    const searchInput = tree.getByPlaceholderText('Search');
    fireEvent.changeText(searchInput, '');

    await waitFor(() => {
      expect(filterMock).not.toHaveBeenCalled();
    });
    expect(ref.current.state.data.length).toBe(0);
  });

  it('should invoke variable and update dataitems if update is required', async () => {
    const resolvedDataItems = {
      dataSet: [
        {
          name: 'name4',
          dataValue: 'dataValue4',
        },
        {
          name: 'name5',
          dataValue: 'dataValue5',
        },
      ],
    };
    const ref = createRef();
    const initMock = jest
      .spyOn(DataProvider.prototype, 'init')
      .mockResolvedValue(true);
    const invokeVariableMock = jest
      .spyOn(DataProvider.prototype, 'invokeVariable')
      .mockReturnValue(Promise.resolve(resolvedDataItems));
    const setDataItems = jest.spyOn(WmSearch.prototype, 'setDataItems');
    const tree = render(
      <WmSearch
        ref={ref}
        {...defaultProps}
        searchon="typing"
        dataset={dataItems}
        searchkey="name"
        datafield="dataValue"
        displaylabel="name"
      />
    );
    ref.current.updateState({
      props: {
        query: 'name1',
      },
    });
    const searchInput = tree.getByPlaceholderText('Search');
    fireEvent.changeText(searchInput, 'name2');

    await waitFor(() => {
      expect(invokeVariableMock).toHaveBeenCalled();
      expect(setDataItems).toHaveBeenCalled();
      let received = mapValues(ref.current.state.dataItems);
      expect(received.toString()).toBe(resolvedDataItems.dataSet.toString());
    });
  });

  function mapValues(response) {
    return response.map((item) => ({
      name: item.displayfield,
      dataValue: item.datafield,
    }));
  }

  it('should render search items when type is autocomplete', async () => {
    // AppModalService.modalsOpened = [];
    const ref = createRef();
    const tree = renderComponentWithWrappers({ type: 'autocomplete', ref });
    ref.current.view = {
      measure: (callback: Function) => {
        callback(0, 0, 100, 50, 10, 20);
      },
    } as any;

    const searchInput = tree.getByPlaceholderText('Search');

    fireEvent(searchInput, 'onFocus');
    await act(async () => {
      await ref.current.computePosition();
    });

    await timer();

    // const renderOptions = AppModalService.modalsOpened[0];
    const renderOptions = AppModalService.modalOptions;
    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);
    expect(subTree.getByText('name1')).toBeTruthy();
    expect(subTree.getByText('name2')).toBeTruthy();
    expect(subTree.getByText('name0')).toBeTruthy();
    expect(subTree.getByText(ref.current.props.datacompletemsg)).toBeTruthy();
  });

  it('should limit the number of displayed items', async () => {
    // AppModalService.modalsOpened = [];
    const ref = createRef();

    const tree = renderComponentWithWrappers({
      type: 'autocomplete',
      ref,
      limit: 2,
    });

    ref.current.view = {
      measure: (callback: Function) => {
        callback(0, 0, 100, 50, 10, 20);
      },
    } as any;

    const searchInput = tree.getByPlaceholderText('Search');

    fireEvent(searchInput, 'onFocus');
    await act(async () => {
      await ref.current.computePosition();
    });

    await timer();

    // const renderOptions = AppModalService.modalsOpened[0];
    const renderOptions = AppModalService.modalOptions;
    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);

    await waitFor(() => {
      expect(subTree.getByText('name1')).toBeTruthy();
      expect(subTree.getByText('name0')).toBeTruthy();
      expect(subTree.queryByText('name2')).toBeNull();
    });
  });

  it('should render search items when type is search', async () => {
    // AppModalService.modalsOpened = [];
    const ref = createRef();

    const tree = renderComponentWithWrappers({
      type: 'search',
      ref,
    });
    ref.current.view = {
      measure: (callback: Function) => {
        callback(0, 0, 100, 50, 10, 20);
      },
    } as any;

    const searchInput = tree.getByPlaceholderText('Search');

    fireEvent(searchInput, 'onFocus');
    fireEvent.changeText(searchInput, 'name1');
    await act(async () => {
      await ref.current.computePosition();
    });

    await timer(500);

    const renderOptions = AppModalService.modalOptions; //[0];
    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);
    expect(subTree.getByText('name1')).toBeTruthy();
  });

  it('should compute dropdown position correctly', async () => {
    const wmSearch = new WmSearch(defaultProps);
    wmSearch.view = {
      measure: (callback: Function) => {
        callback(0, 0, 100, 50, 10, 20);
      },
    } as any;
    await act(async () => {
      await wmSearch.computePosition();
    });
    expect(wmSearch.state.position).toEqual({ left: 10, top: 70 });
  });

  it('should prepare modal options correctly', () => {
    const wmSearch = new WmSearch(defaultProps);
    const content = <></>;
    const styles = { modalContent: { borderWidth: 2 } };
    const modalService = { hideModal: jest.fn() } as any;

    wmSearch.searchInputWidth = 200;
    const options = wmSearch.prepareModalOptions(content, styles, modalService);

    expect(options.modalStyle).toEqual({});
    expect(options.contentStyle).toEqual({
      borderWidth: 2,
      left: 4,
      top: 0,
      width: 196,
    });
    expect(options.isModal).toBe(true);
    expect(typeof options.onClose).toBe('function');
  });

  it('should dismiss keyboard when modal is closed', () => {
    const wmSearch = new WmSearch(defaultProps);
    const content = <></>;
    const styles = { modalContent: { borderWidth: 2 } };
    const modalService = { hideModal: jest.fn() } as any;

    wmSearch.searchInputWidth = 200;
    const options = wmSearch.prepareModalOptions(content, styles, modalService);
    options.onClose();

    expect(wmSearch.state.isOpened).toBe(false);
  });

  it('should set accessibility props correctly', () => {
    const tree = render(
      <WmSearch
        {...defaultProps}
        accessibilitylabel="Search Input"
        hint="Enter search text"
      />
    );
    expect(tree.getByLabelText('Search Input')).toBeTruthy();
    expect(tree.getByA11yHint('Enter search text')).toBeTruthy();
    expect(tree.getByRole('search')).toBeTruthy();
  });

  it('should not clear search field when type readonly is true', async () => {
    const ref = createRef();
    const { getByPlaceholderText, getByText } = render(
      <WmSearch
        {...defaultProps}
        query="name"
        showclear={true}
        ref={ref}
        dataset={dataItems}
        searchkey="name"
        datafield="dataValue"
        displaylabel="name"
        readonly={true}
      />
    );
    const searchInput = getByPlaceholderText('Search');
    fireEvent.changeText(searchInput, 'name2');

    fireEvent.press(getByText('clear'));

    await timer(300);
    await waitFor(() => {
      expect(invokeEventCallback).not.toHaveBeenCalledTimes(1);
      expect(invokeEventCallback).not.toHaveBeenCalledWith('onClear', [
        null,
        expect.anything(),
      ]);
      expect(invokeEventCallback.mock.calls.length).toBe(0);
    });
  });

  it('should not clear search field when disabled is true', async () => {
    const ref = createRef();
    const { getByPlaceholderText, getByText } = render(
      <WmSearch
        {...defaultProps}
        query="name"
        showclear={true}
        ref={ref}
        dataset={dataItems}
        searchkey="name"
        datafield="dataValue"
        displaylabel="name"
        type="autocomplete"
        disabled={true}
      />
    );
    const searchInput = getByPlaceholderText('Search');
    fireEvent.changeText(searchInput, 'name2');
    const updateFilteredDataMock = jest.spyOn(
      WmSearch.prototype,
      'updateFilteredData'
    );
    fireEvent.press(getByText('clear'));
    await waitFor(() => {
      expect(invokeEventCallback).not.toHaveBeenCalledWith('onClear', [
        null,
        expect.anything(),
      ]);
      expect(updateFilteredDataMock).not.toHaveBeenCalledWith('');
      expect(ref.current.state.data.length).toBe(1);
    });
  });

  it('should not render search items when disabled is true', async () => {
    // AppModalService.modalsOpened = [];
    const ref = createRef();

    const tree = renderComponentWithWrappers({
      type: 'search',
      ref,
      disabled: true,
    });
    ref.current.view = {
      measure: (callback: Function) => {
        callback(0, 0, 100, 50, 10, 20);
      },
    } as any;

    const searchInput = tree.getByPlaceholderText('Search');

    fireEvent(searchInput, 'onFocus');
    fireEvent.changeText(searchInput, 'name1');
    await act(async () => {
      await ref.current.computePosition();
    });

    await timer(500);

    const renderOptions = AppModalService.modalOptions; //[0];
    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);
    expect(subTree.queryByText('name1')).toBeNull();
  });

  it('should not render search items when readonly is true', async () => {
    // AppModalService.modalsOpened = [];
    const ref = createRef();
    const tree = renderComponentWithWrappers({
      type: 'autocomplete',
      ref,
      readonly: true,
    });
    ref.current.view = {
      measure: (callback: Function) => {
        callback(0, 0, 100, 50, 10, 20);
      },
    } as any;

    const searchInput = tree.getByPlaceholderText('Search');

    fireEvent(searchInput, 'onFocus');
    await act(async () => {
      await ref.current.computePosition();
    });

    await timer(500);

    // const renderOptions = AppModalService.modalsOpened[0];
    const renderOptions = AppModalService.modalOptions;
    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);

    expect(subTree.queryByText('name1')).toBeNull();
    expect(subTree.queryByText('name2')).toBeNull();
    expect(subTree.queryByText('name0')).toBeNull();
    expect(subTree.queryByText(ref.current.props.datacompletemsg)).toBeNull();
  });

  it('should handle layout change and update width accordingly', async () => {
    const ref = createRef();
    render(<WmSearch {...defaultProps} ref={ref} />);
    const searchTextElement = screen.getByPlaceholderText('Search');
    fireEvent(searchTextElement, 'layout', {
      nativeEvent: {
        layout: {
          width: 100,
          height: 100,
        },
      },
    });

    expect(ref.current.searchInputWidth).toBe(100);
  });

  it('should handle onchange event', async () => {
    const originalPlatform = Platform.OS;
    Platform.OS = 'web';
    const ref = createRef();
    render(<WmSearch {...defaultProps} ref={ref} />);
    const updateStateMock = jest.spyOn(WmSearch.prototype, 'updateState');
    const searchTextElement = screen.getByPlaceholderText('Search');
    fireEvent(searchTextElement, 'change', {
      target: {
        value: 'nam',
        selectionStart: 3,
      },
    });

    await timer(300);
    expect(ref.current.cursor).toBe(3);
    expect(updateStateMock).toHaveBeenCalledWith({
      props: { query: 'nam' },
    } as WmSearchState);

    Platform.OS = originalPlatform;
  });
});
