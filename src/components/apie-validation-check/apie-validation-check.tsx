import { Component, Host, Prop, h } from '@stencil/core';
import { APIE_CONSTRAINT } from '../../utils/utils';
import { Constraint, renderTemplates } from '../../utils/renderTemplates';

@Component({
  tag: 'apie-validation-check',
  styleUrl: 'apie-validation-check.css',
  shadow: true,
})
export class ApieValidationCheck {
  @Prop({reflect: true}) apie: Symbol = APIE_CONSTRAINT;

  @Prop({reflect: true}) name: string;

  @Prop({reflect: true, mutable: true}) value: string;

  @Prop() text: string;

  @Prop() matchesRegex: string | null = null;

  @Prop() notMatchesRegex: string | null = null;

  private renderCheck(): void {
    const state: Constraint = {
      valid: typeof this.value === 'string',
      text: this.text,
    };
    if (this.matchesRegex) {
      if (!new RegExp(this.matchesRegex).test(this.value)) {
        state.valid = false;
      }
    }
    if (this.notMatchesRegex) {
      if (new RegExp(this.notMatchesRegex).test(this.value)) {
        state.valid = false;
      }
    }

    return renderTemplates.renderConstraint(state);
  }
  render() {
    return (
      <Host>
        { this.renderCheck() }
        <slot></slot>
      </Host>
    );
  }

}
