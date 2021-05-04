import BaseTheme, { Theme } from '@wavemaker/rn-runtime/styles/theme';

describe('Test theme functionality', () => {
    test('Check Base Theme', () => {
        expect(BaseTheme instanceof Theme).toBeTruthy();
    });
    test('Check Theme creation by extending', () => {
        const theme = BaseTheme.$new();
        expect(theme instanceof Theme).toBeTruthy();
    });
    test('Check adding styles to a theme', () => {
        const child = BaseTheme.$new();
        child.addStyle('style1', null, { color: 'black'});
        expect(child.getStyle('style1').color).toEqual('black');
    });
    test('Check adding new styles by extending old styles', () => {
        const child = BaseTheme.$new();
        child.addStyle('style1', null, { color: 'black', paddingTop: 5});
        child.addStyle('style2', 'style1', { color: 'white'});
        expect(child.getStyle('style2').color).toEqual('white');
        expect(child.getStyle('style2').paddingTop).toEqual(5);
    });
    test('Check child can access styles in parent but not vice versa', () => {
        const parent = BaseTheme.$new();
        const child = BaseTheme.$new();
        parent.addStyle('style1', null, { color: 'black', paddingTop: 5});
        child.addStyle('style2', 'style1', { color: 'white'});
        expect(parent.getStyle('style1').color).toEqual('black');
        expect(child.getStyle('style1').paddingTop).toEqual(5);
        expect(child.getStyle('style2').color).toEqual('white');
        expect(child.getStyle('style2').paddingTop).toEqual(5);
    });
});