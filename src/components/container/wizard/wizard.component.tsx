import React from 'react';
import { Text, View, TouchableOpacity, Platform, TouchableWithoutFeedback, DimensionValue } from 'react-native';
import { isArray, merge } from 'lodash';
import {  BaseComponent, BaseComponentState, LifecycleListener } from '@wavemaker/app-rn-runtime/core/base.component';

import WmWizardProps from './wizard.props';
import { DEFAULT_CLASS, WmWizardStyles } from './wizard.styles';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmAnchor from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.component';
import WmWizardstep from './wizardstep/wizardstep.component';
import WmProgressCircle from '@wavemaker/app-rn-runtime/components/basic/progress-circle/progress-circle.component';
import WmPopover from '@wavemaker/app-rn-runtime/components/navigation/popover/popover.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';

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
  }

  updateDefaultStep() {
    const steps = this.steps;
    const props = this.props;
    let defaultStepIndex = 0;
    if (isArray(steps) && props.defaultstep) {
      steps && steps.map((item: any, index: any) => {
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
    if (this.props.defaultstep && this.props.defaultstep != 'none') {
      this.updateDefaultStep();
    }
  }

  componentDidUpdate(prevProps: Readonly<WmWizardProps>, prevState: Readonly<WmWizardState>, snapshot?: any): void {
    super.componentDidUpdate && super.componentDidUpdate(prevProps, prevState, snapshot);
    // * when a variable is bind to default step
    if (this.props.defaultstep && prevProps.defaultstep !== this.props.defaultstep) {
      this.updateDefaultStep();
    }
  }

  showActiveStep() {
    this.steps[this.state.currentStep]?.setActive();
  }

  updateCurrentStep(index: number, isDone = false) {
    const lastStep = this.state.currentStep;
    let nextStep = index
    this.steps[this.state.currentStep]?.setInActive();

    // check for next available step if next or prev steps show prop is false
    if(this.steps[nextStep]?.state && !this.steps[nextStep].state.props.show){
      if(lastStep < nextStep){
        for(let i = nextStep + 1; i < this.steps.length; i++){
          if(this.steps[i].state.props.show) {
            nextStep = i;
            break;
          }
        }
      }else if(lastStep > nextStep) {
        for(let i = nextStep - 1; i >= 0; i--){
          if(this.steps[i].state.props.show) {
            nextStep = i;
            break;
          }
        }
      }
    }

    this.updateState({
      currentStep: nextStep,
      isDone: isDone
    } as WmWizardState, () => {
      this.showActiveStep();
      if (lastStep !== nextStep) {
        this.invokeEventCallback('onChange', [null, this.proxy, nextStep + 1, lastStep + 1]);
      }
    });
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
                  <WmIcon id={this.getTestId('icon')} caption={caption} iconclass={currentMenuItem? "wi wi-radio-button-checked" : 'wi wi-radio-button-unchecked'} styles={currentMenuItem?this.styles.stepMenuActiveIcon:this.styles.stepMenuIcon}/>
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
            <WmProgressCircle id={this.getTestId('progress')} minvalue={0} maxvalue={this.steps.length} datavalue={index + 1} captionplacement={'inside'} type={this.props.progresstype} title={progressTitle} subtitle={''} styles={this.styles.progressCircle}/>
          </View>
        <View style={this.styles.stepTitleWrapper}>
            <Text style={this.styles.stepTitle} {...this.getTestPropsForLabel('step' + (index + 1) + '_title')}>
              {item.props.title || 'Step Title'}</Text>
            <Text style={this.styles.stepSubTitle} {...this.getTestPropsForLabel('step' + (index + 1)+ '_subtitle')}>
              {item.props.subtitle || 'Step Sub Title'}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', flex: 1 }}>
            {this.renderMenuPopover()}
          </View>
        </View>
      </View>
    );
  }

  stepConnectorWidth(isFirstOrLastConnector: boolean, stepIndex: number): DimensionValue {
    if(stepIndex === this.lastStepIndex() || stepIndex === this.firstStepIndex()){
      return '50%';
    }
    return isFirstOrLastConnector ? '50%' : '100%';
  }

  renderWizardHeader(item: any, index: number) {
    const isLastStep = index === this.lastStepIndex();
    const isFirstStep = index === this.firstStepIndex();
    const isActiveStep = index === this.state.currentStep;
    const isNumberTextLayout = this.state.props.classname === 'number-text-inline';
    const wizardStepCountVisibility = (index >= this.state.currentStep && !this.state.isDone) || !this.state.currentStep
    return item.state.props.show !== false ? (
      <View 
        style={[
          this.styles.headerWrapper, isNumberTextLayout ?
          {paddingRight: isActiveStep ? 0 : 5, paddingLeft: index === this.state.currentStep + 1 ? 0 : 5}: {}
        ]} 
        key={index+1}
      >
        <TouchableOpacity 
          style={this.styles.stepWrapper}
          onPress={this.updateCurrentStep.bind(this, index, false)} disabled={index >= this.state.currentStep || !this.state.props.headernavigation}
          accessibilityRole='header'
        >
            {!this._showSkeleton ? 
              <View style={this.getStepStyle(index)} {...this.getTestPropsForAction('step'+index)}>
                { wizardStepCountVisibility &&
                  <Text 
                    style={
                      isActiveStep ? [this.styles.activeStep, this.styles.activeStepCounter] : this.styles.stepCounter} 
                      {...this.getTestPropsForLabel('step' + (index + 1) + '_indicator')
                    }
                  >
                    {index+1}
                  </Text>
                }
                {(index < this.state.currentStep || this.state.isDone) &&
                  <WmIcon 
                    id={this.getTestId('status')} 
                    styles={isActiveStep ? merge({}, this.styles.stepIcon, {icon: {color: this.styles.activeStep.color}}) : this.styles.stepIcon}
                    iconclass={item.state.props.iconclass || 'wm-sl-l sl-check'}
                  ></WmIcon>
                }
              </View> : 
              <WmLabel showskeleton={true} styles={{root: {...this.getStepStyle(index)[0]}}}/>
            }
            {(isActiveStep) &&
              <View style={this.styles.stepTitleWrapper}>
                <Text style={this.styles.stepTitle} {...this.getTestPropsForLabel('step' + (index + 1) + '_title')}>
                  {item.state.props.title || 'Step Title'}
                </Text> 
                <Text style={this.styles.stepSubTitle} {...this.getTestPropsForLabel('step' + (index + 1) + '_subtitle')}>
                  {item.state.props.subtitle}
                </Text> 
              </View>
            }
            {this.numberOfSteps > 1 && isActiveStep &&
              <View style={[this.styles.numberTextStepConnector, {width: isLastStep ? 0 : 50}]}></View>}
        </TouchableOpacity>
        {this.getTotalVisibleSteps() > 1 &&
          item.state.props.show &&
          <View 
            style={[
              this.styles.stepConnector, 
              {
                width: this.stepConnectorWidth(isFirstStep || isLastStep, index),
                left: Platform.OS === "web" ?
                  (!this.isRTL && isFirstStep) || (this.isRTL && isLastStep) ? 
                  '50%': '0%': isFirstStep ? '50%': '0%'
              }
            ]}
          ></View>
        }
      </View>
    ) : null;
  }

  prev() {
    const index = this.state.currentStep;
    if (index <= 0 || this.props.skipdefaultprevious) {
      console.log(`skipping previous`)
      return;
    }
    const currentStep = this.steps[index];
    if(currentStep.invokePrevCB(index) == false){
      return;
    }
    this.updateCurrentStep(index - 1);
  }

  next(eventName?: string) {
    const index = this.state.currentStep;
    if (index >= this.steps.length - 1 || this.props.skipdefaultnext) {
      console.log(`skipping next`)
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
    if (this.state.currentStep !== this.lastStepIndex() || this.props.skipdefaultdone) {
      console.log(`skipping done`)
      return;
    }
    this.updateState({
      isDone: true
    } as WmWizardState);
    this.invokeEventCallback('onDone', [$event, this.proxy]);
  }

  cancel() {
    if(this.props.skipdefaultcancel) {
      console.log(`skipping cancel`)
      return;
    }
    this.invokeEventCallback('onCancel', [null, this.proxy]);
  }

  skip() {
    if(this.props.skipdefaultskip) {
      console.log(`skipping skip`)
      return;
    }
    this.next('skip');
  }

  getBackground(): React.JSX.Element | null {
    return this._showSkeleton ? null : this._background
  } 

  lastStepIndex(): number {
    let lastStep = 0;
    for(let i = 0; i < this.steps.length; i++) {
      if(this.steps[i].state.props.show) {
        lastStep = i;
      }
    }
    return lastStep;
  }

  firstStepIndex(): number {
    let firstStep = -1;
    for(let i = 0; i < this.steps.length; i++) {
      if(this.steps[i].state.props.show) {
        if (firstStep === -1) {
          firstStep = i;
        }
      }
    }
    return firstStep;
  }

  getTotalVisibleSteps(): number {
    let lastStep = 0;
    for(let i = 0; i < this.steps.length; i++) {
      if(this.steps[i].state.props.show) {
        lastStep++;
      }
    }
    return lastStep;
  }
  
  public renderSkeleton(props: WmWizardProps): React.ReactNode {
      if(!props.showskeletonchildren) {
        const skeletonStyles: WmSkeletonStyles = this.props?.styles?.skeleton || { root: {}, text: {}  } as WmSkeletonStyles
        return createSkeleton(this.theme, skeletonStyles, {
          ...this.styles.root
        }, (<View style={[this.styles.root, { opacity: 0 }]}>
          {props.children}
        </View>))
      }
      return null;
    }


  renderWidget(props: WmWizardProps) {
    this.numberOfSteps = this.steps.length;
    const activeStep = this.steps[this.state.currentStep];
    const isSkippable = activeStep && activeStep.state.props.enableskip;
    const isProgressCircleHeader = this.state.props.classname?.includes('progress-circle-header');
    const styles = this._showSkeleton ? {
      ...this.styles.root,
      ...this.styles.skeleton.root
    } : this.styles.root
    return (
      <View 
        style={styles}
        onLayout={(event) => this.handleLayout(event)}
      >
        {this.getBackground()}
        <View style={this.styles.wizardHeader}>
          {activeStep && isProgressCircleHeader ? (this.renderProgressCircleHeader(activeStep, this.state.currentStep)) : (this.steps ? this.steps.map((step, i) => this.renderWizardHeader(step, i)) : null)}
        </View>
        <View style={this.styles.wizardBody}>
          {props.children}
        </View>
        <View style={[this.styles.wizardFooter,
          {flexDirection: props.actionsalignment === 'right' ? 'row-reverse': 'row'}]}>
          {(this.state.currentStep) === this.lastStepIndex() && activeStep.state.props.showdone &&
            <WmButton iconclass={'wm-sl-l sl-check'} styles={merge({}, this.styles.wizardActions, this.theme.getStyle('btn-default'), this.styles.doneButton)}
              id = {this.getTestId('donebtn')} caption={props.donebtnlabel} onTap={this.done.bind(this)} disabled={activeStep.state.props.disabledone}></WmButton>
          }
          {(this.state.currentStep) < this.lastStepIndex() && activeStep.state.props.shownext &&
            <WmButton iconclass={'wi wi-chevron-right'} styles={merge({}, this.styles.wizardActions, this.theme.getStyle('btn-default'), this.styles.nextButton)}
                id = {this.getTestId('nextbtn')}
                      iconposition={'right'} caption={props.nextbtnlabel} onTap={this.next.bind(this)} disabled={activeStep.state.props.disablenext}></WmButton>
          }
          {this.state.currentStep > 0 && activeStep.state.props.showprev &&
            <WmButton iconclass={'wi wi-chevron-left'} styles={merge({}, this.theme.getStyle('btn-default'), this.styles.wizardActions, this.styles.prevButton)} caption={props.previousbtnlabel}
                id = {this.getTestId('prevbtn')}
                onTap={this.prev.bind(this)} disabled={activeStep.state.props.disableprev}></WmButton>
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
