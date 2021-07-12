import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmAccordionpane from '@wavemaker/app-rn-runtime/components/container/accordion/accordionpane/accordionpane.component';

describe('Test Accordionpane component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmAccordionpane name="test_Accordionpane"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});