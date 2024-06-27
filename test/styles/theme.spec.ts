import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import BaseTheme, { AllStyle, Theme } from '@wavemaker/app-rn-runtime/styles/theme';

beforeAll(() => {
    BaseTheme.traceEnabled = true;
});

describe('Test theme functionality', () => {
    test('Check Base Theme', () => {
        expect(BaseTheme instanceof Theme).toBeTruthy();
    });
    test('Check Theme creation by extending', () => {
        const theme = BaseTheme.$new('test', []);
        expect(theme instanceof Theme).toBeTruthy();
    });
    test('Check adding styles to a theme', () => {
        const child = BaseTheme.$new('test');
        child.addStyle('.style1', '', { color: 'black'} as any);
        expect(child.getStyle('style1').color).toEqual('black');
    });
    test('Check adding new styles by extending old styles', () => {
        const child = BaseTheme.$new('test');
        child.addStyle('.style1', '', { color: 'black', paddingTop: 5} as any);
        child.addStyle('.style2', 'style1', { color: 'white'} as any);
        expect(child.getStyle('style2').color).toEqual('white');
        expect(child.getStyle('style2').paddingTop).toEqual(5);
    });
    test('Check child can access styles in parent but not vice versa', () => {
        const parent = BaseTheme.$new('test1');
        const child = parent.$new('test2');
        parent.addStyle('.style1', '', { color: 'black', paddingTop: 5} as any);
        child.addStyle('.style2', 'style1', { color: 'white'} as any);
        expect(parent.getStyle('style1').color).toEqual('black');
        expect(child.getStyle('style1').paddingTop).toEqual(5);
        expect(child.getStyle('style2').color).toEqual('white');
        // expect(child.getStyle('style2').paddingTop).toEqual(5);
    });
});

describe('check trace', () => {
    test('check trace', () => {
        const style = BaseTheme.$new('testTheme', [{
            selector: '.testStyle',
            style : {
                root: {
                    color: 'black'
                }
            } as BaseStyles
        }]).getStyle('testStyle');
        expect(style.root.__trace[0].name).toEqual('@testTheme:.testStyle.root');
    });
    test('check hierarchy trace', () => {
        const parent = BaseTheme.$new('parent', [{
            selector: '.test',
            style: {
                root: {
                    color: 'black', 
                    paddingTop: 5
                }
            } as BaseStyles
        }]);
        const child = parent.$new('child', [{
            selector: '.test',
            style: {
                root: {
                    color: 'black', 
                    paddingBottom: 5
                }
            }
        }]);
        const heirarchyStyle = child.getStyle('test');
        expect(heirarchyStyle.root.__trace[0].name).toEqual('@child:.test.root');
        expect(heirarchyStyle.root.__trace[1].name).toEqual('@parent:.test.root');
    });
    test('check merge trace', () => {
        const parent = BaseTheme.$new('parent', [{
            selector: '.test',
            style: {
                root: {
                    color: 'black', 
                    paddingTop: 5
                }
            } as BaseStyles
        }]);
        const child = parent.$new('child', [{
            selector: '.test',
            style: {
                root: {
                    color: 'black', 
                    paddingBottom: 5
                },
                icon: {
                    text: {
                        fontSize: 12
                    }
                }
            } as any,
        }, {
            selector: '.test1',
            style: {
                root: {
                    color: 'red', 
                    paddingLeft: 5
                },
                icon: {
                    root: {
                        width: 100
                    },
                    text: {
                        fontSize: 20
                    }
                }
            } as any
        }]);
        const mergeStyle = child.getStyle('test test1');
        expect(mergeStyle.root.__trace[0].name).toEqual('@child:.test1.root');
        expect(mergeStyle.root.__trace[1].name).toEqual('@child:.test.root');
        expect(mergeStyle.root.__trace[2].name).toEqual('@parent:.test.root');
        expect(mergeStyle.icon.root.__trace[0].name).toEqual('@child:.test1.icon.root');
        expect(mergeStyle.icon.text.__trace[0].name).toEqual('@child:.test1.icon.text');
        expect(mergeStyle.icon.text.__trace[1].name).toEqual('@child:.test.icon.text');
    });
});

describe('Check order of precedence', () => {
    test('with in the same stylesheet', () => {
        const testTheme = Theme.BASE.$new('test', [{
            selector: '.app-button',
            style: {
                root : {
                    color: 'red',
                    borderRadius: 4
                }
            }
        }, {
            selector: '.app-button.btn-primary',
            style: {
                root : {
                    color: 'green'
                }
            }
        }]);
        expect(testTheme.getStyle('app-button').root.color).toEqual('red');
        expect(testTheme.getStyle('btn-primary app-button').root.color).toEqual('green');
        expect(testTheme.getStyle('app-button btn-primary').root.color).toEqual('green');
        testTheme.addStyle('.app-button', '', {
            root: {
                color: 'yellow',
                borderRadius: 5
            }
        });
        expect(testTheme.getStyle('app-button btn-primary').root.borderRadius).toEqual(5);
        expect(testTheme.getStyle('app-button btn-primary').root.color).toEqual('green');
    });

    test('with in different stylesheets', () => {
        const testTheme = Theme.BASE.$new('test', [{
            selector: '.app-button',
            style: {
                root : {
                    color: 'red',
                    borderRadius: 4
                }
            },
        }, {
            selector: '.app-button.btn-primary',
            style: {
                root : {
                    color: 'green'
                }
            }
        }]);
        const testTheme1= testTheme.$new('test', [{
            selector: '.app-button',
            style: {
                root : {
                    color: 'yellow',
                    borderRadius: 8
                }
            }
        }]);
        expect(testTheme1.getStyle('app-button').root.color).toEqual('yellow');
        expect(testTheme1.getStyle('app-button btn-primary').root.color).toEqual('green');
        expect(testTheme1.getStyle('app-button btn-primary').root.borderRadius).toEqual(8);
    });
});