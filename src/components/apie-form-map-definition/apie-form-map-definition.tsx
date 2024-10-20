import { Component, Element, Host, Method, Prop, h } from '@stencil/core';
import { FieldMap, getFormConstraints } from '../../utils/FormDefinition';

@Component({
  tag: 'apie-form-map-definition',
  styleUrl: 'apie-form-map-definition.css',
  shadow: false,
})
export class ApieFormMapDefinition {
  @Prop() name: string;

  @Prop() label: string|null = null;

  @Prop() definitionId: string;

  @Element() el: HTMLElement;

  @Prop({ reflect: true }) prototyped: boolean = false;

  @Prop({ reflect: true, mutable: true}) status: string = 'idle';

  @Prop({ reflect: true }) valueWhenMissing: any = {};

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
    const constraints = await getFormConstraints(this.el);
    const subformDefinition = await (definition as any).getDefinition();
    this.status = 'built';
    return Promise.resolve({
      fieldType: 'map',
      name: this.name,
      label: this.label,
      subField: subformDefinition,
      valueWhenMissing: this.valueWhenMissing,
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
