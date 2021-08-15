import { parseInt } from 'lodash';
import moment from 'moment';
import { CURRENCY_INFO, Currency } from './constants/currency-constants';

export interface Formatter {
    format: (input: any, ...params: any) => any;
}

export class DateToStringFormatter implements Formatter {
    
    public format(input: Date, format: string): string {
        if (!input) {
            return '';
        }
        if (format === 'timestamp') {
            return input.getTime() + '';
        }
        format = format.replace(/d/g, 'D');
        return moment(input).format(format);
    }
}

export class PrependFormatter implements Formatter {
    
    public format(input: any, prefix: string): string {
        return (prefix || '') + (input !== null || input != undefined ? input : '');
    }
}

export class AppendFormatter implements Formatter {
    
    public format(input: any, suffix: string): string {
        return (input !== null || input != undefined ? input : '') + (suffix || '');
    }
}

export class NumberToStringFormatter implements Formatter {
    
    public format(input: number, fractionSize: number): string {
        return isNaN(input) ? '': input.toFixed(fractionSize).toLocaleLowerCase();
    }
}

export class CurrencyFormatter implements Formatter {
    
    public format(data: number, currencySymbol: string, fracSize: number) {
        const _currencySymbol = ((((CURRENCY_INFO as any)[currencySymbol]) || {})  as Currency).symbol || currencySymbol || '';
        let _val = new NumberToStringFormatter().format(data, fracSize);
        const isNegativeNumber = _val.startsWith('-');
        if (isNegativeNumber) {
            _val = _val.replace('-','');
        }
        return _val ? isNegativeNumber ? '-'+ _currencySymbol +_val :_currencySymbol + _val : '';
    }
}

export class TimeFromNowFormatter implements Formatter {
    public format(timestamp: Date) {
        return timestamp ? moment(timestamp).fromNow() : undefined;
    }
}

export class StringToNumberFormatter implements Formatter {
    public format(input: string) {
        return parseInt(input);
    }
}

export default new Map<string, Formatter>([
    ['numberToString', new NumberToStringFormatter()],
    ['prefix', new PrependFormatter()],
    ['suffix', new AppendFormatter()],
    ['stringToNumber', new StringToNumberFormatter()],
    ['timeFromNow', new TimeFromNowFormatter()],
    ['toDate', new DateToStringFormatter()],
    ['toCurrency', new CurrencyFormatter()]
]);