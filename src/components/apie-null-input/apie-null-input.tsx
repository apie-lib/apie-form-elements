import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { APIE_FORM_CONTROLLER, ChangeEvent } from '../../utils/utils';

@Component({
  tag: 'apie-null-input',
  styleUrl: 'apie-null-input.css',
  shadow: true,
})
export class ApieNullInput {
  @Prop({reflect: true}) name: string;

  @Prop({reflect: true, mutable: true}) value: any;

  @Prop({reflect: true}) apie: Symbol = APIE_FORM_CONTROLLER;

  @Event() triggerChange: EventEmitter<ChangeEvent>

  public componentDidRender()  {
    if (this.value !== null) {
      Promise.resolve().then(() => {
        this.value = null;
        this.triggerChange.emit({
          name: this.name,
          value: null,
        });
      })
    }
  }
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
