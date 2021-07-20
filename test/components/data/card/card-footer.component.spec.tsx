import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmCardFooter from '@wavemaker/app-rn-runtime/components/data/card/card-footer/card-footer.component';

describe('Test CardFooter component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmCardFooter name="test_CardFooter"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});