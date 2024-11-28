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

  @Prop({reflect: true, mutable: true}) value: string | null;

  @Prop({reflect: true, mutable: true}) types: string = '';

  @Prop({reflect: true }) renderInfo: RenderInfo = new FallbackRenderInfo();

  @Prop({reflect: true}) additionalSettings?: SingleFieldSettings = {};

  @Prop({reflect: true}) serverValidationError: NestedRecord<string> = {};

  @Prop({reflect: true}) allowsNull: boolean = false;

  @Prop({reflect: true}) emptyStringAllowed: boolean = false;

  @Prop({reflect: true}) required: boolean = false;

  @State() isTouched: boolean = false;

  @Event() touched: EventEmitter<ChangeEvent>;

  @Prop({}) validationResult: ValidationResult = {
    valid: true,
    messages: []
  };

  private sanitizeInput(newValue: string | null): string | null {
    if (newValue === '') {
      if (!this.emptyStringAllowed && this.allowsNull) {
        return null;
      }
    }
    if (newValue === null) {
      if (!this.allowsNull && this.emptyStringAllowed) {
        return '';
      }
    }
    return newValue;
  }

  @Event() triggerChange: EventEmitter<ChangeEvent>;
  private renderInput()  {
    if (this.value === undefined) {
      Promise.resolve().then(() => {
        this.triggerChange.emit({ name: this.name, value: this.sanitizeInput(null) })
      });
    }
    return this.renderInfo.renderSingleInput(this.types.split(','), {
      name: this.name,
      label: this.label,
      value: this.value,
      additionalSettings: this.additionalSettings,
      valueChanged: (newValue: string) => {
        newValue = this.sanitizeInput(newValue);
        if (newValue !== this.value) {
          this.value = newValue;
          this.triggerChange.emit({ name: this.name, value: newValue })
        }
      },
      validationResult: this.validationResult,
      serverValidationError: this.serverValidationError,
      renderInfo: this.renderInfo,
      touched: this.isTouched,
      allowsNull: this.allowsNull,
      emptyStringAllowed: this.emptyStringAllowed,
      required: this.required,
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
