import { Component, Host, Prop, h, Event, EventEmitter, State } from '@stencil/core';
import { APIE_FORM_CONTROLLER, ChangeEvent, toString } from '../../utils/utils';
import { renderTemplates } from '../../utils/renderTemplates';

@Component({
  tag: 'apie-form-hashmap',
  styleUrl: 'apie-form-hashmap.css',
  shadow: true,
})
export class ApieFormHashmap {
  @Prop() templateId: string;

  @Prop() replaceString: string;

  @Prop({ reflect: true }) name: string;

  @Prop({ reflect: true, mutable: true }) value: Record<any, any> = {};

  @Prop({reflect: true, mutable: true}) validationError: Record<string, any> = {}

  @Prop({ reflect: true }) apie: Symbol = APIE_FORM_CONTROLLER;

  @State() valueState!: string;

  @State() keyToAdd: string = '';

  @Event() triggerChange: EventEmitter<ChangeEvent>

  private renderKeyInput(): any {
    return renderTemplates.renderInput({
      name: '_internal[apie]' + this.name,
      value: this.keyToAdd,
      valueChanged: (newValue?: string) => { this.keyToAdd = toString(newValue) }
    })
  }

  private renderAddButton(): any {
    return renderTemplates.renderAddButton({
      disabled: !this.keyToAdd || Object.hasOwnProperty.call(this.value, this.keyToAdd),
      addButtonClicked: () => {
        this.value[this.keyToAdd] = {}
        this.keyToAdd = ''
        this.triggerChangeIfNeeded()
      }
    })
  }

  private renderRemoveButton(index: string): any {
    return renderTemplates.renderRemoveButton({
      disabled: false,
      addButtonClicked: () => {
        delete this.value[index];
        this.value = {...this.value};
        this.triggerChangeIfNeeded();
      }
    })
  }

  private renderEmptyList(): any
  {
    return renderTemplates.renderEmptyList();
  }

  private triggerChangeIfNeeded(): void
  {
    const valueState = JSON.stringify(this.value);
    if (valueState !== this.valueState) {
      Promise.resolve().then(() => {
        this.valueState = valueState;
        this.triggerChange.emit({ name: this.name, value: this.value});
      })
    }
  }

  private updateValue(newValue: Record<string|number, any>) {
    if (newValue) {
      this.value = {...newValue}
      this.triggerChangeIfNeeded();
    }
  }

  private getObjectValue(): Record<string|number, any>
  {
    return {...this.value}
  }

  render() {
    return (
      <Host>
        <apie-form-group class="form-list" name={this.name} value={this.getObjectValue()} validation-error={this.validationError} onTriggerChange={(ev) => { this.updateValue(ev.detail.value as any) } }>
          { Object.entries(this.value).map(
            ([index, item]) =>
              [
                <div>{ index }</div>,
                <apie-render-template class="form-item" key={index} replace-string={this.replaceString} template-id={this.templateId} value={item} name={this.name + '[' + index + ']'}>
                </apie-render-template>,
                this.renderRemoveButton(index)
              ]
          )}
          { !this.value.length && this.renderEmptyList() }
        </apie-form-group>
        {this.renderKeyInput()}
        {this.renderAddButton()}
        <slot></slot>
      </Host>
    );
  }
}
