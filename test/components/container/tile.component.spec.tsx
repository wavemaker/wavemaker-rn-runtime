import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmTile from '@wavemaker/app-rn-runtime/components/container/tile/tile.component';

describe('Test Tile component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmTile name="test_Tile"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});