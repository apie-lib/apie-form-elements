import { Component, Element, Event, EventEmitter, Host, Prop, Watch, State, h } from '@stencil/core';
import { waitFor } from '../../utils/utils';

@Component({
  tag: 'apie-listen-other-event',
  shadow: true,
})
export class ApieListenOtherEvent {
  @Element() private el: HTMLElement;

  @Prop() name: string;

  @Prop({mutable: true, reflect: true}) value: any;

  @Prop() eventName: string;

  @State() private currentEventName!: string;

  @State()
  private callback: Function;

  @Event({
    eventName: 'input',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) inputChanged: EventEmitter<any>;

  constructor() {
    this.callback = (ev) => {
      if (this.name === ev?.target?.name) {
        this.inputChanged.emit(this.value = ev.target.value)
      }
    };
  }

  @Watch('eventName') private onEventNameChange(_newValue: string, _oldValue?: string) {
    this.currentEventName = _newValue;
    waitFor(() => (this.el && this.currentEventName === _newValue)).then(() => {
      if (this.currentEventName !== _newValue) {
        return;
      }
      if (_oldValue) {
        (this.el as any).removeEventListener(_oldValue, this.callback);
      }
      if (_newValue) {
        (this.el as any).addEventListener(_newValue, this.callback);
      }
    });
  }

  componentWillLoad() {
    this.onEventNameChange(this.eventName);
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
