import { Component, Element, Host, Listen, State, Prop, h, VNode } from '@stencil/core';
import { renderTemplates } from '../../utils/renderTemplates';
import { ChangeEvent, FormNameSplit, isApieConstraint, isApieFormElement } from '../../utils/utils';

@Component({
  tag: 'apie-form',
  styleUrl: 'apie-form.css',
  shadow: false,
})
export class ApieForm {
  @Element() el: HTMLElement;

  @Prop({reflect: true}) action: string = window.location.href;

  @Prop({reflect: true}) method: string = 'post';

  @Prop({reflect: true, mutable: true}) value: Record<string, any> = {};

  @Prop({reflect: true, mutable: true}) internalState: Record<string, any> = {}

  @Prop({reflect: true, mutable: true}) validationError: Record<string, any> = {}

  @Prop({reflect: true }) supportsMultipart: boolean = false;

  @Prop({reflect: true}) submitLabel: string = 'Submit';

  @Prop() debugMode: boolean = false;

  @State() csrfToken!: string;

  @State() foundInputs: string[] = [];

  @State() valueState!: string;

  @State() internalStateState!: string;

  @Listen('triggerChange') onTriggerChange(event: CustomEvent<ChangeEvent>) {
    const child: any = event.target;
    if (isApieFormElement(child)) {
      const childName = child.name.split(new FormNameSplit());
      if (childName[0] === 'form' && childName.length === 2) {
        this.value[childName[1]] = event.detail.value;
        this.updateValuesIfNeeded();
      }
    }
  }

  @Listen('triggerInternalState') onTriggerInternalState(event: CustomEvent<ChangeEvent>) {
    const child: any = event.target;
    if (isApieFormElement(child)) {
      const childName = child.name.split(new FormNameSplit());
      if (childName[0] === 'form' && childName.length === 2) {
        this.internalState[childName[0]] = event.detail.value;
        this.updateValuesIfNeeded();
      }
    }
  }

  private getCalculatedAction(): string {
    return String(this.action || '').replace(
      /\{([a-zA-Z0-9]+)\}/g,
      (_match: string, cp1: string): string => {
        return String(this.value[cp1] ?? '');
      }
    );
  }

  private updateValuesIfNeeded(): void {
    const valueState = JSON.stringify(this.value);
    const internalStateState: string = JSON.stringify(this.internalState);
    if (valueState !== this.valueState) {
      Promise.resolve().then(() => {
        this.valueState = valueState;
        this.value = { ...this.value };
      })
    }
    if (internalStateState !== this.internalStateState) {
      Promise.resolve().then(() => {
        this.internalStateState = internalStateState;
        this.internalState = { ...this.internalState };
      })
    }
  }

  private renderSubmitButton() {
    return renderTemplates.renderSubmitButton({
      label: this.submitLabel,
      disabled: false
    })
  }

  public componentDidRender()
  {
    const foundInputs = [];
    const form = this.el.querySelector('form .form');
    if (!form) {
      return;
    }
    let csrfToken = null;
    form.childNodes.forEach((child: any) => {
      if (!child.name) {
        if (child.nodeName === 'apie-csrf-token') {
          csrfToken = child.value;
        }
        return;
      }
      const childName = child.name.split(new FormNameSplit());
        if (isApieFormElement(child)) {
          if (childName.length > 1 && childName[0] === 'form') {
            foundInputs.push(childName[1]);
          }
          if (childName.length === 2) {
            this.value[childName[1]] = child.value;
            this.internalState[childName[1]] = child.internalState;
          }
        } else if (isApieConstraint(child)) {
          if (childName.length > 1 && childName[0] === 'form') {
            child.value = this.value[childName[1]];
          }
        }
    });
    this.updateValuesIfNeeded();
    if (this.csrfToken !== csrfToken) {
      Promise.resolve().then(() => {
        this.csrfToken = csrfToken;
      })
    }  
  }

  private renderMainGroup(content: VNode): VNode {
    return renderTemplates.renderFormGroup({content, label: null})
  }

  render() {
    return (
      <Host>
        { this.debugMode && <table>
          <tr>
            <td>
              <pre>{ JSON.stringify(this.value, null, 4) }</pre>
            </td>
            <td>
              <pre>{ JSON.stringify(this.internalState, null, 4) }</pre>
            </td>
          </tr>
        </table>}
        <form action={this.getCalculatedAction()} method={this.method} enctype={this.supportsMultipart ? 'multipart/form-data' : 'application/x-www-form-urlencoded'}>
          { this.renderMainGroup(<div class="form"><slot></slot>{this.renderSubmitButton()}</div>) }
          <apie-render-types csrfToken={this.csrfToken} value={this.value} internalState={this.internalState} supportsMultipart={this.supportsMultipart}/>
        </form>
      </Host>
    );
  }

}
