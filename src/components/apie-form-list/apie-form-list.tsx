import { Component, Element, Prop, Host, h, State, Listen, Event, EventEmitter } from '@stencil/core';
import { applyEventTarget, loadTemplate } from '../../utils/utils';

@Component({
  tag: 'apie-form-list',
  styleUrl: 'apie-form-list.css',
  shadow: false,
})
export class ApieFormList {
  @Element() el: HTMLElement;

  @Prop() name: string;

  @Prop() label: string = '';

  @Prop({reflect: true, mutable: true}) value: Array<any> = [];

  @Prop() templateId: string;

  @Prop() replaceString: string = '__PROTO__';

  @State() previousList!: string;

  @Event({
    eventName: 'input',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) inputChanged: EventEmitter<any[]>;

  public handleClick() {
    this.value = this.value ? [...this.value, null] : [null];
    this.triggerInputOnChange();
  }

  public removeRow(key: number) {
    this.value.splice(key, 1);
    this.value = [...this.value]
    this.triggerInputOnChange();
  }

  @Listen('input') public onInput(ev: any) {
    if (ev.target === this.el) {
      return;
    }
    if (ev?.target?.name) {
      this.value = [...applyEventTarget(
        this.name,
        this.value,
        ev.target
      )];
      this.triggerInputOnChange();
    }
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
          {!this.value?.length && <slot name="empty-array"></slot>}
          <gr-button onClick={() => this.handleClick()} class="unhandled-add-to-list-button" variant="secondary">
            <ion-icon name="add-circle-outline"></ion-icon> Add
          </gr-button>
          <div class="field-list">
            { (Array.isArray(this.value) ? this.value : []).map((value: any, key: number) => 
            <div>
              <gr-button onClick={() => this.removeRow(key)}>
                <ion-icon name="close-circle-outline">X</ion-icon>
              </gr-button>
              <apie-scalar-element key={key} name={this.name + '[' + key + ']'} value={value} innerHTML={loadTemplate(this.templateId).replace(this.replaceString, String(key))}>
              </apie-scalar-element>
            </div>
            ) }
          </div>
          <slot></slot>
        </gr-field-group>
      </Host>
    );
  }
}
