import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmGridrow from '@wavemaker/app-rn-runtime/components/container/layoutgrid/gridrow/gridrow.component';

describe('Test Gridrow component', () => {
  test('Check validity of sample component', () => {
    const tree = renderer.create(<WmGridrow name="test_Gridrow" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
