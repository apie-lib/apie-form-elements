import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { APIE_FORM_CONTROLLER, ChangeEvent } from '../../utils/utils';
import { renderTemplates } from '../../utils/renderTemplates';

@Component({
  tag: 'apie-textarea',
  styleUrl: 'apie-textarea.css',
  shadow: true,
})
export class ApieTextarea {
  @Prop({reflect: true}) name: string;

  @Prop({reflect: true, mutable: true}) value: string;

  @Prop({reflect: true}) apie: Symbol = APIE_FORM_CONTROLLER;

  @Event() triggerChange: EventEmitter<ChangeEvent>
  private renderInput() {
    return renderTemplates.renderMultilineInput({
      name: this.name,
      value: this.value,
      rows: this.countRows(),
      valueChanged: (newValue: string) => {
        if (newValue !== this.value) {
          this.value = newValue;
          this.triggerChange.emit({ name: this.name, value: newValue })
        }
      }
    })
  }

  private countRows(): number {
    return Math.max(2, String(this.value).split("\n").length + 1);
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
