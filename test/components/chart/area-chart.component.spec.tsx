import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmAreaChart from '@wavemaker/app-rn-runtime/components/chart/area-chart/area-chart.component';

describe('Test AreaChart component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmAreaChart name="test_AreaChart"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});
