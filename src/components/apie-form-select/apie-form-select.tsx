import { Component, Event, EventEmitter, Host, State, Prop, h } from '@stencil/core';
import { loadTemplate } from '../../utils/utils';
import type { TypeDefinition } from '../../utils/utils';

@Component({
  tag: 'apie-form-select',
  styleUrl: 'apie-form-select.css',
  shadow: false,
})
export class ApieFormSelect {
  @Prop() name: string;

  @Prop({mutable: true}) options: Record<string, TypeDefinition>

  @Prop({mutable: true}) value: any = null;

  @Prop({mutable: true}) selectChoice?: string = null;

  @State() previousValue!: string;

  @Prop({mutable: true}) validationErrors: Record<string, any> = {};

  @Event({
    eventName: 'input',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) inputChanged: EventEmitter<any[]>;

  public getCurrentType(): TypeDefinition|null
  {
    if (!this.selectChoice) {
      return null;
    }
    if (!Object.prototype.hasOwnProperty.call(this.options, this.selectChoice)) {
      return null;
    }

    return this.options[this.selectChoice];
  }

  public renderTemplate(): string
  {
    const def = this.getCurrentType();
    if (!def) {
      return '';
    }
    return loadTemplate(def.templateId);
  }

  public onSelectChange(event): void
  {
    if (this.selectChoice && Object.prototype.hasOwnProperty.call(this.options, this.selectChoice)) {
      this.options[this.selectChoice].value = this.value;
    }
    this.selectChoice = event.target.value;
    const def = this.getCurrentType();
    this.value = def?.value;
    this.triggerInputOnChange();
  }

  public onInput(event): void
  {
    if (event?.target?.name === this.name) {
      this.value = event.target.value;
      this.triggerInputOnChange();
    }
  }

  private triggerInputOnChange(): void
  {
    const current = JSON.stringify(this.value);
    if (current !== this.previousValue) {
      this.previousValue = current;
      this.inputChanged.emit(this.value);
    }
  }

  render() {
    if (!this.options) {
      return <Host></Host>
    }
    return (
      <Host>
        <gr-select ongr-change={(ev) => this.onSelectChange(ev)}name={ '_apie' + this.name } value={this.selectChoice}>
          { Object.entries(this.options).map((option: [string, TypeDefinition]) => 
            <gr-menu-item value={option[0]}>{ option[1].label }</gr-menu-item>
          )}
        </gr-select>
        <apie-scalar-element onInput={ (ev) => this.onInput(ev) } name={this.name} value={this.value} innerHTML={this.renderTemplate()}></apie-scalar-element>
      </Host>
    );
  }

}
