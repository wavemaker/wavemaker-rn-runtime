import Color from "colorjs.io";

const ColorMixSpace = [
    //rectangular
    "srgb", "srgb-linear", "display-p3" , "a98-rgb" , "prophoto-rgb" , "rec2020" ,
    "lab" , "oklab" , "xyz" , "xyz-d50" , "xyz-d65" ,
    //triangle
    "hsl" , "hwb" , "lch" , "oklch"
];

const HueInterpolationMethod = [
    "shorter", "longer", "increasing", "decreasing"
];

interface ColorInterpolationMethod {
    space: string,
    hueInterpolationMethod: string 
}

interface ColorPercent {
    color: string;
    percent: number;
}

class ColorMix {
    static INSTANCE = new ColorMix();
        
    valueOf(expression: string) {
        const {
            colorInterpolationMethod, 
            colorPercent1,
            colorPercent2
        } = this.parse(expression);
        let p1 = colorPercent1.percent;
        let p2 = colorPercent2.percent;
        if (p1 && !p2) {
            p2 = 100 - p1;
        } else if (!p1 && p2) {
            p1 = 100 - p2;
        } else if (p1 + p2 > 100) {
            const sum = p1 + p2;
            p1 = p1 / sum * 100;
            p2 = p2 / sum * 100;
        }
        p1 = p1/ 100;
        p2 = p2/ 100;
        
        return new Color(colorPercent1.color).mix(colorPercent2.color, p2, {
            space: colorInterpolationMethod.space,
            hue: colorInterpolationMethod.hueInterpolationMethod as any
        }).to("srgb").toString({format: "hex"});
    }

    parseColorInterpolationMethod(expression: string): ColorInterpolationMethod {
        const splits = (expression.split(' ')) as string[];
        return {
            space: splits[1],
            hueInterpolationMethod: splits[2] || 'shorter'
        }
    }

    parseColorPercent(expression: string): ColorPercent {
        let colorCode = '';
        let percent = 0;
        if (expression.indexOf(')') > 0) {
            const splits = expression.split(')').map(s => s.trim());
            colorCode = splits[0] + ')';
            percent = splits[1] ? parseFloat((splits[1].replace('%', ''))) : 0;
        } else {
            const splits = (expression.split(' ')) as string[];
            colorCode = splits[0];
            percent = splits[1] ? parseFloat((splits[1].replace('%', ''))) : 0;
        }
        return {
            color: colorCode,
            percent: percent
        }
    }

    parse(expression: string): {
        colorInterpolationMethod : ColorInterpolationMethod,
        colorPercent1: ColorPercent,
        colorPercent2: ColorPercent
    } {
        const splits = expression.split(',').map(s => s.trim());
        return {
            colorInterpolationMethod: this.parseColorInterpolationMethod(splits[0]),
            colorPercent1: this.parseColorPercent(splits[1]),
            colorPercent2: this.parseColorPercent(splits[2])
        } as any;
    }

}

export default {
    "valueOf" : (expression: string) => {
        if (expression.startsWith("color-mix")) {
            expression = expression.substring("color-mix(".length, expression.length - 1);
        }
        return ColorMix.INSTANCE.valueOf(expression);
    }
};