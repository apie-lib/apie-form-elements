import { Component, Element, Host, Method, Prop, h } from '@stencil/core';
import { getFormConstraints, SingleField, SingleFieldSettings } from '../../utils/FormDefinition';

@Component({
  tag: 'apie-form-field-definition',
  styleUrl: 'apie-form-field-definition.css',
  shadow: false,
})
export class ApieFormFieldDefinition {
  @Element() el: HTMLElement;
  @Prop() name: string;
  @Prop() label: string;
  @Prop() types: string = 'text';
  @Prop({ reflect: true}) additionalSettings?: SingleFieldSettings = {};
  @Prop({ reflect: true, mutable: true}) status: string = 'idle';
  @Prop({ reflect: true }) prototyped: boolean = false;
  @Prop({ reflect: true }) valueWhenMissing: any = null;

  @Method()
  async getDefinition(): Promise<SingleField> {
    this.status = 'building';
    const constraints = await getFormConstraints(this.el);
    this.status = 'built';
    return Promise.resolve({
      fieldType: 'single',
      name: this.name,
      label: this.label,
      types: this.types.split(','),
      valueWhenMissing: this.valueWhenMissing,
      additionalSettings: this.additionalSettings,
      constraints,
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
