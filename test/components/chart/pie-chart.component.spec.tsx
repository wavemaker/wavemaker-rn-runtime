import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmPieChart from '@wavemaker/app-rn-runtime/components/chart/pie-chart/pie-chart.component';

describe('Test PieChart component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmPieChart name="test_PieChart"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});
