import { beforeEach, describe, test, expect } from '@jest/globals';

import { parseSelector } from '@wavemaker/app-rn-runtime/styles/selector';
import { WmComponentNode } from "@wavemaker/app-rn-runtime/core/wm-component-tree";
import BaseTheme  from '@wavemaker/app-rn-runtime/styles/theme';


let testNode = new WmComponentNode({
    'type': 'root'
});
beforeEach(() => {
    testNode = new WmComponentNode({
        'type': 'wm-page',
        'classname': 'app-page',
        'children': [
            new WmComponentNode({
                'type': 'wm-content',
                'classname': 'app-content',
                'children': [
                    new WmComponentNode({
                        'type': 'wm-pagecontent',
                        'classname': 'app-page-content',
                        'children': [
                            new WmComponentNode({
                                'type': 'wm-container',
                                'classname': 'app-container',
                                'children': [
                                    new WmComponentNode({
                                        'type': 'wm-button',
                                        'classname': 'app-button btn-primary',
                                    }),
                                    new WmComponentNode({
                                        'type': 'wm-label',
                                        'classname': 'app-label',
                                    }),
                                    new WmComponentNode({
                                        'type': 'wm-button',
                                        'classname': 'app-button btn-default',
                                    }),
                                    new WmComponentNode({
                                        'type': 'wm-button',
                                        'classname': 'app-button btn-secondary',
                                    })
                                ]
                            })
                        ]
                        
                    }),
                    new WmComponentNode({
                        'type': 'wm-container',
                        'classname': 'app-container',
                        'children': [
                            new WmComponentNode({
                                'type': 'wm-button',
                                'classname': 'app-button btn-primary',
                            })
                        ]
                    })
                ]
            })
        ]
    })
});

describe('Basic Type Selector', () => {
    test('type selector should select', () => {
        const input = `wm-pagecontent`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0])).toBeDefined();
    });
    test('type selector score should be 1', () => {
        const input = `wm-pagecontent`;
        const output = parseSelector(input);
        expect(output.specificityWeight.value).toEqual(1);
    });
    test('type selector should not select', () => {
        const input = `wm-page`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0])).toBeUndefined();
    });
    test('Check styles with type selector', () => {
        const testTheme = BaseTheme.$new('testTheme', [{
            selector: 'wm-pagecontent',
            style: {
                root: {
                    color: 'black'
                }
            }
        }]);
        expect(testTheme.getStyle(
            new WmComponentNode({
                type: 'wm-pagecontent',
                classname: ''
            })).root.color).toEqual('black');
        expect(testTheme.getStyle(
            new WmComponentNode({
                type: 'wm-page',
                classname: ''
            }))?.root).toBeUndefined();
    });
});

describe('Basic Class Selector', () => {
    test('Class selector should select', () => {
        const input = `.app-page-content`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0])).toBeDefined();
    });
    test('Class selector score should be 100', () => {
        const input = `.app-page-content`;
        const output = parseSelector(input);
        expect(output.specificityWeight.value).toEqual(100);
    });
    test('class selector should not select', () => {
        const input = `.app-page`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0])).toBeUndefined();
    });
    test('Check styles with class selector', () => {
        const testTheme = BaseTheme.$new('testTheme', [{
            selector: '.app-pagecontent',
            style: {
                root: {
                    color: 'black'
                }
            }
        }]);
        expect(testTheme.getStyle(
            new WmComponentNode({
                type: 'wm-pagecontent',
                classname: 'app-pagecontent'
            })).root.color).toEqual('black');
        expect(testTheme.getStyle(
            new WmComponentNode({
                type: 'wm-pagecontent',
                classname: ''
            }))?.root).toBeUndefined();
    });
});

describe('Basic first-child Selector', () => {
    test('First-child should select', () => {
        const input = `.app-button:first-child`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[0])).toBeDefined();
    });
    test('Basic first-child score should be 100', () => {
        const input = `:first-child`;
        const output = parseSelector(input);
        expect(output.specificityWeight.value).toEqual(100);
    });
    test('First-child should not select', () => {
        const input = `.app-button:first-child`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[1])).toBeUndefined();
    });
    test('Check styles with First-child selector', () => {
        const testTheme = BaseTheme.$new('testTheme', [{
            selector: '.app-button:first-child',
            style: {
                root: {
                    color: 'black'
                }
            }
        }]);
        const firstButton = testNode.children[0].children[0].children[0].children[0];
        const secondButton = testNode.children[0].children[0].children[0].children[1];
        expect(testTheme.getStyle(firstButton).root.color).toEqual('black');
        expect(testTheme.getStyle(secondButton).root).toBeUndefined();
    });
});

