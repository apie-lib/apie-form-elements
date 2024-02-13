import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'apie-validation-error',
  styleUrl: 'apie-validation-error.css',
  shadow: true,
})
export class ApieValidationError {

  render() {
    return (
      <Host>
        <div class="form-control-invalid-text">
          <div class="text"><slot></slot></div>
        </div>
      </Host>
    );
  }

}
