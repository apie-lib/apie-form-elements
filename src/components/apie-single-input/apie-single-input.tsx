import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { renderTemplates } from '../../utils/renderTemplates';
import { APIE_FORM_CONTROLLER, ChangeEvent } from '../../utils/utils';

@Component({
  tag: 'apie-single-input',
  styleUrl: 'apie-single-input.css',
  shadow: true,
})
export class ApieSingleInput {
  @Prop({reflect: true}) name: string;

  @Prop({reflect: true}) label: string | null = null;

  @Prop({reflect: true, mutable: true}) value: string;

  @Prop({reflect: true, mutable: true}) types: string = '';

  @Prop({reflect: true}) apie: Symbol = APIE_FORM_CONTROLLER;

  @Event() triggerChange: EventEmitter<ChangeEvent>;
  private renderInput()  {
    return renderTemplates.renderSingleInput({
      name: this.name,
      label: this.label,
      value: this.value,
      types: this.types.split(','),
      valueChanged: (newValue: string) => {
        if (newValue !== this.value) {
          this.value = newValue;
          this.triggerChange.emit({ name: this.name, value: newValue })
        }
      }
    })
  }

  render() {
    return (
      <Host>
        { this.renderInput() }
        <slot></slot>
      </Host>
    );
  }

}
