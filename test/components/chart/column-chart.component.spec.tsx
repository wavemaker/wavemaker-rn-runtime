import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmColumnChart from '@wavemaker/app-rn-runtime/components/chart/column-chart/column-chart.component';

describe('Test ColumnChart component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmColumnChart name="test_ColumnChart"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});