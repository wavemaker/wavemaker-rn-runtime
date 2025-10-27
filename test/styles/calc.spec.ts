import { CalcExpression } from '@wavemaker/app-rn-runtime/styles/calc';

describe('Test Calc functionality', () => {
    test('Check Calc with plus', () => {
        expect(new CalcExpression("1 + 2").evaluate()).toEqual(3);
    });
    test('Check Calc with minus', () => {
        expect(new CalcExpression("2 - 1").evaluate()).toEqual(1);
    });
    test('Check Calc with multiply', () => {
        expect(new CalcExpression("2 * 2").evaluate()).toEqual(4);
    });
    test('Check Calc with division', () => {
        expect(new CalcExpression("6 / 2").evaluate()).toEqual(3);
    });
    test('Check Calc with multiple opertors', () => {
        expect(new CalcExpression("6 * 3 + 4  - 6 / 2").evaluate()).toEqual(19);
    });
    test('Check Calc with multiple opertors', () => {
        expect(new CalcExpression("6 * (3 + 4)  - 6 / 2").evaluate()).toEqual(39);
    });
    test('Check Calc with percent', () => {
        expect(new CalcExpression("100%  - 20%", {p: 50}).evaluate()).toEqual(40);
    });
    test('Check Calc with percent and number', () => {
        expect(new CalcExpression("100%  - 48px", {p: 50}).evaluate()).toEqual(2);
    });
    test('Check Calc with vh', () => {
        expect(new CalcExpression("100vh  - 48px", {vh: 600}).evaluate()).toEqual(552);
    });
    test('Check Calc with vw', () => {
        expect(new CalcExpression("100vw  - 48px", {vw: 360}).evaluate()).toEqual(312);
    });
    test('Check Calc with variables at evaluation', () => {
        expect(new CalcExpression("100vw  - 48px", {vw: 360}).evaluate({vw: 240})).toEqual(192);
    });
    test('Check with inner calc', () => {
        expect(new CalcExpression("calc(calc(24 / 3)* -1)", {vw: 360}).evaluate({vw: 240})).toEqual(-8);
    });
});