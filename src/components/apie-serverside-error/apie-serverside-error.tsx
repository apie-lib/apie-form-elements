import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'apie-serverside-error',
  styleUrl: 'apie-serverside-error.css',
  shadow: true,
})
export class ApieServersideError {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
