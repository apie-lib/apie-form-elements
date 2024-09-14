import { Component, Element, Host, Method, Prop, h } from '@stencil/core';
import { FieldMap } from '../../utils/FormDefinition';

@Component({
  tag: 'apie-form-map-definition',
  styleUrl: 'apie-form-map-definition.css',
  shadow: true,
})
export class ApieFormMapDefinition {
  @Prop() name: string;

  @Prop() label: string|null = null;

  @Prop() definitionId: string;

  @Element() el: HTMLElement;

  instantiated: boolean = false;

  connectedCallback() {
    this.instantiated = true;
  }

  disconnectedCallback() {
    this.instantiated = false;
  }


  @Method()
  async getDefinition(): Promise<FieldMap> {
    const newValue = this.definitionId;
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
    const subformDefinition = await (definition as any).getDefinition();
    return Promise.resolve({
      fieldType: 'map',
      name: this.name,
      label: this.label,
      subField: subformDefinition,
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