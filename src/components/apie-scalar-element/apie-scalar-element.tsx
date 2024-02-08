import { Component, Element, State, Prop, Host, Watch, h } from '@stencil/core';
import { waitFor } from '../../utils/utils';
@Component({
  tag: 'apie-scalar-element',
  styleUrl: 'apie-scalar-element.css',
  shadow: false,
})
export class ApieScalarElement {
  @Element() el: HTMLElement;

  @State() currentValue: any;

  @Prop() name: string;

  @Prop() value: any;
  
  @Watch('value') updateValue(_val) {
    this.currentValue = _val;
    waitFor(() => (this.el && this.currentValue === _val)).then(() => {
      if (this.currentValue !== _val) {
        return;
      }
      [].some.call(
        this.el.childNodes,
        (child: any) => {
          if (child && child.name) {
            child.name = this.name;
            child.value = this.value;
            return true;
          }
        }
      );
    })
  }

  componentWillLoad() {
    this.updateValue(this.value);
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
