import { Component, Host, Method, Prop, h } from '@stencil/core';
import { toString, clone }  from '../../utils/utils';
import { FormSelectOption, FieldSplit } from '../../utils/FormDefinition';

@Component({
  tag: 'apie-form-select-definition',
  styleUrl: 'apie-form-select-definition.css',
  shadow: false,
})
export class ApieFormSelectDefinition {
  @Prop() name: string;

  @Prop() label: string|null = null;

  @Prop() definitionIdList: Array<FormSelectOption>;

  @Prop({ reflect: true }) prototyped: boolean = false;

  @Prop({ reflect: true, mutable: true}) status: string = 'idle';

  instantiated: boolean = false;

  connectedCallback() {
    this.instantiated = true;
  }

  disconnectedCallback() {
    this.instantiated = false;
  }

  @Method()
  async getDefinition(): Promise<FieldSplit> {
    const newValue = this.definitionIdList;
    this.status = 'retrieving child metadata';
    await new Promise((resolve, reject) => {
      const id = setInterval(async () => {
        if (!this.instantiated || this.definitionIdList !== newValue) {
          clearInterval(id);
          reject(new Error('definitionId changed or component destroyed'));
        }
        for (let definitionId of this.definitionIdList) {
          const name = toString(definitionId.value as any);
          const definition = document.getElementById(name);
          if (!definition) {
            if (definitionId.definition) {
              continue;
            }
            this.status = 'retrieving child metadata ' + definitionId.value;
            return;
          }
          definitionId.definition = clone(await (definition as any).getDefinition());
          (definitionId.definition as any).name = this.name;
          (definitionId.definition as any).label = this.label;
        }
        clearInterval(id);
        resolve(this.definitionIdList);
      })
    });
    this.status = 'built';
    return Promise.resolve({
      fieldType: 'split',
      name: this.name,
      label: this.label,
      subFields: this.definitionIdList
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
