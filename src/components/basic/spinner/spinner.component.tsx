import React from 'react';
import { Text, View, Platform } from 'react-native';
import Color from "color";
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmSpinnerProps from './spinner.props';
import { DEFAULT_CLASS, WmSpinnerStyles } from './spinner.styles';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';
import LottieView from 'lottie-react-native';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export class WmSpinnerState extends BaseComponentState<WmSpinnerProps> {

}

export default class WmSpinner extends BaseComponent<WmSpinnerProps, WmSpinnerState, WmSpinnerStyles> {

  constructor(props: WmSpinnerProps) {
    super(props, DEFAULT_CLASS, new WmSpinnerProps());
  }

  private prepareIcon(props: any) {
    return (<WmIcon
      id={this.getTestId('icon')}
      styles={this.styles.icon}
      iconclass={props.iconclass + ' fa-spin'} iconsize={props.iconsize}></WmIcon>);
  }

  private prepareImage(props: any) {
    return (<WmPicture
        id={this.getTestId('picture')}
        styles={this.styles.image}
        picturesource={props.image}></WmPicture>);
  }

  private recursiveSearch = (obj: any, colors: any) => {
    obj && Object.keys(obj).forEach(key => {
        let value = obj[key];
        let ind = Math.floor(Math.random() * (0 - colors.length ) + colors.length);
        if (key == "nm" && (value.toLowerCase().includes('fill ') || value.toLowerCase().includes('stroke '))) {
            if (obj["c"] && obj["c"]["k"] 
              && (obj["c"]["k"].length == 4
                || (obj["c"]["k"].length ==3 
                  && typeof obj["c"]["k"][0] == 'number'))) {
                obj["c"]["k"] = colors[ind];
            }
            else {
                if (obj["c"] && obj["c"]["k"]){
                    for (let shape in obj["c"]["k"]) {
                      if(obj["c"]["k"][shape] && obj["c"]["k"][shape]["s"]){
                        obj["c"]["k"][shape]["s"] = colors[ind];
                      }
                    }
                }
            }
        } else if (typeof value === 'object') {
            this.recursiveSearch(value, colors);
        }
      });
      return obj;
  };

  private toRgbArray(color: Color) {
    return [
      color.red()/255,
      color.green()/255,
      color.blue()/255,
      1
    ]
  }

  private addClasstoLottie(lottiePath: any) {
    let primaryColor = Color(ThemeVariables.INSTANCE.primaryColor);
    let colors = [this.toRgbArray(primaryColor), 
      this.toRgbArray(primaryColor.darken(0.2)), 
      this.toRgbArray(primaryColor.darken(0.4)), 
      this.toRgbArray(primaryColor.darken(0.6)), 
      this.toRgbArray(primaryColor.darken(0.8))];
    return this.recursiveSearch(lottiePath.json, lottiePath.loader == 'circleSpinner' ? [colors[0]] : colors);
  }

  private prepareLottie(props: any) {
    let Lottie = Platform.OS == 'web' ? require('react-lottie-player') : null;
    Lottie = Lottie?.default || Lottie;
    return (
      Platform.OS == 'web' ? <Lottie animationData={this.addClasstoLottie(props.lottie)} loop={true} play={true} style={this.styles.lottie} /> : <LottieView
        testID={this.getTestId('lottie')}
        source={this.addClasstoLottie(props.lottie)}
        resizeMode='contain'
        autoPlay={true}
        loop={true}
        style={this.styles.lottie}
      />
    )
  }

  renderWidget(props: WmSpinnerProps) {
    return (
      <View style={this.styles.root}>
        {this._background}
        {props.lottie ? this.prepareLottie(props) : props.image ? this.prepareImage(props) : this.prepareIcon(props)}
        {props.caption ? <Text {...this.getTestPropsForLabel()} style={this.styles.text}>{props.caption}</Text> : null}
      </View>
    );
  }
}
