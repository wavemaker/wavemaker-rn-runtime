import BASE_THEME, {AllStyle} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from "@wavemaker/app-rn-runtime/styles/theme.variables";
import { VictoryAxisCommonProps, VictoryThemeDefinition } from "victory-core";
export type WmLineChartStyles = BaseStyles & {
};

export const DEFAULT_CLASS = 'app-line-chart';
export const DEFAULT_STYLES: WmLineChartStyles = defineStyles({
    root: {},
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
