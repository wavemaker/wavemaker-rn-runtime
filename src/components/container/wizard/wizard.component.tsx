import React from 'react';
import { Text, View, TouchableOpacity, Platform, TouchableWithoutFeedback } from 'react-native';
import { isArray, merge } from 'lodash';
import { BaseComponent, BaseComponentState, LifecycleListener } from '@wavemaker/app-rn-runtime/core/base.component';

import WmWizardProps from './wizard.props';
import { DEFAULT_CLASS, WmWizardStyles } from './wizard.styles';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmAnchor from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.component';
import WmWizardstep from './wizardstep/wizardstep.component';
import WmProgressCircle from '@wavemaker/app-rn-runtime/components/basic/progress-circle/progress-circle.component';
import WmPopover from '@wavemaker/app-rn-runtime/components/navigation/popover/popover.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';

export class WmWizardState extends BaseComponentState<WmWizardProps> {
  currentStep: number = 0;
  isDone: boolean = false;
}

export default class WmWizard extends BaseComponent<WmWizardProps, WmWizardState, WmWizardStyles> {
  private numberOfSteps: number = null as any;
  private steps = [] as WmWizardstep[];
  private popOverRef: WmPopover = null as any;

  private listener: LifecycleListener = {
    onComponentInit: (c) => {
      if (c instanceof WmPopover) {
        this.popOverRef = c;
      }
    }
  };

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

  renderMenuPopover(){
    const menuDataset = this.props.getmenudataexpression || ((item: any, index: number) => '') ;
    const Labels = this.steps.map((step: WmWizardstep) => step.state.props.title);
    return (
      <WmPopover
        id={this.getTestId('menu')}
        styles={this.styles.popover}
        contentanimation={'slideInDown'}
        caption={''}
        popoverheight={this.styles.popover.popover.height as string | number | undefined || null}
        popoverwidth={this.styles.popover.popover.width as string | number | undefined || null}
        listener={this.listener}
        iconclass={this.props.popovericonclass || 'fa fa-caret-down'}
        iconposition="right"
        type='dropdown'>
          <View style={this.styles.popover.popover}>
            {Labels.map((item: any, index: number) => {
              const currentMenuItem = index==this.state.currentStep;
              const caption = menuDataset({"count":this.steps.length}, index); 
              return (
              <TouchableWithoutFeedback key={'wizard_menu_item_'+index} onPress={()=>{this.popOverRef.hide();}}>
                <View style={[this.styles.stepMenu, currentMenuItem?this.styles.activeStepMenu:{}]}>
                  <WmIcon caption={caption} iconclass={currentMenuItem? "wi wi-radio-button-checked" : 'wi wi-radio-button-unchecked'} styles={currentMenuItem?this.styles.stepMenuActiveIcon:this.styles.stepMenuIcon}/>
                  <WmLabel caption={item} styles={currentMenuItem?this.styles.stepMenuActiveLabel:this.styles.stepMenuLabel}/>
                </View>
              </TouchableWithoutFeedback>
            )})}
          </View>
      </WmPopover>
    );
  }

