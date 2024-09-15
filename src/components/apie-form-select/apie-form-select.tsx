import { Component, Event, EventEmitter, Host, Prop, VNode, h } from '@stencil/core';
import { ChangeEvent, Option } from '../../utils/utils';
import { renderSingleTemplates } from '../../utils/renderTemplates';

@Component({
  tag: 'apie-form-select',
  styleUrl: 'apie-form-select.css',
  shadow: true,
})
export class ApieFormSelect {
  @Prop() subElements: VNode[]

  @Prop({reflect: true}) name: string;

  @Prop({reflect: true}) label: string | null = null;

  @Prop({reflect: true, mutable: true}) value: Record<string, any>;

  @Prop({reflect: true, mutable: true}) internalState: Record<string, any> = {};

  @Prop({reflect: true, mutable: true}) options: Array<Option> = []

  @Event() triggerChange: EventEmitter<ChangeEvent>;

  @Event() triggerInternalState: EventEmitter<ChangeEvent>;

  private renderSelect()
  {
    return renderSingleTemplates.select({
      name: this.name,
      label: this.label ?? undefined,
      value: this.internalState?._split ?? null,
      disabled: this.options.length === 0,
      valueChanged: (newValue?: string): void => {
        const internalState = this.internalState ? { ...this.internalState } : {}
        console.log(internalState);
        debugger;
        const prevSplit = internalState._split ?? null;
        internalState._split = newValue;
        if (prevSplit) {
          internalState[prevSplit] = this.value
        }
        this.value = newValue ? (internalState[newValue] ?? null) : null;
        this.internalState = internalState;
        this.triggerInternalState.emit({
          name: this.name,
          value: this.internalState,
          force: true
        })
        this.triggerChange.emit({
          name: this.name,
          value: this.value,
          force: true
        })
      },
      additionalSettings: {
        options: this.options,
      }
    })
  }

  render() {
    return (
      <Host>
        <div>
          {this.renderSelect()}
          <slot></slot>
        </div>
      </Host>
    );
  }

}
