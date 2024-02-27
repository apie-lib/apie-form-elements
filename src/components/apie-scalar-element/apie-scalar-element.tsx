import { Component, Element, State, Prop, Host, Watch, h } from '@stencil/core';
import { ValidationErrorState, waitFor } from '../../utils/utils';
@Component({
  tag: 'apie-scalar-element',
  styleUrl: 'apie-scalar-element.css',
  shadow: false,
})
export class ApieScalarElement {
  @Element() el: HTMLElement;

  @State() currentValue: any;

  @State() previousInnerHTML!: string

  @Prop() name: string;
  @Prop({mutable: true, reflect: true}) validationError?: ValidationErrorState = null;

  @Prop({mutable: true, reflect: true}) value: any;

  @Prop() useChecked: boolean = false;
  
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
            if (this.useChecked) {
              child.checked = Boolean(this.value);
              Promise.resolve().then(() => { child.value = child.checked ? '1' : ''; });
              
            } else {
              child.value = this.value;
            }
            return true;
          }
        }
      );
    })
  }

  componentDidRender() {
    const currentInnerHTML = this.el?.innerHTML;
    if (currentInnerHTML !== this.previousInnerHTML) {
      try {
        this.handleInnerHTMLChange();
      } finally {
        Promise.resolve().then(() => {
          this.previousInnerHTML = currentInnerHTML;
        })
      }
    }
  }

  handleInnerHTMLChange() {
    this.updateValue(this.value);
  }

  componentWillLoad() {
    if (!this.value && this.el) {
      [].some.call(
        this.el.querySelectorAll('*[name]'),
        (child) => {
          if (child.name === this.name) {
            this.value = this.useChecked ? child.checked : child.value;
            return String(child.tagName).toLowerCase() !== 'apie-listen-other-event';
          }
        }
      )
    }
    this.updateValue(this.value);
  }

  render() {
    return (
      <Host>
        <slot></slot>
        <apie-display-missing-validation-errors validationError={this.validationError} />
      </Host>
    );
  }

}
