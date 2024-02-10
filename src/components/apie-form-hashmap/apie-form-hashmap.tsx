import { Component, Element, Prop, Host, h, State, Listen, Event, EventEmitter } from '@stencil/core';
import { applyEventTarget, loadTemplate } from '../../utils/utils';

@Component({
  tag: 'apie-form-hashmap',
  styleUrl: 'apie-form-hashmap.css',
  shadow: false,
})
export class ApieFormHashmap {
  @Element() el: HTMLElement;

  @Prop() name: string;

  @Prop() label: string = '';

  @Prop({reflect: true, mutable: true}) value: Record<string|number, any> = {};

  @Prop() templateId: string;

  @Prop() replaceString: string = '__PROTO__';

  @State() previousList!: string;

  @State() addKey: string = '';

  @Event({
    eventName: 'input',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) inputChanged: EventEmitter<Record<string|number, any>>;

  public handleClick() {
    if (!this.value) {
      this.value = {};
    }
    this.value[this.addKey] = null;
    this.value = { ...this.value }
    this.addKey = '';
    this.triggerInputOnChange();
  }

  public removeRow(key: string) {
    delete this.value[key];
    this.value = { ...this.value };
    this.triggerInputOnChange();
  }

  @Listen('input') public onInput(ev: any) {
    if (ev.target === this.el) {
      return;
    }
    if (ev?.target?.name) {
      this.value = {...applyEventTarget(
        this.name,
        this.value,
        ev.target
      )};
      this.triggerInputOnChange();
    }
  }

  public handleKeyChange(event) {
    this.addKey = event.target.value;
  }

  public isAddKeyDisabled(): boolean
  {
    return this.addKey.length === 0 || (this.value && Object.hasOwnProperty.call(this.value, this.addKey));
  }

  private triggerInputOnChange(): void
  {
    const current = JSON.stringify(this.value);
    if (current !== this.previousList) {
      this.previousList = current;
      this.inputChanged.emit(this.value);
    }
  }

  render() {
    return (
      <Host>
        <gr-field-group label={this.label} style="">
          <table class="field-list">
            <tr>
              <td>
                <gr-input value={this.addKey} onInput={(event) => this.handleKeyChange(event)}></gr-input>
              </td>
              <td>
                <gr-button disabled={this.isAddKeyDisabled()} onClick={() => this.handleClick()} class="unhandled-add-to-list-button" variant="secondary">
                  <ion-icon name="add-circle-outline"></ion-icon> Add
                </gr-button>
              </td>
            </tr>
            { (Object.entries(this.value || {})).map((entry: [string, any]) => 
            <tr>
              <th>{ entry[0] }</th>
              <td><gr-button onClick={() => this.removeRow(entry[0])}>
                <ion-icon name="close-circle-outline">X</ion-icon>
              </gr-button>
              <apie-scalar-element key={entry[0]} name={this.name + '[' + entry[0] + ']'} value={entry[1]} innerHTML={loadTemplate(this.templateId).replace(this.replaceString, String(entry[0]))}>
              </apie-scalar-element>
              </td>
            </tr>
            ) }
          </table>
          <slot></slot>
        </gr-field-group>
      </Host>
    );
  }
}
