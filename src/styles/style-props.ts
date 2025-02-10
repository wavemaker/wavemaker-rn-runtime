export class StyleProps {
    backgroundimage?: any;
    backgroundsize?: any;
    backgroundrepeat?: any;
    backgroundresizemode?: any;
    backgroundposition?: any;
    backgroundcolor?: any;
    bordercolor?: any;
    borderradius?: any;
    borderstyle?: any;
    borderwidth?: any;
    borderbottomwidth?: any;
    borderleftwidth?: any;
    borderrightwidth?: any;
    bordertopwidth?: any;
    color?: any;
    display?: any;
    fontsize?: any;
    fontfamily?: any;
    fontstyle?: any;
    fontvariant?: any;
    fontweight?: any;
    height?: any;
    horizontalalign?: any;
    lineheight?: any;
    margin?: any;
    marginbottom?: any;
    marginleft?: any;
    marginright?: any;
    margintop?: any;
    opacity?: any;
    overflow?: any;
    padding?: any;
    paddingbottom?: any;
    paddingleft?: any;
    paddingright?: any;
    paddingtop?: any;
    textalign?: any;
    textdecoration?: any;
    verticalalign?: any;
    width?: any;
    zindex?: any;
    top?: number | string;
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
}

const styleMapping = {
    backgroundimage: 'backgroundImage',
    backgroundsize: 'backgroundSize',
    backgroundrepeat: 'backgroundRepeat',
    backgroundresizemode: 'backgroundResizeMode',
    backgroundposition: 'backgroundPosition',
    backgroundcolor: 'backgroundColor',
    bordercolor: 'borderColor',
    borderradius: 'borderRadius',
    borderstyle: 'borderStyle',
    borderwidth: 'borderWidth',
    borderbottomwidth: 'borderBottomWidth',
    borderleftwidth: 'borderLeftWidth',
    borderrightwidth: 'borderRightWidth',
    bordertopwidth: 'borderTopWidth',
    color: 'color',
    display: 'display',
    fontsize: 'fontSize',
    fontfamily: 'fontFamily',
    fontstyle: 'fontStyle',
    fontvariant: 'fontVariant',
    fontweight: 'fontWeight',
    height: 'height',
    //horizontalalign: any;
    lineheight: 'lineHeight',
    margin: 'margin',
    marginbottom: 'marginBottom',
    marginleft: 'marginLeft',
    marginright: 'marginRight',
    margintop: 'marginTop',
    opacity: 'opacity',
    overflow: 'overflow',
    padding: 'padding',
    paddingbottom: 'paddingBottom',
    paddingleft: 'paddingLeft',
    paddingright: 'paddingRight',
    paddingtop: 'paddingTop',
    textalign: 'textAlign',
    textdecoration: 'textDecoration',
    verticalalign: 'verticalAlign',
    width: 'width',
    zindex: 'zindex',
    top: 'top',
    bottom: 'bottom',
    left: 'left',
    right: 'right'
};

export const getStyleName = (name: string) => (styleMapping as any)[name];
