import { waitFor } from '@testing-library/react-native';
import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { PropsProvider } from '@wavemaker/app-rn-runtime/core/props.provider';

// describe('Test PropsProvider', () => {
//     interface TestProps extends BaseProps {
//         flag : boolean
//     }
//     const initialProps = {
//         name: 'test',
//         flag: true
//     };
//     test('Instance needs to be created without any error', () => {
//         const instance = new PropsProvider<TestProps>(initialProps, () => {});
//         expect(instance).not.toBeNull();
//     });

//     test('Should return the initial property values', () => {
//         const instance = new PropsProvider<TestProps>(initialProps, () => {});
//         const props = instance.get();
//         expect(props).not.toBeNull();
//     });

//     test('check properties', () => {
//         const instance = new PropsProvider<TestProps>(initialProps, () => {});
//         const props = instance.get();
//         expect(props.flag).toBeTruthy();
//         //@ts-ignore
//         expect(props.unknown).toBeUndefined();
//     });

//     test('setting properties', () => {
//         const instance = new PropsProvider<TestProps>(initialProps, () => {});
//         const props = instance.get();
//         expect(props.flag).toBeTruthy();
//         props.flag = false;
//         expect(initialProps.flag).toBeTruthy();
//         expect(props.flag).toBeFalsy();
//         //@ts-ignore
//         props.unknown = 'unknown';
//         //@ts-ignore
//         expect(props.unknown).toBeUndefined();
//     });
    
//     test('getting callback on change of properties', () => {
//         const callback = jest.fn((name: string, $new: any, $old: any) => {});
//         const instance = new PropsProvider<TestProps>(initialProps, callback);
//         const props = instance.get();
//         let callCount = 2; // initialization callback for each property with value
//         expect(callback.mock.calls.length).toBe(callCount);
//         props.flag = false;
//         expect(callback.mock.calls.length).toBe(++callCount);
//         props.flag = false;
//         expect(callback.mock.calls.length).toBe(callCount);
//         props.flag = true;
//         expect(callback.mock.calls.length).toBe(++callCount);
//         expect(callback.mock.calls[callCount - 1][0]).toBe('flag');
//         expect(callback.mock.calls[callCount - 1][1]).toBeTruthy();
//         expect(callback.mock.calls[callCount - 1][2]).toBeFalsy();
//     });
// });


class TestProps extends BaseProps {
    name?: string;
    age?: number;
}

