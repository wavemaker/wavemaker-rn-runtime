import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmBubbleChart from '@wavemaker/app-rn-runtime/components/chart/bubble-chart/bubble-chart.component';

describe('Test BubbleChart component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmBubbleChart name="test_BubbleChart"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});