import { Component, Element, Host, Method, Prop, h } from '@stencil/core';
import { FormField, FormGroupField, getFormConstraints, toFormField } from '../../utils/FormDefinition';

@Component({
  tag: 'apie-form-group-definition',
  styleUrl: 'apie-form-group-definition.css',
  shadow: false,
})
export class ApieFormGroupDefinition {
  @Prop() name: string;

  @Prop() label: string|null = null;

  @Prop({ reflect: true }) prototyped: boolean = false;

  @Prop({ reflect: true, mutable: true}) status: string = 'idle';

  @Prop({ reflect: true }) valueWhenMissing: any = null;

  @Element() el: HTMLElement;

  private getEffectiveValueWhenMissing(fields: FormField[]): any
  {
    if (this.valueWhenMissing) {
      return this.valueWhenMissing
    }
    const result: Record<string, any> = {};
    for (let field of fields) {
      result[field.name] = (field as any).valueWhenMissing;
    }
    return result;
  }

  @Method()
  async getDefinition(): Promise<FormGroupField> {
    this.status = 'building';
    const constraints = await getFormConstraints(this.el);
    const fields: FormField[] = await toFormField(this.el.childNodes);
    this.status = 'built';
    
    return Promise.resolve({
      fieldType: 'group',
      name: this.name,
      label: this.label,
      fields,
      valueWhenMissing: this.getEffectiveValueWhenMissing(fields),
      types: ['group'],
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
