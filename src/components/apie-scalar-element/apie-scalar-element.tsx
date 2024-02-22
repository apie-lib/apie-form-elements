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

  @State() currentInvalid: boolean;

  @State() currentInvalidText!: string;

  @State() displayInvalidText: boolean;

  @State() previousInnerHTML!: string

  @Prop() name: string;

  @Prop({mutable: true}) value: any;

  @Prop() invalid: boolean = false;

  @Prop({mutable: true}) invalidText?: string = null;

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

  @Watch('invalid') updateInvalid(_val) {
    this.currentInvalid = _val;
    waitFor(() => (this.el && this.currentInvalid === _val)).then(() => {
      if (this.currentInvalid !== _val) {
        return;
      }
      [].some.call(
        this.el.childNodes,
        (child: any) => {
          if (child && child.invalid) {
            child.invalid = this.invalid;
            return true;
          }
        }
      );
    })
  }

  @Watch('invalidText') updateInvalidText(_val) {
    this.currentInvalidText = _val;
    waitFor(() => (this.el && this.currentInvalidText === _val)).then(() => {
      if (this.currentInvalidText !== _val) {
        return;
      }
      this.invalidText = _val;
      this.displayInvalidText = true;
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
    this.updateInvalid(this.invalid);
    this.updateInvalidText(this.invalidText);
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
    this.updateInvalid(this.invalid);
    this.updateInvalidText(this.invalidText);
  }

  render() {
    return (
      <Host>
        <slot></slot>
        {this.displayInvalidText && <apie-validation-error>{this.invalidText}</apie-validation-error>}
      </Host>
    );
  }

}
