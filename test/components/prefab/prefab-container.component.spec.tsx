import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';

import WmPrefabContainer from '@wavemaker/app-rn-runtime/components/prefab/prefab-container.component';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';

const timer = (time = 200) => new Promise((resolve: any, reject) => {setTimeout(()=>resolve(), time)})

const renderComponent = (props = {}) => {
    return render(
      <AssetProvider value={(path) => path}>
        <WmPrefabContainer name={'wm-prefab'} children={[<Text>Children</Text>]} {...props}/>
      </AssetProvider>
    )
}

jest.mock('@wavemaker/app-rn-runtime/core/imageSizeEstimator', () => ({
  getSize: jest.fn((uri, callback) => {
    callback(100, 200); // mock image dimensions
  }),
}));

describe('Test prefab container', () => {
  test('should render component', () => {
    renderComponent();
    expect(screen).toMatchSnapshot();
  });

  test('should render children component', () => {
    renderComponent();
    expect(screen.getByText('Children')).toBeTruthy();
    expect(screen).toMatchSnapshot();
  });

  test('should apply styles', () => {
    renderComponent({
        styles: {
            root: {
                backGroundColor: 'red',
                height: 100
            }
        }
    });

    expect(screen.toJSON()?.props.style).toMatchObject({
        backGroundColor: 'red',
        height: 100
    })
    expect(screen).toMatchSnapshot();
  });

  test('should render background component, when background image is set', async () => {
    renderComponent({
      styles: {
        root: {
          backgroundImage: 'linear-gradient(45deg, #4c669f, #3b5998)',
          backgroundSize: '100% 100%',
        }
      }
    });

    await timer();
    expect(screen.getByTestId('wm-expo-linear-gradient')).toBeTruthy();
    expect(screen).toMatchSnapshot();
  })
});
