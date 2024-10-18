import React from 'react';
import { render, screen } from '@testing-library/react-native';
import WmCarouselTemplate from '@wavemaker/app-rn-runtime/components/advanced/carousel/carousel-template/carousel-template.component';
import { View, Text } from 'react-native';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';

// Helper function to render the component
const renderComponent = (props = {}) => {
  return render(<WmCarouselTemplate {...props} />);
};

describe('WmCarouselTemplate Component', () => {
  it('should render the component without crashing', () => {
    const tree = renderComponent().toJSON();
    expect(tree).toMatchSnapshot(); // Ensure it matches the snapshot
    expect(tree).not.toBeNull(); // The component should not be null
    expect(tree).toBeDefined(); // The component should be defined
  });

  it('should render the root element with default styles when height is provided', () => {
    const mockStyles = {
      root: {
        height: '50%', // Simulating height being passed in the styles
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      },
    };

    const tree = renderComponent({ styles: mockStyles });

    // Access the root View element
    const viewEle = tree.UNSAFE_getByType(View); // Get the root View component
    expect(viewEle).toBeDefined();
    expect(viewEle).toHaveStyle({
      height: '50%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    });
  });

  it('should render children components correctly', () => {
    const tree = renderComponent({
      children: (
        <View>
          <Text>Carousel Item</Text>
        </View>
      ),
    });

    const rootView = tree.root.props.style;
    // Check if child text is rendered
    expect(tree.getByText('Carousel Item')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  it('should render the background component if it exists', () => {
    const tree = renderComponent();
    const backgroundEle = tree.UNSAFE_getByType(BackgroundComponent); // Check for the background component
    expect(backgroundEle).toBeDefined(); // It should be defined if present
  });
});
