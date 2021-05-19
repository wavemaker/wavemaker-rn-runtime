import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { PropsProvider } from '@wavemaker/app-rn-runtime/core/props.provider';

describe('Test PropsProvider', () => {
    interface TestProps extends BaseProps {
        flag : boolean
    }
    const initialProps = {
        name: 'test',
        flag: true
    };
    test('Instance needs to be created without any error', () => {
        const instance = new PropsProvider<TestProps>(initialProps, () => {});
        expect(instance).not.toBeNull();
    });

    test('Should return the initial property values', () => {
        const instance = new PropsProvider<TestProps>(initialProps, () => {});
        const props = instance.get();
        expect(props).not.toBeNull();
    });

    test('check properties', () => {
        const instance = new PropsProvider<TestProps>(initialProps, () => {});
        const props = instance.get();
        expect(props.flag).toBeTruthy();
        //@ts-ignore
        expect(props.unknown).toBeUndefined();
    });

    test('setting properties', () => {
        const instance = new PropsProvider<TestProps>(initialProps, () => {});
        const props = instance.get();
        expect(props.flag).toBeTruthy();
        props.flag = false;
        expect(initialProps.flag).toBeTruthy();
        expect(props.flag).toBeFalsy();
        //@ts-ignore
        props.unknown = 'unknown';
        //@ts-ignore
        expect(props.unknown).toBeUndefined();
    });
    
    test('getting callback on change of properties', () => {
        const callback = jest.fn((name: string, $new: any, $old: any) => {});
        const instance = new PropsProvider<TestProps>(initialProps, callback);
        const props = instance.get();
        let callCount = 2; // initialization callback for each property with value
        expect(callback.mock.calls.length).toBe(callCount);
        props.flag = false;
        expect(callback.mock.calls.length).toBe(++callCount);
        props.flag = false;
        expect(callback.mock.calls.length).toBe(callCount);
        props.flag = true;
        expect(callback.mock.calls.length).toBe(++callCount);
        expect(callback.mock.calls[callCount - 1][0]).toBe('flag');
        expect(callback.mock.calls[callCount - 1][1]).toBeTruthy();
        expect(callback.mock.calls[callCount - 1][2]).toBeFalsy();
    });
});