describe('Basic last-child Selector', () => {
    test('last-child should select', () => {
        const input = `.app-button:last-child`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[3])).toBeDefined();
    });
    test('Basic last-child score should be 100', () => {
        const input = `:last-child`;
        const output = parseSelector(input);
        expect(output.specificityWeight.value).toEqual(100);
    });
    test('last-child should not select', () => {
        const input = `.app-button:last-child`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[1])).toBeUndefined();
    });
    test('Check styles with last-child selector', () => {
        const testTheme = BaseTheme.$new('testTheme', [{
            selector: '.app-button:last-child',
            style: {
                root: {
                    color: 'black'
                }
            }
        }]);
        const lastButton = testNode.children[0].children[0].children[0].children[3];
        const secondButton = testNode.children[0].children[0].children[0].children[1];
        expect(testTheme.getStyle(lastButton).root.color).toEqual('black');
        expect(testTheme.getStyle(secondButton).root).toBeUndefined();
    });
});

describe('multi class Selector', () => {
    test('multi class should select', () => {
        const input = `.app-button.btn-primary`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[0])).toBeDefined();
    });
    test('multi class score should be 200', () => {
        const input = `.app-button.btn-primary`;
        const output = parseSelector(input);
        expect(output.specificityWeight.value).toEqual(200);
    });
    test('multi class should not select', () => {
        const input = `.app-button.btn-primary`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[2])).toBeUndefined();
    });
    test('Check styles with multi class selector', () => {
        const testTheme = BaseTheme.$new('testTheme', [{
            selector: '.app-button.btn-primary',
            style: {
                root: {
                    color: 'black'
                }
            }
        }]);
        const firstButton = testNode.children[0].children[0].children[0].children[0];
        const secondButton = testNode.children[0].children[0].children[0].children[1];
        expect(testTheme.getStyle(firstButton).root.color).toEqual('black');
        expect(testTheme.getStyle(secondButton).root).toBeUndefined();
    });
});

describe('type-class Selector', () => {
    test('type-class should select', () => {
        const input = `wm-button.app-button`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[0])).toBeDefined();
    });
    test('type-class score should be 101', () => {
        const input = `wm-button.app-button`;
        const output = parseSelector(input);
        expect(output.specificityWeight.value).toEqual(101);
    });
    test('type-class should not select with container', () => {
        const input = `wm-container.app-button`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[0])).toBeUndefined();
    });
    test('type-class should not select with different button', () => {
        const input = `wm-button.app-button1`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[0])).toBeUndefined();
    });
    test('Check styles with type-class selector', () => {
        const testTheme = BaseTheme.$new('testTheme', [{
            selector: 'wm-button.app-button',
            style: {
                root: {
                    color: 'black'
                }
            }
        }]);
        const firstButton = testNode.children[0].children[0].children[0].children[0];
        expect(testTheme.getStyle(firstButton).root.color).toEqual('black');
        const testTheme1 = BaseTheme.$new('testTheme', [{
            selector: 'wm-container.app-button',
            style: {
                root: {
                    color: 'black'
                }
            }
        }]);
        expect(testTheme1.getStyle(firstButton)?.root).toBeUndefined();
    });
});

describe('Complex Node Selector', () => {
    test('Complex Node Selector should select with first child', () => {
        const input = `wm-button.app-button.btn-primary:first-child`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[0])).toBeDefined();
    });
    test('Complex Node Selector score', () => {
        const input = `wm-button.app-button.btn-primary:first-child`;
        const output = parseSelector(input);
        expect(output.specificityWeight.value).toEqual(301);
    });
    test('Complex Node Selector should not select with last-child', () => {
        const input = `wm-button.app-button.btn-primary:last-child`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[0])).toBeUndefined();
    });
    test('Complex Node Selector should not select with first child', () => {
        const input = `wm-button.app-button.btn-secondary:first-child`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[2])).toBeUndefined();
    });
    test('Complex Node Selector should select with last-child', () => {
        const input = `wm-button.app-button.btn-secondary:last-child`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[3])).toBeDefined();
    });
    test('Check styles with complex node selector', () => {
        const testTheme = BaseTheme.$new('testTheme', [{
            selector: 'wm-button.app-button.btn-primary:first-child',
            style: {
                root: {
                    color: 'black'
                }
            }
        }]);
        const firstButton = testNode.children[0].children[0].children[0].children[0];
        expect(testTheme.getStyle(firstButton).root.color).toEqual('black');
        const lastButton = testNode.children[0].children[0].children[0].children[3];
        expect(testTheme.getStyle(lastButton)?.root).toBeUndefined();
        const testTheme1 = BaseTheme.$new('testTheme', [{
            selector: 'wm-button.app-button.btn-secondary:last-child',
            style: {
                root: {
                    color: 'black'
                }
            }
        }]);
        expect(testTheme1.getStyle(lastButton).root.color).toEqual('black');
    });
});

