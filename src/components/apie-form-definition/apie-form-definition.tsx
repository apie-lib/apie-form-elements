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

  @Prop({ reflect: true, mutable: true}) status: string = 'idle';

  @Method()
  async getDefinition(): Promise<FormDefinition> {
    this.status = 'building';
    const fields: FormField[] = await toFormField(this.el.childNodes);
    this.status = 'built';
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
