import { Component, Element, Host, Method, h, Prop } from '@stencil/core';
import { FormDefinition, FormField, toFormField } from '../../utils/FormDefinition';

@Component({
  tag: 'apie-form-definition',
  styleUrl: 'apie-form-definition.css',
  shadow: false,
})
export class ApieFormDefinition {
  @Element() el: HTMLElement;

  @Prop({ reflect: true }) prototyped: boolean = false;

  @Method()
  async getDefinition(): Promise<FormDefinition> {
    const fields: FormField[] = await toFormField(this.el.childNodes);
    return Promise.resolve({ fields })
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
