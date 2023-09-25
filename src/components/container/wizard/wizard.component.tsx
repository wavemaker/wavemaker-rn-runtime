import React from 'react';
import { Text, View, TouchableOpacity, Platform } from 'react-native';
import { isArray, merge } from 'lodash';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmWizardProps from './wizard.props';
import { DEFAULT_CLASS, WmWizardStyles } from './wizard.styles';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmAnchor from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.component';
import WmWizardstep from './wizardstep/wizardstep.component';

export class WmWizardState extends BaseComponentState<WmWizardProps> {
  currentStep: number = 0;
  isDone: boolean = false;
}

export default class WmWizard extends BaseComponent<WmWizardProps, WmWizardState, WmWizardStyles> {
  private numberOfSteps: number = null as any;
  private steps = [] as WmWizardstep[];
  constructor(props: WmWizardProps) {
    super(props, DEFAULT_CLASS, new WmWizardProps());
    const steps = props.children;
    let defaultStepIndex = 0;
    if (isArray(steps) && props.defaultstep) {
      steps.map((item: any, index: any) => {
        if (props.defaultstep === item.props.name) {
          defaultStepIndex = index;
        }
      })
    }
    this.updateCurrentStep(defaultStepIndex);
  }

  addWizardStep(step: WmWizardstep) {
    this.steps[step.props.index] = step;
    this.forceUpdate();
  }

  componentDidMount() {
    super.componentDidMount();
    this.showActiveStep();
  }

  showActiveStep() {
    this.steps[this.state.currentStep]?.setActive();
  }

  updateCurrentStep(index: number, isDone = false) {
    this.steps[this.state.currentStep]?.setInActive();
    this.updateState({
      currentStep: index,
      isDone: isDone
    } as WmWizardState, () => this.showActiveStep());
  }

  getStepStyle(index: number) {
    const style = [this.styles.step];
    if (this.state.isDone || index < this.state.currentStep) {
      style.push(this.styles.doneStep);
    } else if (this.state.currentStep === index) {
      style.push(this.styles.activeStep);
    }
    return style;
  }

  renderWizardHeader(item: any, index: number) {
    const isLastStep = index === this.numberOfSteps - 1;
    const isFirstStep = index === 0;
    const isActiveStep = index === this.state.currentStep;
    const isNumberTextLayout = this.state.props.classname === 'number-text-inline';
    return item.props.show != false ? (
      <View style={[this.styles.headerWrapper, isNumberTextLayout ?
        {paddingRight: isActiveStep ? 0 : 5, paddingLeft: index === this.state.currentStep + 1 ? 0 : 5}: {}]} key={index+1}>
        <TouchableOpacity style={this.styles.stepWrapper}
                          onPress={this.updateCurrentStep.bind(this, index, false)} disabled={index >= this.state.currentStep}>
            <View style={this.getStepStyle(index)}>
              {index >= this.state.currentStep && !this.state.isDone &&
                <Text style={isActiveStep ? this.styles.activeStep : this.styles.stepCounter}>{index+1}</Text>}
              {(index < this.state.currentStep || this.state.isDone) &&
                <WmIcon styles={merge({}, this.styles.stepIcon, {icon: {color: this.styles.activeStep.color}})}
                        iconclass={item.props.iconclass || 'wm-sl-l sl-check'}></WmIcon>}
            </View>
            {((isNumberTextLayout && isActiveStep) || !isNumberTextLayout) &&
              <Text style={this.styles.stepTitle}>
              {item.props.title || 'Step Title'}</Text> }
            {this.numberOfSteps > 1 && isActiveStep &&
              <View style={[this.styles.numberTextStepConnector, {width: isLastStep ? 0 : 50}]}></View>}
        </TouchableOpacity>
        {this.numberOfSteps > 1 && <View style={[this.styles.stepConnector, { width: isFirstStep || isLastStep ? '50%' : '100%',
                                                      left: Platform.OS == "web"?(!this.isRTL && isFirstStep) || (this.isRTL && isLastStep) ? '50%': '0%': isFirstStep ? '50%': '0%'}]}></View>}
      </View>
    ) : null;
  }

  onPrev(steps: any) {
    const index = this.state.currentStep;
    const currentStep = this.steps[index];
    currentStep.invokePrevCB(index);
    this.updateCurrentStep(index - 1);
  }

  onNext(steps: any, eventName?: string) {
    const index = this.state.currentStep;
    const currentStep = this.steps[index];
    if (eventName === 'skip') {
      currentStep.invokeSkipCB(index);
    } else {
      currentStep.invokeNextCB(index);
    }
    this.updateCurrentStep(index + 1);
  }

  onDone($event: any) {
    this.updateState({
      isDone: true
    } as WmWizardState);
    this.invokeEventCallback('onDone', [$event, this.proxy]);
  }

  onCancel() {
    this.invokeEventCallback('onCancel', [null, this.proxy]);
  }
  onSkip(steps: any) {
    this.onNext(steps, 'skip');
  }

  renderWidget(props: WmWizardProps) {
    this.numberOfSteps = this.steps.length;
    const activeStep = this.steps[this.state.currentStep];
    const isSkippable = this.steps[this.state.currentStep] && this.steps[this.state.currentStep].props.enableskip;
    return (
      <View style={this.styles.root}>
        {this._background}
        <View style={this.styles.wizardHeader}>
          {this.steps ? this.steps.map((step, i) => this.renderWizardHeader(step, i)) : null}
        </View>
        <View style={this.styles.wizardBody}>
          {props.children}
        </View>
        <View style={[this.styles.wizardFooter,
          {flexDirection: props.actionsalignment === 'right' ? 'row-reverse': 'row'}]}>
          {(this.state.currentStep+1) === this.numberOfSteps &&
            <WmButton iconclass={'wm-sl-l sl-check'} styles={merge({}, this.styles.wizardActions, this.theme.getStyle('btn-success'), this.styles.doneButton)}
                      caption={props.donebtnlabel} onTap={this.onDone.bind(this)}></WmButton>
          }
          {(this.state.currentStep+1) < this.numberOfSteps &&
            <WmButton iconclass={'wi wi-chevron-right'} styles={merge({}, this.styles.wizardActions, this.theme.getStyle('btn-primary'), this.styles.nextButton)}
                      iconposition={'right'} caption={props.nextbtnlabel} onTap={this.onNext.bind(this, this.steps)}></WmButton>
          }
          {this.state.currentStep > 0 &&
            <WmButton iconclass={'wi wi-chevron-left'} styles={merge({}, this.theme.getStyle('btn-default'), this.styles.wizardActions, this.styles.prevButton)} caption={props.previousbtnlabel}
                      onTap={this.onPrev.bind(this, this.steps)}></WmButton>
          }
          {props.cancelable ?
              <WmButton caption={props.cancelbtnlabel} styles={merge({}, this.theme.getStyle('btn-default'), this.styles.wizardActions, this.styles.cancelButton)} onTap={this.onCancel.bind(this)}></WmButton>
              : null
          }
          {isSkippable &&
              <WmAnchor iconclass={'wi wi-chevron-right'} iconposition={'right'} caption={'Skip'}
                        styles={merge({}, this.styles.wizardActions, this.styles.skipLink)} onTap={this.onSkip.bind(this, this.steps)}></WmAnchor>
          }
        </View>
      </View>
    );
  }
}
