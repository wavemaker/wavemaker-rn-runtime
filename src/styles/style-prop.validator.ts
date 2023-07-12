import {isNumber, isNil, isString } from 'lodash-es';
import * as Font from 'expo-font';

const isColor = (c: string) => true;
const isStringOrNumber = (v: any) => isNumber(v) || isString(v);
const isIn = (...arr: any) => {
    const obj = {};
    arr.forEach((v: any) => {
        (obj as any)[v] = true;
    })
    return (k: any) => (obj as any)[k] === true ;
};

const STYLE_PROP_TYPE_INFO = {
    alignContent: {
        isValid: isIn('flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around'),
        ref: 'https://reactnative.dev/docs/layout-props#aligncontent'
    },
    alignItems: {
        isValid: isIn('flex-start', 'flex-end', 'center', 'stretch', 'baseline'),
        ref: 'https://reactnative.dev/docs/layout-props#alignitems'
    },
    alignSelf: {
        isValid: isIn('auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline'),
        ref: 'https://reactnative.dev/docs/layout-props#alignself'
    },
    aspectRatio: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#aspectratio'
    },
    backfaceVisibility: {
        isValid: isIn('visible', 'hidden'),
        ref: 'https://reactnative.dev/docs/image-style-props#backfacevisibility'
    },
    backgroundColor: {
        isValid: isColor,
        ref: 'https://reactnative.dev/docs/image-style-props#backgroundcolor'
    },
    backgroundImage: {
        isValid: isString,
        ref: 'http://www.wavemakeronline.com/app-runtime/latest/rn/style-docs/widgets/view'
    },
    borderBottomColor: {
        isValid: isColor,
        ref: 'https://reactnative.dev/docs/view-style-props#borderbottomcolor'
    },
    borderBottomEndRadius: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/view-style-props#borderbottomendradius'
    },
    borderBottomLeftRadius: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/image-style-props#borderbottomleftradius'
    },
    backgroundPosition: {
        isValid: isStringOrNumber,
        ref: 'http://www.wavemakeronline.com/app-runtime/latest/rn/style-docs/widgets/view'
    },
    backgroundRepeat: {
        isValid: isIn('repeat', 'repeat-x', 'repeat-y', 'no-repeat'),
        ref: 'http://www.wavemakeronline.com/app-runtime/latest/rn/style-docs/widgets/view'
    },
    backgroundSize: {
        isValid: isStringOrNumber,
        ref: 'http://www.wavemakeronline.com/app-runtime/latest/rn/style-docs/widgets/view'
    },
    borderBottomRightRadius: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/image-style-props#borderbottomrightradius'
    },
    borderBottomStartRadius: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/view-style-props#borderbottomstartradius'
    },
    borderBottomWidth: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/layout-props#borderbottomwidth'
    },
    borderColor: {
        isValid: isColor,
        ref: 'https://reactnative.dev/docs/image-style-props#bordercolor'
    },
    borderCurve: {
        isValid: isIn('circular', 'continuous'),
        ref: 'https://reactnative.dev/docs/view-style-props#bordercurve-ios'
    },
    borderEndColor: {
        isValid: isColor,
        ref: 'https://reactnative.dev/docs/view-style-props#borderendcolor'
    },
    borderEndWidth: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/layout-props#borderendwidth'
    },
    borderLeftColor: {
        isValid: isColor,
        ref: 'https://reactnative.dev/docs/view-style-props#borderleftcolor'
    },
    borderLeftWidth: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/layout-props#borderleftwidth'
    },
    borderRadius: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/image-style-props#borderradius'
    },
    borderRightColor: {
        isValid: isColor,
        ref: 'https://reactnative.dev/docs/view-style-props#borderrightcolor'
    },
    borderRightWidth: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/layout-props#borderrightwidth'
    },
    borderStartColor: {
        isValid: isColor,
        ref: 'https://reactnative.dev/docs/view-style-props#borderstartcolor'
    },
    borderStartWidth: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/layout-props#borderstartwidth'
    },
    borderStyle: {
        isValid: isIn('solid', 'dotted', 'dashed'),
        ref: 'https://reactnative.dev/docs/view-style-props#borderstyle'
    },
    borderTopEndRadius: {
        isValid: isColor,
        ref: 'https://reactnative.dev/docs/view-style-props#bordertopendradius'
    },
    borderTopLeftRadius: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/image-style-props#bordertopleftradius'
    },
    borderTopRightRadius: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/image-style-props#bordertoprightradius'
    },
    borderTopStartRadius: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/view-style-props#bordertopstartradius'
    },
    borderTopColor: {
        isValid: isColor,
        ref: 'https://reactnative.dev/docs/layout-props#bordertopwidth'
    },
    borderTopWidth: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/layout-props#bordertopwidth'
    },
    borderWidth: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/image-style-props#borderwidth'
    },
    bottom: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#bottom'
    },
    color: {
        isValid: isColor,
        ref: 'https://reactnative.dev/docs/text-style-props#color'
    },
    columnGap: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/layout-props#columngap'
    },
    direction: {
        isValid: isIn('inherit', 'LTR', 'RTL'),
        ref: 'https://reactnative.dev/docs/layout-props#direction'
    },
    display: {
        isValid: isIn('none', 'flex'),
        ref: 'https://reactnative.dev/docs/layout-props#display'
    },
    elevation: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/view-style-props#elevation-android'
    },
    end: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#end'
    },
    flex: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/layout-props#flex'
    },
    flexBasis: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#flexbasis'
    },
    flexDirection: {
        isValid: isIn('column', 'row', 'column-reverse', 'row-reverse'),
        ref: 'https://reactnative.dev/docs/layout-props#flexdirection'
    },
    flexGrow: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/layout-props#flexgrow'
    },
    flexShrink: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/layout-props#flexshrink'
    },
    flexWrap: {
        isValid: isIn('wrap', 'nowrap', 'wrap-reverse'),
        ref: 'https://reactnative.dev/docs/layout-props#flexwrap'
    },
    fontFamily: {
        isValid: (v: string) => Font.isLoaded(v),
        errorMsg: (v: string) => `Font '${v}' is not loaded. Font family names are case-sensitive. Please add font either in theme or app.`,
        ref: 'https://reactnative.dev/docs/text-style-props#fontfamily'
    },
    fontSize: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/text-style-props#fontsize'
    },
    fontStyle: {
        isValid: isIn('normal', 'italic'),
        ref: 'https://reactnative.dev/docs/text-style-props#fontstyle'
    },
    fontVariant: {
        isValid: (v: any) => isIn('small-caps', 'oldstyle-nums', 'lining-nums', 'tabular-nums', 'proportional-nums') || isString(v),
        ref: 'https://reactnative.dev/docs/text-style-props#fontvariant'
    },
    fontWeight: {
        isValid: (v: any) => isIn('normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900') || isNumber(v),
        ref: 'https://reactnative.dev/docs/text-style-props#fontweight'
    },
    gap: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/layout-props#gap'
    },
    height: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#height'
    },
    justifyContent: {
        isValid: isIn('flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'),
        ref: 'https://reactnative.dev/docs/layout-props#justifycontent'
    },
    left: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#left'
    },
    letterSpacing: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/text-style-props#letterspacing'
    },
    lineHeight: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/text-style-props#lineheight'
    },
    margin: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#margin'
    },
    marginBottom: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#marginbottom'
    },
    marginEnd: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#marginend'
    },
    marginHorizontal: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#marginhorizontal'
    },
    marginLeft: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#marginleft'
    },
    marginRight: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#marginright'
    },
    marginStart: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#marginstart'
    },
    marginTop: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#margintop'
    },
    marginVertical: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#marginvertical'
    },
    maxHeight: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#maxheight'
    },
    maxWidth: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#maxwidth'
    },
    minHeight: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#minheight'
    },
    minWidth: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#minwidth'
    },
    opacity: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/image-style-props#opacity'
    },
    overflow: {
        isValid: isIn('visible', 'hidden', 'scroll'),
        ref: 'https://reactnative.dev/docs/image-style-props#overflow'
    },
    overlayColor: {
        isValid: isColor,
        ref: 'https://reactnative.dev/docs/image-style-props#overlaycolor-android'
    },
    padding: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#padding'
    },
    paddingBottom: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#paddingbottom'
    },
    paddingEnd: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#paddingend'
    },
    paddingHorizontal: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#paddinghorizontal'
    },
    paddingLeft: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#paddingleft'
    },
    paddingRight: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#paddingright'
    },
    paddingStart: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#paddingstart'
    },
    paddingTop: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#paddingtop'
    },
    paddingVertical: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#paddingvertical'
    },
    pointerEvents: {
        isValid: isIn('auto', 'box-none', 'box-only', 'none' ),
        ref: 'https://reactnative.dev/docs/view-style-props#pointerevents'
    },
    position: {
        isValid: isIn('absolute', 'relative', 'fixed'),
        ref: 'https://reactnative.dev/docs/layout-props#position'
    },
    resizeMode: {
        isValid: isIn('cover', 'contain', 'stretch', 'repeat', 'center'),
        ref: 'https://reactnative.dev/docs/image-style-props#resizemode'
    },
    right: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#right'
    },
    rowGap: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/layout-props#rowgap'
    },
    shadowColor: {
        isValid: isColor,
        ref: 'https://reactnative.dev/docs/shadow-props#shadowcolor'
    },
    shadowOpacity: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/shadow-props#shadowopacity-ios'
    },
    shadowRadius: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/shadow-props#shadowradius-ios'
    },
    start: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#start'
    },
    textAlign: {
        isValid: isIn('auto', 'left', 'right', 'center', 'justify'),
        ref: 'https://reactnative.dev/docs/text-style-props#textalign'
    },
    textAlignVertical: {
        isValid: isIn('auto', 'top', 'bottom', 'center'),
        ref: 'https://reactnative.dev/docs/text-style-props#textalignvertical-android'
    },
    textDecorationColor: {
        isValid: isColor,
        ref: 'https://reactnative.dev/docs/text-style-props#textdecorationcolor-ios'
    },
    textDecorationLine: {
        isValid: isIn('none', 'underline', 'line-through', 'underline line-through'),
        ref: 'https://reactnative.dev/docs/text-style-props#textdecorationline'
    },
    textDecorationStyle: {
        isValid: isIn('solid', 'double', 'dotted', 'dashed'),
        ref: 'https://reactnative.dev/docs/text-style-props#textdecorationstyle-ios'
    },
    textShadowColor: {
        isValid: isColor,
        ref: 'https://reactnative.dev/docs/text-style-props#textshadowcolor'
    },
    textShadowRadius: {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/text-style-props#textshadowoffset'
    },
    textTransform: {
        isValid: isIn('none', 'uppercase', 'lowercase', 'capitalize'),
        ref: 'https://reactnative.dev/docs/text-style-props#texttransform'
    },
    tintColor: {
        isValid: isColor,
        ref: 'https://reactnative.dev/docs/image-style-props#tintcolor'
    },
    top: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#top'
    },
    userSelect: {
        isValid: isIn('text', 'none'),
        ref: 'valid values to user-select are text, none.'
    },
    verticalAlign: {
        isValid: isIn('auto', 'top', 'bottom', 'middle'),
        ref: 'https://reactnative.dev/docs/text-style-props#verticalalign-android'
    },
    width: {
        isValid: isStringOrNumber,
        ref: 'https://reactnative.dev/docs/layout-props#width'
    },
    writingDirection: {
        isValid: isIn('auto', 'ltr', 'rtl'),
        ref: 'https://reactnative.dev/docs/text-style-props#writingdirection-ios'
    },
    zIndex:  {
        isValid: isNumber,
        ref: 'https://reactnative.dev/docs/layout-props#zindex'
    },
};

export const getStyleReference = (name: string) => {
    const info = (STYLE_PROP_TYPE_INFO as any)[name];
    return !info || info.ref;
};

export const isValidStyleProp = (name: string, value: any) => {
    const info = (STYLE_PROP_TYPE_INFO as any)[name];
    return name?.trim().startsWith('__') || (info && info.isValid(value));
};

export const getErrorMessage = (name: string, value: any) => {
    const info = (STYLE_PROP_TYPE_INFO as any)[name];
    name = name.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
    if (info) {
        if (info.errorMsg) {
            return info.errorMsg(value);
        } else {
            return `'${value}' is not a valid value to '${name}'.`;
        }
    }
    return `'${name}' is not a supported style property in one or all Native Platforms.`
};