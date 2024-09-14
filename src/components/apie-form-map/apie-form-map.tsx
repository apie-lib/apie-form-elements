import { Component, Event, EventEmitter, Host, Prop, State, VNode, h } from '@stencil/core';
import { renderTemplates } from '../../utils/renderTemplates';
import { APIE_FORM_CONTROLLER, ChangeEvent } from '../../utils/utils';

@Component({
  tag: 'apie-form-map',
  styleUrl: 'apie-form-map.css',
  shadow: true,
})
export class ApieFormMap {
  @Prop() subElements: VNode[]

  @Prop({reflect: true}) name: string;

  @Prop({reflect: true}) label: string | null = null;

  @Prop({reflect: true, mutable: true}) value: Record<string, any>;

  @Prop({reflect: true, mutable: true}) types: string = '';

  @Prop({reflect: true}) apie: Symbol = APIE_FORM_CONTROLLER;

  @State() enteredKey: string = '';

  @Event() triggerChange: EventEmitter<ChangeEvent>;

  onAddItemMap() {
    if (!this.value) {
      this.value = {};
    }
    this.value[this.enteredKey] = null;
    this.value = { ...this.value }
    this.enteredKey = '';
    this.triggerChange.emit({
      name: this.name,
      value: this.value,
      force: true
    });
  }

  canNotAdd(): boolean {
    return this.enteredKey === ''
      || this.enteredKey === '__proto__'
      || (this.value && Object.hasOwnProperty.call(this.value, this.enteredKey));
  }

  private removeFromList(node: VNode)
  {
    const nodeName = node.$attrs$.name as string;
    const keyName = nodeName.substring(this.name.length + 1, nodeName.length - 1);
    delete this.value[keyName];
    this.value = { ...this.value }
    this.triggerChange.emit({
      name: this.name,
      value: this.value,
      force: true
    });
  }

  render() {
    return (
      <Host>
        <div>{this.subElements.map((subElement, index) => {
          return [subElement, <button key={'__remove__' + index} type="button" onClick={() => this.removeFromList(subElement)}>X</button>]
        })}</div>
        { renderTemplates.renderInput({
          name: '_internal' + this.name,
          label: 'Key',
          value: this.enteredKey,
          valueChanged: (newValue?: string) => this.enteredKey = newValue ?? '',
        }) }
        <button disabled={this.canNotAdd()} type="button" onClick={() => this.onAddItemMap() }>Add</button>
      </Host>
    );
  }

}
