import React from 'react';
import renderer from 'react-test-renderer';
import WmListActionTemplate from '@wavemaker/app-rn-runtime/components/data/list/list-action-template/list-action-template.component';
describe('Test ListActionTemplate component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmListActionTemplate name="test_ListActionTemplate"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});rr