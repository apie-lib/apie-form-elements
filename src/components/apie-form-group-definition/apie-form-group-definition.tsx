import { Component, Element, Host, Method, Prop, h } from '@stencil/core';
import { FormField, FormGroupField, toFormField } from '../../utils/FormDefinition';

@Component({
  tag: 'apie-form-group-definition',
  styleUrl: 'apie-form-group-definition.css',
  shadow: true,
})
export class ApieFormGroupDefinition {
  @Prop() name: string;

  @Prop() label: string|null = null;

  @Prop({ reflect: true }) prototyped: boolean = false;

  @Prop({ reflect: true, mutable: true}) status: string = 'idle';

  @Element() el: HTMLElement;

  @Method()
  async getDefinition(): Promise<FormGroupField> {
    this.status = 'building';
    const fields: FormField[] = await toFormField(this.el.childNodes);
    this.status = 'built';
    return Promise.resolve({
      fieldType: 'group',
      name: this.name,
      label: this.label,
      fields,
      types: ['group'],
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
