import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { APIE_FORM_CONTROLLER, ChangeEvent, Option } from '../../utils/utils';
import { renderTemplates } from '../../utils/renderTemplates';

@Component({
  tag: 'apie-form-select',
  styleUrl: 'apie-form-select.css',
  shadow: true,
})
export class ApieFormSelect {
  @Prop({reflect: true}) name: string;

  @Prop({reflect: true, mutable: true}) value: string;

  @Prop({reflect: true, mutable: true}) internalState: Record<string, any> = {}

  @Prop({reflect: true}) options: Option[];

  @Prop({reflect: true}) apie: Symbol = APIE_FORM_CONTROLLER;

  @Prop() replaceString: string;

  @Event() triggerChange: EventEmitter<ChangeEvent>

  @Event() triggerInternalState: EventEmitter<ChangeEvent>

  private renderSelect() {
    return renderTemplates.renderSelect({
      name: '_internal' + this.name,
      value: this.internalState?.option || null,
      options: this.options,
      valueChanged: (newValue: string) => {
        if (newValue !== this.internalState.option) {
          this.internalState.option = newValue;
          this.internalState = { ...this.internalState };
          this.triggerInternalState.emit({ name: this.name, value: this.internalState.option })
        }
      }
    })
  }

  private getSelectedOption(): string|null {
    if (!this.internalState.option) {
      return null;
    }
    for (let option of this.options) {
      if (option.value === this.internalState.option) {
        return String(option.value);
      }
    }
    return null;
  }
  render() {
    return (
      <Host>
        {this.renderSelect()}
        {this.getSelectedOption() && <apie-render-template internal-state={this.internalState} replace-string={this.replaceString} name={this.name} value={this.value} template-id={this.getSelectedOption()}></apie-render-template>}
        <slot></slot>
      </Host>
    );
  }

}
