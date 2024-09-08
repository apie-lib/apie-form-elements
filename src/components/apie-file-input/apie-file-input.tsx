import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { renderTemplates } from '../../utils/renderTemplates';
import { APIE_FORM_CONTROLLER, ChangeEvent } from '../../utils/utils';

@Component({
  tag: 'apie-file-input',
  styleUrl: 'apie-file-input.css',
  shadow: true,
})
export class ApieFileInput {
  @Prop({reflect: true}) name: string;

  @Prop({reflect: true, mutable: true}) value: File|null = null;

  @Prop({reflect: true}) apie: Symbol = APIE_FORM_CONTROLLER;

  @Event() triggerChange: EventEmitter<ChangeEvent>
  private renderInput()  {
    return renderTemplates.renderFileInput({
      name: this.name,
      value: this.value,
      valueChanged: (newValue: File) => {
        if (newValue !== this.value) {
          this.value = newValue;
          this.triggerChange.emit({ name: this.name, value: newValue, force: true })
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