describe('PropsProvider', () => {
    let defaultProps: TestProps;
    let initProps: TestProps;
    let mockOnChange: jest.Mock;

    function createPropsProviderInstance(){
        const provider = new PropsProvider<TestProps>(defaultProps, initProps, mockOnChange);
        provider.check()
        return provider;
    }

    beforeEach(() => {
        defaultProps = { name: 'John', age: 30 };
        initProps = { name: 'Doe' };
        mockOnChange = jest.fn();
    });

    it('should initialize with default and init props', () => {
        const provider = createPropsProviderInstance()
        
        const propsProxy = provider.get();
        
        expect(propsProxy.name).toBe('Doe'); // from initProps
        expect(propsProxy.age).toBe(30);     // from defaultProps
    });

    it('should override properties and call onChange when set', () => {
        const provider = createPropsProviderInstance()

        const propsProxy = provider.get();
        
        // Override a property
        propsProxy.name = 'Jane';
        expect(mockOnChange).toHaveBeenCalledWith('name', 'Jane', 'Doe');
        expect(propsProxy.name).toBe('Jane');
    });

    it('should not call onChange if the value is the same', () => {
        const provider = createPropsProviderInstance()

        const propsProxy = provider.get();

        // Set the same value
        propsProxy.name = 'Doe';
        expect(mockOnChange.mock.calls.length).toBeLessThanOrEqual(2);
         // No change in value, onChange should not be called except during the initial setting of values
    }); 

    it('should allow setting default properties', () => {
        const provider = createPropsProviderInstance()

        // Set a default property
        provider.setDefault('name', 'DefaultName');
        const propsProxy = provider.get();
        
        expect(propsProxy.name).toBe('Doe'); // InitProps still override default
        provider.overrideProp('name', 'Jane');
        expect(propsProxy.name).toBe('Jane'); // overriddenProps should take precedence
    });

    it('should allow overriding properties directly', () => {
        const provider = createPropsProviderInstance()
        
        provider.overrideProp('age', 40);
        const propsProxy = provider.get();

        expect(propsProxy.age).toBe(40); // overriddenProps should return 40
    });

    it('should detect property changes when using check()', () => {
        const provider = createPropsProviderInstance()
        
        const hasChanged = provider.check({ name: 'NewName', age: 40 });
        
        expect(hasChanged).toBe(true); // Props have changed
        expect(mockOnChange).toHaveBeenCalledWith('name', 'NewName', 'Doe');
        expect(mockOnChange).toHaveBeenCalledWith('age', 40, 30);
    });

    it('should not detect changes if there are none during check()', () => {
        const provider = createPropsProviderInstance()
        
        const hasChanged = provider.check({ name: 'Doe', age: 30 });
        
        expect(hasChanged).toBe(false); // No changes detected
        expect(mockOnChange.mock.calls.length).toBeLessThanOrEqual(2);
    });

    it('should set properties using set() and call onChange', () => {
        const provider = createPropsProviderInstance()

        provider.set('name', 'NewName');
        const propsProxy = provider.get();

        expect(propsProxy.name).toBe('NewName');
        expect(mockOnChange).toHaveBeenCalledWith('name', 'NewName', 'Doe');
    });

    it('should return false for has() if the property is not in propertyNames', () => {
        const provider = createPropsProviderInstance()

        expect(provider.has('nonExistentProp')).toBe(false); // Property doesn't exist
    });

    it('should return true for has() if the property exists', () => {
        const provider = createPropsProviderInstance()

        expect(provider.has('name')).toBe(true); // Property exists
    });

    it('should handle multiple property changes in check()', () => {
        const provider = createPropsProviderInstance()

        const propsToCheck = { name: 'Alice', age: 35 };
        const hasChanged = provider.check(propsToCheck);

        expect(hasChanged).toBe(true); // Properties have changed
        expect(mockOnChange).toHaveBeenCalledWith('name', 'Alice', 'Doe');
        expect(mockOnChange).toHaveBeenCalledWith('age', 35, 30);
    });

    it('should handle undefined values correctly', () => {
        const provider = createPropsProviderInstance()
        const propsProxy = provider.get();
        
        // Set undefined value
        propsProxy.name = undefined;
        expect(mockOnChange).toHaveBeenCalledWith('name', undefined, 'Doe');
        expect(propsProxy.name).toBeUndefined();
    });

    it('should handle null values correctly', () => {
        const provider = createPropsProviderInstance()
        const propsProxy = provider.get();
        
        // Set null value
        propsProxy.name = null;
        expect(mockOnChange).toHaveBeenCalledWith('name', null, 'Doe');
        expect(propsProxy.name).toBeNull();
    });

    xit('should not fail when initProps is undefined', () => {
        const provider = new PropsProvider<TestProps>(defaultProps, undefined, mockOnChange);
        const propsProxy = provider.get();

        expect(propsProxy.name).toBe('John'); // Should fallback to defaultProps
        expect(propsProxy.age).toBe(30);     // defaultProp age
    });

    it('should not call onChange if no property has changed', () => {
        const provider = createPropsProviderInstance()
        provider.check({ name: 'Doe', age: 30 });

        expect(mockOnChange.mock.calls.length).toBeLessThanOrEqual(2);// No changes should trigger onChange
    });

    it('should not allow setting non-existent properties', () => {
        const provider = createPropsProviderInstance()
        const propsProxy = provider.get();

        propsProxy.nonExistentProp = 'someValue'; // Property does not exist
        expect(propsProxy.nonExistentProp).toBeUndefined(); // Should remain undefined
    });

    it('should reset the dirty flag after a check', () => {
        const provider = createPropsProviderInstance()

        provider.overrideProp('name', 'Alice');
        expect(provider.check()).toBe(true); // Changed -> dirty
        expect(provider.check()).toBe(false); // Reset -> clean after first check
    });

    it('should properly handle deeply nested objects', () => {
        const provider = createPropsProviderInstance()
        const propsProxy = provider.get();

        // propsProxy.nested.key = 'newKey';
        provider.set('newObj',{lname:'bob'})
        expect(mockOnChange).toHaveBeenCalledWith('newObj',{ lname: 'bob' },undefined);

        provider.overrideProp('newObj', { lname: 'bob the builder' });
        expect(provider.check()).toBe(true); // Changed -> dirty

        // expect(mockOnChange).toHaveBeenCalledWith('newObj', { lname: 'bob the builder' }, { lname: 'bob' });
    });

    it('should handle multiple overrides and track isDirty correctly', () => {
        const provider = createPropsProviderInstance()

        provider.overrideProp('name', 'Alice');
        provider.check({name:'Alice'})
        provider.overrideProp('age', 35);

        const hasChanged = provider.check({age:35});
        expect(hasChanged).toBe(true); // Multiple changes
        // expect(mockOnChange).toHaveBeenCalledWith('name', 'Alice', 'Doe');
        // expect(mockOnChange).toHaveBeenCalledWith('age', 35, 30);
    });

    it('should allow checking props without triggering onChange when values are unchanged', () => {
        const provider = createPropsProviderInstance()
        provider.check({ name: 'Doe', age: 30 });

        expect(provider.check({ name: 'Doe', age: 30 })).toBe(false); // No change
        expect(mockOnChange.mock.calls.length).toBeLessThanOrEqual(2);

    });

});

