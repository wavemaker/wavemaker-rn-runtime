import React from 'react';
import { render, screen } from '@testing-library/react-native';
import WmPartialContainer from '@wavemaker/app-rn-runtime/components/page/partial-container/partial-container.component'; // Adjust the import path
import { View, Text } from 'react-native';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';
import PartialService, { PartialConsumer } from '@wavemaker/app-rn-runtime/core/partial.service';

// Mock PartialService
const mockPartialService = {
  get: jest.fn(),
};

// Mock PartialConsumer to use the mocked PartialService
jest.mock('@wavemaker/app-rn-runtime/core/partial.service', () => ({
  PartialConsumer: ({ children }) => children(mockPartialService),
}));

// Helper function to render the component
const renderComponent = (props = {}) => {
  return render(<WmPartialContainer {...props} />);
};

describe('Test WmPartialContainer component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render WmPartialContainer component', () => {
    const tree = renderComponent().toJSON();
    expect(tree).toMatchSnapshot();
    expect(tree).not.toBeNull();
    expect(tree).toBeDefined();
  });

  it('should render root element with default styles', () => {
    renderComponent();
    const rootEle = screen.root;
    expect(rootEle.props.style.width).toBe('100%');
    expect(rootEle.props.style.backgroundColor).toBe('#eeeeee'); // Assuming default bg color
  });

  it('should render the background component', () => {
    const tree = renderComponent();
    const backgroundEle = tree.UNSAFE_queryByType(BackgroundComponent);
    expect(backgroundEle).not.toBeNull();
    expect(backgroundEle).toBeDefined();
  });

  it('should render partial content when provided', () => {
    // Mock the return value of the get method in PartialService
    mockPartialService.get.mockReturnValue(() => (
      <View>
        <Text>Partial Content</Text>
      </View>
    ));

    renderComponent({ content: 'somePartial' });

    expect(mockPartialService.get).toHaveBeenCalledWith('somePartial');
    expect(screen.getByText('Partial Content')).toBeTruthy();
  });

  it('should not render partial if content is not provided', () => {
    // Mock the return value of the get method in PartialService
    mockPartialService.get.mockReturnValue(null);

    renderComponent({ content: 'unknownPartial' });

    expect(mockPartialService.get).toHaveBeenCalledWith('unknownPartial');
    expect(screen.queryByText('Partial Content')).toBeNull();
  });

  it('should call onLoad prop when component is loaded', () => {
    const onLoadMock = jest.fn();
    renderComponent({ onLoad: onLoadMock });
    expect(onLoadMock).toHaveBeenCalled();
  });

});