import { deepCopy } from '@wavemaker/rn-runtime/core/utils';

describe('test deepCopy', () => {
    test('replace values in the simple source object with destination', () => {
        const r = deepCopy({a: 1}, {a: 2});
        expect(r.a).toEqual(2);
    });
    test('Keys present in source object but not in destination', () => {
        const r = deepCopy({a: 1, b : { c: 3, d: 4}}, {a: 2, b: {c: 5}});
        expect(r.b.c).toEqual(5);
        expect(r.b.d).toEqual(4);
    });
});