import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmDonutChart from '@wavemaker/app-rn-runtime/components/chart/donut-chart/donut-chart.component';

describe('Test DonutChart component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmDonutChart name="test_DonutChart"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});