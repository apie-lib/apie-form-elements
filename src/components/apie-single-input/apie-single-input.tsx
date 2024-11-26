import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import type { ChangeEvent } from '../../utils/utils';
import { RenderInfo } from '../../utils/RenderInfo';
import { FallbackRenderInfo } from '../../utils/FallbackRenderInfo';
import { SingleFieldSettings } from '../../components';
import { NestedRecord, ValidationResult } from '../../utils/FormDefinition';

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

  @Prop({reflect: true }) renderInfo: RenderInfo = new FallbackRenderInfo();

  @Prop({reflect: true}) additionalSettings?: SingleFieldSettings = {};

  @Prop({reflect: true}) serverValidationError: NestedRecord<string> = {};

  @State() isTouched: boolean = false;

  @Event() touched: EventEmitter<ChangeEvent>;

  @Prop({}) validationResult: ValidationResult = {
    valid: true,
    messages: []
  };

  @Event() triggerChange: EventEmitter<ChangeEvent>;
  private renderInput()  {
    if (this.value === undefined) {
      Promise.resolve().then(() => {
        this.triggerChange.emit({ name: this.name, value: null })
      });
    }
    return this.renderInfo.renderSingleInput(this.types.split(','), {
      name: this.name,
      label: this.label,
      value: this.value,
      additionalSettings: this.additionalSettings,
      valueChanged: (newValue: string) => {
        if (newValue !== this.value) {
          this.value = newValue;
          this.triggerChange.emit({ name: this.name, value: newValue })
        }
      },
      validationResult: this.validationResult,
      serverValidationError: this.serverValidationError,
      renderInfo: this.renderInfo,
      touched: this.isTouched,
      onTouched: () => { this.isTouched = true; this.touched.emit(); }
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
