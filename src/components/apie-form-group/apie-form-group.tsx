import { Component, Event, EventEmitter, Element, State, Prop, Host, Watch, h, Listen } from '@stencil/core';
import { FormNameSplit, applyEventTarget, waitFor } from '../../utils/utils';

@Component({
  tag: 'apie-form-group',
  styleUrl: 'apie-form-group.css',
  shadow: false,
})
export class ApieFormGroup {
  @Element() el: HTMLElement;

  @State() previousName: any = undefined;

  @State() currentValue: any;

  @State() currentValidationErrors: any;

  @State() previousMap!: string;

  @State() groupError!: string;

  @Prop() name: string;

  @Prop({mutable: true}) value: Record<string, any> = {};

  @Prop({mutable: true}) validationErrors: Record<string, any> = {};

  @Event({
    eventName: 'input',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) inputChanged: EventEmitter<Record<string, any>>;
  
  @Watch('value') async updateValue(_val) {
    if (!_val) {
      return;
    }
    this.currentValue = _val;
    const previousName = this.previousName;
    await waitFor(() => (this.el && this.currentValue === _val && this.previousName === previousName));
    if (this.currentValue !== _val || this.previousName !== previousName) {
      return;
    }
    this.el.childNodes.forEach((child: any) => {
      if (child && child.name) {
        if (previousName !== undefined && String(child.name).indexOf(previousName) === 0) {
          child.name = String(child.name).replace(previousName, this.name);
        }
        if (String(child.name).indexOf(this.name) === 0) {
          const fieldName = String(child.name).substring(this.name.length).split(new FormNameSplit())
          child.value = _val[fieldName[0]];
        }
      }
    });
  }

  @Watch('validationErrors') async updateValidationErrors(_val) {
    this.currentValidationErrors = _val;
    await waitFor(() => (this.el && this.currentValidationErrors === _val));
    if (this.currentValidationErrors !== _val) {
      return;
    }
    this.groupError = _val[''];
    this.el.childNodes.forEach((child: any) => {
      if (child && child.name && String(child.name).indexOf(this.name) === 0) {
        const fieldName = String(child.name).substring(this.name.length).split(new FormNameSplit())
        const error = _val[fieldName[0]];
        if (error === null || error === undefined) {
          child.invalid = false;
          child.invalidText = null;
        } else if (typeof error === 'object') {
          child.validationErrors = error;
          child.invalid = true;
          child.invalidText = null;
        } else {
          child.invalid = true;
          child.invalidText = error;
        }
      }
    });
  }

  @Listen('input') public onInput(ev: any) {
    if (ev.target === this.el) {
      return;
    }
    if (ev?.target?.name && ev?.target?.value) {
      this.value = {...applyEventTarget(
        this.name,
        this.value,
        ev.target
      )};
      this.triggerInputOnChange();
    }
  }

  private triggerInputOnChange(): void
  {
    const current = JSON.stringify(this.value);
    if (current !== this.previousMap) {
      this.previousMap = current;
      this.inputChanged.emit(this.value);
    }
  }

  componentWillLoad() {
    this.updateValue(this.value);
  }

  render() {
    return (
      <Host>
        <slot></slot>
        { this.groupError && <apie-validation-error>{ this.groupError }</apie-validation-error> }
      </Host>
    );
  }

}
