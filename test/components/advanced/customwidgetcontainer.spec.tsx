import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmCustomWidgetContainer from '@wavemaker/app-rn-runtime/components/advanced/CustomWidgetContainer/CustomWidgetContainer.component';

describe('Test CustomWidgetContainer component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmCustomWidgetContainer name="test_CustomWidgetContainer"></WmCustomWidgetContainer>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});