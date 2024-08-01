import React, { ReactNode, createRef } from 'react';
import renderer from 'react-test-renderer';
import WmRating from '@wavemaker/app-rn-runtime/components/input/rating/rating.component';
import WmRatingProps from '../../../src/components/input/rating/rating.props';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

// Mock Icon Component
// jest.mock(
//   '@wavemaker/app-rn-runtime/components/basic/icon/icon.component',
//   () => 'WmIcon'
// );

describe('WmRating', () => {
  let defaultProps;

  const dataInput = [
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
    {
      name: 'name3',
      dataValue: 'dataValue3',
    },
    {
      name: 'name4',
      dataValue: 'dataValue4',
    },
  ];

  beforeEach(() => {
    defaultProps = {
      dataset: dataInput,
      datafield: 'dataValue',
      displayfield: 'name',
      // getDisplayExpression: null,
      // datavalue: null,
      maxvalue: 5,
      // readonly: false,
      // iconcolor: null,
      iconsize: 32,
      showcaptions: true,
      // onFieldChange: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Check Rendering with Default Props
  it('renders correctly with default props', () => {
    render(<WmRating {...defaultProps} />);
    expect(screen).toMatchSnapshot();
    expect(screen.getAllByText('star-border')).toHaveLength(
      defaultProps.maxvalue
    );
  });

  // Prop Update Handling
  it('responds to prop updates correctly', async () => {
    const { rerender } = render(
      <WmRating {...defaultProps} iconcolor="red" datavalue="dataValue2" />
    );
    rerender(<WmRating {...defaultProps} datavalue="dataValue3" />);
    await waitFor(() => {
      expect(
        screen.UNSAFE_getAllByType(WmIcon)[3].props.styles.text
      ).toMatchObject({
        color: 'red',
      });
    });
  });

  // Readonly Handling
  it('should not be able to change value when readonly', async () => {
    const invokeEventCallback = jest.spyOn(
      WmRating.prototype,
      'invokeEventCallback'
    );
    const updateState = jest.spyOn(WmRating.prototype, 'updateState');
    const ref = createRef();
    render(<WmRating {...defaultProps} readonly={true} />);
    const starItem = screen.getAllByText('star-border')[2];
    fireEvent.press(starItem);
    await waitFor(() => {
      expect(invokeEventCallback).not.toHaveBeenCalled();
      expect(updateState).not.toHaveBeenCalledWith({
        props: {
          datavalue: 'dataValue2',
        },
      });
    });
  });

  // Icon Color and Size
  it('applies correct icon color and size', async () => {
    render(
      <WmRating
        {...defaultProps}
        iconcolor="blue"
        iconsize={40}
        datavalue="dataValue0"
      />
    );
    const firstStar = screen.UNSAFE_getAllByType(WmIcon)[0];
    expect(firstStar.props.iconsize).toEqual(40);
    await waitFor(() => {
      expect(firstStar.props.styles.text).toEqual(
        expect.objectContaining({ color: 'blue' })
      );
    });
  });

  // Caption Display
  it('displays caption correctly when showcaptions is true', async () => {
    render(<WmRating {...defaultProps} datavalue="dataValue3" />);
    expect(screen.getByText('name3')).toBeTruthy();

    const thirdItem = screen.getAllByText('star')[2];
    fireEvent.press(thirdItem);
    await waitFor(() => {
      expect(screen.getByText(dataInput[2].name)).toBeTruthy();
    });
  });

  // Handle invalid values for props
  it('handles invalid maxvalue gracefully', () => {
    render(<WmRating {...defaultProps} maxvalue={null} />);
    const stars = screen.getAllByText('star-border');
    expect(stars).toHaveLength(5); // Default maxvalue
  });

  // Event Callbacks
  it('invokes onFieldChange properly', async () => {
    const onFieldChangeMock = jest.fn();
    const props = {
      ...defaultProps,
      onFieldChange: onFieldChangeMock,
    };

    render(<WmRating {...props} datavalue="dataValue1" />);
    const checkbox = screen.getAllByText('star-border')[0];
    fireEvent.press(checkbox);
    await waitFor(() => {
      expect(onFieldChangeMock).toHaveBeenCalled();
      expect(onFieldChangeMock).toHaveBeenCalledWith(
        'datavalue',
        'dataValue2',
        'dataValue1',
        undefined
      );
    });
  });

  it('invokes onChange properly when pressed on any star', async () => {
    const invokeEventCallback = jest.spyOn(
      WmRating.prototype,
      'invokeEventCallback'
    );
    render(<WmRating {...defaultProps} datavalue="dataValue1" />);
    const starItem = screen.getAllByText('star-border')[2];
    fireEvent.press(starItem);
    await waitFor(() => {
      expect(invokeEventCallback).toHaveBeenCalledWith('onChange', [
        undefined,
        expect.anything(),
        'dataValue4',
        'dataValue1',
      ]);
    });
  });

  // Internal Methods
  it('calls prepareItems and changeValue correctly', async () => {
    const ref = createRef();

    render(<WmRating {...defaultProps} ref={ref} />);

    // Validate prepareItems method
    ref.current.prepareItems(defaultProps);
    expect(ref.current.state.items).toBeDefined();
    expect(ref.current.state.selectedIndex).toBe(-1);

    // Validate changeValue method
    ref.current.changeValue(2);
    await waitFor(() => {
      expect(ref.current.state.props.datavalue).toBe(
        defaultProps.dataset[2].dataValue
      );
    });
  });

  // Edge Cases
  it('handles empty caption and invalid datafield gracefully', () => {
    render(
      <WmRating
        {...defaultProps}
        showcaptions={true}
        datafield=""
        displayfield=""
      />
    );
    expect(screen.getAllByText('star-border').length).toBe(
      defaultProps.maxvalue
    );

    render(
      <WmRating
        {...defaultProps}
        showcaptions={true}
        datafield=""
        datavalue="dataValue3"
        displayfield=""
      />
    );
    expect(screen.getByText('')).toBeTruthy();
  });

  it('handles invalid datavalue gracefully ', () => {
    render(<WmRating {...defaultProps} datavalue={1} />);
    expect(screen.getAllByText('star').length).toBe(2);
  });

  // Empty Dataset Handling
  it('handles empty dataset gracefully', () => {
    render(<WmRating {...defaultProps} dataset={null} />);
    const items = screen.getAllByText('star-border');
    expect(items).toHaveLength(defaultProps.maxvalue);
  });

  it('handles string dataset ', () => {
    render(<WmRating {...defaultProps} dataset="a,b,c,d,e,f" />);
    const items = screen.getAllByText('star-border');
    expect(items).toHaveLength(defaultProps.maxvalue);
  });

  it('invokes display expression function when provided ', () => {
    const getDisplayExpressionMock = jest.fn();
    render(
      <WmRating
        {...defaultProps}
        getDisplayExpression={getDisplayExpressionMock}
        datavalue="dataValue2"
      />
    );
    expect(getDisplayExpressionMock).toBeCalledWith(dataInput[2]);
  });
});
