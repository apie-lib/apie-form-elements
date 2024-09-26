import { Component, Host, Method, Prop, h } from '@stencil/core';
import { SingleField, SingleFieldSettings } from '../../utils/FormDefinition';

@Component({
  tag: 'apie-form-field-definition',
  styleUrl: 'apie-form-field-definition.css',
  shadow: true,
})
export class ApieFormFieldDefinition {
  @Prop() name: string;
  @Prop() label: string;
  @Prop() types: string = 'text';
  @Prop({reflect: true}) additionalSettings?: SingleFieldSettings = {};

  @Method()
  async getDefinition(): Promise<SingleField> {
    return Promise.resolve({
      fieldType: 'single',
      name: this.name,
      label: this.label,
      types: this.types.split(','),
      additionalSettings: this.additionalSettings
    })
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
