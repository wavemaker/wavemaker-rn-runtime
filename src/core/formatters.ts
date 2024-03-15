import { parseInt } from 'lodash';
import moment from 'moment';
import { CURRENCY_INFO, Currency } from './constants/currency-constants';
import { DateFormatter } from '@wavemaker/variables/src/types/date-formatter';
import injector from '@wavemaker/app-rn-runtime/core/injector';

export interface Formatter {
    format: (input: any, ...params: any) => any;
}

export class DateToStringFormatter implements DateFormatter {

    public format(input: Date, format: string): string {
        if (!input) {
            return '';
        }
        if (format === 'timestamp') {
            return input.getTime() + '';
        }
        format = format.replace(/d/g, 'D');
        const _moment = moment(input, [
            "M/D/YYYY", "M-D-YYYY", "M.D.YYYY",
            "M/DD/YYYY", "M-DD-YYYY", "M.DD.YYYY",
            "YYYY/M/D", "YYYY-M-D", "YYYY.M.D",
            "MM/D/YYYY", "MM-D-YYYY", "MM.D.YYYY",
            "M/D/YY", "M-D-YY", "M.D.YY", "D MMM YYYY",
            "MM/DD/YYYY", "MM-DD-YYYY", "MM.DD.YYYY",
            "YYYY/MM/DD", "YYYY-MM-DD", "YYYY.MM.DD",
            "MM/DD/YY", "MM-DD-YY", "MM.DD.YY", "DD MMM YYYY"
        ], true);
        return _moment.isValid() ? _moment.format(format) : input.toString();
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
        const i18nService = injector.I18nService.get();
        const selectedLocale = i18nService.getSelectedLocale();
        let formatCurrency = new Intl.NumberFormat(selectedLocale,{
            minimumFractionDigits: fractionSize,
            maximumFractionDigits: fractionSize,
        });
        return isNaN(input) ? '': formatCurrency.format(input);
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

const createFormatter = (key: string, defaultFormatter: Formatter) => {
    return {
        format: (input: any, ...params: any) => {
            const output = defaultFormatter.format(input, ...params);
            const customFormatter = formatters.get(`custom.${key}`);
            return customFormatter ? customFormatter.format(output, ...params): output;
        }
    };
};

const formatters = new Map<string, Formatter>([
    ['numberToString', createFormatter('numberToString' , new NumberToStringFormatter())],
    ['prefix', createFormatter('prefix', new PrependFormatter())],
    ['suffix', createFormatter('suffix', new AppendFormatter())],
    ['stringToNumber', createFormatter('stringToNumber',new StringToNumberFormatter())],
    ['timeFromNow', createFormatter('timeFromNow', new TimeFromNowFormatter())],
    ['toDate', createFormatter('toDate', new DateToStringFormatter())],
    ['toCurrency', createFormatter('toCurrency', new CurrencyFormatter())]
]);

export default formatters;