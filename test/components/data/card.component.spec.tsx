import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmCard from '@wavemaker/app-rn-runtime/components/data/card/card.component';

describe('Test Card component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmCard name="test_Card"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});