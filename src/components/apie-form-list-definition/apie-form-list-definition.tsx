import { Component, Element, Host, Method, Prop, h } from '@stencil/core';
import { FieldList } from '../../utils/FormDefinition';

@Component({
  tag: 'apie-form-list-definition',
  styleUrl: 'apie-form-list-definition.css',
  shadow: false,
})
export class ApieFormListDefinition {
  @Prop() name: string;

  @Prop() label: string|null = null;

  @Prop() definitionId: string;

  @Prop({ reflect: true }) prototyped: boolean = false;

  @Prop({ reflect: true, mutable: true}) status: string = 'idle';

  @Prop({ reflect: true }) valueWhenMissing: any = [];

  @Element() el: HTMLElement;

  instantiated: boolean = false;

  connectedCallback() {
    this.instantiated = true;
  }

  disconnectedCallback() {
    this.instantiated = false;
  }

  @Method()
  async getDefinition(): Promise<FieldList> {
    const newValue = this.definitionId;
    this.status = 'retrieving child metadata';
    const definition = await new Promise((resolve, reject) => {
      const id = setInterval(() => {
        if (!this.instantiated || this.definitionId !== newValue) {
          clearInterval(id);
          reject(new Error('definitionId changed or component destroyed'));
        }
        const definition = document.getElementById(this.definitionId);
        if (definition) {
          clearInterval(id);
          resolve(definition);
        }
      })
    });
    this.status = 'building';
    const subformDefinition = await (definition as any).getDefinition();
    this.status = 'built';
    return Promise.resolve({
      fieldType: 'list',
      name: this.name,
      label: this.label,
      subField: subformDefinition,
      unique: false,
      valueWhenMissing: this.valueWhenMissing,
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
