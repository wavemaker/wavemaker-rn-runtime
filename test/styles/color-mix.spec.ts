import ColorMix from '@wavemaker/app-rn-runtime/styles/color-mix';

describe('Test Color Mix functionality', () => {
    test('Check Color Mix with oklab', () => {
        expect(ColorMix.valueOf("color-mix(in oklab, #673AB7, #00FFFF 20%)")).toEqual("#6a65c7");
    });

    test('Check Color Mix with hsl color', () => {
        expect(ColorMix.valueOf("color-mix(in oklab, hsl(261.6deg 51.87% 47.25%) 80%, #00FFFF)")).toEqual("#6a65c7");
    });

    test('Check Color Mix with lch', () => {
        expect(ColorMix.valueOf("color-mix(in lch, hsl(261.6deg 51.87% 47.25%) 80%, #00FFFF)")).toEqual("#366be2");
    });

    test('Check Color Mix with longer', () => {
        expect(ColorMix.valueOf("color-mix(in lch longer hue, hsl(261.6deg 51.87% 47.25%) 80%, #00FFFF)")).toEqual("#cd207c");
    });

});