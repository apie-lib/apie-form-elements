import { Component, Event, EventEmitter, Element, State, Prop, Host, Watch, h, Listen } from '@stencil/core';
import { FormNameSplit, ValidationErrorState, applyEventTarget, waitFor } from '../../utils/utils';

@Component({
  tag: 'apie-form-group',
  styleUrl: 'apie-form-group.css',
  shadow: false,
})
export class ApieFormGroup {
  @Element() el: HTMLElement;

  @State() previousName: any = undefined;

  @State() currentValue: any;

  @State() previousMap!: string;

  @Prop() name: string;

  @Prop() debugMode: boolean = false;

  @Prop({mutable: true}) value?: Record<string, any> = undefined;

  @Prop({mutable: true}) validationError: ValidationErrorState|null = null;

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

  @Listen('input') public async onInput(ev: any) {
    if (ev.target === this.el) {
      return;
    }
    if (!this.value) {
      await this.createValueFromInnerHTML();
    }
    if (ev?.target?.name && ev?.target?.value !== undefined) {
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

  private async createValueFromInnerHTML()
  {
    await waitFor(() => (this.el && !this.value));
    if (this.value) {
      return;
    }
    const newValue : Record<string, any> = {};
    this.el.childNodes.forEach((child: any) => {
      if (child && child.name && String(child.name).indexOf(this.name) === 0) {
        const fieldName = String(child.name).substring(this.name.length).split(new FormNameSplit())
        newValue[fieldName[0]] = child.checked === true ? child.checked : child.value;
      }
    });
    this.value = newValue;
    this.triggerInputOnChange();
  }

  componentWillLoad() {
    if (this.value) {
      this.updateValue(this.value);
    } else {
      this.createValueFromInnerHTML();
    }
    this.componentShouldUpdate();
  }

  componentShouldUpdate() {
    if (this.validationError) {
      this.validationError.markAllErrorsAsUnused();
      this.el.childNodes.forEach((child: any) => {
        if (child && child.name && String(child.name).indexOf(this.name) === 0) {
          const fieldName = String(child.name).substring(this.name.length).split(new FormNameSplit())
          this.validationError.markError(fieldName[0]);
          child.validationError = this.validationError.getSubValidation(fieldName[0]);
        }
      });
    }
  }

  render() {
    return (
      <Host>
        { this.debugMode && <pre>{JSON.stringify(this.value, null, 4)}</pre> }
        <slot></slot>
        { this.validationError && <apie-display-missing-validation-errors validationError={this.validationError} /> }
      </Host>
    );
  }

}