describe('General child Selector', () => {
    test('General child should select', () => {
        const input = `wm-page .app-button`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[0])).toBeDefined();
    });
    test('General child should not select', () => {
        const input = `.app-button wm-page`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[0])).toBeUndefined();
    });
    test('General child with 2 parents should select', () => {
        const input = `wm-page .app-container .app-button`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[0])).toBeDefined();
    });
    test('General child with 2 parents score should be 201', () => {
        const input = `wm-page .app-container .app-button`;
        const output = parseSelector(input);
        expect(output.specificityWeight.value).toEqual(201);
    });
    test('General child with 2 parents should not select', () => {
        const input = `wm-page1 .app-container .app-button`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[0])).toBeUndefined();
    });
    test('Check styles with general child selector', () => {
        const testTheme = BaseTheme.$new('testTheme', [{
            selector: 'wm-page .app-button',
            style: {
                root: {
                    color: 'black'
                }
            }
        }]);
        const firstButton = testNode.children[0].children[0].children[0].children[0];
        expect(testTheme.getStyle(firstButton).root.color).toEqual('black');
        expect(testTheme.getStyle(testNode)?.root).toBeUndefined();
    });
});

describe('Immediate child Selector', () => {
    test('Immediate child should select', () => {
        const input = `.app-container > .app-button`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[0])).toBeDefined();
    });
    test('Immediate child score should be 200', () => {
        const input = `.app-container > .app-button`;
        const output = parseSelector(input);
        expect(output.specificityWeight.value).toEqual(200);
    });
    test('Immediate child should not select', () => {
        const input = `wm-page > .app-button`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[0])).toBeUndefined();
    });
    test('General child with 2 parents should select', () => {
        const input = `.app-page-content>.app-container >.app-button`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[0])).toBeDefined();
    });
    test('Check styles with immediate child selector', () => {
        const testTheme = BaseTheme.$new('testTheme', [{
            selector: '.app-page-content>.app-container >.app-button',
            style: {
                root: {
                    color: 'black'
                }
            }
        }]);
        const firstButton = testNode.children[0].children[0].children[0].children[0];
        expect(testTheme.getStyle(firstButton).root.color).toEqual('black');
        expect(testTheme.getStyle(testNode.children[0].children[1].children[0])?.root).toBeUndefined();
    });
});

describe('Adjacent sibling Selector', () => {
    test('Adjacent sibling should select', () => {
        const input = `.app-button+.app-button`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[3])).toBeDefined();
    });
    test('Adjacent sibling should not select', () => {
        const input = `.app-button+.app-button`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[0])).toBeUndefined();
    });
    test('Check styles with adjacent sibling selector', () => {
        const testTheme = BaseTheme.$new('testTheme', [{
            selector: '.app-button+.app-button',
            style: {
                root: {
                    color: 'black'
                }
            }
        }]);
        const firstButton = testNode.children[0].children[0].children[0].children[0];
        const secondButton = testNode.children[0].children[0].children[0].children[3];
        expect(testTheme.getStyle(firstButton)?.root).toBeUndefined();
        expect(testTheme.getStyle(secondButton).root.color).toEqual('black');
    });
});

describe('General sibling Selector', () => {
    test('General sibling should select', () => {
        const input = `.app-label~.app-button`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[3])).toBeDefined();
    });
    test('General sibling score should be 200', () => {
        const input = `.app-label~.app-button`;
        const output = parseSelector(input);
        expect(output.specificityWeight.value).toEqual(200);
    });
    test('General sibling should not select', () => {
        const input = `.app-container~.app-button`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[2])).toBeUndefined();
    });
    test('Check styles with general sibling selector', () => {
        const testTheme = BaseTheme.$new('testTheme', [{
            selector: '.app-label~.app-button',
            style: {
                root: {
                    color: 'black'
                }
            }
        }]);
        const firstButton = testNode.children[0].children[0].children[0].children[0];
        const secondButton = testNode.children[0].children[0].children[0].children[2];
        expect(testTheme.getStyle(firstButton)?.root).toBeUndefined();
        expect(testTheme.getStyle(secondButton).root.color).toEqual('black');
    });
});

describe('Complex Selector', () => {
    test('1.Complex Selector should select', () => {
        const input = `.app-page > .app-content > wm-pagecontent.app-page-content .app-container .app-button:first-child`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[0])).toBeDefined();
    });
    test('2.Complex Selector should select', () => {
        const input = `.app-page > .app-content > wm-pagecontent.app-page-content .app-container .app-label~.app-button:last-child`;
        const output = parseSelector(input);
        expect(output.select(testNode.children[0].children[0].children[0].children[3])).toBeDefined();
    });
    test('Complex Selector should select', () => {
        const input = `.app-page > .app-content > wm-pagecontent.app-page-content .app-container .app-label~.app-button:last-child`;
        const output = parseSelector(input);
        expect(output.specificityWeight.value).toEqual(701);
    });
    test('Check styles with complex selector', () => {
        const testTheme = BaseTheme.$new('testTheme', [{
            selector: '.app-page > .app-content > wm-pagecontent.app-page-content .app-container .app-button:first-child',
            style: {
                root: {
                    color: 'black'
                }
            }
        }]);
        const firstButton = testNode.children[0].children[0].children[0].children[0];
        const secondButton = testNode.children[0].children[0].children[0].children[2];
        expect(testTheme.getStyle(firstButton).root.color).toEqual('black');
        expect(testTheme.getStyle(secondButton)?.root).toBeUndefined();
    });
});