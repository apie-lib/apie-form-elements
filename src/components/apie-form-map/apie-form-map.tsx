import { Component, Event, EventEmitter, Host, Prop, State, VNode, h } from '@stencil/core';
import { ChangeEvent } from '../../utils/utils';
import { RenderInfo } from '../../utils/RenderInfo';
import { FallbackRenderInfo } from '../../utils/FallbackRenderInfo';

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

  @Prop({reflect: true}) renderInfo: RenderInfo = new FallbackRenderInfo();

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
    const keyField = this.renderInfo.renderSingleInput(['map_key_field', 'text'], {
      name: '_internal' + this.name,
      label: 'Key',
      value: this.enteredKey,
      valueChanged: (newValue?: string) => this.enteredKey = newValue ?? '',
      renderInfo: this.renderInfo,
      validationResult: {
        valid: true,
        messages: []
      }
    });
    const addButton = this.renderInfo.renderAddItemToList({
      mappingKey: '__add' + this.enteredKey,
      disabled: this.canNotAdd(),
      isMap: true,
      label: 'Add',
      onRowAdd: () => this.onAddItemMap()
    });
    return (
      <Host>
        <div>{this.subElements.filter((subElement) => {
          return !Array.isArray(subElement) || subElement.length > 0;
        }).map((subElement, index) => {
          return this.renderInfo.renderListOrMapRow(
            {
              mappingKey: index,
              isMap: true,
              onRowRemove: () => this.removeFromList(subElement),
            },
            subElement
          );
        })}</div>
        { this.renderInfo.renderAddItemToMap(keyField, addButton) }
      </Host>
    );
  }

}
