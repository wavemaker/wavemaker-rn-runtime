import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmLineChart from '@wavemaker/app-rn-runtime/components/chart/line-chart/line-chart.component';

describe('Test LineChart component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmLineChart name="test_LineChart"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});
