import { Component, Host, Prop, h } from '@stencil/core';
import { ValidationErrorState } from '../../utils/utils';

function renderCurrent(prefix: string[], validationError?: ValidationErrorState) {
  return [
    validationError?.getCurrentError() && <apie-validation-error>{ (prefix.length > 1) && (prefix.join(', ') + ': ') }{ validationError?.getCurrentError() }</apie-validation-error>,
    validationError?.getUnmappedValidationErrors()?.map((unmappedError: [string, ValidationErrorState | null]) => {
      if (unmappedError[1] === null) {
        return <div></div>
      }
      return renderCurrent([...prefix, unmappedError[0]], unmappedError[1]);
    })
  ];
}

@Component({
  tag: 'apie-display-missing-validation-errors',
  styleUrl: 'apie-display-missing-validation-errors.css',
  shadow: true,
})
export class ApieDisplayMissingValidationErrors {
  @Prop() validationError: ValidationErrorState;

  render() {
    return <Host>{ renderCurrent([], this.validationError) }</Host>
  }

}
