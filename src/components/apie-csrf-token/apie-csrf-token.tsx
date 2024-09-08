import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'apie-csrf-token',
  shadow: false,
})
export class ApieCsrfToken {
  @Prop({reflect: true}) value: string;
  render() {
    return (
      <input type="hidden" name="_csrf" value={this.value} />
    );
  }

}
