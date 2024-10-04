import { Component, Host, Method, Prop, h } from '@stencil/core';
import { Constraint } from '../../utils/FormDefinition';

@Component({
  tag: 'apie-constraint-check-definition',
  styleUrl: 'apie-constraint-check-definition.css',
  shadow: false,
})
export class ApieConstraintCheckDefinition {
  @Prop() name: string;
  @Prop({reflect: true}) value: string;
  @Prop() message: string;
  @Prop() inverseCheck: boolean = false;
  @Prop() exactMatch: string|number|null|undefined = undefined;
  @Prop() pattern!: string;
  @Prop() minLength!: number;
  @Prop() maxLength!: number;
  @Prop({ reflect: true, mutable: true}) status: string = 'idle';

  private get constraint(): Constraint
  {
    return {
      fieldType: 'constraint',
      name: this.name,
      message: this.message,
      inverseCheck: this.inverseCheck,
      exactMatch: this.exactMatch === undefined ? this.value : this.exactMatch,
      pattern: this.pattern,
      serverSide: this.exactMatch !== undefined,
      minLength: this.minLength,
      maxLength: this.maxLength,
    }
  }

  @Method()
  async getDefinition(): Promise<Constraint> {
    this.status = 'built';
    return Promise.resolve(this.constraint)
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
