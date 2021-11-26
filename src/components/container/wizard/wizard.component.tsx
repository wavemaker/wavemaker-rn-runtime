import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { isArray, merge } from 'lodash';
import { Divider } from 'react-native-paper';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmWizardProps from './wizard.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmWizardStyles } from './wizard.styles';
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
  private newIndex: number = 0;
  constructor(props: WmWizardProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmWizardProps());
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
    this.steps[this.newIndex] = step;
    this.forceUpdate();
  }

  updateCurrentStep(index: number, isDone = false) {
    this.newIndex = index;
    this.updateState({
      currentStep: index,
      isDone: isDone
    } as WmWizardState);
  }

  getColor(index: number) {
    return this.state.currentStep === index ? this.styles.activeStep.color: index < this.state.currentStep ? this.styles.doneStep.color : this.styles.step.color;
  }

  renderWizardHeader(item: any, index: number) {
    const isLastStep = index === this.numberOfSteps - 1;
    const isFirstStep = index === 0;
    return item.props.show != false ? (
      <View style={this.styles.headerWrapper} key={index+1}>
        <TouchableOpacity style={this.styles.stepWrapper}
                          onPress={this.updateCurrentStep.bind(this, index, false)} disabled={index >= this.state.currentStep}>
            <View style={[this.styles.step, { borderColor: this.getColor(index) }]}>
              {index >= this.state.currentStep && !this.state.isDone &&
                    <Text style={this.styles.stepCounter}>{index+1}</Text>}
              {(index < this.state.currentStep || this.state.isDone) &&
                    <WmIcon styles={merge({}, this.styles.stepIcon, {text: {color: isLastStep ? this.styles.activeStep.color : this.styles.doneStep.color}})}
                            iconclass={item.props.iconclass || 'wi wi-done'}></WmIcon>}
            </View>
          <Text style={[this.styles.stepTitle, {color: this.getColor(index), opacity: index === this.state.currentStep ? 1 : 0 }]}>
            {item.props.title || 'Step Title'}</Text>
        </TouchableOpacity>
        {this.numberOfSteps > 1 && <View style={[this.styles.stepConnector, { width: isFirstStep || isLastStep ? '50%' : '100%',
                                                      left: isFirstStep ? '50%': '0%'}]}></View>}
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
    const steps = props.children;
    this.numberOfSteps = isArray(steps) ? steps.length : 1;
    const activeStep = isArray(steps) ? steps[this.state.currentStep] : steps;
    const isSkippable = this.steps[this.state.currentStep] && this.steps[this.state.currentStep].props.enableskip;
    return (
      <View style={this.styles.root}>
        <View style={this.styles.wizardHeader}>
          {steps
            ? isArray(steps) && steps.length
              ? steps.map((item: any, index: any) => this.renderWizardHeader(item, index))
              : this.renderWizardHeader(steps, 0)
            : null}
        </View>
        <View style={this.styles.wizardBody} key={'wizardbody_'+this.state.currentStep}>
          <View>{activeStep}</View>
        </View>
        <View style={[this.styles.wizardFooter, {justifyContent: 'space-between'}]}>
          <View style={{
            alignItems: props.actionsalignment === 'right' ? 'flex-start' : 'flex-end',
            justifyContent: props.actionsalignment === 'right' ? 'flex-start' : 'flex-end'}}>
            {isSkippable &&
                <WmAnchor iconclass={'wi wi-chevron-right'} iconposition={'right'} caption={'Skip'}
                          styles={merge({}, this.styles.wizardActions, this.styles.skipLink)} onTap={this.onSkip.bind(this, steps)}></WmAnchor>
            }
          </View>
          <View style={[this.styles.buttonWrapper, {
            alignItems: props.actionsalignment === 'right' ? 'flex-end' : 'flex-start',
            justifyContent: props.actionsalignment === 'right' ? 'flex-end' : 'flex-start'}]}>
            {props.cancelable ?
                <WmButton caption={props.cancelbtnlabel} styles={merge({}, this.theme.getStyle('btn-default'), this.styles.wizardActions)} onTap={this.onCancel.bind(this)}></WmButton>
                : null
            }
            {this.state.currentStep > 0 &&
              <WmButton iconclass={'wi wi-chevron-left'} styles={merge({}, this.theme.getStyle('btn-default'), this.styles.wizardActions)} caption={props.previousbtnlabel}
                        onTap={this.onPrev.bind(this, steps)}></WmButton>
            }
            {(this.state.currentStep+1) < this.numberOfSteps &&
              <WmButton iconclass={'wi wi-chevron-right'} styles={merge({}, this.styles.wizardActions, this.theme.getStyle('btn-primary'), this.styles.nextButton)}
                        iconposition={'right'} caption={props.nextbtnlabel} onTap={this.onNext.bind(this, steps)}></WmButton>
            }
            {(this.state.currentStep+1) === this.numberOfSteps &&
              <WmButton iconclass={'wi wi-done'} styles={merge({}, this.styles.wizardActions, this.theme.getStyle('btn-success'), this.styles.doneButton)}
                        caption={props.donebtnlabel} onTap={this.onDone.bind(this)}></WmButton>
            }
          </View>
        </View>
      </View>
    );
  }
}
