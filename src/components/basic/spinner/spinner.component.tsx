import React from 'react';
import { Text, View, Platform } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmSpinnerProps from './spinner.props';
import { DEFAULT_CLASS, WmSpinnerStyles } from './spinner.styles';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';
import LottieView from 'lottie-react-native';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import Color from "color";

export class WmSpinnerState extends BaseComponentState<WmSpinnerProps> {

}

export default class WmSpinner extends BaseComponent<WmSpinnerProps, WmSpinnerState, WmSpinnerStyles> {

  constructor(props: WmSpinnerProps) {
    super(props, DEFAULT_CLASS, new WmSpinnerProps());
  }

  private prepareIcon(props: any) {
    return (<WmIcon
      styles={this.styles.icon}
      iconclass={props.iconclass + ' fa-spin'} iconsize={props.iconsize}></WmIcon>);
  }

  private prepareImage(props: any) {
    return (<WmPicture
        styles={this.styles.image}
        picturesource={props.image}></WmPicture>);
  }

  private recursiveSearch = (obj: any, colors: any) => {
      Object.keys(obj).forEach(key => {
        let value = obj[key];
        let ind = Math.floor(Math.random() * (0 - colors.length ) + colors.length);
        if (key == "nm" && (value.toLowerCase().includes('fill ') || value.toLowerCase().includes('stroke '))) {
            if (obj["c"]["k"].length == 4 || (obj["c"]["k"].length ==3 && typeof obj["c"]["k"][0] == 'number')) {
                obj["c"]["k"] = colors[ind];
            }
            else {
                if (obj["c"]["k"]){
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

  private hexToRgb(hex: any) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255, 1] : null;
  }

  private addClasstoLottie(lottiePath: any) {
    let primaryColor = ThemeVariables.INSTANCE.primaryColor;
    let colors = [this.hexToRgb(primaryColor), 
      this.hexToRgb(Color(primaryColor).darken(0.2).hex().toString()), 
      this.hexToRgb(Color(primaryColor).darken(0.4).hex().toString()), 
      this.hexToRgb(Color(primaryColor).darken(0.6).hex().toString()), 
      this.hexToRgb(Color(primaryColor).darken(0.8).hex().toString())];
    return this.recursiveSearch(lottiePath.json, lottiePath.loader == 'circleSpinner' ? [colors[0]] : colors);
  }

  private prepareLottie(props: any) {
    const Lottie = Platform.OS == 'web' ? require('react-lottie-player') : null;
    return (
      Platform.OS == 'web' ? <Lottie animationData={this.addClasstoLottie(props.lottie)} loop={true} play={true} style={this.styles.lottie} /> : <LottieView
        source={this.addClasstoLottie(props.lottie)}
        autoPlay={true}
        loop={true}
        style={this.styles.lottie}
      />
    )
  }

  renderWidget(props: WmSpinnerProps) {
    return (
      <View style={this.styles.root}>
        {props.lottie ? this.prepareLottie(props) : props.image ? this.prepareImage(props) : this.prepareIcon(props)}
        {props.caption ? <Text style={this.styles.text}>{props.caption}</Text> : null}
      </View>
    );
  }
}
