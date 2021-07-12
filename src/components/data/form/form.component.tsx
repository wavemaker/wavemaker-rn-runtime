import React from 'react';
import {Text, View} from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { widgetsWithUndefinedValue } from '@wavemaker/app-rn-runtime/core/utils';
import {isArray, forEach, isEqual} from 'lodash';

import WmFormProps from './form.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmFormStyles } from './form.styles';

export class WmFormState extends BaseComponentState<WmFormProps> {
  isValid = false;
}

export default class WmForm extends BaseComponent<WmFormProps, WmFormState, WmFormStyles> {
  private formWidgets: any;
  private formdataoutput: any;
  constructor(props: WmFormProps) {
    console.log("form children", props.children);
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmFormProps());
  }

  processFormFields(children: any) {
    this.formWidgets = {};
    const traverse = (currentNode: any) => {
      if (currentNode.props?.formRef) {
        this.formWidgets[currentNode.key] = currentNode;
        if (this.state.props.formdata) {
          currentNode.props.onChange(null, currentNode, this.state.props.formdata[currentNode.key]);
        }
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
    this.processFormFields(this.props.children);
    super.componentDidMount();
  }

  // @ts-ignore
  handleSubmit(event: any) {
    event.preventDefault();
    console.log("submit fields", this.formWidgets);
    const formData = this.props.dataoutput;
    let isValid = true;
    forEach(formData, (val, key) => {
      if(!val && this.formWidgets[key]?.props.required && widgetsWithUndefinedValue.indexOf(this.formWidgets[key]?.props.widget) < 0) {
        isValid = false;
      }
      this.formWidgets[key].props.onValidate();
    });
    if(!isValid) {
      return false;
    }
    if(this.props.onBeforesubmit) {
      this.invokeEventCallback('onBeforesubmit', [ null, this.proxy, formData ]);
    }
    this.invokeEventCallback('onSubmit', [ null, this.proxy, formData ]);
  }

  updateDataOutput(key: string, val: any) {
    var current = this.formdataoutput || {};
    current[key] = val;
    this.formdataoutput = current;
    this.updateState({ props: { dataoutput: current }} as WmFormState);
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'gendataoutput':
        if (!this.state.props.dataoutput || !isEqual($new(), this.state.props.dataoutput)) {
          console.log("gendataoutput onpropertychange");
          this.updateState({ props: { dataoutput: $new() }} as WmFormState);
        }
        break;
      case 'formdata':
        console.log("formdata", $new);
        if($new && this.formWidgets) {
          forEach(this.formWidgets, (widget) => {
            widget.props.onChange(null, widget, $new[widget.key]);
          });
        }
    }
  }

  renderWidget(props: WmFormProps) {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <View style={this.styles.root}>{props.children}</View>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
