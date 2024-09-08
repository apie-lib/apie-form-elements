import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { APIE_FORM_CONTROLLER, ChangeEvent, Option } from '../../utils/utils';
import { renderTemplates } from '../../utils/renderTemplates';

@Component({
  tag: 'apie-select',
  styleUrl: 'apie-select.css',
  shadow: true,
})
export class ApieSelect {

  @Prop({reflect: true}) name: string;

  @Prop({reflect: true, mutable: true}) value: string;

  @Prop({reflect: true}) options: Option[];

  @Prop({reflect: true}) apie: Symbol = APIE_FORM_CONTROLLER;

  @Event() triggerChange: EventEmitter<ChangeEvent>
  private renderInput()  {
    return renderTemplates.renderSelect({
      name: this.name,
      value: this.value,
      options: this.options,
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
        { this.options && this.renderInput() }
        <slot></slot>
      </Host>
    );
  }

}