  renderProgressCircleHeader(item: any, index: number) {
    const progressTitle = this.props.progresstitle || (index + 1 + '/' + this.steps.length);
    return (
      <View style={[this.styles.headerWrapper]} key={index + 1}>
        <View style={this.styles.stepWrapper}>
          <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', flexDirection:'row' }}>
            <WmProgressCircle minvalue={0} maxvalue={this.steps.length} datavalue={index + 1} captionplacement={'inside'} type={this.props.progresstype} title={progressTitle} subtitle={''} styles={this.styles.progressCircle} />
          </View>
        <View style={{ flex: 2, justifyContent: 'center', flexDirection: 'column' }}>
            <Text style={this.styles.stepTitle}>
              {item.props.title || 'Step Title'}</Text>
            <Text style={this.styles.stepSubTitle}>
              {item.props.subtitle || 'Step Sub Title'}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            {this.renderMenuPopover()}
          </View>
        </View>
      </View>
    );
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

  prev() {
    const index = this.state.currentStep;
    if (index <= 0) {
      return;
    }
    const currentStep = this.steps[index];
    currentStep.invokePrevCB(index);
    this.updateCurrentStep(index - 1);
  }

  next(eventName?: string) {
    const index = this.state.currentStep;
    if (index >= this.steps.length - 1) {
      return;
    }
    const currentStep = this.steps[index];
    if (eventName === 'skip') {
      currentStep.invokeSkipCB(index);
    } else if (currentStep.invokeNextCB(index) == false) {
      return;
    }
    this.updateCurrentStep(index + 1);
  }

  done($event: any) {
    if (this.state.currentStep !== this.steps.length - 1) {
      return;
    }
    this.updateState({
      isDone: true
    } as WmWizardState);
    this.invokeEventCallback('onDone', [$event, this.proxy]);
  }

  cancel() {
    this.invokeEventCallback('onCancel', [null, this.proxy]);
  }
  
  skip() {
    if ( this.steps[this.state.currentStep] 
      && this.steps[this.state.currentStep].props.enableskip) {
      this.next('skip');
    }
  }

  renderWidget(props: WmWizardProps) {
    this.numberOfSteps = this.steps.length;
    const activeStep = this.steps[this.state.currentStep];
    const isSkippable = this.steps[this.state.currentStep] && this.steps[this.state.currentStep].props.enableskip;
    const isProgressCircleHeader = this.state.props.classname?.includes('progress-circle-header');
    return (
      <View style={this.styles.root}>
        {this._background}
        <View style={this.styles.wizardHeader}>
          {activeStep && isProgressCircleHeader ? (this.renderProgressCircleHeader(activeStep, this.state.currentStep)) : (this.steps ? this.steps.map((step, i) => this.renderWizardHeader(step, i)) : null)}
        </View>
        <View style={this.styles.wizardBody}>
          {props.children}
        </View>
        <View style={[this.styles.wizardFooter,
          {flexDirection: props.actionsalignment === 'right' ? 'row-reverse': 'row'}]}>
          {(this.state.currentStep+1) === this.numberOfSteps &&
            <WmButton iconclass={'wm-sl-l sl-check'} styles={merge({}, this.styles.wizardActions, this.theme.getStyle('btn-default'), this.styles.doneButton)}
              id = {this.getTestId('donebtn')}  caption={props.donebtnlabel} onTap={this.done.bind(this)}></WmButton>
          }
          {(this.state.currentStep+1) < this.numberOfSteps &&
            <WmButton iconclass={'wi wi-chevron-right'} styles={merge({}, this.styles.wizardActions, this.theme.getStyle('btn-default'), this.styles.nextButton)}
                id = {this.getTestId('nextbtn')} 
                      iconposition={'right'} caption={props.nextbtnlabel} onTap={this.next.bind(this)}></WmButton>
          }
          {this.state.currentStep > 0 &&
            <WmButton iconclass={'wi wi-chevron-left'} styles={merge({}, this.theme.getStyle('btn-default'), this.styles.wizardActions, this.styles.prevButton)} caption={props.previousbtnlabel}
                id = {this.getTestId('prevbtn')}
                onTap={this.prev.bind(this)}></WmButton>
          }
          {props.cancelable ?
              <WmButton id = {this.getTestId('cancelbtn')}  caption={props.cancelbtnlabel} styles={merge({}, this.theme.getStyle('btn-default'), this.styles.wizardActions, this.styles.cancelButton)} onTap={this.cancel.bind(this)}></WmButton>
              : null
          }
          {isSkippable &&
              <WmAnchor iconclass={'wi wi-chevron-right'} iconposition={'right'} caption={'Skip'}
                id = {this.getTestId('skip')}        
                styles={merge({}, this.styles.wizardActions, this.styles.skipLink)} onTap={this.skip.bind(this)}></WmAnchor>
          }
        </View>
      </View>
    );
  }
}
