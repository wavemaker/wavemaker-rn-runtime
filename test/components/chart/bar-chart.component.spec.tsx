import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmBarChart from '@wavemaker/app-rn-runtime/components/chart/bar-chart/bar-chart.component';

describe('Test BarChart component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmBarChart name="test_BarChart"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});
