import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'apie-form-split',
  styleUrl: 'apie-form-split.css',
  shadow: true,
})
export class ApieFormSplit {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
