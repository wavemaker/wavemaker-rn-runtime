import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmGridcolumn from '@wavemaker/app-rn-runtime/components/container/layoutgrid/gridcolumn/gridcolumn.component';

describe.skip('Test Gridcolumn component', () => {
  test('Check validity of sample component', () => {
    const tree = renderer
      .create(<WmGridcolumn name="test_Gridcolumn" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
