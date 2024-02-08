import { Component, Element, State, Prop, Host, Watch, h } from '@stencil/core';
import { waitFor } from '../../utils/utils';

@Component({
  tag: 'apie-form-group',
  styleUrl: 'apie-form-group.css',
  shadow: false,
})
export class ApieFormGroup {
  @Element() el: HTMLElement;

  @State() previousName: any = undefined;

  @State() currentValue: any;

  @Prop() name: string;

  @Prop() value: Record<string, any> = {};
  
  @Watch('value') async updateValue(_val) {
    this.currentValue = _val;
    const previousName = this.previousName;
    await waitFor(() => (this.el && this.currentValue === _val && this.previousName === previousName));
    if (this.currentValue !== _val || this.previousName !== previousName) {
      return;
    }
    this.el.childNodes.forEach((child: any) => {
      if (child && child.name) {
        if (previousName !== undefined && String(child.name).indexOf(previousName) === 0) {
          child.name = String(child.name).replace(previousName, this.name);
        }
        if (String(child.name).indexOf(this.name) === 0) {
          const fieldName = String(child.name).substring(this.name.length + 1, String(child.name).length - 1);
          child.value = this.value[fieldName];
        }
      }
    });
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
