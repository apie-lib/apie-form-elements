import { Component, Host, Method, Prop, h } from '@stencil/core';
import { SingleField, SingleFieldSettings } from '../../utils/FormDefinition';

@Component({
  tag: 'apie-form-field-definition',
  styleUrl: 'apie-form-field-definition.css',
  shadow: false,
})
export class ApieFormFieldDefinition {
  @Prop() name: string;
  @Prop() label: string;
  @Prop() types: string = 'text';
  @Prop({reflect: true}) additionalSettings?: SingleFieldSettings = {};
  @Prop({ reflect: true, mutable: true}) status: string = 'idle';
  @Prop({ reflect: true }) prototyped: boolean = false;

  @Method()
  async getDefinition(): Promise<SingleField> {
    this.status = 'built';
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
