import { Component, Element, Prop, Host, h, State, Listen, Event, EventEmitter, Watch } from '@stencil/core';
import { ValidationErrorState, applyEventTarget, loadTemplate } from '../../utils/utils';

@Component({
  tag: 'apie-form-list',
  styleUrl: 'apie-form-list.css',
  shadow: false,
})
export class ApieFormList {
  @Element() el: HTMLElement;

  @Prop() name: string;

  @Prop() label: string = '';

  @Prop({reflect: true, mutable: true}) value: Array<any> = [];

  @Prop() validationError?: ValidationErrorState = null;

  @Prop() templateId: string;

  @Prop() replaceString: string = '__PROTO__';

  @State() previousList!: string;

  @Event({
    eventName: 'input',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) inputChanged: EventEmitter<any[]>;

  public handleClick() {
    this.value = this.value ? [...this.value, null] : [null];
    this.triggerInputOnChange();
  }

  public removeRow(key: number) {
    this.value.splice(key, 1);
    this.value = [...this.value]
    this.triggerInputOnChange();
  }

  @Listen('input') public onInput(ev: any) {
    if (ev.target === this.el) {
      return;
    }
    if (ev?.target?.name) {
      this.value = [...applyEventTarget(
        this.name,
        this.value,
        ev.target
      )];
      this.triggerInputOnChange();
    }
  }

  @Watch('validationError')
  public updateValidationError(): void
  {
    if (this.validationError) {
      this.validationError.markAllErrorsAsUnused();
      for (let i = 0; i < this.value.length; i++) {
        this.validationError.markError(String(i));
      }
    }
  }

  private triggerInputOnChange(): void
  {
    const current = JSON.stringify(this.value);
    this.updateValidationError();
    if (current !== this.previousList) {
      this.previousList = current;
      this.inputChanged.emit(this.value);
    }
  }

  private renderRow(key: string|number): any
  {
    let template = loadTemplate(this.templateId);
    while (template.indexOf(this.replaceString) > -1) {
      template = template.replace(this.replaceString, String(key));
    }
    return template;
  }

  render() {
    return (
      <Host>
        <gr-field-group label={this.label} style="">
          {!this.value?.length && <slot name="empty-array"></slot>}
          <div class="field-list">
            { (Array.isArray(this.value) ? this.value : []).map((value: any, key: number) => 
            <div class="row">
              <gr-button class="remove-button" onClick={() => this.removeRow(key)}>
                <ion-icon name="close-circle-outline">X</ion-icon>
              </gr-button>
              <apie-scalar-element class="form-item" validationError={ this.validationError?.getSubValidation(String(key)) } key={key} name={this.name + '[' + key + ']'} value={value} innerHTML={this.renderRow(key)}>
              </apie-scalar-element>
            </div>
            ) }
            <div>
              <gr-button onClick={() => this.handleClick()} variant="secondary">
                <ion-icon name="add-circle-outline"></ion-icon> Add
              </gr-button>
            </div>
          </div>
          <apie-display-missing-validation-errors validationError={this.validationError} />
          <slot></slot>
        </gr-field-group>
      </Host>
    );
  }
}
