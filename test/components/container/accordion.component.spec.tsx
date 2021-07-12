import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmAccordion from '@wavemaker/app-rn-runtime/components/container/accordion/accordion.component';

describe('Test Accordion component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmAccordion name="test_Accordion"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});