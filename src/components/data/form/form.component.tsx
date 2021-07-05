import React from 'react';
import {Text, View} from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import {isArray, forEach} from 'lodash';

import WmFormProps from './form.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmFormStyles } from './form.styles';

export class WmFormState extends BaseComponentState<WmFormProps> {
  dataout: any;
  isValid = false;
}

export default class WmForm extends BaseComponent<WmFormProps, WmFormState, WmFormStyles> {
  private formWidgets: any;
  constructor(props: WmFormProps) {
    console.log("form children", props.children);
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmFormProps());
    this.processFormFields(props.children);
  }

  processFormFields(children: any) {
    this.formWidgets = {};
    const traverse = (currentNode: any) => {
      if (currentNode.props?.formRef) {
        this.formWidgets[currentNode.key] = currentNode;
      }
      if(currentNode.props?.children) {
        if(isArray(currentNode.props.children)) {
          for(let i = 0; i < currentNode.props.children.length; i++) {
            traverse(currentNode.props.children[i]);
          }
        } else {
          traverse(currentNode.props.children);
        }
      }
    }
    traverse(children);
  }

  componentDidMount() {
    console.log("mount");
    this.props.dataoutput();
    super.componentDidMount();
  }

  // @ts-ignore
  handleSubmit(event: any) {
    event.preventDefault();
    console.log("submit fields", this.formWidgets);
    const formData = this.props.dataoutput();
    let isValid = true;
    forEach(formData, (val, key) => {
      console.log("required", this.formWidgets[key]?.props.required);
      if(!val && this.formWidgets[key]?.props.required) {
        isValid = false;
        this.formWidgets[key].props.validate();
      }
    });
    if(!isValid) {
      return false;
    }
    if(this.props.onBeforesubmit) {
      this.invokeEventCallback('onBeforesubmit', [ null, this.proxy, formData ]);
    }
    this.invokeEventCallback('onSubmit', [ null, this.proxy, formData ]);
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'dataoutput':
        console.info("newVal", $new);
        this.updateState({
          dataout: $new(),
        } as WmFormState);
        break;
    }
  }

  renderWidget(props: WmFormProps) {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <View style={this.styles.root}>{props.children}</View>
        <input type="submit" value="Submit" />
        {JSON.stringify(props.dataoutput())}
      </form>
    );
  }
}
