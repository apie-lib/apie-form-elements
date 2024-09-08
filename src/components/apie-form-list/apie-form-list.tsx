import { Component, Host, Prop, h, Event, EventEmitter, State } from '@stencil/core';
import { APIE_FORM_CONTROLLER, ChangeEvent } from '../../utils/utils';
import { renderTemplates } from '../../utils/renderTemplates';

@Component({
  tag: 'apie-form-list',
  styleUrl: 'apie-form-list.css',
  shadow: true,
})
export class ApieFormList {
  @Prop() templateId: string;

  @Prop() replaceString: string;

  @Prop({ reflect: true }) name: string;

  @Prop({ reflect: true, mutable: true }) value: any[] = [];

  @Prop({reflect: true, mutable: true}) validationError: Record<string, any> = {}

  @Prop({ reflect: true }) apie: Symbol = APIE_FORM_CONTROLLER;

  @State() valueState!: string;

  @Event() triggerChange: EventEmitter<ChangeEvent>

  private renderAddButton(): any {
    return renderTemplates.renderAddButton({
      disabled: false,
      addButtonClicked: () => {
        this.value = [...this.value, {}];
        this.triggerChangeIfNeeded()
      }
    })
  }

  private renderRemoveButton(index: number): any {
    return renderTemplates.renderRemoveButton({
      disabled: false,
      addButtonClicked: () => {
        this.value.splice(index, 1);
        this.value = [...this.value];
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
      this.value = Object.keys(newValue).filter(key => !isNaN(parseInt(key, 10))).map(key => newValue[key])
      this.triggerChangeIfNeeded();
    }
  }

  private getObjectValue(): Record<string|number, any>
  {
    return this.value.reduce((acc:  Record<string|number,any>, currentValue: any, index) => {
      acc[index] = currentValue;
      return acc;
    }, {});
  }

  render() {
    return (
      <Host>
        <apie-form-group class="form-list" name={this.name} value={this.getObjectValue()} validation-error={this.validationError} onTriggerChange={(ev) => { this.updateValue(ev.detail.value as any) } }>
          { this.value.map(
            (item: any, index: number) =>
              [
                <apie-render-template class="form-item" key={index} replace-string={this.replaceString} template-id={this.templateId} value={item} name={this.name + '[' + index + ']'}>
                </apie-render-template>,
                this.renderRemoveButton(index)
              ]
          )}
          { !this.value.length && this.renderEmptyList() }
        </apie-form-group>
        {this.renderAddButton()}
        <slot></slot>
      </Host>
    );
  }
}
